const Book=require('../models/book.model')
const AppError=require('../utils/AppError')
const fs=require('fs/promises')

async function updateBookService(id,updateData){
    const existingBook=await Book.findById(id)
      if(!existingBook){
        throw new AppError('Book not found',404)
    }

    const oldFilePath=existingBook.filePath  
    
    const book=await Book.findByIdAndUpdate(id,updateData,{returnDocument: 'after', runValidators:true})

    if(!book){
        throw new AppError('Book not found',404)
    }

     const newFilePath=updateData.filePath
     if(newFilePath){
        try{
            await fs.unlink(oldFilePath)
        }catch(err){
            if(err.code!=='ENOENT'){
                console.error('Error deleting old file',err)
            }
            
        }
     }  

    return book


    
}

module.exports=updateBookService