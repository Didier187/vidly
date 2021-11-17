const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = mongoose.Schema({
  genre: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    lowercase: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    genre: Joi.string().min(5).max(50),
  });
  return schema.validate(genre);
}
module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validateGenre = validateGenre;
