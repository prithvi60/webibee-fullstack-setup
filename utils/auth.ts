import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Prisma, PrismaClient } from "@prisma/client";
import prisma from "@/prisma/db";
import { authConfig } from "./auth.config";

// Make sure environment variables are defined
const JWT_SECRET = process.env.AUTH_SECRET;
if (!JWT_SECRET) {
  throw new Error("AUTH_SECRET is not defined in environment variables");
}

// Generate JWT for credentials-based authentication
export const generateToken = (user: {
  id: string;
  email: string;
  role?: string;
  phone_number?: string;
}) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role || "user",
      phone_number: user.phone_number || null,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Authenticate user with email and password or Email and OTP
const authenticateUser = async (
  identifier: string,
  credential: string,
  method: "password" | "otp"
) => {
  const isEmail = identifier.includes("@");

  // Find user by email or phone
  const user = await prisma.user.findFirst({
    where: isEmail ? { email: identifier } : { phone_number: identifier },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      phone_number: true,
      emailVerified: true,
    },
  });

  if (!user) return null;

  if (method === "password") {
    // Password authentication
    if (user.password && (await bcrypt.compare(credential, user.password))) {
      return {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role || "user",
        authMethod: "password" as const,
        accessToken: generateToken({
          id: user.id.toString(),
          email: user.email,
          phone_number: user.phone_number,
          role: user.role || "user",
        }),
      };
    }
  } else if (method === "otp") {
    // OTP authentication
    const otpRecord = await prisma.otp.findFirst({
      where: { email: user.email },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord || otpRecord.otp !== credential) return null;
    if (otpRecord.verified) return null;
    if (new Date() > otpRecord.expiresAt) return null;

    // Mark OTP as verified
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Update email verification status if not already verified
    if (!user.emailVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    }

    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role || "user",
      authMethod: "otp" as const,
      accessToken: generateToken({
        id: user.id.toString(),
        email: user.email,
        phone_number: user.phone_number,
        role: user.role || "user",
      }),
    };
  }

  return null;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma as PrismaClient),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        credential: { label: "Password or OTP", type: "password" },
        method: { label: "Method", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (
            !credentials?.identifier ||
            !credentials?.credential ||
            !credentials?.method
          ) {
            console.error("Authorization failed: Missing required fields");
            return null;
          }

          const user = await authenticateUser(
            credentials.identifier as string,
            credentials.credential as string,
            credentials.method as "password" | "otp"
          );

          if (!user) {
            console.error(
              `Authorization failed: Invalid ${credentials.method === "password" ? "password" : "OTP"} for`,
              credentials.identifier
            );
            return null;
          }

          return user;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    // async signIn({ user, account, profile }) {
    //   // Handle Google OAuth
    //   // if (account?.provider === "google") {
    //   //   try {
    //   //     // Check if user exists
    //   //     let dbUser = await prisma.user.findUnique({
    //   //       where: { email: user.email! },
    //   //     });

    //   //     // If user doesn't exist, create them
    //   //     if (!dbUser) {
    //   //       dbUser = await prisma.user.create({
    //   //         data: {
    //   //           name: user.name!,
    //   //           email: user.email!,
    //   //           image: user.image,
    //   //           emailVerified: new Date(),
    //   //         },
    //   //       });
    //   //     }

    //   //     // Update the user object with database values
    //   //     user.id = dbUser.id.toString();
    //   //     user.role = dbUser.role || "user";
    //   //     user.phone_number = dbUser.phone_number || "";
    //   //   } catch (error) {
    //   //     console.error("Error handling Google sign in:", error);
    //   //     return false;
    //   //   }
    //   // }

    //   return true;
    // },
    async jwt({ token, user, account }) {
      // Initial sign-in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone_number = user.phone_number;
        if ("accessToken" in user) {
          token.accessToken = user.accessToken;
        }
      }

      // For Google provider
      if (account?.provider === "google" && account.access_token) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phone_number = token.phone_number as string | undefined;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
});
