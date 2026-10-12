const deleteBookByIdService=require('../services/deletebookbyid.service')


async function deleteBook(req,res,next){
const id=req.params.id

try{
    const result=await deleteBookByIdService(id)
    res.status(200).json({message:`Book with ID ${id} deleted successfully`,result})
   
}catch(err){
        next(err)
}
}
module.exports=deleteBook