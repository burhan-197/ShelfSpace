
const Book=require('../models/book.model')

async function createBookService(bookData){
  const book=await Book.create({
        title: bookData.title,
        author: bookData.author,
        pages: bookData.pages,
        publishDate: bookData.publishDate,
        genre: bookData.genre
    })
    return book


  
}


module.exports={
    createBookService
}