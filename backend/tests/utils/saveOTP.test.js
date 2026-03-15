import bcrypt from "bcryptjs";
import OTP from "../../src/models/OTP.model.js";
import { saveOTP } from "../../src/services/email.service.js";

describe("saveOTP", () => {
  it("saves hashed OTP in database", async () => {
    await saveOTP("user@test.com", "123456");

    const otpDoc = await OTP.findOne({ email: "user@test.com" });

    expect(otpDoc).not.toBeNull();

    const isMatch = await bcrypt.compare("123456", otpDoc.otp);
    expect(isMatch).toBe(true);

    expect(otpDoc.expiresAt).toBeDefined();
  });

  it("replaces existing OTP", async () => {
    await saveOTP("user@test.com", "111111");
    await saveOTP("user@test.com", "222222");

    const otps = await OTP.find({ email: "user@test.com" });

    expect(otps.length).toBe(1);

    const isMatch = await bcrypt.compare("222222", otps[0].otp);
    expect(isMatch).toBe(true);
  });
});
