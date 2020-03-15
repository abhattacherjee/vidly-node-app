const express = require('express');
const { Movie, validate } = require('../models/movie');
const { getGenre } = require('./genres');

const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort({name: 1});
    res.send(movies);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // get the genre
    const genre = await getGenre(req.body.genreId);
    if(!genre) return res.status(404).send('Genre is invalid');

    console.log(genre);

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre[0].id,
            name: genre[0].name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();
    res.send(movie);
});


module.exports = router;

