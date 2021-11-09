const mongoose = require('mongoose')

// can create winston logs here as well
// and get rid of catch sentence
module.exports = function(){
    mongoose.connect('mongodb://localhost/vidly')
    .then(()=>console.log('successfully connected to mongo db vidly'))
    .catch( (e)=> console.log('unable to connect'))
}