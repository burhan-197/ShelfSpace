
const {createBookService}=require('../services/createbook.service')


async function createBook(req,res,next){
    const {title,author,pages,publishDate,genre}=req.body
    const filePath=req.file.path
    const bookData={title,author,pages,publishDate,genre,filePath}

    try {
        const book = await createBookService(bookData);
        
        res.status(201).json(book);
    } catch (err) {
        next(err);
    }
}




module.exports={
    createBook,
    
}