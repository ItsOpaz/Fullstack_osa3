require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body'));

let persons = [
    { 
        name: 'Arto Hellas', 
        number: '040-123456',
        id: 1
    },
    {
        name: 'Ada Lovelace',
        number: '39-44-5323523',
        id: 2
    },
    {
        name: 'Dan Abramov', 
        number: '12-43-234345',
        id: 3
    },
    {
        name: 'Mary Poppendieck', 
        number: '39-23-6423122',
        id: 4
    }
  ]

  app.get('/',(req, res) => {
    res.get('/index.html')
  })

  app.get('/api/persons', (req, res) => {
    Person.find({}).then (persons => {
      res.json(persons)
    })
  })

  app.get('/api/info', (req, res) => {
    Person.countDocuments({}).exec((err,count) => {
      res.send(`Phonebook has info of ${count} persons <br/> ${Date()}`)
  })
})


  app.get('/api/persons/:id', (request, response) => {
    Person.findById(req.params.id)
    .then(person => {
        if (person) {
            res.json(person)
        }else{
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body
    const names = persons.map(n=>n.name)

    function nameIsTaken(name){
        return name === body.name
    }
  
    if (!body.name) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }else if(!body.number){
        return response.status(400).json({ 
            error: 'number missing'
        })
    }else if(names.find(nameIsTaken)){
        return response.status(400).json({ 
            error: 'name must be unique'
        })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })