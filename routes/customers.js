const { Customer, validateCustomer} = require('../models/customer')
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

//create customer
router.post('/', async(req, res)=>{
    const result = validateCustomer(req.body)
    if(result.error) return res.status(400).send(result.error.details[0].message)
    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    })
    await customer.save()
    res.send(customer)
})

// read customers
router.get('/', async (req, res)=>{
    const customers = await Customer.find().sort({name: 1})
    res.send(customers)
})

//update customer
router.put('/:id', async (req,res) => {
    const result = validateCustomer(req.body)
    if(result.error) return res.status(400).send(result.error.details[0].message)

    const customer = await Customer.findOneAndUpdate(req.params.id, {
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    },{new:true})

    if(!customer) return res.status(404).send('customer for that id not found')
    res.send(customer)
})

// delete customer
router.delete('/:id', async (req,res)=>{
    const deletedCustomer = await Customer.findOneAndRemove(req.params.id)
    res.send(deletedCustomer)
})

module.exports = router