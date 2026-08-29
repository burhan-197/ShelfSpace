const updateBookService=require('../services/updatebook.service')
const fs=require('fs/promises')
async function updateBook(req,res,next){
 try{
   const id=req.params.id
   const updatedData = Object.fromEntries(
    Object.entries(req.body).filter(([key, value]) => value !== '')
);
   if(req.file){
      updatedData.filePath=req.file.path
   }

const book=await updateBookService(id,updatedData)
res.status(200).json({message:'Book updated successfully', book})
 }catch(err){
       console.error(err.stack)
      try{
           if(req.file){
             await fs.unlink(req.file.path)
           }

          }catch(cleanUpErr){
            if(cleanUpErr.code!=='ENOENT'){
                console.error('Error deleting file:', cleanUpErr)
            }
          }
        next(err);
 }
}
module.exports=updateBook