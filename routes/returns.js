const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const moment = require("moment");
const Joi = require('joi')

router.post("/", auth, async (req, res) => {
  const result = validateReturn(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);
    const rental = await Rental.findOne({
    customer_id: req.body.customerId,
    movie_id: req.body.movieId,
  });
  if (!rental) return res.status(404).send("Bad request: Rental not found");
  if (rental.dateReturned)
    return res.status(400).send("return already processed");
  rental.dateReturned = new Date();
  const rentedDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentedDays * rental.movie.dailyRentalRate;
  await rental.save();
  await Movie.updateOne(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  return res.status(200).send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(req);
}
module.exports = router;
