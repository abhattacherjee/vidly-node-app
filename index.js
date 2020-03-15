
const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');

Joi.objectId = require('joi-objectid')(Joi);

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const home = require('./routes/home');


const app = express();

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL: jwtPrivateKey is not defined');
    process.exit(1);
}

// connect to MongoDB
mongoose
    .connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB: ' + err.message));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.static('public'));

app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

// define ports
const port = process.env.PORT || 3000;

// start listening to port
app.listen(port, () => console.log(`Listening on port ${port}`));
