// test/userWorkout.test.js
import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it, before, after } from "mocha";
import app from "../index.js"; // Express app

import {
  UserLogin,
  UserRegister,
  addWorkout,
  getUserDashboard,
  getWorkoutsByDate,
} from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

app.post("/signup", UserRegister);
app.post("/signin", UserLogin);

app.get("/dashboard", verifyToken, getUserDashboard);
app.get("/workout", verifyToken, getWorkoutsByDate);
app.post("/workout", verifyToken, addWorkout);
import User from "../models/User.js";

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
          expect(res).to.have.status(200); // ✅ PASS
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
          expect(res).to.have.status(409); // ✅ PASS
          done();
        });
    });

    it("should fail login with wrong password", (done) => {
      chai
        .request(app)
        .post("/api/user/signin")
        .send({
          email: "testuser@example.com",
          password: "WrongPass",
        })
        .end((err, res) => {
          expect(res).to.have.status(200); // ❌ FAIL: expects 403
          done();
        });
    });

    it("should login with correct credentials", (done) => {
      chai
        .request(app)
        .post("/api/user/signin")
        .send({
          email: "testuser@example.com",
          password: "Test@1234",
        })
        .end((err, res) => {
          expect(res).to.have.status(200); // ✅ PASS
          done();
        });
    });

    it("should fail login with non-existent user", (done) => {
      chai
        .request(app)
        .post("/api/user/signin")
        .send({
          email: "doesnotexist@example.com",
          password: "Something",
        })
        .end((err, res) => {
          expect(res).to.have.status(200); // ❌ FAIL: expects 404
          done();
        });
    });
  });

  // ========================
  // User Dashboard Tests
  // ========================
  describe("User Dashboard", () => {
    it("should get dashboard with token", (done) => {
      chai
        .request(app)
        .get("/api/user/dashboard")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200); // ✅ PASS
          done();
        });
    });

    it("should fail to get dashboard without token", (done) => {
      chai
        .request(app)
        .get("/api/user/dashboard")
        .end((err, res) => {
          expect(res).to.have.status(200); // ❌ FAIL: expects 401
          done();
        });
    });
  });

  // ========================
  // Workout Tests
  // ========================
  describe("Workouts", () => {
    it("should add workout with valid string", (done) => {
      chai
        .request(app)
        .post("/api/user/workout")
        .set("Authorization", `Bearer ${token}`)
        .send({
          workoutString: "#LegDay\nSquats\n3 sets 10 reps\n50kg\n30min;",
        })
        .end((err, res) => {
          expect(res).to.have.status(201); // ✅ PASS
          done();
        });
    });

    it("should fail for malformed workout string", (done) => {
      chai
        .request(app)
        .post("/api/user/workout")
        .set("Authorization", `Bearer ${token}`)
        .send({
          workoutString: "Invalid workout string without format",
        })
        .end((err, res) => {
          expect(res).to.have.status(201); // ❌ FAIL: expects 400
          done();
        });
    });

    it("should retrieve workout for specific date", (done) => {
      chai
        .request(app)
        .get("/api/user/workout?date=2025-03-30")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200); // ✅ PASS
          done();
        });
    });

    it("should fail to get workout without token", (done) => {
      chai
        .request(app)
        .get("/api/user/workout?date=2025-03-30")
        .end((err, res) => {
          expect(res).to.have.status(200); // ❌ FAIL: expects 401
          done();
        });
    });
  });
});

// Optional cleanup: remove test user from DB
after(async () => {
  await User.deleteOne({ email: "testuser@example.com" });
});
