const express = require('express');
const mongoose = require('mongoose');

const { Genre, validate } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

// get all genres
router.get('/', async (req, res) => {
    const genres = await getAllGenres();
    res.send(genres);
});

// get a specific genre
router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await getGenre(req.params.id);
    if (!genre) return res.status(404).send(`Genre with id ${req.params.id} does not exist`);
    res.send(genre);
})

// add a new genre
router.post('/', auth, (req, res) => {
    
    //validate
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    createGenre( { name: req.body.name } )
        .then(genre => res.send(genre))
        .catch(err => res.status(500).send('Error creating new genre: ', err.message));

})

// modify an existing genre
router.put('/:id', auth, (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    updateGenre(req.params.id, req.body.name)
        .then(genre => {
            if (!genre) return res.status(404).send(`Genre with id ${req.params.id} does not exist`);
            res.send(genre);
        })
})

// delete an existing genre
router.delete('/:id', [auth, admin], (req, res) => {
    deleteGenre (req.params.id)
        .then(genre => {
             if (!genre) return res.status(404).send(`Genre with id ${req.params.id} does not exist`);
             res.send(genre)
        })
})

//dao functions

async function createGenre (genre) {
    const genreDB = new Genre( { name: genre.name } ); 
    try {
        return result = await genreDB.save();
    }
    catch(err) {
        console.error('Error while saving into database: ' + err.message);
        throw err;
    }
     
}

async function getAllGenres () {
    try {
        return await Genre.find().sort({name: 1});
    }
    catch(err) {
        console.error('Error while getting genres: ' + err.message);
        throw err;
    }
    
}

async function getGenre (id) {
    try {
        return await Genre.findById(id).sort({name: 1});
    }
    catch (err) {
        console.error('Error while getting genre: ' + err.message);
        throw err;
    }
}

async function updateGenre (id, name) {
    try {
        return await Genre.findByIdAndUpdate({_id: id}, {
            $set: { name: name }
        }, {new: true});
    } 
    catch(err) {
        console.error('Error while updating genre into database: ' + err.message);
        throw err;
    }

}

async function deleteGenre (id) {
    try {
         return await Genre.findByIdAndRemove({_id: id});
    }
    catch (err) {
         console.error('Error while deleting genre into database: ' + err.message);
         throw err;
    }
}

module.exports = router;
module.exports.getGenre = getGenre;