const lodash = require('lodash')
const auth = require('../middleware/auth')
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const express = require('express')
const { User, validateUser } = require('../models/user')
const router = express.Router()


//get all users

router.get('/', async(req,res)=>{
    const users =await User.find().sort({name:1}).select({name:1, email:1})
    res.send(users)
})
// get logged in user

router.get('/me', auth, async(req,res)=>{
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
})

// create a new user
router.post('/', async (req,res)=>{
    const {error} = validateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    let user = await User.findOne({email: req.body.email})
    if(user) return res.status(400).send('user with that email already exists')

    // lodash picks only spacified properties from the given object
    user = new User(lodash.pick(req.body,['name', 'email','password','isAdmin']))
    const salt =  await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()
    // create a jwt and set it response header as x-auth-token
    const token = user.generateAuthToken()
    res.header('x-auth-token',token).send( lodash.pick(user,['_id','name', 'email']))
})

module.exports = router