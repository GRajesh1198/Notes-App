const express=require('express')
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


let notes=[
    {
        id:1,
        content:"HTML is easy",
        date:new Date().toISOString(),
        important:true
    },
    {
        id:2,
        content:"Browser can execute only JavaScript",
        date:new Date().toISOString(),
        important:false
    },
    {
        id:3,
        content:"GET and POST are the most methods of the HTTP protocol",
        date:new Date().toISOString(),
        important:true
    }

]
app.get('/',(req,res)=>{
    res.send('<h1>Hello Fucker</h1>')
})
app.get('/api/notes',(req,res)=>{
    res.json(notes)
})
app.get('/api/notes/:id',(req,res)=>{
    const id=Number(req.params.id)
    const note=notes.find(note=>note.id === id)
    if(note){
        res.json(note)
    }else{
        res.status(404).end()
    }
})
app.delete('/api/notes/:id',(req,res)=>{
    const id=Number(req.params.id)
    notes=notes.filter(note=>note.id!==id)
    res.status(204).end()
})

app.post('/api/notes',(req,res)=>{
    const maxId=notes.length > 0 ? Math.max(...notes.map(n=>n.id)):0

    const body=req.body
    if(!body.content){
        return res.status(400).json({
            error:'Content Missing'
        })
    }
    const note={
        content:body.content,
        id:maxId+1,
        date:new Date(),
        important:body.important || false
    }
    notes=notes.concat(note)
    res.json(note)
})

const unknkownEndPoint=(req,res)=>{
    res.status(400).send({error:'Unknown endpoint'})
}
app.use(unknkownEndPoint)
const PORT=process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
