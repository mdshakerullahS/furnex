import bcrypt from "bcryptjs";
import OTP from "../models/OTP.model.js";
import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
  SendSmtpEmail,
} from "@getbrevo/brevo";

export const genOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

export const sendOTPMail = async (email, otp) => {
  try {
    const apiInstance = new TransactionalEmailsApi();

    apiInstance.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY,
    );

    const sendSmtpEmail = new SendSmtpEmail();

    sendSmtpEmail.subject = "Your OTP Verification Code";
    sendSmtpEmail.sender = {
      name: "Furnex Support",
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
    return result;
  } catch {
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
