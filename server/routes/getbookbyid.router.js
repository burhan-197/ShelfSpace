const express=  require('express')
const getBookById=require('../controllers/getbookbyid.controller')
const getBookByIdRouter=express.Router()

getBookByIdRouter.get('/details/:id',getBookById)

module.exports={getBookByIdRouter}