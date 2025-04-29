import NextAuth from "next-auth";
import { authConfig } from "./utils/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/dashboard", "/services/:path*", "/blog/:path*"],
};
