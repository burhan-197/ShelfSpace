
const {createBookService}=require('../services/createbook.service')
const AppError=require('../utils/AppError')
const fs=require('fs/promises')


async function createBook(req,res,next){
    const {title,author,pages,publishDate,genre}=req.body
   
    try {
        if (!req.file) {
    throw new AppError('PDF file is required', 400)
}
         const filePath=req.file.path

        const bookData={title,author,pages,publishDate,genre,filePath}

        const book = await createBookService(bookData);
        
        res.status(201).json(book);
    } catch (err) {
          try{
           if(req.file){
             await fs.unlink(req.file.path)
           }

          }catch(cleanUpErr){
            console.error('Error deleting file:', cleanUpErr)
          }
        next(err);
    }
}




module.exports={
    createBook,
    
}