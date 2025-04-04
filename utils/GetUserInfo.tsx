import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

const JWT_SECRET = process.env.AUTH_SECRET;

if (!JWT_SECRET) {
    throw new Error("AUTH_SECRET is not defined in environment variables");
}

interface CustomJwtPayload extends JwtPayload {
    id: string;
}

export const getUserFromToken = (token?: string | null): CustomJwtPayload | null => {
    try {
        if (!token) {
            console.warn("Token is missing.");
            return null;
        }

        // Extract token if it has the Bearer prefix
        const tokenWithoutBearer = token.startsWith("Bearer ") ? token.slice(7).trim() : token.trim();

        // Check if we have a non-empty token after processing
        if (!tokenWithoutBearer) {
            console.warn("Empty token after removing Bearer prefix.");
            return null;
        }

        // Verify with the secret
        const decoded = jwt.verify(tokenWithoutBearer, JWT_SECRET) as CustomJwtPayload;

        if (!decoded || !decoded.id) {
            console.warn("Invalid or incomplete token data.");
            return null;
        }

        return decoded;

    } catch (error: any) {
        if (error instanceof TokenExpiredError) {
            console.error("Token has expired:", error.message);
        } else if (error instanceof JsonWebTokenError) {
            console.error("Invalid token:", error.message);
        } else {
            console.error("Error verifying token:", error.message || error);
        }
        return null;
    }
};