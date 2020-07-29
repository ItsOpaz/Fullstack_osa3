const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
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

  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/api/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people <br/>
    ${Date()}`)
  })


  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body
    const names = persons.map(n=>n.name)

    function getRandomInt() {
        min = Math.ceil(1);
        max = Math.floor(1000);
        return Math.floor(Math.random() * (max - min)) + min;
      }

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
  
    const person = {
      name: body.name,
      number: body.number,
      id: getRandomInt(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })