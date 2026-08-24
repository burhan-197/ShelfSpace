const express=  require('express')
const getBookById=require('../controllers/getbookbyid.controller')
const getBookByIdRouter=express.Router()

getBookByIdRouter.get('/books/:id',getBookById)

module.exports={getBookByIdRouter}