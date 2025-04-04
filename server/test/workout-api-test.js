// test/userWorkout.test.js
import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it, before, after } from "mocha";
import app from "../index.js"; // Ensure index.js exports your express app
import {
  UserRegister,
  UserLogin,
  getUserDashboard,
  getWorkoutsByDate,
  addWorkout,
} from "../controllers/User.js"; // Import controllers for coverage

const { expect } = chai;
chai.use(chaiHttp);

let token;
let userId;

describe("User & Workout API Tests", () => {
  // ========================
  // User Authentication Tests
  // ========================
  describe("User Authentication", () => {
    it("should register a new user", (done) => {
      chai
        .request(app)
        .post("/api/user/signup")
        .send({
          email: "testuser@example.com",
          password: "Test@1234",
          name: "Test User",
          img: "https://example.com/profile.jpg",
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("token").that.is.a("string");
          expect(res.body).to.have.property("user").that.is.an("object");
          expect(res.body.user).to.have.property("_id").that.is.a("string");
          token = res.body.token;
          userId = res.body.user._id;
          done();
        });
    });

    it("should not register a user with an existing email", (done) => {
      chai
        .request(app)
        .post("/api/user/signup")
        .send({
          email: "testuser@example.com",
          password: "Test@1234",
          name: "Duplicate User",
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          done();
        });
    });

    it("should log in an existing user", (done) => {
      chai
        .request(app)
        .post("/api/user/signin")
        .send({
          email: "testuser@example.com",
          password: "Test@1234",
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("token").that.is.a("string");
          done();
        });
    });

    it("should not log in with incorrect password", (done) => {
      chai
        .request(app)
        .post("/api/user/signin")
        .send({
          email: "testuser@example.com",
          password: "WrongPass",
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          done();
        });
    });

    it("should not log in with non-existing user", (done) => {
      chai
        .request(app)
        .post("/api/user/signin")
        .send({
          email: "nonexistent@example.com",
          password: "SomePassword",
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  // ========================
  // User Dashboard Tests
  // ========================
  describe("User Dashboard", () => {
    it("should retrieve user dashboard data", (done) => {
      chai
        .request(app)
        .get("/api/user/dashboard")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("totalCaloriesBurnt");
          done();
        });
    });

    it("should return unauthorized error if no token provided", (done) => {
      chai
        .request(app)
        .get("/api/user/dashboard")
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  // ========================
  // Workout Tests
  // ========================
  describe("Workouts", () => {
    it("should add a new workout", (done) => {
      chai
        .request(app)
        .post("/api/user/workout")
        .set("Authorization", `Bearer ${token}`)
        .send({
          workoutString: "#LegDay\nSquats\n3 sets 10 reps\n50kg\n30min;",
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("should return error for malformed workout string", (done) => {
      chai
        .request(app)
        .post("/api/user/workout")
        .set("Authorization", `Bearer ${token}`)
        .send({
          workoutString: "Squats 3 sets 10 reps 50kg 30min;",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it("should retrieve workouts for a specific date", (done) => {
      chai
        .request(app)
        .get("/api/user/workout?date=2025-03-30")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("todaysWorkouts");
          done();
        });
    });

    it("should return unauthorized error for fetching workouts without token", (done) => {
      chai
        .request(app)
        .get("/api/user/workout?date=2025-03-30")
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });
});

// Optional cleanup: remove test user from database after tests run
import User from "../models/User.js"; // adjust path if needed
after(async () => {
  await User.deleteOne({ email: "testuser@example.com" });
});
