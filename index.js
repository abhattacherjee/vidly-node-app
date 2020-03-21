const express = require('express');
const winston = require('winston');
const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/views')(app);
require('./startup/validation')();

// define ports
const port = process.env.PORT || 3000;

// start listening to port
app.listen(port, () => winston.info(`Listening on port ${port}`));
