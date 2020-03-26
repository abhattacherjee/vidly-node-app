const express = require('express');
const mongoose = require('mongoose');
const validateObjectId = require('../middleware/validateObjectId');
const { Rental, validate } = require('../models/rental');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

});

module.exports = router;
