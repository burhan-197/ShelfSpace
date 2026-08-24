const express=require('express')
const app=express()
const http=require('http')
const dotenv=require('dotenv')
dotenv.config()
const mongoose=require('mongoose')
const server=http.createServer(app)
const {errorHandler}=require('./middlewares/errorHandle.middleware')
const {createBookRouter}=require('./routes/createbook.router')
const {getAllBooksRouter}=require('./routes/getallbooks.router')
const {getBookByIdRouter}=require('./routes/getbookbyid.router')
const {updateBookRouter}=require('./routes/updatebook.router')
const {deleteBookRouter}=require('./routes/deletebookbyid.router')
app.use(express.json())
app.use(createBookRouter)
app.use(getBookByIdRouter)
app.use(getAllBooksRouter)
app.use(updateBookRouter)
app.use(deleteBookRouter)
app.use(errorHandler)




mongoose.connection.once('open',()=>{
    console.log('MongoDB connection ready!')
})

mongoose.connection.on('error',(err)=>{
    console.error(err)
})

async function startServer(){
    await mongoose.connect(process.env.MONGO_URI) 
  

const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
}
startServer();