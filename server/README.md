# ShelfSpace — Personal Book Library + REST API

ShelfSpace is a personal book library: upload PDFs, browse a searchable/filterable
library, and read books in the browser with a built-in PDF reader. It also ships a
versioned JSON REST API with interactive Swagger docs, so the same data the pages
render is available to any HTTP client.

## What it does

- **Library page** — paginated grid with search (title/author), genre + author filters, and sorting
- **Upload flow** — multipart upload of a PDF plus an optional cover image, with validation
- **Book detail pages** — metadata, edit, and delete from the UI
- **In-browser PDF reader** — page navigation rendered with pdf.js
- **REST API (`/api/v1`)** — full CRUD, file download, library metadata, and a health check,
  all in a consistent `{ success, data, meta? }` envelope
- **Swagger docs at `/api/docs`** — interactive OpenAPI UI (served locally, no CDN)

## Tech stack

Node.js · Express 5 · MongoDB (Mongoose) · EJS + express-ejs-layouts · Multer ·
pdf.js · swagger-jsdoc + swagger-ui-express

The backend follows a layered layout: `routes/` → `controllers/` → `services/` → `models/`.
The page routes and the REST API share the same service layer, so business rules
(validation, file cleanup, pagination) live in one place.

## Project structure

```
.
├── app.js                      # app setup, router mounting, server start
├── swagger.js                  # OpenAPI spec + Swagger UI mounting
├── models/book.model.js        # Mongoose schema (Book)
├── routes/
│   ├── *.router.js             # page routes (library, upload, reader, details)
│   └── api/v1/
│       ├── api.router.js       # /api/v1 mount point + health check
│       └── books.router.js     # /api/v1/books endpoints (+ Swagger annotations)
├── controllers/
│   ├── *.controller.js         # page controllers (render EJS views)
│   └── api/books.controller.js # REST API controllers (JSON envelope)
├── services/*.service.js       # shared business logic (CRUD, file resolution)
├── middlewares/                # upload (multer), API dbGuard, error handler
├── utils/                      # AppError, pagination range, shared API constants
├── views/                      # EJS templates
├── public/                     # CSS + client JS
├── scripts/
│   ├── seed.js                 # seeds 20 demo books
│   └── smoke.js                # smoke test (runs via `npm test`)
└── uploads/                    # uploaded PDFs/covers (gitignored, except .gitkeep)
```

## Quick start

```bash
npm install
cp .env.example .env        # then set MONGO_URI
npm run seed                # optional: loads 20 demo books
npm start                   # http://localhost:8000
```

Seed note: the demo books point at `uploads/<slug>.pdf` placeholders — the PDFs
themselves are not in the repo. Grab them from Project Gutenberg and upload via
the `/upload` page to make the reader work.

Working on the UI without a database? `SKIP_DB=1 npm start` boots the server with
no MongoDB connection — the library page renders empty, and API routes needing
the database answer `503 { success:false, error:{ code:"SERVICE_UNAVAILABLE" } }`.

## API reference

Interactive docs: **http://localhost:8000/api/docs** (raw spec at `/api/docs/openapi.json`)

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/health` | Liveness check → `{ status, uptime, version }` (no DB needed) |
| GET | `/api/v1/books` | List books. Query: `page`, `limit` (max 100), `q` (search), `genre`, `author`, `title`, `sort`. Answers `{ success, data, meta:{ page, limit, totalPages, total } }` |
| POST | `/api/v1/books` | Create a book. `multipart/form-data`: `bookFile` (PDF, required), `coverImage` (optional), plus `title`, `author`, `pages`, `publishDate`, `genre` |
| GET | `/api/v1/books/meta` | `{ success, data:{ genres, count } }` — genre allowlist + total count |
| GET | `/api/v1/books/:id` | One book |
| PATCH | `/api/v1/books/:id` | Partial update (JSON: `title`, `author`, `pages`, `publishDate`, `genre`) |
| DELETE | `/api/v1/books/:id` | Deletes the record and its uploaded files |
| GET | `/api/v1/books/:id/file` | Streams the book's PDF |

Errors always use the envelope `{ success:false, error:{ code, message } }`, e.g.
`NOT_FOUND`, `VALIDATION_ERROR`, `INVALID_ID`, `SERVICE_UNAVAILABLE`.

Example:

```bash
curl "http://localhost:8000/api/v1/books?page=1&limit=5&sort=title"
```

## Author

Burhan Imran
