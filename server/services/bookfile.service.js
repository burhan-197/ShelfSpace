// Shared helper that resolves the absolute on-disk path of a book's PDF.
// Used by both the page route (GET /books/:id/file, rendered reader) and
// the REST API (GET /api/v1/books/:id/file), so both stay in sync.
const path = require('path');
const { getBookByIdService } = require('./getbookbyid.service');

async function getBookFileService(id) {
  const book = await getBookByIdService(id);
  const absolutePath = path.join(__dirname, '..', book.filePath);
  return { book, absolutePath };
}

module.exports = { getBookFileService };
