const Book=require('../models/book.model')


async function getAllBooksService(filters,sortBy){
 
    if(sortBy!==undefined){
        const books= await Book.find(filters).sort({[sortBy]:1})
        return books;
    }else if(filters && Object.keys(filters).length>0){
    
      const books= await Book.find(filters)
      return books;
    }
     const books=await Book.find({})

    return books;
    

}

module.exports={
    getAllBooksService
}