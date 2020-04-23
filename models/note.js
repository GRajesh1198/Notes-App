const mongoose=require('mongoose')
mongoose.set('useFindAndModify', false)     
require('dotenv').config()
const url=process.env.MONGODB_URL

console.log('connecting to',url)

mongoose.connect(url,{useUnifiedTopology:true,useNewUrlParser:true})
        .then(result=>{
            console.log('Connected to MONGO_DB')
        })
        .catch(error=>{
            console.log('error connecting to mongo',error.message)
        })
const noteSchema=new mongoose.Schema({
    content:{
        type:String,
        minlength:5,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    important:Boolean
    
})
noteSchema.set('toJSON',{
    transform:(document,returnedObject)=>{
        returnedObject.id=returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note',noteSchema)