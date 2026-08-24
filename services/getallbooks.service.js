const Book=require('../models/book.model')


async function getAllBooksService(filters={},sortBy,skip,limit){
 
    
    const query=Book.find(filters)
    if(sortBy!==undefined){
       query.sort({[sortBy]:1})
       
    }
  const books= await query.skip(skip).limit(limit)
    return books;
       



}

module.exports={
    getAllBooksService
}