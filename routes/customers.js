const express = require('express');
const { Customer, validate } = require('../models/customer');

const router = express.Router();

// get
router.get('/', (req, res) => {
    getAllCustomers()
        .then(customers => res.send(customers))
        .catch(err => res.status(500).send('Error getting all customers: ' + err.message));
});

router.get('/:id', (req, res) => {
    getCustomer(req.params.id)
        .then(customer => {
            if (!customer) return res.status(404).send(`Customer with id ${req.params.id} does not exist`);
            res.send(customer);
        })
        .catch(err => res.status(500).send('Error getting customer: ' + err.message));
})

// add a new genre
router.post('/', (req, res) => {
    //validate
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    createCustomer( req.body )
        .then(customer => res.send(customer))
        .catch(err => res.status(500).send('Error creating new customer: ', err.message));

})

// modify an existing genre
router.put('/:id', (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    updateCustomer(req.params.id, req.body)
        .then(customer => {
            if (!customer) return res.status(404).send(`Customer with id ${req.params.id} does not exist`);
            res.send(customer);
        })
        .catch(err => res.status(500).send('Error updating customer: ', err.message));

})

// delete an existing genre
router.delete('/:id', (req, res) => {
    deleteCustomer (req.params.id)
        .then(customer => {
             if (!customer) return res.status(404).send(`Customer with id ${req.params.id} does not exist`);
             res.send(customer)
        })
        .catch(err => res.status(500).send('Error deleting customer: ', err.message));
})

//dao functions

async function createCustomer (customer) {
    console.log(customer);
    const customerDB = new Customer( { 
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone 
    } ); 
    try {
        return result = await customerDB.save();
    }
    catch(err) {
        console.error('Error while saving into database: ' + err.message);
        throw err;
    }
     
}

async function getAllCustomers () {
    try {
        return await Customer.find().sort({name: 1});
    }
    catch(err) {
        console.error('Error while getting customer: ' + err.message);
        throw err;
    }
    
}

async function getCustomer (id) {
    try {
        return await Customer.find({_id: id}).sort({name: 1});
    }
    catch (err) {
        console.error('Error while getting customer: ' + err.message);
        throw err;
    }
}

async function updateCustomer (id, customer) {
    try {
        return await Customer.findByIdAndUpdate({_id: id}, {
            $set: { 
                name: customer.name, 
                isGold: customer.isGold,
                phone: customer.phone
            }
        }, {new: true}
        );
    } 
    catch(err) {
        console.error('Error while updating customer into database: ' + err.message);
        throw err;
    }

}

async function deleteCustomer (id) {
    try {
         return await Customer.findByIdAndRemove({_id: id});
    }
    catch (err) {
         console.error('Error while deleting customer into database: ' + err.message);
         throw err;
    }
}

module.exports = router;