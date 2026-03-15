import request from "supertest";
import { createApp } from "../../app.js";
import { jest } from "@jest/globals";

describe("POST /api/otp/verify-otp — OTP verification endpoint", () => {
  it("should return 404 if OTP is incorrect", async () => {
    const app = createApp({
      genOTP: jest.fn(() => "123456"),
      sendOTPMail: jest.fn(),
    });

    const agent = request.agent(app);

    await agent.post("/api/auth/register").send({
      name: "Mark Cuban",
      email: "dev@markcuban.com",
      password: "mark123",
      confirmPass: "mark123",
    });

    const res = await agent.post("/api/otp/verify-otp").send({ otp: "000000" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Invalid OTP");
  });

  it("should varify OTP with 200 status code", async () => {
    const app = createApp({
      genOTP: jest.fn(() => "123456"),
      sendOTPMail: jest.fn(),
    });

    const agent = request.agent(app);

    await agent.post("/api/auth/login").send({
      email: "dev@markcuban.com",
      password: "mark123",
    });

    await agent.post("/api/otp/request-otp");
    const res = await agent.post("/api/otp/verify-otp").send({ otp: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("OTP verified");
    expect(res.body.isVerified).toBe(true);
  });
});
