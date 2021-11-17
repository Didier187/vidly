const request = require("supertest");
const mongoose = require("mongoose");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genre.deleteMany({});
    server.close();
  });
  afterAll(() => mongoose.disconnect());
  let token;

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ genre: "genre1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if token is invalid", async () => {
    token = "bees";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 200 if token is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
