const express = require('express');
const { createBook } = require('../controllers/createbook.controller');
const { uploadBookFiles } = require('../middlewares/upload.middleware');

const createBookRouter = express.Router();

createBookRouter.post('/books', uploadBookFiles, createBook);

module.exports = { createBookRouter };