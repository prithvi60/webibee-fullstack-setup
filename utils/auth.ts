import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { PrismaClient } from "@prisma/client";
import prisma from "@/prisma/db";
import { authConfig } from "./auth.config";

// Make sure environment variables are defined
const JWT_SECRET = process.env.AUTH_SECRET;
if (!JWT_SECRET) {
  throw new Error("AUTH_SECRET is not defined in environment variables");
}

// Generate JWT for credentials-based authentication
const generateToken = (user: {
  id: string;
  email: string;
  role: string;
}): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// Authenticate user with email and password
const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
    },
  });

  if (
    user &&
    user.password &&
    (await bcrypt.compare(password, user.password))
  ) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || "user",
      accessToken: generateToken({
        id: user.id.toString(),
        email: user.email,
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
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("Authorization failed: Missing email or password");
            return null;
          }

          const user = await authenticateUser(
            credentials.email as string,
            credentials.password as string
          );

          if (!user) {
            console.error(
              "Authorization failed: Invalid email or password for",
              credentials.email
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: {
              id: true,
              role: true,
            },
          });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                name: user.name!,
                email: user.email!,
                image: user.image,
                // role: "user",s
              },
              select: {
                id: true,
                role: true,
              },
            });
          }

          user.id = dbUser.id.toString();
          user.role = dbUser.role || "user";
        } catch (error) {
          console.error("Error handling Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign-in
      if (user) {
        token.id = user.id;
        token.role = user.role; // Make sure role is included
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
        session.user.role = token.role as string; // Ensure role is included
        // @ts-expect-error - accessToken is added dynamically
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
});
