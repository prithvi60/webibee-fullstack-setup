import { generateOtpEmailTemplate } from "@/utils/EmailTemplate";
import nodemailer from "nodemailer";

export async function sendOtpEmail(
  email: string,
  otp: string,
  expiryTime: string
) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailContent = generateOtpEmailTemplate(otp, expiryTime);

  await transporter.sendMail({
    from: '"Business Portfolio" <support@Business-Portfolio.com>',
    to: email,
    subject: "Your Business Portfolio OTP",
    html: emailContent,
  });
}
