const bcrypt =require('bcrypt')
const express = require('express')
const Joi = require('joi')
const { User} = require('../models/user')
const router = express.Router()


// login existing user

router.post('/', async (req,res)=>{
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    let user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Invalid email or password')

    //user.password already contains the hashing salt
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Invalid email or password')
    const token = user.generateAuthToken()
    res.send(token)
})

function validate(req){
    const schema = Joi.object({
        email:Joi.string().trim().min(5).max(255).required().email(),
        password:Joi.string().min(10).max(255).required()
    })
    return schema.validate(req)
}

module.exports = router