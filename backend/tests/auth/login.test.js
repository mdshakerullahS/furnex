import request from "supertest";
import app from "../../app.js";
import User from "../../src/models/user.model.js";
import bcrypt from "bcryptjs";

describe("POST /api/auth/login — User Login Endpoint", () => {
  const route = "/api/auth/login";

  it("should return 400 when required fields are missing", async () => {
    const res = await request(app).post(route).send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should return 400 for an invalid email format", async () => {
    const res = await request(app)
      .post(route)
      .send({ email: "invalid-email", password: "mark123" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should return 400 for wrong information", async () => {
    const res = await request(app)
      .post(route)
      .send({ email: "random@email.com", password: "random-password" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should return 200 status with user data", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Mark Cuban",
      email: "dev@markcuban.com",
      password: "mark123",
      confirmPass: "mark123",
    });

    const res = await request(app).post(route).send({
      email: "dev@markcuban.com",
      password: "mark123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.body.message).toBe("Logged in successfully");

    const user = await User.findOne({ email: "dev@markcuban.com" });
    expect(user).not.toBeNull();

    expect(await bcrypt.compare("mark123", user?.password)).toBe(true);
    expect(res.body.user).toEqual({
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
    });
  });
});
