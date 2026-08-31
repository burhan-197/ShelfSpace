# ShelfSpace

A full-stack web application for managing and organizing a digital library. Upload, browse, and read books from your personal shelf with an intuitive interface.

## 🌟 Features

- **📚 Book Management** - Create, read, update, and delete books from your collection
- **📤 Upload Books** - Upload PDF files with metadata (title, author, description)
- **🔍 Search & Browse** - View all books in your library with pagination
- **📖 Built-in PDF Reader** - Read PDFs directly in the browser with integrated viewer
- **✏️ Edit Books** - Update book information anytime
- **🗑️ Delete Books** - Remove books from your collection
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web server framework
- **Node.js** - Runtime environment
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Multer** - File upload handling

### Frontend
- **EJS** - Templating engine
- **Express-EJS-Layouts** - Template layouts
- **PDF.js** - PDF viewer
- **Vanilla JavaScript** - Client-side logic
- **CSS3** - Styling

## 📁 Project Structure

```
server/
├── app.js                          # Express app configuration
├── package.json                    # Dependencies
├── controllers/                    # Business logic
│   ├── createbook.controller.js
│   ├── getallbooks.controller.js
│   ├── getbookbyid.controller.js
│   ├── updatebook.controller.js
│   ├── deletebookbyid.controller.js
│   └── renderbook.controller.js
├── routes/                         # API routes
├── services/                       # Data operations
├── models/                         # MongoDB schemas
├── middlewares/                    # Express middlewares
│   ├── errorHandle.middleware.js
│   └── upload.middleware.js
├── views/                          # EJS templates
├── public/                         # Static assets
│   ├── css/                        # Stylesheets
│   └── js/                         # Client scripts
├── uploads/                        # Uploaded PDF files
└── utils/                          # Helper utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
Create a `.env` file in the `server` directory:
```
MONGO_URI=your_mongodb_connection_string
PORT=3000
NODE_ENV=development
```

4. **Start the server**
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📝 API Endpoints

### Books
- `POST /api/books` - Create a new book
- `GET /` - Get all books (with pagination)
- `GET /books/:id` - Get a specific book by ID
- `PUT /books/:id` - Update a book
- `DELETE /books/:id` - Delete a book
- `GET /render/:id` - View/read a book's PDF

### Pages
- `GET /upload` - Upload book page
- `GET /library` - Browse all books

## 🎯 Usage

### Uploading a Book
1. Navigate to the Upload page
2. Fill in book details (title, author, description)
3. Select a PDF file from your computer
4. Click Upload

### Reading a Book
1. Go to the Library
2. Click on any book
3. Use the built-in PDF reader to view and navigate

### Managing Books
- **Edit** - Click the edit button on a book to update its information
- **Delete** - Click the delete button to remove a book from your collection

## 🔧 Configuration

### Database
Update your MongoDB connection string in `.env`:
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/shelfspace
```

### Upload Settings
Modify upload middleware settings in `middlewares/upload.middleware.js` for file size limits and allowed types.

## 🎨 Styling

The application uses a modular CSS structure:
- `global.css` - Global styles
- `components.css` - Reusable components
- `library.css` - Library page styles
- `book_details.css` - Book detail page styles
- `reader.css` - PDF reader styles
- `upload.css` - Upload form styles

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB object modeling
- **ejs** - Template engine
- **express-ejs-layouts** - Layout support
- **multer** - File upload middleware
- **pdfjs-dist** - PDF.js library for rendering PDFs
- **dotenv** - Environment variable management

## 🐛 Error Handling

The application includes comprehensive error handling middleware in `middlewares/errorHandle.middleware.js` that catches and gracefully handles application errors.

## 📚 Learn More

For more information about the technologies used:
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [EJS Documentation](https://ejs.co/)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)

## 📄 License

ISC License

---

## 📸 Screenshots
Home Page:
<img width="1327" height="680" alt="image" src="https://github.com/user-attachments/assets/ad82ec55-9620-4024-8ff2-9c888eb133d0" />
Book Detail Page:
<img width="1332" height="681" alt="image" src="https://github.com/user-attachments/assets/5baff257-645d-41d9-8d0b-208feae515cf" />
Book Uploading Page:
<img width="1304" height="679" alt="image" src="https://github.com/user-attachments/assets/35553ce9-3f80-4392-ab46-0d17e752eb20" />
Book Edit Modal:
<img width="1252" height="683" alt="image" src="https://github.com/user-attachments/assets/981808fd-d17e-49c8-85a9-0c85690223bc" />
Book Rendering Page:
<img width="1307" height="679" alt="image" src="https://github.com/user-attachments/assets/02a06e51-2eb7-4091-b573-a1236b0818f9" />





