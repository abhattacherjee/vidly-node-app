
const express = require('express');
const Joi = require('joi');
const genres = require('./routes/genres');
const home = require('./routes/home');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.static('public'));

app.use('/', home);
app.use('/api/genres', genres);

// define ports
const port = process.env.PORT || 3000;

// start listening to port
app.listen(port, () => console.log(`Listening on port ${port}`));
