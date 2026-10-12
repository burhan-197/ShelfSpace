// REST API controllers (GET /api/v1/books ...). They reuse the same
// service layer as the server-rendered pages and answer with the JSON
// envelope { success:true, data, meta? } / { success:false, error:{code,message} }.
const fs = require('fs/promises');
const AppError = require('../../utils/AppError');
const {
  ALLOWED_GENRES,
  API_ALLOWED_QUERY_PARAMS,
  ALLOWED_FILTERS,
  ALLOWED_SORT_VALUES
} = require('../../utils/api.constants');
const { getAllBooksService } = require('../../services/getallbooks.service');
const { getBookByIdService } = require('../../services/getbookbyid.service');
const { createBookService } = require('../../services/createbook.service');
const updateBookService = require('../../services/updatebook.service');
const deleteBookByIdService = require('../../services/deletebookbyid.service');
const { getBookFileService } = require('../../services/bookfile.service');
const Book = require('../../models/book.model');

const MAX_LIMIT = 100;

// Fields a PATCH body is allowed to touch.
const UPDATABLE_FIELDS = ['title', 'author', 'pages', 'publishDate', 'genre'];

function parsePagination(query) {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 10 : Number(query.limit);

  if (!Number.isInteger(page) || page <= 0 || !Number.isInteger(limit) || limit <= 0) {
    throw new AppError('Invalid page or limit value', 400);
  }
  if (limit > MAX_LIMIT) {
    throw new AppError(`limit cannot exceed ${MAX_LIMIT}`, 400);
  }
  return { page, limit };
}

function validateListQuery(query) {
  const invalidParams = Object.keys(query).filter((key) => !API_ALLOWED_QUERY_PARAMS.includes(key));
  if (invalidParams.length > 0) {
    throw new AppError(`Invalid query parameters: ${invalidParams.join(', ')}`, 400);
  }

  const filters = Object.fromEntries(
    Object.entries(query).filter(([key, value]) => ALLOWED_FILTERS.includes(key) && value !== '')
  );

  if (query.genre && !ALLOWED_GENRES.includes(String(query.genre).toLowerCase())) {
    throw new AppError(`Invalid genre: ${query.genre}`, 400);
  }

  if (query.sort && !ALLOWED_SORT_VALUES.includes(query.sort)) {
    throw new AppError(`Invalid sort value: ${query.sort}`, 400);
  }

  return { filters, sort: query.sort || undefined, searchTerm: query.q };
}

async function listBooks(req, res, next) {
  try {
    const { filters, sort, searchTerm } = validateListQuery(req.query);
    const { page, limit } = parsePagination(req.query);
    const skip = (page - 1) * limit;

    const { books, totalBooks } = await getAllBooksService(filters, sort, skip, limit, searchTerm);

    res.status(200).json({
      success: true,
      data: books,
      meta: { page, limit, totalPages: Math.ceil(totalBooks / limit), total: totalBooks }
    });
  } catch (err) {
    next(err);
  }
}

function buildCreatePayload(body, files) {
  const bookFile = files?.bookFile?.[0];
  const coverFile = files?.coverImage?.[0];

  if (!bookFile) {
    throw new AppError('PDF file is required (field: bookFile)', 400);
  }

  const title = String(body.title || '').trim();
  const author = String(body.author || '').trim();
  if (!title || !author) {
    throw new AppError('Title and author are required', 400);
  }

  const pages = Number(body.pages);
  if (!Number.isInteger(pages) || pages < 1) {
    throw new AppError('Pages must be a positive integer', 400);
  }

  return {
    title,
    author,
    pages,
    publishDate: body.publishDate,
    genre: body.genre,
    filePath: bookFile.path.replace(/\\/g, '/'),
    coverImage: coverFile ? coverFile.path.replace(/\\/g, '/') : ''
  };
}

async function removeUploadedFiles(files) {
  for (const field of ['bookFile', 'coverImage']) {
    const file = files?.[field]?.[0];
    if (file) {
      await fs.unlink(file.path).catch(() => {});
    }
  }
}

async function createBook(req, res, next) {
  try {
    const payload = buildCreatePayload(req.body, req.files);
    const book = await createBookService(payload);
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    await removeUploadedFiles(req.files);
    next(err);
  }
}

async function getBook(req, res, next) {
  try {
    const book = await getBookByIdService(req.params.id);
    res.status(200).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
}

async function patchBook(req, res, next) {
  try {
    const id = req.params.id;
    const updateData = Object.fromEntries(
      Object.entries(req.body || {}).filter(([key, value]) => UPDATABLE_FIELDS.includes(key) && value !== '')
    );

    if (Object.keys(updateData).length === 0) {
      throw new AppError('No updatable fields provided (title, author, pages, publishDate, genre)', 400);
    }

    if (updateData.pages !== undefined) {
      const pages = Number(updateData.pages);
      if (!Number.isInteger(pages) || pages < 1) {
        throw new AppError('Pages must be a positive integer', 400);
      }
      updateData.pages = pages;
    }

    if (updateData.genre !== undefined && !ALLOWED_GENRES.includes(String(updateData.genre).toLowerCase())) {
      throw new AppError(`Invalid genre: ${updateData.genre}`, 400);
    }

    const book = await updateBookService(id, updateData);
    res.status(200).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
}

async function deleteBook(req, res, next) {
  try {
    const book = await deleteBookByIdService(req.params.id);
    res.status(200).json({ success: true, data: { id: book._id, deleted: true } });
  } catch (err) {
    next(err);
  }
}

async function downloadBookFile(req, res, next) {
  try {
    const { book, absolutePath } = await getBookFileService(req.params.id);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(book.title)}.pdf"`);
    res.sendFile(absolutePath);
  } catch (err) {
    next(err);
  }
}

async function getMeta(req, res, next) {
  try {
    const count = await Book.countDocuments({});
    res.status(200).json({ success: true, data: { genres: ALLOWED_GENRES, count } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listBooks,
  createBook,
  getBook,
  patchBook,
  deleteBook,
  downloadBookFile,
  getMeta
};
