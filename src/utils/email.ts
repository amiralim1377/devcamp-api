import nodemailer from "nodemailer";
import { config } from "../config/index.js";

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    auth: {
      user: config.emailUsername,
      pass: config.emailPassword,
    },
  });

  const mailOptions = {
    from: "DevCamp <noreply@devcamp.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
