const Book=require('../models/book.model')


async function getAllBooksService(filters={},sortBy,skip,limit){
 
    
    const query=Book.find(filters)
    if(sortBy!==undefined){
       query.sort({[sortBy]:1})
       
    }
  const books= await query.skip(skip).limit(limit)
  const totalBooks=await Book.countDocuments(filters)
    return {books,totalBooks};
       



}

module.exports={
    getAllBooksService
}