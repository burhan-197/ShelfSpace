const express=require('express')
const {createBook}=require('../controllers/createbook.controller')
const upload=require('../middlewares/upload.middleware')

const createBookRouter=express.Router()

createBookRouter.post('/books',upload.single('bookFile'),createBook)

module.exports={createBookRouter}