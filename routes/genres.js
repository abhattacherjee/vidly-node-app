const express = require('express');
const Joi = require('joi');

const router = express.Router();

// define data structure
const genres = [{
        id: 1,
        name: 'action'
    },
    {
        id: 2,
        name: 'drama'
    }
];

const validateGenre = function (genre) {
    const schemaGenre = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(genre, schemaGenre);
}

// get
router.get('/', (req, res) => res.send(genres));
router.get('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`Genre with id ${req.params.id} does not exist`);
    res.send(genre);
})

// add a new genre
router.post('/', (req, res) => {
    //validate
    const {
        error
    } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //create a new genre    
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }

    genres.push(genre);
    res.send(genre);
})

// modify an existing genre
router.put('/:id', (req, res) => {
    const {
        error
    } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`Genre with id ${req.params.id} does not exist`);

    genre.name = req.body.name;
    res.send(genre);
})

// delete an existing genre
router.delete('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`Genre with id ${req.params.id} does not exist`);

    genres.splice(genres.indexOf(genre), 1);
    res.send(genre);
})

module.exports = router;