import bcrypt from "bcryptjs";
import OTP from "../models/OTP.model.js";
import Brevo from "@getbrevo/brevo";

export const sendOTPMail = async (email, otp) => {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY,
    );

    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Your OTP Verification Code";
    sendSmtpEmail.sender = {
      name: "Furniro Support",
      email: process.env.EMAIL_USER,
    };
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.htmlContent = `
      <div style="font-family: sans-serif; text-align: center; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #b88e2f;">Email Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 5px; color: #333;">${otp}</h1>
        <p>This code expires in 5 minutes.</p>
      </div>
    `;

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully via Brevo API");
    return result;
  } catch (error) {
    console.error("Brevo API Error:", error.response?.body || error.message);
    throw new Error("Failed to send OTP email");
  }
};

export const saveOTP = async (email, otp) => {
  const hashedOTP = await bcrypt.hash(otp, 10);

  await OTP.findOneAndDelete({ email });

  await OTP.create({
    email,
    otp: hashedOTP,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
};
