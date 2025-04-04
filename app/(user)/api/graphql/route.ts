import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/db";
import { typeDefs } from "@/lib/TypeDefs";
import { resolvers } from "@/lib/Resolvers";
import { getUserFromToken } from "@/lib/GetUserInfo";

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Context for Apollo Server
const createContext = async (req: NextRequest) => {
  try {
    // Get authorization header and properly handle it
    const authHeader = req.headers.get("authorization") || "";

    // Only attempt to get user if we have a token
    let userId = null;
    if (authHeader) {
      const user = getUserFromToken(authHeader);
      userId = user?.id || null;
    }

    return {
      userId,
      prisma,
    };
  } catch (error) {
    console.error("Error creating context:", error);
    return { userId: null, prisma };
  }
};

// Create base handler with explicit typing
const baseHandler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: createContext,
});

// CORS middleware with corrected typing
async function corsMiddleware(
  req: NextRequest,
  handlerFn: typeof baseHandler
): Promise<NextResponse> {
  const origin = req.headers.get("origin") || "";
  // Add more allowed origins as needed
  const allowedOrigins = ["", "http://localhost:3000"];

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    const headers = new Headers({
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400", // 24 hours
    });

    if (allowedOrigins.includes(origin)) {
      headers.set("Access-Control-Allow-Origin", origin);
      headers.set("Access-Control-Allow-Credentials", "true");
    }

    return new NextResponse(null, { status: 204, headers });
  }

  // Handle actual request
  try {
    const response = await handlerFn(req);
    const newHeaders = new Headers(response.headers);

    if (allowedOrigins.includes(origin)) {
      newHeaders.set("Access-Control-Allow-Origin", origin);
    }
    newHeaders.set("Access-Control-Allow-Credentials", "true");
    newHeaders.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    newHeaders.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  } catch (error) {
    console.error("Apollo request error:", error);

    // Create proper response headers
    const errorHeaders = new Headers({
      "Content-Type": "application/json",
    });

    if (allowedOrigins.includes(origin)) {
      errorHeaders.set("Access-Control-Allow-Origin", origin);
      errorHeaders.set("Access-Control-Allow-Credentials", "true");
    }

    return new NextResponse(
      JSON.stringify({
        errors: [
          {
            message: "Internal server error",
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        ],
      }),
      { status: 500, headers: errorHeaders }
    );
  }
}

// Route handlers with corrected implementation
export async function POST(req: NextRequest): Promise<NextResponse> {
  return corsMiddleware(req, baseHandler);
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return corsMiddleware(req, baseHandler);
}

export async function OPTIONS(req: NextRequest): Promise<NextResponse> {
  return corsMiddleware(req, baseHandler);
}
