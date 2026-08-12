import { describe, expect, it, Mock, vi } from "vitest";
import sendEmail, { EmailOptions } from "./email.js";
import nodemailer from "nodemailer";
import { config } from "../config/index.js";

vi.mock("../config/index.js", () => {
  return {
    config: {
      emailHost: "fake-host",
      emailPort: "fake-port",
      emailUsername: "fake-user",
      emailPassword: "fake-pass",
    },
  };
});

describe("sendEmail", () => {
  it("should sendEmail", async () => {
    const mockEmailOptions: EmailOptions = {
      email: "fake-email@email.com",
      subject: "fake-subject",
      message: "fake-message",
    };

    const sendMailMock = vi.fn();

    const createTransportSpy = vi
      .spyOn(nodemailer, "createTransport")
      .mockReturnValue({
        sendMail: sendMailMock,
      } as any);

    const mailOptions = {
      from: "DevCamp <noreply@devcamp.io>",
      to: mockEmailOptions.email,
      subject: mockEmailOptions.subject,
      text: mockEmailOptions.message,
    };

    // act

    await sendEmail(mockEmailOptions);

    // assert 1:
    expect(createTransportSpy).toHaveBeenCalledTimes(1);
    expect(createTransportSpy).toHaveBeenCalledWith({
      host: config.emailHost,
      port: config.emailPort,
      auth: {
        user: config.emailUsername,
        pass: config.emailPassword,
      },
    });
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(mailOptions);
  });
});
