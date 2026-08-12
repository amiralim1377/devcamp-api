import mongoose from "mongoose";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { config } from "../../config/index.js";
import request from "supertest";
import app from "../../app.js";
import User from "../../models/user.model.js";
import { signToken } from "../../utils/signToken.js";
import { Bootcamp } from "../../models/bootcamp.model.js";

describe("Bootcamp API Integration Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(config.databaseLocal);
  });
  beforeEach(async () => {
    await User.deleteMany({ email: "instructor@test.com" });
    await Bootcamp.deleteMany({ name: "Supertest Bootcamp" });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /api/v1/bootcamps", () => {
    it("should return 200 OK and a list of bootcamps", async () => {
      // act
      const response = await request(app).get("/api/v1/bootcamps");

      //   assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.bootcamps)).toBe(true);
    });
  });

  describe("POST /api/v1/bootcamps", () => {
    it("should create a new bootcamp when user is logged in as an instructor", async () => {
      // arrange
      const testUser = await User.create({
        name: "Test Instructor",
        email: "instructor@test.com",
        password: "password123",
        passwordConfirm: "password123",
        role: "instructor",
      });

      const token = signToken(testUser._id.toString());

      const newBootcampData = {
        title: "Supertest Bootcamp Masterclass",
        description: "Learn to build modern APIs with Node.js and Supertest.",
        price: 99.5,
        startDate: "2026-09-01T10:00:00.000Z",
      };

      //   act
      const response = await request(app)
        .post("/api/v1/bootcamps")
        .set("Authorization", `Bearer ${token}`)
        .send(newBootcampData);

      //   assert
      expect(response.status).toBe(201);
      expect(response.body.data.bootcamp.title).toBe(newBootcampData.title);
    });
  });
}, 10000);
