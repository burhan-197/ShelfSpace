const mongoose = require('mongoose');

const allowedGenres = [
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

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Title must be at least 2 characters long']
  },
  author: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Author name must be at least 2 characters long']
  },
  pages: {
    type: Number,
    required: true,
    min: [1, 'Page count must be at least 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Pages must be a whole number'
    }
  },
  publishDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value <= new Date();
      },
      message: 'Publish date cannot be in the future'
    }
  },
  genre: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: {
      values: allowedGenres,
      message: 'Please choose a valid genre'
    }
  },
  filePath: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);