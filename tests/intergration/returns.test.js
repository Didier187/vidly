const request = require("supertest");
const mongoose = require("mongoose");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const moment = require("moment");
const { Movie } = require("../../models/movie");
let server;
let customerId;
let movieId;
let rental;
let token;
let movie;

const exec = () => {
  return request(server)
    .post("/api/returns")
    .set("x-auth-token", token)
    .send({ customerId, movieId });
};
describe("/api/returns", () => {
  beforeEach(async () => {
    server = require("../../index");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = User().generateAuthToken();
    movie = new Movie({
      _id: movieId,
      title: "The gentlemen",
      dailyRentalRate: 2,
      genre: { genre: "12345" },
      numberInStock: 10,
    });
    await movie.save();
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "123456",
      },
      movie: {
        _id: movieId,
        title: "The gentlemen",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.deleteOne({});
    await Movie.deleteMany({});
  });
  afterAll(() => mongoose.disconnect());

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if customerId is not provided", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 400 if movieId is not provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 404 if movieId/customerId are not found", async () => {
    await Rental.deleteOne({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 200 if we have a valid request", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
  it("should set returnDate if input is valid", async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const diff = rentalInDb.dateReturned - rentalInDb.dateOut;
    expect(diff).toBeGreaterThan(1);
  });
  it("should set the rentalFee to dailyRentalFee times numver of days out", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });
  it("should increase the movie stock", async () => {
    const res = await exec();
    const movieInDb = await Movie.findById(movie._id);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });
  it("should return the rental if in put is valid", async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(res.body).toHaveProperty("dateOut");
    expect(res.body).toHaveProperty("dateReturned");
    expect(res.body).toHaveProperty("rentalFee");
    expect(res.body).toHaveProperty("customer");
    expect(res.body).toHaveProperty("movie");
  });
});
