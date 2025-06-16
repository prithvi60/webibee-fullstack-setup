import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Context } from "@apollo/client";
import prisma from "@/prisma/db";
import otpGenerator from "otp-generator";
import { formatExpiryTime } from "@/components/features/formatExpiryTime";
import { sendOtpEmail } from "@/components/features/sendOtpEmail";

const JWT_SECRET = process.env.AUTH_SECRET;
const OTP_EXPIRY_MINUTES = 10;
const SUBSCRIPTION_EXPIRY_DAYS = 30;
if (!JWT_SECRET) {
  throw new Error("AUTH_SECRET is not defined in environment variables");
}

interface User {
  id: string;
  email: string;
}

interface UserSignUp {
  id?: string;
  email: string;
  name: string;
  phone_number: string;
  address?: string;
  role?: string;
  password: string;
  confirmPassword: string;
}

// Generate JWT token
const generateToken = (user: User) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Compare password helper
const comparePassword = async (
  enteredPassword: string,
  storedPassword: string
) => {
  const isMatch = await bcrypt.compare(enteredPassword, storedPassword);
  if (!isMatch) {
    throw new Error("Invalid password");
  }
};

export const resolvers = {
  Query: {
    user: async (_: unknown, __: unknown, { userId }: Context) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            UploadedFile: true,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        return user;
      } catch (error) {
        console.error("Error while fetching user:", error);
        throw new Error("Failed to fetch user");
      }
    },
    users: async () => {
      try {
        const users = await prisma.user.findMany({
          include: {
            UploadedFile: true,
          },
        });
        return users;
      } catch (error) {
        console.error("Error while fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },
    getUser: async (_: unknown, { email }: { email: string }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        return user;
      } catch (error) {
        console.error("Error while fetching user by email:", error);
        throw new Error("Failed to fetch user");
      }
    },
    getUploadedFiles: async (
      _: any,
      __: any,
      { userId }: { userId: string }
    ) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      try {
        const user = await prisma.uploadedFile.findMany({
          where: {
            userId: userId,
          },
        });

        return user;
      } catch (error) {
        console.error("Error while fetching user:", error);
        throw new Error("Failed to fetch user");
      }
    },
    getSubscribedUserByEmail: async (_: unknown, { email }: { email: string }) => {
      try {
        const subscribedUser = await prisma.subscription.findFirst({
          where: { email },
        });

        if (!subscribedUser) {
          console.error("Subscribed user not found for email:");
          // throw new Error("subscribed User not found");
        }
        return subscribedUser;
      } catch (error) {
        console.error("Error while fetching subscribed user by email:", error);
        throw new Error("Failed to fetch subscribed user");
      }
    },
  },
  Mutation: {
    signUp: async (
      _: unknown,
      {
        name,
        email,
        phone_number,
        address,
        role,
        password,
        confirmPassword,
      }: UserSignUp
    ) => {
      try {
        // Validate password match
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match, please check the password");
        }

        // Check if the email already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          throw new Error("Email already in use. Please try another");
        }

        // Hash the password
        const hashedPwd = await bcrypt.hash(password, 10);

        // Create new user
        const userData = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPwd,
            phone_number,
            address,
            role,
          },
        });

        return userData;
      } catch (error: any) {
        // Log the actual error for debugging
        console.error("Error while creating user:", error.message);

        // Throw a more user-friendly message
        if (error.message.includes("Passwords do not match")) {
          throw new Error(error.message);
        } else if (error.message.includes("Email already in use")) {
          throw new Error(error.message);
        } else {
          throw new Error("Couldn't create user. Please try again later");
        }
      }
    },
    login: async (
      _: unknown,
      { identifier, password }: { identifier: string; password: string }
    ) => {
      try {
        // Check if user exists
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier }, { phone_number: identifier }],
          },
        });
        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Compare the password
        if (!user.password) {
          throw new Error("Password is missing for the user");
        }

        await comparePassword(password, user.password);

        // Generate token and return user data with token
        const token = generateToken(user);
        return { ...user, token };
      } catch (error: any) {
        console.error("Error logging in user:", error.message);
        throw new Error("Invalid email or password");
      }
    },
    logout: async () => {
      return true;
    },
    uploadFile: async (
      _: any,
      {
        fileUrl,
        filename,
        userId,
      }: { fileUrl: string; filename: string; userId: string }
    ) => {
      // Find the latest version of the file with the same filename for the user
      const existingFile = await prisma.uploadedFile.findMany();

      // Determine the new version number
      const newVersion = existingFile.length;

      const createdFile = await prisma.uploadedFile.create({
        data: {
          filename,
          fileUrl,
          version: newVersion,
          createdAt: new Date(),
          userId,
        },
      });

      return createdFile;
    },
    // generateOtp: async (_: any, { email }: { email: string }) => {
    //   try {
    //     // Validate email format
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!emailRegex.test(email)) {
    //       throw new Error("Invalid email format");
    //     }

    //     // Check if user exists in the database
    //     const user = await prisma.user.findUnique({
    //       where: { email },
    //     });
    //     if (!user) {
    //       throw new Error("Email not registered");
    //     }
    //     // Invalidate any existing unverified OTPs
    //     await prisma.otp.updateMany({
    //       where: { email, verified: false },
    //       data: { expiresAt: new Date() },
    //     });

    //     // Generate 6-digit numeric OTP
    //     const otpCode = otpGenerator.generate(6, {
    //       digits: true,
    //       lowerCaseAlphabets: false,
    //       upperCaseAlphabets: false,
    //       specialChars: false,
    //     });

    //     const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    //     await prisma.otp.create({
    //       data: {
    //         email,
    //         otp: otpCode,
    //         expiresAt,
    //       },
    //     });
    //     const expiryTime = formatExpiryTime(expiresAt.toISOString());
    //     await sendOtpEmail(email, otpCode, expiryTime);
    //     return {
    //       success: true,
    //       message: "OTP generated successfully && OTP sent to your email",
    //       otp: otpCode,
    //       expiresAt: expiresAt.toISOString(),
    //     };
    //   } catch (error) {
    //     console.error("OTP generation error:", error);
    //     return {
    //       success: false,
    //       message: "Failed to generate OTP, Invalid Email Id",
    //       otp: null,
    //       expiresAt: null,
    //     };
    //   }
    // },
    generateOtp: async (_: any, { email }: { email: string }) => {
      try {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return {
            success: false,
            message: "Invalid email format",
            otp: null,
            expiresAt: null,
          };
        }

        // Normalize email (e.g., convert to lowercase)
        const normalizedEmail = email.toLowerCase().trim();

        // Check if user exists in the database
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });
        if (!user) {
          return {
            success: false,
            message: "Email not registered",
            otp: null,
            expiresAt: null,
          };
        }

        // Invalidate any existing unverified OTPs
        await prisma.otp.updateMany({
          where: { email: normalizedEmail, verified: false },
          data: { expiresAt: new Date() },
        });

        // Generate 6-digit numeric OTP
        const otpCode = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });

        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

        // Create OTP in the database
        await prisma.otp.create({
          data: {
            email: normalizedEmail,
            otp: otpCode,
            expiresAt,
          },
        });

        // Send OTP email
        const expiryTime = formatExpiryTime(expiresAt.toISOString());
        // await sendOtpEmail(normalizedEmail, otpCode, expiryTime);

        return {
          success: true,
          message: "OTP generated successfully && OTP sent to your email",
          otp: otpCode,
          expiresAt: expiresAt.toISOString(),
        };
      } catch (error) {
        if (error && typeof error === "object" && "message" in error) {
          console.error("OTP generation error:", {
            error: (error as { message: string }).message,
            stack: (error as { stack?: string }).stack,
            email,
          });
          if ((error as { message: string }).message.includes("Invalid email format")) {
            return {
              success: false,
              message: "Invalid email format",
              otp: null,
              expiresAt: null,
            };
          }
          if ((error as { message: string }).message.includes("Email not registered")) {
            return {
              success: false,
              message: "Email not registered",
              otp: null,
              expiresAt: null,
            };
          }
          return {
            success: false,
            message: `Failed to generate OTP: ${(error as { message: string }).message}`,
            otp: null,
            expiresAt: null,
          };
        } else {
          console.error("OTP generation error:", error);
          return {
            success: false,
            message: "Failed to generate OTP due to an unknown error",
            otp: null,
            expiresAt: null,
          };
        }
      }
    },
    verifyOtp: async (
      _: any,
      { email, otp }: { email: string; otp: string }
    ) => {
      try {
        const otpRecord = await prisma.otp.findFirst({
          where: { email },
          orderBy: { createdAt: "desc" },
        });

        if (!otpRecord) {
          return { success: false, message: "No OTP found for this email" };
        }

        if (otpRecord.verified) {
          return { success: false, message: "OTP already used" };
        }

        if (new Date() > otpRecord.expiresAt) {
          return { success: false, message: "OTP expired" };
        }

        if (otpRecord.otp !== otp) {
          return { success: false, message: "Invalid OTP" };
        }

        // Mark as verified
        await prisma.otp.update({
          where: { id: otpRecord.id },
          data: { verified: true },
        });

        // Check if user exists (login flow)
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          // Update verification status
          await prisma.user.update({
            where: { email },
            data: { emailVerified: new Date() },
          });

          // Generate auth token
          const token = generateToken(user);
          return {
            success: true,
            message: "OTP verified successfully",
            token,
            user,
          };
        }
      } catch (error) {
        console.error("OTP verification error:", error);
        return {
          success: false,
          message: "Failed to verify OTP",
        };
      }
    },
    subscribePlan: async (_: any, { email }: { email: string }) => {
      try {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error("Invalid email format");
        }

        // Check if user exists in the database
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          throw new Error("Email not registered");
        }

        const expiresAt = new Date(
          Date.now() + SUBSCRIPTION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
        );

        await prisma.subscription.create({
          data: {
            email,
            verified: true,
            expiresAt,
          },
        });
        const expiryTime = formatExpiryTime(expiresAt.toISOString());
        return {
          success: true,
          message: "Subscribed successfully",
          expiresAt: expiryTime,
        };
      } catch (error) {
        console.error("Subscription Failed error:", error);
        return {
          success: false,
          message: "Failed to Subscribe",
          otp: null,
          expiresAt: null,
        };
      }
    },
  },
};
