const Book=require('../models/book.model')
const AppError=require('../utils/AppError')

async function updateBookService(id,updateData){
    
    const book=await Book.findByIdAndUpdate(id,updateData,{new:true, runValidators:true})
    if(!book){
        throw new AppError('Book not found',404)
    }
    return book


    
}

module.exports=updateBookService