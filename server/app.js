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
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(createBookRouter)
app.use(getBookByIdRouter)
app.use(getAllBooksRouter)
app.use(updateBookRouter)
app.use(deleteBookRouter)
app.use(errorHandler)



app.get('/upload', (req, res) => {
    res.render('upload', {
        title: 'Upload Book — ShelfSpace',
        stylesheet: '/css/upload.css',
        script: '/js/upload.js',
        activePage: 'upload'
    });
});


app.get('/reader/:id', (req, res) => {
    res.render('render', {
        layout: 'render-layout',
        title: 'Reader — ShelfSpace',
        stylesheet: '/css/reader.css',
        script: '/js/reader.js',
        
    });
})
mongoose.connection.once('open',()=>{
    console.log('MongoDB connection ready!')
})

mongoose.connection.on('error',(err)=>{
    console.error(err)
})

async function startServer(){
    await mongoose.connect(process.env.MONGO_URI) 
  

const PORT = process.env.PORT || 8000;
server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
}
startServer();