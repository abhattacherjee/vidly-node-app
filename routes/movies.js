const express = require('express');
const { Movie, validate } = require('../models/movie');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const { getGenre } = require('./genres');

const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort({name: 1});
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie)
        res.send(404).send('Movie not found');

    res.send(movie);
})

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // get the genre
    const genre = await getGenre(req.body.genreId);
    if(!genre) return res.status(404).send('Genre is invalid');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre.id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();
    res.send(movie);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // get the genre
    const genre = await getGenre(req.body.genreId);
    if(!genre) return res.status(404).send('Genre is invalid');

    const movie = await Movie.findByIdAndUpdate(
        {_id: req.params.id},
        {$set:
                {
                    title: req.body.title,
                    genre: {
                        _id: genre.id,
                        name: genre.name
                    },
                    numberInStock: req.body.numberInStock,
                    dailyRentalRate: req.body.dailyRentalRate
                }
        },
        {new: true}
        );

    if(!movie) res.status(404).send('Movie not found');
    res.send(movie);
})

router.delete('/:id', [auth, admin], async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if(!movie) return res.status(404).send('Movie does not exist');
})


module.exports = router;

