const Joi = require('joi');
const mongoose = require('mongoose');
const { movieSchema } = require('./movie');
const { customerSchema } = require('./customer');
const moment = require('moment');


const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    movie: {
        type: movieSchema,
        required: true
    },
    rentalDate: {
        type: Date,
        default: Date
    },
    dateReturned: Date,
    rentalFee: Number
});

rentalSchema.statics.lookup = function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id' : movieId
    });
};

rentalSchema.methods.return = function() {
    this.dateReturned = Date.now();

    this.rentalFee = this.movie.dailyRentalRate * moment().diff(this.rentalDate, 'days');
    this.save();
};

const Rental = mongoose.model('Rental', rentalSchema);

const validateRental = rental => {
    const schemaRental = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    return Joi.validate(rental, schemaRental);
};

module.exports.validate = validateRental;
module.exports.rentalSchema = rentalSchema;
module.exports.Rental = Rental;




