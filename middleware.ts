
import NextAuth from "next-auth"
import { authConfig } from "./utils/auth.config"
 
// 1. Use middleware directly
export const { auth: middleware } = NextAuth(authConfig)
 
