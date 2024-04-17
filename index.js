require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Note = require('./models/note')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

//const mongoose = require('mongoose')
//
//const password = "JwubVyGIjnOzmVOD"
//const url = `mongodb+srv://lasselautanala:${password}@fullstackdatabase.j1z9b3g.mongodb.net/noteApp?retryWrites=true&w=majority`
//
//mongoose.set('strictQuery', false)
//mongoose.connect(url)
//
//const noteSchema = new mongoose.Schema({
//  content: String,
//  important: Boolean,
//})
//
//noteSchema.set('toJSON', {
//  transform: (document, returnedObject) => {
//    returnedObject.id = returnedObject._id.toString()
//    delete returnedObject._id
//    delete returnedObject.__v
//  }
//})

// const Note = mongoose.model('Note', noteSchema)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

//app.get('/api/notes', (request, response) => {
//  response.json(notes)
//})

//const generateId = () => {
//  const maxId = notes.length > 0
//    ? Math.max(...notes.map(n => n.id))
//    : 0
//  return maxId + 1
//}

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})
//app.post('/api/notes', (request, response) => {
//  const body = request.body
//
//  if (body.content === undefined) {
//    return response.status(400).json({ error: 'content missing' })
//  }
//
//  const note = new Note({
//    content: body.content,
//    important: body.important || false,
//  })
//
//  note.save().then(savedNote => {
//    response.json(savedNote)
//  })
//})

//app.post('/api/notes', (request, response) => {
//  const body = request.body
//  if (!body.content) {
//    return response.status(400).json({error: 'content missing'})
//  }
//
//  const note = {
//    content: body.content,
//    important: body.important || false,
//    id: generateId(),
//  }
//  notes = notes.concat(note)
//  response.json(note)
//})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//app.get('/api/notes/:id', (request, response) => {
//  Note.findById(request.params.id).then(note => {
//    response.json(note)
//  })
//})

//app.get('/api/notes/:id', (request, response) => {
//  const id = Number(request.params.id)
//  const note = notes.find(note => note.id === id)
//  if (note) {
//    response.json(note)
//  } else {
//    console.log('x')
//    response.status(404).end()
//  }
//})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//app.delete('/api/notes/:id', (request, response) => {
//  const id = Number(request.params.id)
//  notes = notes.filter(note => note.id !== id)
//  response.status(204).end()
//})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(
    request.params.id, 
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  ) 
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})
//app.put('/api/notes/:id', (request, response, next) => {
//  const body = request.body
//
//  const note = {
//    content: body.content,
//    important: body.important,
//  }
//
//  Note.findByIdAndUpdate(request.params.id, note, { new: true })
//    .then(updatedNote => {
//      response.json(updatedNote)
//    })
//    .catch(error => next(error))
//})


//app.put('/api/notes/:id', (request, response) => {
//  console.log("PUT")
//  const id = Number(request.params.id)
//  const body = request.body
//  if (!body.content) {
//    return response.status(400).json({error: 'content missing'})
//  }
//  const changedNote = notes.find(n => n.id === id)
//  if (changedNote) {
//    changedNote.content = body.content
//    changedNote.important = body.important
//    response.json(changedNote)
//  } else {
//      console.log('x')
//      response.status(404).end()
//  }
//})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

// const PORT = process.env.PORT || 3001
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})