import type { NextAuthConfig, User } from "next-auth";

// Extend the User type to include the role property
// Extend the User type to include the role property
declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    phone_number?: string;
    accessToken?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      phone_number?: string;
      accessToken?: string;
    };
  }
}
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// Make sure environment variables are defined
const JWT_SECRET = process.env.AUTH_SECRET;
if (!JWT_SECRET) {
  throw new Error("AUTH_SECRET is not defined in environment variables");
}

export const authConfig = {
  providers: [
    // Google,
    Credentials({
      credentials: {
        identifier: { label: "Email or Phone Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Logic moved to auth.ts to avoid Edge runtime issues
        return null;
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  secret: JWT_SECRET,
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/services") ||
        nextUrl.pathname.startsWith("/blog");

      if (isProtectedRoute && !isLoggedIn) {
        return Response.redirect(new URL("/sign-in", nextUrl));
      }
      if (!isProtectedRoute && isLoggedIn && nextUrl.pathname === "/sign-in") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign-in - add user info to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone_number = user.phone_number;
        token.name = user.name;
        token.email = user.email;
        if ("accessToken" in user) {
          token.accessToken = user.accessToken;
        }
      }

      // For Google provider, add access token if available
      // if (account?.provider === "google" && account.access_token) {
      //   token.accessToken = account.access_token;
      // }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.phone_number = token.phone_number as string | undefined;
        // @ts-expect-error - accessToken is added dynamically
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  trustHost: true,
  // debug: process.env.NODE_ENV !== "production",
} satisfies NextAuthConfig;
