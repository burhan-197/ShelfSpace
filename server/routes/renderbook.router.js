const express=  require('express')
const {renderBook,serveBookFile}=require('../controllers/renderbook.controller')
const renderBookRouter=express.Router()

renderBookRouter.get('/reader/:id',renderBook)
renderBookRouter.get('/books/:id/file',serveBookFile)

module.exports={renderBookRouter}