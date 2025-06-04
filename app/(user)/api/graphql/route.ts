import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/db";
import { typeDefs } from "@/utils/TypeDefs";
import { resolvers } from "@/utils/Resolvers";
import { getUserFromToken } from "@/utils/GetUserInfo";

interface Context {
  userId: string | null;
  prisma: typeof prisma;
}

// Initialize Apollo Server
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

// Context for Apollo Server
const createContext = async (req: NextRequest): Promise<Context> => {
  try {
    const authHeader = req.headers.get("authorization") || "";
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
const baseHandler = startServerAndCreateNextHandler<NextRequest, Context>(
  server,
  {
    context: createContext,
  }
);

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
