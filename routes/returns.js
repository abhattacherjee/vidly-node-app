const express = require('express');
const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post('/', auth, validateRequest(validate), async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental)
        return res.status(404).send('Not found');
    else if(rental.dateReturned)
        return res.status(400).send('Bad Request');

    await rental.return();

    await Movie.findByIdAndUpdate(
        req.body.movieId,
        {$inc: {numberInStock: 1}},
        {new: true});

    return res.send(rental);
});

module.exports = router;
