import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

// The URL of THIS Next.js app (not the Express backend)
const appUrl = process.env.BETTER_AUTH_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const auth = betterAuth({
  baseURL: appUrl,
  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirectURI: `${appUrl}/api/auth/callback/google`,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      requireLocalEmailVerified: false, 
    },
  },
  database: mongodbAdapter(db, {
    client: client,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: true, // allow the client to set this field on signup
      },
      isBlocked: {
        defaultValue: false,
      },
      // Lawyer-specific fields
      caseWon: {
        type: "number",
        required: false,
        input: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
      experience: {
        type: "number",
        required: false,
        input: true,
      },
      languages: {
        type: "json",
        required: false,
        input: true,
      },
      location: {
        type: "string",
        required: false,
        input: true,
      },
      specialization: {
        type: "string",
        required: false,
        input: true,
      },
      successRate: {
        type: "number",
        required: false,
        input: true,
      },
      reviewCount: {
        type: "number",
        required: false,
        input: true,
        defaultValue: 0,
      },
      rating: {
        type: "number",
        required: false,
        input: true,
        defaultValue: 0,
      },
      availability: {
        type: "string",
        required: false,
        input: true,
        defaultValue: "Available",
      },
      badge: {
        type: "string",
        required: false,
        input: true,
      },
      tags: {
        type: "json",
        required: false,
        input: true,
      },
      title: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
});