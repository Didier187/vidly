const express = require('express')
const Joi = require('joi')
const mongoose = require('mongoose')
const { Genre,validateGenre } = require('../models/genre')
const router = express.Router()

// routes

// get all genres
router.get('/', async (req,res)=>{
    const genres = await Genre.find().sort({genre:1})
   res.send(genres)
    
})
// get genre by name

router.get('/:genre', async (req,res)=>{
    const genre = await Genre.find({genre: req.params.genre})
    if(!genre) return res.status(404).send('genre not found')
    res.send(genre)
})

// create a new genre
router.post('/',async (req,res)=>{
    const result = validateGenre(req.body)
    if(result.error) return res.status(400).send(result.error.details[0].message)

    let genre = new Genre({
        genre: req.body.genre
    })

    genre = await genre.save()
    
    res.send(genre)
})

// find by id and update
router.put('/:id',async (req,res)=>{
    const result = validateGenre(req.body)
    if(result.error) return res.status(400).send(result.error.details[0].message)

    const genre = await Genre.findByIdAndUpdate(req.params.id,{genre: req.body.genre
    }, {new: true}
    )
    if(!genre) return res.status(404).send('genre not found')
    res.send(genre)
})

// delete genre
router.delete('/:id',async (req,res)=>{
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if(!genre) return res.status(404).send('genre not found')
    
    res.send(genre)
})

module.exports = router;