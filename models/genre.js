const mongoose = require('mongoose')
const Joi = require('joi')

const genreSchema = mongoose.Schema({
    genre:{
        type: String,
        required: true,
        minlength: 3,
        maxlength:100,
        lowercase:true
    },
    date:{
        type:Date,
        default: Date.now
    }
})

const Genre = mongoose.model('Genre', genreSchema)

function validateGenre(genre){
    const schema = Joi.object({
        genre: Joi.string().max(100)
    });
    return schema.validate(genre)
}
module.exports.Genre = Genre
module.exports.validateGenre = validateGenre