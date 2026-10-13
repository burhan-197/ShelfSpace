// Seeds the library with 20 demo books so the app is demo-ready.
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
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', pages: 180, publishDate: '1925-04-10', genre: 'fiction', filePath: 'uploads/the-great-gatsby.pdf' },
  { title: 'The Clockwork Orchard', author: 'Mara Ellison', pages: 368, publishDate: '2020-03-12', genre: 'fantasy', filePath: 'uploads/the-clockwork-orchard.pdf' },
  { title: 'Signals from Europa', author: 'Darius Vale', pages: 294, publishDate: '2021-07-08', genre: 'sci-fi', filePath: 'uploads/signals-from-europa.pdf' },
  { title: 'The Last Mapmaker', author: 'Nadia Reyes', pages: 416, publishDate: '2019-09-21', genre: 'other', filePath: 'uploads/the-last-mapmaker.pdf' },
  { title: 'A Garden of Small Miracles', author: 'Elena Brooks', pages: 256, publishDate: '2022-05-17', genre: 'romance', filePath: 'uploads/a-garden-of-small-miracles.pdf' },
  { title: 'The Quiet Detective', author: 'Jonah Mercer', pages: 331, publishDate: '2018-11-03', genre: 'mystery', filePath: 'uploads/the-quiet-detective.pdf' },
  { title: 'Letters from the North', author: 'Amara Okafor', pages: 224, publishDate: '2023-01-26', genre: 'history', filePath: 'uploads/letters-from-the-north.pdf' },
  { title: 'The Daily Reset', author: 'Priya Shah', pages: 192, publishDate: '2021-02-15', genre: 'self-help', filePath: 'uploads/the-daily-reset.pdf' },
  { title: 'Beyond the Summit', author: 'Caleb Hart', pages: 287, publishDate: '2017-06-30', genre: 'biography', filePath: 'uploads/beyond-the-summit.pdf' },
  { title: 'Understanding the Tides', author: 'Dr. Lila Morgan', pages: 340, publishDate: '2020-10-09', genre: 'non-fiction', filePath: 'uploads/understanding-the-tides.pdf' },
  { title: 'The Ember Crown', author: 'Soren Whitaker', pages: 512, publishDate: '2022-08-19', genre: 'fantasy', filePath: 'uploads/the-ember-crown.pdf' },
  { title: 'Midnight at Meridian Station', author: 'Tessa Nguyen', pages: 276, publishDate: '2024-04-02', genre: 'sci-fi', filePath: 'uploads/midnight-at-meridian-station.pdf' },
  { title: 'The Art of Starting Again', author: 'Marcus Bell', pages: 208, publishDate: '2023-09-14', genre: 'self-help', filePath: 'uploads/the-art-of-starting-again.pdf' }
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
