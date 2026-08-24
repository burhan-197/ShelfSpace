const express=require('express')
const deleteBook=require('../controllers/deletebookbyid.controller')
const deleteBookRouter=express.Router()

deleteBookRouter.delete('/books/:id',deleteBook)

module.exports={deleteBookRouter}