const request = require("supertest");
const mongoose = require("mongoose");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
let server;

describe("api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.deleteMany({});
  });
  afterAll(() => mongoose.disconnect());
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { genre: "genre1" },
        { genre: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.genre === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.genre === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return valid genre if id passed is valid", async () => {
      const genre = new Genre({ genre: "genre1" });
      await genre.save();
      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("genre", genre.genre);
    });
    describe("GET /:id", () => {
      it("should return 404 if id passed is invalid", async () => {
        const res = await request(server).get("/api/genres/1");
        expect(res.status).toBe(404);
      });
    });
  });

  describe("POST /", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server)
        .post("/api/genres")
        .send({ genre: "genre1" });
      expect(res.status).toBe(401);
    });
    it("should return 400 if genre is invalid(less than 5 characters)", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ genre: "1234" });
      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is invalid(more than 50 characters)", async () => {
      const token = new User().generateAuthToken();
      const longGenre = new Array(52).join("a");
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ genre: longGenre });
      expect(res.status).toBe(400);
    });
    it("should save the genre to database if genre is valid", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ genre: "comedy" });
      const genre = await Genre.find({ genre: "comedy" });
      expect(res.status).toBe(200);
      expect(genre).not.toBeNull();
    });
    it("should return the genre if genre is valid", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ genre: "comedy" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("genre", "comedy");
    });
  });
  describe("DELETE /:id", () => {
    it("should return 404 if genreid is invalid", async () => {
      const user = { _id: mongoose.Types.ObjectId(), isAdmin: true };
      const genre = new Genre({ genre: "genre3" });
      const token = new User(user).generateAuthToken();
      const res = await request(server)
        .delete("/api/genres/1")
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
    it("should return 403 if user is authenticated but not admin and genreid is valid", async () => {
      const user = { _id: mongoose.Types.ObjectId(), isAdmin: false };
      const genre = new Genre({
        genre: "genre3",
      });
      await genre.save();
      const token = new User(user).generateAuthToken();
      const res = await request(server)
        .delete("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send();
      expect(res.status).toBe(403);
  
    });
    it("should return 200 if user is aothernticated + admin and genreid is valid", async () => {
      const user = { _id: mongoose.Types.ObjectId(), isAdmin: true };
      const genre = new Genre({
        genre: "genre3",
      });
      await genre.save();
      const token = new User(user).generateAuthToken();
      const res = await request(server)
        .delete("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("genre", "genre3");
    });
  });
});
