# Book Management API Audit

No code was modified during this audit. The `.env` file exists, but its contents are intentionally omitted.

## 1. Project Tree

```text
Book Api/
├── .env                         [contents omitted]
├── 3000;                        [file]
├── app.js
├── package.json
├── package-lock.json
├── controllers/
│   ├── createbook.controller.js
│   ├── deletebookbyid.controller.js
│   ├── getallbooks.controller.js
│   ├── getbookbyid.controller.js
│   └── updatebook.controller.js
├── middlewares/
│   └── errorHandle.middleware.js
├── models/
│   └── book.model.js
├── routes/
│   ├── createbook.router.js
│   ├── deletebookbyid.router.js
│   ├── getallbooks.router.js
│   ├── getbookbyid.router.js
│   └── updatebook.router.js
├── services/
│   ├── createbook.service.js
│   ├── deletebookbyid.service.js
│   ├── getallbooks.service.js
│   ├── getbookbyid.service.js
│   └── updatebook.service.js
└── utils/                       [empty]
```

`node_modules` is excluded.

## 2. Routes

| Method | Endpoint | Controller |
|---|---|---|
| `POST` | `/books` | `createBook` in `controllers/createbook.controller.js` |
| `GET` | `/books/:id` | `getBookById` in `controllers/getbookbyid.controller.js` |
| `GET` | `/allbooks` | `getAllBooks` in `controllers/getallbooks.controller.js` |
| `PATCH` | `/books/:id` | `updateBook` in `controllers/updatebook.controller.js` |
| `DELETE` | `/books/:id` | `deleteBook` in `controllers/deletebookbyid.controller.js` |

Route definitions are in the corresponding files under `routes/`.

## 3. Controllers

### `createBook`

File: `controllers/createbook.controller.js`

- Reads `title`, `author`, `pages`, `publishDate`, and `genre` from `req.body`.
- Constructs a `bookData` object.
- Calls `createBookService(bookData)`.
- Returns the created document with status `201`.
- Catches errors and passes them to `next(err)`.

### `deleteBook`

File: `controllers/deletebookbyid.controller.js`

- Reads `req.params.id`.
- Calls `deleteBookByIdService(id)`.
- If a document is deleted, returns status `200` with a success message.
- If no document exists, returns status `404`.
- Catches errors and passes them to `next(err)`.

### `getAllBooks`

File: `controllers/getallbooks.controller.js`

- Reads `req.query`.
- Allows only `author`, `title`, `genre`, and `sortBy`.
- Allows filtering by `author`, `title`, and `genre`.
- Allows sorting by `title`, `author`, `genre`, or `publishDate`.
- Invalid query parameters return status `400`.
- Invalid `sortBy` values return status `400`.
- Calls `getAllBooksService(filters, sortBy)` when filters or sorting are present.
- Calls `getAllBooksService()` otherwise.
- Returns books with status `200`.
- Catches service errors and passes them to `next(err)`.

### `getBookById`

File: `controllers/getbookbyid.controller.js`

- Reads `id` from `req.params`.
- Calls `getBookByIdService(id)`.
- Intended to return the book with status `200`.
- Intended to return status `404` when no book exists.
- Catches errors and passes them to `next(err)`.

The service throws an error when no book is found, so the controller's `else` branch is unreachable. The request reaches the error middleware and normally becomes a `500` response instead of `404`.

### `updateBook`

File: `controllers/updatebook.controller.js`

- Reads `req.params.id`.
- Passes the entire `req.body` as `updatedData`.
- Calls `updateBookService(id, updatedData)`.
- Always returns status `200` with `Book updated successfully` if no exception occurs.
- Does not inspect the service result.
- Logs caught errors with `console.error`.
- Passes caught errors to `next(err)`.

If the ID does not match a document, the service returns `null`, but the controller still returns `200`.

## 4. Services

### `createBookService`

File: `services/createbook.service.js`

- Receives `bookData`.
- Performs `Book.create({...})`.
- Contains no `try/catch`.
- Does not create or rethrow errors.
- Mongoose errors propagate to the controller.

### `deleteBookByIdService`

File: `services/deletebookbyid.service.js`

- Receives `id`.
- Performs `Book.findByIdAndDelete(id)`.
- Returns the deleted document or `null`.
- Contains no `try/catch`.
- Does not create or rethrow errors.
- Mongoose errors propagate naturally.

### `getAllBooksService`

File: `services/getallbooks.service.js`

- Receives `filters` and `sortBy`.
- Performs `Book.find(filters).sort({ [sortBy]: 1 })` when sorting is requested.
- Performs `Book.find(filters)` when filters exist.
- Performs `Book.find({})` otherwise.
- Contains no `try/catch`.
- Does not create or rethrow errors.
- Mongoose errors propagate naturally.

### `getBookByIdService`

File: `services/getbookbyid.service.js`

- Receives `id`.
- Performs `Book.findById(id)`.
- Creates `new Error('Book not found')` when no document is found.
- Contains no `try/catch`.
- Does not rethrow caught errors because there is no catch block.
- The created error propagates to the controller.

### `updatBookService`

File: `services/updatebook.service.js`

- The function name is misspelled as `updatBookService`.
- Receives `id` and `updateData`.
- Performs `Book.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })`.
- Returns the updated document or `null`.
- Contains no `try/catch`.
- Does not create or rethrow errors.
- Mongoose errors propagate naturally.

## 5. Book Schema

File: `models/book.model.js`

```js
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true,
        min: [1, 'Page count must be at least 1']
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
        required: true
    }
});
```

Validation rules:

- `title`: required `String`; leading and trailing whitespace is removed with `trim`.
- `author`: required `String`.
- `pages`: required `Number`; minimum value is `1`.
- `publishDate`: required `Date`; cannot be later than the current time.
- `genre`: required `String`.

There are no explicit maximum lengths, enum restrictions, or non-empty-string checks.

## 6. Error Flow

1. A service performs a Mongoose operation.
2. Services generally have no `try/catch`, so Mongoose errors propagate.
3. Controllers catch service errors and call `next(err)`.
4. `errorHandler` in `middlewares/errorHandle.middleware.js` receives the error.
5. Validation errors return status `400`.
6. All other errors return status `500` with `err.message`.

Problems in this flow:

- `getBookByIdService` converts a missing book into a generic error, resulting in `500`.
- Invalid MongoDB IDs can produce a Mongoose `CastError`, which is also returned as `500` instead of a client error.
- Generic error messages are exposed in HTTP responses.
- There is no centralized handling for cast errors, duplicate-key errors, or database connection failures.
- `next` is accepted by the error middleware but is not used.

## 7. `app.js` Registration Order

File: `app.js`

1. `dotenv.config()`
2. `app.use(express.json())`
3. `app.use(createBookRouter)`
4. `app.use(getBookByIdRouter)`
5. `app.use(getAllBooksRouter)`
6. `app.use(updateBookRouter)`
7. `app.use(deleteBookRouter)`
8. `app.use(errorHandler)`

The server then registers MongoDB connection event handlers, connects using the environment variable `MONGO_URI`, uses the environment variable `PORT` with a default of `3000`, and starts the HTTP server after the database connection succeeds.

No environment values or connection strings are included in this report.

## 8. Findings

### Duplicated code

- Every controller repeats the same `try/catch` and `next(err)` pattern.
- Each route file repeats Express router creation and export boilerplate.
- `getAllBooksService` contains repeated `Book.find(...)` branches.
- Several controllers manually construct similar success and not-found responses.

### Inconsistent naming

- Files use lowercase concatenated names such as `getallbooks.controller.js`, while functions use camelCase.
- `errorHandle.middleware.js` contains `errorHandler`.
- `deleteBook` calls `deleteBookByIdService`.
- `updatBookService` is misspelled.
- The package is named `practice` rather than reflecting the Book API project.
- `/allbooks` differs from the resource-oriented `/books` route naming used elsewhere.

### Unused imports/functions and artifacts

- No clearly unused imports were found in the inspected source.
- `next` in `errorHandle.middleware.js` is unused, although its presence identifies Express error middleware.
- `utils/` is empty.
- The `3000;` file appears unrelated to the application and is not referenced.

### Incorrect or questionable status codes

- `GET /books/:id` returns `500` for a missing book because the service throws before the controller can return `404`.
- `PATCH /books/:id` returns `200` even when no book was updated.
- Invalid MongoDB IDs are likely returned as `500`.
- `DELETE /books/:id` returns `200` with a message. This is valid, although `204` could also be used if no response body were returned.

### Error-handling problems

- Generic errors expose `err.message` to clients in `middlewares/errorHandle.middleware.js`.
- Database startup failures from `mongoose.connect` are not explicitly caught.
- There is no dedicated handling for invalid IDs.
- There is no explicit handling for duplicate database keys.
- Error logging exists only in the update controller, so logging is inconsistent.

### Architectural problems

- Routers are split into one file per operation, producing repetitive structure.
- Controllers contain query validation logic that could become difficult to maintain.
- Services return inconsistent not-found behavior: delete returns `null`, update returns `null`, while get-by-ID throws.
- The update endpoint accepts the complete request body without controller-level field filtering.
- There is no API prefix such as `/api/books`.
- No tests are defined in `package.json`.

### Obvious bugs

- `getBookByIdService` makes the controller's intended `404` branch unreachable.
- `updateBook` ignores the result returned by `findByIdAndUpdate`.
- `updatBookService` is misspelled.
- The empty `3000;` file appears to be an accidental project artifact.

## 9. Relevant Dependencies

From `package.json`:

- `express` `^5.2.1`: HTTP server, routers, middleware, and request handling.
- `mongoose` `^9.9.3`: MongoDB connection, schema definition, validation, and database operations.
- `dotenv` `^17.4.2`: Loads environment configuration from `.env`.

The project uses CommonJS modules through `"type": "commonjs"`.

## 10. Scope

This document records the current implementation only. It does not propose major new features or a project rewrite.
