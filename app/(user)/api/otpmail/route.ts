import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { generateOtpEmailTemplate } from "@/utils/EmailTemplate";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface EmailRequestBody {
  email: string;
  otp: string;
  expiryTime: string;
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export async function POST(req: Request): Promise<Response> {
  const { email, otp, expiryTime }: EmailRequestBody = await req.json();

  // !clientEmail
  if (!email && !process.env.EMAIL_ID) {
    return NextResponse.json(
      { success: false, message: "Recipient email(s) missing" },
      { status: 400 }
    );
  }

  const userMailOptions: MailOptions = {
    from: `Business Portfolio <support@webibee.com>`,
    to: email,
    subject: "Your Business Portfolio OTP",
    html: generateOtpEmailTemplate(otp, expiryTime),
  };

  try {
    // Send OTP email to the customer
    await transporter.sendMail(userMailOptions);

    return NextResponse.json({
      success: true,
      message: "OTP Email sent successfully",
    });
  } catch (error: any) {
    console.error("Error sending emails:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error sending emails" },
      { status: 500 }
    );
  }
}
