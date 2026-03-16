import request from "supertest";
import app from "../../app.js";
import User from "../../src/models/user.model.js";

describe("POST /api/auth/register — User Registration Endpoint", () => {
  const validUser = {
    name: "Mark Cuban",
    email: "dev@markcuban.com",
    password: "mark123",
    confirmPass: "mark123",
  };

  const route = "/api/auth/register";

  it("should return 400 when required fields are missing", async () => {
    const res = await request(app).post(route).send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should return 400 for an invalid email format", async () => {
    const res = await request(app)
      .post(route)
      .send({ ...validUser, email: "invalid-email" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid email");
  });

  it("should return 400 when password and confirm password do not match", async () => {
    const res = await request(app)
      .post(route)
      .send({ ...validUser, confirmPass: "mark12" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "Passwords in the both fields should be the same",
    );
  });

  it("should create a new user and return a 201 status with user data", async () => {
    const res = await request(app).post(route).send(validUser);

    expect(res.status).toBe(201);
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.body.message).toBe("User registered successfully");

    const user = await User.findOne({
      email: validUser.email,
    });
    expect(user).not.toBeNull();

    expect(res.body.user).toMatchObject({
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    });
  });

  it("should return 400 when trying to register with an existing email", async () => {
    const res = await request(app).post(route).send(validUser);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });
});
