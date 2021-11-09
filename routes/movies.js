const express = require('express')
const mongoose = require('mongoose')
const {Movie, validateMovie} = require('../models/movie')
const {Genre} = require('../models/genre')
const router = express.Router()


// get all movies
router.get('/', async (req,res)=>{
    const movies = await Movie.find().sort({title:1})
    res.send(movies)
})

// create a movie

router.post('/', async (req,res)=>{
    const {error} = validateMovie(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const genreFound = await Genre.findById(req.body.genreId)
    if(!genreFound) return res.status(400).send('Invalid genre')

    const movie = new Movie({
        title: req.body.title,
        genre:{
            _id: genreFound._id,
            genre: genreFound.genre
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })
    await movie.save()
    res.send(movie)
})

// update a movie details
router.put('/:id',async (req,res)=>{
    const movie = await Movie.findById(req.params.id)
    const genreFound = await Genre.findById(req.body.genreId)
    if(!genreFound) return res.status(400).send('Invalid genre')
    if(!movie) return res.status(404).send('could not find the specified movie')
    movie.title = req.body.title,
    movie.genre= {
        _id: genreFound._id,
        genre: genreFound.genre
    },
    movie.numberInStock = req.body.numberInStock,    
    movie.dailyRentalRate= req.body.dailyRentalRate
    await movie.save()
    res.send(movie)    
})

// delete movie

router.delete('/:id',async (req,res)=>{
    const deletedMovie = await Movie.findOneAndRemove(req.params.id);
    if(!deletedMovie) return res.status(404).send('Could not find that movie')
    res.send(deletedMovie)
})
module.exports = router