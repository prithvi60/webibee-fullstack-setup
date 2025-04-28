import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import prisma from "@/prisma/db";
import type { PrismaClient } from "@prisma/client";

// Make sure environment variables are defined
const JWT_SECRET = process.env.AUTH_SECRET;
if (!JWT_SECRET) {
  throw new Error("AUTH_SECRET is not defined in environment variables");
}

// Generate JWT for credentials-based authentication
const generateToken = (user: { id: number; email: string }): string => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Authenticate user with email and password
const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (
    user &&
    user.password &&
    (await bcrypt.compare(password, user.password))
  ) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      accessToken: generateToken({
        id: Number(user.id),
        email: user.email,
      }),
    };
  }
  return null;
};

// Auth.js v5 configuration
export const authConfig = {
  // adapter: PrismaAdapter(prisma as PrismaClient),
  providers: [
    Google,
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
            // @ts-expect-error - credentials.email and credentials.password are defined
            credentials.email,
            credentials.password
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
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  secret: JWT_SECRET,
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                name: user.name!,
                email: user.email!,
                image: user.image,
              },
            });
          }

          user.id = dbUser.id.toString();
        } catch (error) {
          console.error("Error handling Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        if ("accessToken" in user) {
          token.accessToken = user.accessToken;
        }
      }

      // For Google OAuth
      if (account?.provider === "google" && account.access_token) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        // @ts-expect-error - We're adding accessToken to the session user
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production",
} satisfies NextAuthConfig;

// Create Auth.js handler
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
