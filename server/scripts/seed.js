// Seeds the library with 8 public-domain classics so the app is demo-ready.
// Usage: npm run seed   (requires MONGO_URI in .env)
//
// The PDFs themselves are NOT included in the repo — filePath is a placeholder
// pointing at uploads/<slug>.pdf. Upload the real PDFs (e.g. from
// Project Gutenberg) through the /upload page or the API to make the
// in-browser reader work for seeded books.
require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/book.model');

const books = [
  { title: 'Pride and Prejudice', author: 'Jane Austen', pages: 432, publishDate: '1813-01-28', genre: 'fiction', filePath: 'uploads/pride-and-prejudice.pdf' },
  { title: 'Moby-Dick', author: 'Herman Melville', pages: 635, publishDate: '1851-10-18', genre: 'fiction', filePath: 'uploads/moby-dick.pdf' },
  { title: 'Frankenstein', author: 'Mary Shelley', pages: 280, publishDate: '1818-01-01', genre: 'sci-fi', filePath: 'uploads/frankenstein.pdf' },
  { title: 'The Adventures of Sherlock Holmes', author: 'Arthur Conan Doyle', pages: 307, publishDate: '1892-10-14', genre: 'mystery', filePath: 'uploads/sherlock-holmes.pdf' },
  { title: 'Dracula', author: 'Bram Stoker', pages: 418, publishDate: '1897-05-26', genre: 'mystery', filePath: 'uploads/dracula.pdf' },
  { title: 'Jane Eyre', author: 'Charlotte Brontë', pages: 507, publishDate: '1847-10-16', genre: 'fiction', filePath: 'uploads/jane-eyre.pdf' },
  { title: 'Wuthering Heights', author: 'Emily Brontë', pages: 342, publishDate: '1847-12-01', genre: 'fiction', filePath: 'uploads/wuthering-heights.pdf' },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', pages: 180, publishDate: '1925-04-10', genre: 'fiction', filePath: 'uploads/the-great-gatsby.pdf' }
];

async function main() {
  if (!process.env.MONGO_URI) {
    console.error('FATAL: MONGO_URI is not set. Copy .env.example to .env and fill it in.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  await Book.deleteMany({});
  const inserted = await Book.insertMany(books);

  console.log(`Seeded ${inserted.length} books into the library.`);
  console.log('Note: PDFs are not included — upload real PDFs via /upload (e.g. from Project Gutenberg) to enable the reader.');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
