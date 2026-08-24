const express=require('express')
const {getAllBooks}=require('../controllers/getallbooks.controller')

const getAllBooksRouter=express.Router()

getAllBooksRouter.get('/books',getAllBooks)

module.exports={getAllBooksRouter}