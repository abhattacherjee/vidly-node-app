const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const { User } = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid user or password');

    try {
        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid) return res.status(400).send('Invalid user or password');
    
        const token = user.generateAuthToken();
        res.header('x-auth-token', token)
        res.sendStatus(200);

    }
    catch(err) {
        console.error(err);
        res.status(500).send('Error authenticating the user');
    }
    
})

function validate(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
}

module.exports = router;