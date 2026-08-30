const Book = require('../models/book.model');

async function getAllBooksService(filters = {}, sortBy, skip, limit, searchTerm) {
  const normalizedFilters = { ...filters };

  if (searchTerm && searchTerm.trim()) {
    const safeSearch = searchTerm.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    normalizedFilters.$or = [
      { title: { $regex: safeSearch, $options: 'i' } },
      { author: { $regex: safeSearch, $options: 'i' } }
    ];
  }

  const query = Book.find(normalizedFilters);

  if (sortBy) {
    query.sort({ [sortBy]: 1 });
  }

  const books = await query.skip(skip).limit(limit);
  const totalBooks = await Book.countDocuments(normalizedFilters);

  return { books, totalBooks };
}

module.exports = {
  getAllBooksService
};