// Shared allowlists used by both the server-rendered library page
// (controllers/getallbooks.controller.js) and the REST API
// (controllers/api/books.controller.js), so validation stays identical.

const ALLOWED_GENRES = [
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

// Query params the library page accepts (rendered route: GET /)
const PAGE_ALLOWED_QUERY_PARAMS = ['author', 'title', 'genre', 'sortBy', 'page', 'limit', 'q'];

// Query params the REST API accepts (GET /api/v1/books)
const API_ALLOWED_QUERY_PARAMS = ['author', 'title', 'genre', 'sort', 'page', 'limit', 'q'];

// Fields that may be used as Mongo filters on both surfaces
const ALLOWED_FILTERS = ['author', 'title', 'genre'];

// Values accepted for sorting on both surfaces
const ALLOWED_SORT_VALUES = ['title', 'author', 'genre', 'publishDate'];

module.exports = {
  ALLOWED_GENRES,
  PAGE_ALLOWED_QUERY_PARAMS,
  API_ALLOWED_QUERY_PARAMS,
  ALLOWED_FILTERS,
  ALLOWED_SORT_VALUES
};
