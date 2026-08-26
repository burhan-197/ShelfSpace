const multer=require('multer');
const AppError=require('../utils/AppError')
const path=require('path');
const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename:function (req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname))
    }
})
function fileFilter(req,file,cb){
if(file.mimetype==='application/pdf'){
    cb(null,true)
}else{
    cb(new AppError('Only PDF files are allowed', 400))
}


}
const upload=multer({
    storage:storage,
    fileFilter:fileFilter,

})
module.exports=upload;