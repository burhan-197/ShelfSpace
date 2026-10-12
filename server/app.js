const express=require('express')
const app=express()
const http=require('http')
const dotenv=require('dotenv')
const path=require('path')
dotenv.config()
const mongoose=require('mongoose')
const server=http.createServer(app)
const expressLayouts = require('express-ejs-layouts');
const {errorHandler}=require('./middlewares/errorHandle.middleware')
const {createBookRouter}=require('./routes/createbook.router')
const {getAllBooksRouter}=require('./routes/getallbooks.router')
const {getBookByIdRouter}=require('./routes/getbookbyid.router')
const {updateBookRouter}=require('./routes/updatebook.router')
const {deleteBookRouter}=require('./routes/deletebookbyid.router')
const {renderBookRouter}=require('./routes/renderbook.router')
const {apiRouter}=require('./routes/api/v1/api.router')
const {swaggerDocsRouter}=require('./swagger')
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(createBookRouter)
app.use(getBookByIdRouter)
app.use(getAllBooksRouter)
app.use(updateBookRouter)
app.use(deleteBookRouter)
app.use(renderBookRouter)
// Versioned REST API (JSON) + interactive docs
app.use('/api/v1',apiRouter)
app.use('/api/docs',swaggerDocsRouter)
app.use(
  '/pdfjs',
  express.static('node_modules/pdfjs-dist/build')
);
app.use(errorHandler)



app.get('/upload', (req, res) => {
    res.render('upload', {
        title: 'Upload Book — ShelfSpace',
        stylesheet: '/css/upload.css',
        script: '/js/upload.js',
        activePage: 'upload'
    });
});



mongoose.connection.once('open',()=>{
    console.log('MongoDB connection ready!')
})

mongoose.connection.on('error',(err)=>{
    console.error(err)
})

async function startServer(){
    if (process.env.SKIP_DB === '1') {
        console.log('SKIP_DB=1 — starting without MongoDB. API routes that need the database will answer 503.');
    } else {
        if (!process.env.MONGO_URI) {
            console.error('FATAL: MONGO_URI is not set. Copy .env.example to .env and fill in your MongoDB connection string.');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI)
    }


const PORT = process.env.PORT || 8000;
server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
}
startServer();