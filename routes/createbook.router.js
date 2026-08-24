const express=require('express')
const {createBook}=require('../controllers/createbook.controller')

const createBookRouter=express.Router()

createBookRouter.post('/books',createBook)

module.exports={createBookRouter}