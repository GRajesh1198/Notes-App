require('dotenv').config()

const express=require('express')

const Note=require('./models/note')
const cors=require('cors')

const app=express()
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
const requestLogger=(req,res,next)=>{
    console.log('Method: ',req.method)
    console.log('Path: ',req.path)
    console.log('Body: ',req.body)
    console.log('----')
    next()
}
app.use(requestLogger)

app.get('/',(req,res)=>{
    res.send('<h1>Hello Fucker</h1>')
})
app.get('/api/notes',(req,res)=>{
    Note.find({}).then(result=>{
        
        const mappedNotes=result.map(note=>note.toJSON())
        res.json(mappedNotes)
    })
})
app.get('/api/notes/:id',(req,res,next)=>{
    Note.findById(req.params.id)
    .then(note=>{
        if(note){
            res.json(note.toJSON())
        }else{
            console.log("note not found")
            res.status(404).end()
        }
        
    })
    .catch(error=>next(error))
})
app.delete('/api/notes/:id',(req,res,next)=>{
    Note.findByIdAndRemove(req.params.id)
        .then(result=>{
            if(result){
                res.status(204).end()
            }else{
                res.status(404).end()
            }
            
        })
        .catch(error=>next(error))
})

app.post('/api/notes',(req,res)=>{
   const body=req.body

   if(!body.content){
       return res.status(404).json({error:'content missing'})
   }
   const note=new Note({
       content:body.content,
       important:body.important || false,
       date:new Date()
   })
   note.save()
       .then(savedNote=>{
            return savedNote.toJSON()
   })
       .then(savedAndFormattedNote=>{
           res.json(savedAndFormattedNote)
       })
})

app.put('/api/notes/:id',(req,res,next)=>{
    const body=req.body

    const note={
        content:body.content,
        important:body.important
    }
    Note.findByIdAndUpdate(req.params.id,note,{new:true})
        .then(updatedNote=>{
            res.json(updatedNote.toJSON())
        })
        .catch(error=>next(error))
})
const unknkownEndPoint=(req,res)=>{
    res.status(400).send({error:'Unknown endpoint'})
}
app.use(unknkownEndPoint)

const errorHandler=(error,request,response,next)=>{
    console.error(error.message)
    if(error.name==='CastError' && error.kind==='ObjectId'){
        return response.status(400).send({error:"Malformatted Id"})
    }else if(error.name === 'ValidationError'){
        return response.status(400).json({error:error.message})
    }
    next(error)
}
app.use(errorHandler)
const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
