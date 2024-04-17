const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://lasselautanala:${password}@fullstackdatabase.j1z9b3g.mongodb.net/noteApp?retryWrites=true&w=majority`
//  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

let notes = [
    {
      id: 1,
      content: "HTML is not easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

  
if (process.argv.length === 4) {
  const note = new Note({
    content: process.argv[3],
    important: false
  })
  note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
}