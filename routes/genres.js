const express = require('express')
const Joi = require('joi')
const router = express.Router()

const genres =[
    {
        id:1,
        genre:"horror"
    },
    {
        id:2,
        genre:"True story"
    },
    {
        id:3,
        genre:"documentary"
    },
    {
        id:4,
        genre:"Drama"
    }
]
router.get('/', (req,res)=>{
    res.send(genres)
})

router.get('/:genre', (req,res)=>{
    const genre = genres.find(g => g.genre === req.params.genre)
    if(!genre) return res.status(404).send('genre not found')
    res.send(genre)
})

router.post('/',(req,res)=>{
    const schema = Joi.object({
        id:Joi.number(),
        genre: Joi.string().max(10)
    });

    const newGenre={
        id: genres.length + 1,
        genre: req.body.genre
    }
    const result = schema.validate(newGenre)
    if(result.error) return res.status(400).send(result.error.details[0].message)
    genres.push(newGenre)
    res.send(genres)
})

router.put('/:id',(req,res)=>{
    let genre = genres.find(g => g.id === parseInt(req.params.id))
    if(!genre) return res.status(404).send('genre not found')
    genre.genre = req.body.genre
    res.send(genre)
})

router.delete('/:id',(req,res)=>{
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if(!genre) return res.status(404).send('genre not found')
    const index = genres.indexOf(genre)
    genres.splice(index,1)
    res.send(genres)
})



module.exports = router;