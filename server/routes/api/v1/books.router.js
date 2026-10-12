const express = require('express');
const {
  listBooks,
  createBook,
  getBook,
  patchBook,
  deleteBook,
  downloadBookFile,
  getMeta
} = require('../../../controllers/api/books.controller');
const dbGuard = require('../../../middlewares/dbGuard');
const { uploadBookFiles } = require('../../../middlewares/upload.middleware');

const booksRouter = express.Router();

/**
 * @openapi
 * /api/v1/books:
 *   get:
 *     summary: List books
 *     description: Returns a paginated list of books with optional search, filtering and sorting.
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1, minimum: 1 }
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, minimum: 1, maximum: 100 }
 *         description: Books per page.
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Case-insensitive search across title and author.
 *       - in: query
 *         name: genre
 *         schema: { type: string, enum: [fiction, non-fiction, fantasy, sci-fi, mystery, romance, biography, history, self-help, other] }
 *       - in: query
 *         name: author
 *         schema: { type: string }
 *       - in: query
 *         name: title
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [title, author, genre, publishDate] }
 *         description: Sort ascending by this field.
 *     responses:
 *       200:
 *         description: Paginated book list.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedBooks'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       503:
 *         $ref: '#/components/responses/ServiceUnavailable'
 */
booksRouter.get('/', dbGuard, listBooks);

/**
 * @openapi
 * /api/v1/books/meta:
 *   get:
 *     summary: Library metadata
 *     description: Returns the allowed genre list and the total number of books. Useful for API discovery.
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Metadata object.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         genres:
 *                           type: array
 *                           items: { type: string }
 *                         count:
 *                           type: integer
 *       503:
 *         $ref: '#/components/responses/ServiceUnavailable'
 */
booksRouter.get('/meta', dbGuard, getMeta);

/**
 * @openapi
 * /api/v1/books:
 *   post:
 *     summary: Upload a book
 *     description: Creates a book. Send as multipart/form-data with the PDF under `bookFile`, an optional cover image under `coverImage`, and the metadata fields.
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, author, pages, publishDate, genre, bookFile]
 *             properties:
 *               title: { type: string, example: 'Pride and Prejudice' }
 *               author: { type: string, example: 'Jane Austen' }
 *               pages: { type: integer, example: 432 }
 *               publishDate: { type: string, format: date, example: '1813-01-28' }
 *               genre: { type: string, enum: [fiction, non-fiction, fantasy, sci-fi, mystery, romance, biography, history, self-help, other] }
 *               bookFile: { type: string, format: binary, description: 'PDF file (max 50MB)' }
 *               coverImage: { type: string, format: binary, description: 'Optional cover image' }
 *     responses:
 *       201:
 *         description: Book created.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Book'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       503:
 *         $ref: '#/components/responses/ServiceUnavailable'
 */
booksRouter.post('/', dbGuard, uploadBookFiles, createBook);

/**
 * @openapi
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: MongoDB ObjectId of the book.
 *     responses:
 *       200:
 *         description: The book.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Book'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       503:
 *         $ref: '#/components/responses/ServiceUnavailable'
 *   patch:
 *     summary: Partially update a book
 *     description: Updates only the fields provided in the JSON body.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               author: { type: string }
 *               pages: { type: integer }
 *               publishDate: { type: string, format: date }
 *               genre: { type: string, enum: [fiction, non-fiction, fantasy, sci-fi, mystery, romance, biography, history, self-help, other] }
 *           example:
 *             pages: 433
 *     responses:
 *       200:
 *         description: Updated book.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Book'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       503:
 *         $ref: '#/components/responses/ServiceUnavailable'
 *   delete:
 *     summary: Delete a book
 *     description: Deletes the book record and its uploaded files from disk.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deletion confirmation.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessEnvelope'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id: { type: string }
 *                         deleted: { type: boolean, example: true }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       503:
 *         $ref: '#/components/responses/ServiceUnavailable'
 */
booksRouter.get('/:id', dbGuard, getBook);
booksRouter.patch('/:id', dbGuard, express.json(), patchBook);
booksRouter.delete('/:id', dbGuard, deleteBook);

/**
 * @openapi
 * /api/v1/books/{id}/file:
 *   get:
 *     summary: Download the book's PDF
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The PDF file.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       503:
 *         $ref: '#/components/responses/ServiceUnavailable'
 */
booksRouter.get('/:id/file', dbGuard, downloadBookFile);

module.exports = { booksRouter };
