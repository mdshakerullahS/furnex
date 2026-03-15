import { jest } from "@jest/globals";

const mockSendTransacEmail = jest.fn();

jest.unstable_mockModule("@getbrevo/brevo", () => ({
  TransactionalEmailsApi: class {
    setApiKey() {}
    sendTransacEmail = mockSendTransacEmail;
  },

  SendSmtpEmail: class {},

  TransactionalEmailsApiApiKeys: {
    apiKey: "apiKey",
  },
}));

const { sendOTPMail } = await import("../../src/services/email.service.js");
const { TransactionalEmailsApi } = await import("@getbrevo/brevo");

describe("sendOTPMail", () => {
  it("sends OTP email", async () => {
    mockSendTransacEmail.mockResolvedValue({
      messageId: "mock-message-id",
    });
    const result = await sendOTPMail("test@mail.com", "123456");

    expect(result.messageId).toBe("mock-message-id");

    expect(mockSendTransacEmail).toHaveBeenCalled();
  });

  it("throws error if email fails", async () => {
    mockSendTransacEmail.mockRejectedValue(
      new Error("Failed to send OTP email"),
    );

    await expect(sendOTPMail("test.com", "123456")).rejects.toThrow(
      "Failed to send OTP email",
    );
  });
});
