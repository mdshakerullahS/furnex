import request from "supertest";
import app from "../../app.js";

describe("POST /api/messages — Save message endpoint", () => {
  const route = "/api/messages";

  it("returns 400 if required fields are missing", async () => {
    const res = await request(app).post(route).send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Fill up required fields");
  });

  it("should save the message in the DB and return 201", async () => {
    const res = await request(app)
      .post(route)
      .send({ name: "name", email: "email", message: "Message" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Message received successfully");
  });
});
