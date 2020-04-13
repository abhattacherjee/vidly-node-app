const express = require('express');
const winston = require('winston');
const cors = require('cors');
const app = express();
app.use(cors());

require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/views')(app);
require('./startup/validation')();
require('./startup/prod')(app);

// define ports
const port = process.env.PORT || 3000;

// start listening to port
const server = app.listen(port, () => winston.info(`Listening on port ${port}`));

module.exports = server;
