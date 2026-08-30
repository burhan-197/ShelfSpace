const express = require('express');
const updateBookRouter = express.Router();
const updateBook = require('../controllers/updatebook.controller');
const { uploadBookFiles } = require('../middlewares/upload.middleware');

updateBookRouter.patch('/books/:id', uploadBookFiles, updateBook);
module.exports = { updateBookRouter };