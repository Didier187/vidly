const mongoose =require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:100
    },
    email:{
        type:String,
        required:true,
        minlength:5,
        maxlength:255,
        unique:true
    },
    password:{
        type:String,
        minlength:10,
        maxlength:1024,
        required:true
    },
    isAdmin: Boolean
})
//creating jwts from a method attached to userSchema so that we can call user.generateAuthToken
// anywhere we have a user
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin},config.get('jwtPrivateKey'))
    return token
}

const User = mongoose.model('User', userSchema)
// you can use joi-password-complexity npm package to enforce stronger password
function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(100).required(),
        email:Joi.string().trim().min(5).max(255).required().email(),
        password:Joi.string().min(10).max(255).required(),
        isAdmin: Joi.boolean()
    })
    return schema.validate(user)
}

module.exports.User = User
module.exports.validateUser = validateUser