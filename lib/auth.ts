// lib/auth.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Exportuj handlers + authOptions
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Exportuj config pre server actions
export { authConfig as authOptions };