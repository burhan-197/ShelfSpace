const { getAllBooksService } = require('../services/getallbooks.service');
const getPaginationRange = require('../utils/getPaginationRange');

const genres = [
  'fiction',
  'non-fiction',
  'fantasy',
  'sci-fi',
  'mystery',
  'romance',
  'biography',
  'history',
  'self-help',
  'other'
];

async function getAllBooks(req, res, next) {
  const allowedQueryParams = ['author', 'title', 'genre', 'sortBy', 'page', 'limit', 'q'];
  const allowedFilters = ['author', 'title', 'genre'];
  const allowedSortByValues = ['title', 'author', 'genre', 'publishDate'];

  try {
    const queryParams = req.query;
    const searchTerm = queryParams.q;

    const invalidQueryParams = Object.keys(queryParams).filter((key) => !allowedQueryParams.includes(key));
    if (invalidQueryParams.length > 0) {
      return res.status(400).json({ error: `Invalid query parameters: ${invalidQueryParams.join(', ')}` });
    }

    const filters = Object.fromEntries(
      Object.entries(queryParams).filter(([key, value]) => allowedFilters.includes(key) && value !== '')
    );

    const sortBy = queryParams.sortBy;
    let page = 1;
    let limit = 10;

    if (queryParams.page !== undefined) {
      page = Number(queryParams.page);
    }

    if (queryParams.limit !== undefined) {
      limit = Number(queryParams.limit);
    }

    if ((page <= 0 || !Number.isInteger(page)) || (limit <= 0 || !Number.isInteger(limit))) {
      return res.status(400).json({ error: 'Invalid page or limit value' });
    }

    const invalidSortBy = sortBy && !allowedSortByValues.includes(sortBy);
    if (invalidSortBy) {
      return res.status(400).json({ error: `Invalid sortBy value: ${sortBy}` });
    }

    const skip = (page - 1) * limit;
    const { books, totalBooks } = await getAllBooksService(filters, sortBy, skip, limit, searchTerm);
    const totalPages = Math.ceil(totalBooks / limit);
    const paginationRange = getPaginationRange(page, totalPages);

    res.status(200).render('library', {
      title: 'Library — ShelfSpace',
      stylesheet: '/css/library.css',
      script: '/js/library.js',
      activePage: 'library',
      books,
      totalBooks,
      totalPages,
      currentPage: page,
      limit,
      paginationRange,
      selectedGenre: req.query.genre || '',
      selectedAuthor: req.query.author || '',
      selectedSort: req.query.sortBy || '',
      genres
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllBooks
};