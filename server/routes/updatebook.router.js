const express=require('express')
const updateBookRouter=express.Router()
const updateBook=require('../controllers/updatebook.controller')

updateBookRouter.patch('/books/:id',updateBook)

module.exports={updateBookRouter}