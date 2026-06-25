import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Points to THIS Next.js app (the frontend) where /api/auth/* routes live
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
