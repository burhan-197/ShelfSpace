const Book=require('../models/book.model')
const AppError=require('../utils/AppError')

async function getBookByIdService(id){


    const book=await Book.findById(id)
    
    if(!book){
        throw new AppError('Book not found', 404)
    }
    return book


}
module.exports={getBookByIdService}