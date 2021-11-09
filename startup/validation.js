const Joi = require('joi')
module.exports= function(){
    //validating objectid by Joi-objectid
    Joi.objectId = require('joi-objectid')(Joi)
}