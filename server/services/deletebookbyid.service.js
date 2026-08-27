const Book=require('../models/book.model')
const AppError=require('../utils/AppError')
const fs=require('fs/promises')

async function deleteBookByIdService(id){
   
        const book=await Book.findByIdAndDelete(id)
      
        if(!book){
            throw new AppError('Book not found',404)
        }
          
     try{
          await fs.unlink(book.filePath)
     }catch(err){
        if(err.code!=='ENOENT'){
            console.error('Error deleting file:', err)
            
        }    
    
}
  return book
}
module.exports=deleteBookByIdService