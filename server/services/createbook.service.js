
const Book = require('../models/book.model');

async function createBookService(bookData) {
  const book = await Book.create({
    title: bookData.title,
    author: bookData.author,
    pages: Number(bookData.pages),
    publishDate: bookData.publishDate,
    genre: bookData.genre,
    filePath: bookData.filePath,
    coverImage: bookData.coverImage || ''
  });

  return book;
}

module.exports = {
  createBookService
};