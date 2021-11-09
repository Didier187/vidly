const Joi =require('joi')
const mongoose = require('mongoose')
const {genreSchema} = require('./genre')

const movieSchema = mongoose.Schema({
    title: {
        type:String,
        trim:true,
        required:true,
        minlength:3,
        maxlenght:50
    },
    genre: {
        type: genreSchema, 
        required: true
    },
    numberInStock: {
        type: Number,
        required:true,
        min: 0,
        max:255
    },
    dailyRentalRate: {
        type: Number,
        required:true,
        min: 0,
        max:255
    }
})

const Movie = mongoose.model('Movie', movieSchema)

function validateMovie(movie){
        const schema =Joi.object({
        title:Joi.string().min(3).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    });

    return schema.validate(movie)
}

module.exports.Movie = Movie
module.exports.movieSchema =movieSchema
module.exports.validateMovie = validateMovie