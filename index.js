require('express-async-errors')
require('winston-mongodb')
const config = require('config')
const winston = require('winston')
const Joi = require('joi')
//validating objectid by Joi-objectid
Joi.objectId = require('joi-objectid')(Joi)
const express = require('express')
const mongoose = require('mongoose')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auth = require('./routes/auth')
const errorHandler = require('./middleware/error')
const app = express()


process.on('uncaughtException',(ex)=>{
   // you can also logged this using a package like winston
    console.log('uncaught error during start up')
    process.exit(1)
}) 


process.on('unhandledRejection',(ex)=>{
    // you can also logged this using a package like winston
     console.log('unhandled promise error')
     process.exit(1)
 }) 

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR missing jwt key')
    //0 =success , >= 1 = failure in the process global object
    process.exit(1)
}

mongoose.connect('mongodb://localhost/vidly')
    .then(()=>console.log('successfully connected to mongo db vidly'))
    .catch( (e)=> console.log('unable to connect'))


app.use(express.json())
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/auth', auth)

// the middleware to handle the errors
app.use(errorHandler)

const port  = process.env.PORT || 3000
app.listen(port,()=>{console.log(`Listening on port ${port}`)})