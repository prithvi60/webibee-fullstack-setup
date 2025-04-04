
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/db";
import { Context } from "@apollo/client";

const JWT_SECRET = process.env.AUTH_SECRET;

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
        const users = await prisma.user.findMany();
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
    }
  },
  Mutation: {
    signUp: async (
      _: unknown,
      {
        name,
        email,
        phone_number,
        address,
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
      { email, password }: { email: string; password: string }
    ) => {
      try {
        // Check if user exists
        const user = await prisma.user.findUnique({ where: { email } });
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
      // Since JWT is stateless, server-side logout is just returning true
      // The client will handle removing the token from storage
      return true;
    }
  },
};
