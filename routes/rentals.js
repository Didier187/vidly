const express =require('express')
const mongoose =require('mongoose')
const {Rental, validateRental} = require('../models/rental')
const {Movie} =require('../models/movie')
const {Customer} = require('../models/customer')
const router = express.Router()


router.get('/', async(req,res)=>{
    const rentals = await Rental.find().sort({dateOut:-1})
    res.send(rentals)
})

router.post('/', async (req,res)=>{
    //transactions
    // create a session for rental
    const session = await Rental.startSession()
    const {error} = validateRental(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    const customer = await Customer.findById(req.body.customerId).session(session)
    if(!customer) return res.status(400).send('can not find customer')

    const movie = await Movie.findById(req.body.movieId).session(session)
    if(!movie) return res.status(400).send('can not find that movie')
    if(movie.numberInStock === 0) return res.status(400).send('movie not in stock')

    let rental = new Rental({
        customer:{
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie:{
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })
    rental =await rental.save()

    movie.numberInStock--;
    movie.save()
    res.send(rental)
    //end session here
    session.endSession();
})


module.exports = router