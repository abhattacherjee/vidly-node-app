const Joi = require('joi');
const mongoose = require('mongoose');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

const validateGenre = function (genre) {
    const schemaGenre = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(genre, schemaGenre);
}

exports.Genre = Genre;
exports.validate = validateGenre;
