import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import jwt, { Jwt } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import type { User, Session } from "next-auth";
import prisma from "@/prisma/db";

// Type for user with extra properties
interface CustomUser extends User {
  accessToken?: string;
}

// Type for token with extended properties
interface CustomToken extends Jwt {
  id?: string;
  accessToken?: string;
}

// Extended session type
interface CustomSession extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
  };
  accessToken?: string;
}

// Make sure JWT_SECRET is defined
const JWT_SECRET = process.env.AUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error("AUTH_SECRET is not defined in environment variables");
}
if (!process.env.NEXTAUTH_DATABASE_URL)
  throw new Error("NEXTAUTH_DATABASE_URL is not defined");
// Generate JWT for credentials-based authentication
const generateToken = (user: { id: number; email: string }): string => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Authenticate user with email and password
const authenticateUser = async (
  email: string,
  password: string
): Promise<CustomUser | null> => {
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
const authConfig: NextAuthConfig = {
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
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  secret: JWT_SECRET,
  pages: {
    signIn: "/sign-in", // Custom login page
  },
  // adapter: PrismaAdapter(prisma),
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
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async jwt({ token, user, account }): Promise<CustomToken> {
      // Initial sign in
      if (user) {
        token.id = user.id;
        if ("accessToken" in user) {
          token.accessToken = (user as CustomUser).accessToken;
        }
      }

      // If using Google provider, handle token differently
      if (account && account.provider === "google" && account.access_token) {
        token.accessToken = account.access_token;
      }

      return token as unknown as CustomToken;
    },
    async session({ session, token }) {
      const customSession = session as CustomSession;

      if (token) {
        customSession.user = {
          id: token.id as string,
          name: token.name,
          email: token.email,
          image: token.picture,
          accessToken: token.accessToken as string | undefined,
        };
      }

      return customSession;
    },
  },
  // debug: true,
};

// Export handlers for use in route handlers
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Export a default handler for the API route
export { handlers as GET, handlers as POST };
