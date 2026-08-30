const { createBookService } = require('../services/createbook.service');
const AppError = require('../utils/AppError');
const fs = require('fs/promises');

async function createBook(req, res, next) {
  const { title, author, pages, publishDate, genre } = req.body;

  try {
    const uploadedBookFile = req.files?.bookFile?.[0];
    const uploadedCoverFile = req.files?.coverImage?.[0];

    if (!uploadedBookFile) {
      throw new AppError('PDF file is required', 400);
    }

    const cleanTitle = String(title || '').trim();
    const cleanAuthor = String(author || '').trim();

    if (!cleanTitle || !cleanAuthor) {
      throw new AppError('Title and author are required', 400);
    }

    const numericPages = Number(pages);
    if (!Number.isInteger(numericPages) || numericPages < 1) {
      throw new AppError('Pages must be a positive integer', 400);
    }

    const bookData = {
      title: cleanTitle,
      author: cleanAuthor,
      pages: numericPages,
      publishDate,
      genre,
      filePath: uploadedBookFile.path.replace(/\\/g, '/'),
      coverImage: uploadedCoverFile ? uploadedCoverFile.path.replace(/\\/g, '/') : ''
    };

    await createBookService(bookData);
    res.redirect(303, '/');
  } catch (err) {
    try {
      if (req.files?.bookFile?.[0]) {
        await fs.unlink(req.files.bookFile[0].path).catch(() => {});
      }
      if (req.files?.coverImage?.[0]) {
        await fs.unlink(req.files.coverImage[0].path).catch(() => {});
      }
    } catch (cleanUpErr) {
      console.error('Error deleting file:', cleanUpErr);
    }

    next(err);
  }
}

module.exports = {
  createBook
};