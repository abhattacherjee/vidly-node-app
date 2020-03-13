
const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const home = require('./routes/home');

const app = express();

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


// define ports
const port = process.env.PORT || 3000;

// start listening to port
app.listen(port, () => console.log(`Listening on port ${port}`));
