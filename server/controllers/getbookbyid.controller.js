const getBookByIdService=require('../services/getbookbyid.service')

async function getBookById(req,res,next){
const {id}=req.params
try{
  const book=await getBookByIdService(id)
  res.status(200).json(book)

}catch(err){
    next(err)
}
}
module.exports=getBookById