const updateBookService=require('../services/updatebook.service')

async function updateBook(req,res,next){
 try{
   const id=req.params.id
   const updatedData=req.body
const book=await updateBookService(id,updatedData)
res.status(200).json({message:'Book updated successfully', book})
 }catch(err){
    next(err)
 }
}
module.exports=updateBook