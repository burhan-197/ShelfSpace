const express=require('express')
const updateBookRouter=express.Router()
const updateBook=require('../controllers/updatebook.controller')
const upload=require('../middlewares/upload.middleware')

updateBookRouter.patch('/books/:id',upload.single('bookFile'),updateBook)
module.exports={updateBookRouter}