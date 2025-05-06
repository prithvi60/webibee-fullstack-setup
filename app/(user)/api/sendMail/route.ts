import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import {
  generateEmailTemplateForClient,
  generateEmailTemplateForUser,
} from "@/utils/EmailTemplate";
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
  name: string;
  email: string;
  message: string;
  title: string;
  fileUrl: string;
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  bcc?: string[];
}

export async function POST(req: Request): Promise<Response> {
  const { name, email, message, title, fileUrl }: EmailRequestBody =
    await req.json();

  const capitalized: string = title.charAt(0).toUpperCase() + title.slice(1);

  const messageForClient: string = `
  <p style="font-size: 16px; color: #555;"><strong>Valuable customer insights derived from ${title}:</strong></p>
            <p style="font-size: 16px; color: #555;"><strong>Name:</strong> ${name}</p>
            <p style="font-size: 16px; color: #555;"><strong>Email:</strong> ${email}</p>
            ${
              message !== ""
                ? `
              <p style="font-size: 16px; color: #555;">
                <strong>Message:</strong> ${message}
              </p>
                `
                : ""
            }
                ${
                  fileUrl !== ""
                    ? `
              <p style="font-size: 16px; color: #555;">
                <strong>File URL:</strong> ${fileUrl}
              </p>
                `
                    : ""
                }
  `;

  const messageForUser: string = `
  <p style="font-size: 16px; color: #555;">Dear <strong>${name}</strong>,</p>
  `;

  // !clientEmail
  if (!email && !process.env.EMAIL_ID) {
    return NextResponse.json(
      { success: false, message: "Recipient email(s) missing" },
      { status: 400 }
    );
  }

  const clientMailOptions: MailOptions = {
    from: `"${email}" <${"support@webibee.com"}>`,
    to: process.env.EMAIL_ID!,
    subject: `New Customer Form Submitted - ${capitalized} Page`,
    html: generateEmailTemplateForClient(messageForClient),
    // bcc: ["reachout@penthusiasts.com"],
  };

  const userMailOptions: MailOptions = {
    from: `Business Portfolio - "${process.env.EMAIL_ID}" <support@webibee.com>`,
    to: email,
    subject: "Acknowledgment: We received your Submission",
    html: generateEmailTemplateForUser(messageForUser, title),
  };

  try {
    if (title === "contact") {
      // Send acknowledgment email to the customer
      await transporter.sendMail(userMailOptions);
    }

    // Send detailed email to the client
    await transporter.sendMail(clientMailOptions);

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (error: any) {
    console.error("Error sending emails:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error sending emails" },
      { status: 500 }
    );
  }
}
