const mongoose = require('mongoose')
const Joi = require('joi')

const customerSchema = mongoose.Schema({
    isGold:{
        type: Boolean,
        default:false
    },
    name:{
        type: String,
        required: true,
        minlength:5,
        maxlength: 50
    },
    phone: {
        type: String,
        required:true
    }
})
const Customer = mongoose.model('Customer', customerSchema)

function validateCustomer(customer){
    const schema = Joi.object({
        isGold: Joi.boolean(),
        name:Joi.string()
            .min(5)
            .max(50)
            .required(),
        phone: Joi.string()
            .required()

    });
    return schema.validate(customer)
}

module.exports.Customer = Customer
module.exports.validateCustomer = validateCustomer