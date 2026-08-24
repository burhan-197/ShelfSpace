const Book=require('../models/book.model')
const AppError=require('../utils/AppError')


async function deleteBookByIdService(id){
   
        const book=await Book.findByIdAndDelete(id)
        if(!book){
            throw new AppError('Book not found',404)
        }
        return book
    
}
module.exports=deleteBookByIdService