const express = require('express');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const auth = require('../middleware/auth');
const { Movie } = require('../models/movie');


const mongoose = require('mongoose');
const Fawn = require('fawn');

const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort( { rentalDate: 1 } );
    res.send(rentals);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // get custsomer
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) res.status(404).send('Customer is invalid');

    // get movie
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) res.status(404).send('Movie is invalid');

    if (movie.numberInStock === 0) return res.status(404).send('Movie is unavailable');

    // save rentals
    const rental = new Rental({
        customer: {
            _id: customer.id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie.id,
            title: movie.title,
            genre: movie.genre,
            numberInStock: movie.numberInStock,
            dailyRentalRate: movie.dailyRentalRate
        },
    });

    try {
        new Fawn.Task()
        .save('rentals', rental)
        .update('movies', {_id: movie._id}, {
            $inc: {numberInStock: -1}
        })
        .run();

        res.send(rental);
    }
    catch(ex) {
        console.log(ex);
        res.status(500).send('Something failed');
    }


});

module.exports = router;
