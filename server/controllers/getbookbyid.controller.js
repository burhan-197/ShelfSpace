const getBookByIdService=require('../services/getbookbyid.service')
const path=require('path')

async function getBookById(req,res,next){
const {id}=req.params
try{
  const book=await getBookByIdService(id)
  const bookPath=path.join(__dirname,'..', book.filePath)
  res.status(200).sendFile(bookPath,(err)=>{
    if(err){
      next(err)
    }
  })

}catch(err){
    next(err)
}
}
module.exports=getBookById