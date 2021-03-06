const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
})

const Movie = mongoose.model('Movie', movieSchema);

const validateMovie = movie => {
    const schemaMovie = {
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.objectId().required(),
        dailyRentalRate: Joi.number().required(),
        numberInStock: Joi.number().required()

    }
    return Joi.validate(movie, schemaMovie);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
module.exports.movieSchema = movieSchema;
