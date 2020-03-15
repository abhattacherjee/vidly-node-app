const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const { movieSchema } = require('./movie');
const { customerSchema } = require('./customer');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    movies: [ movieSchema ],
    rentalDate: {
        type: Date,
        default: Date
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

const validateRental = rental => {
    const schemaRental = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    return Joi.validate(rental, schemaRental);
}

module.exports.validate = validateRental;
module.exports.rentalSchema = rentalSchema;
module.exports.Rental = Rental;




