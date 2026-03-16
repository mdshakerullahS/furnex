import request from "supertest";
import { genOTP } from "../../src/services/email.service.js";
import { jest } from "@jest/globals";
import { createApp } from "../../app.js";

describe("POST /api/otp/request-otp — OTP request endpoint", () => {
  it("returns 401 if not logged in", async () => {
    const app = createApp({ genOTP, sendOTPMail: jest.fn() });

    const res = await request(app).post("/api/otp/request-otp");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Not authorized, please login");
  });

  it("should send OTP with 200 status code", async () => {
    const app = createApp({ genOTP, sendOTPMail: jest.fn() });

    const agent = request.agent(app);

    await agent.post("/api/auth/register").send({
      name: "Mark Cuban",
      email: "dev@markcuban.com",
      password: "mark123",
      confirmPass: "mark123",
    });

    const res = await agent.post("/api/otp/request-otp");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("OTP sent to your email");
  });
});
