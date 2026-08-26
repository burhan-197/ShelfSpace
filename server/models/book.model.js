const  mongoose = require('mongoose');


const bookSchema=new mongoose.Schema({
title:{
    type:String,
    required:true,
    trim:true
},
author:{
    type:String,
    required:true
},
pages:{
    type:Number,
    required:true,
    min:[1,'Page count must be at least 1']
},
publishDate:{
    type:Date,
    required:true,
     validate: {
    validator: function (value) {
      return value <= new Date();
    },
    message: 'Publish date cannot be in the future'
  }
  
},
genre:{
    type:String,
    required:true
},
filePath:{
    type:String,
    required:true
}



})
module.exports=mongoose.model('Book',bookSchema)