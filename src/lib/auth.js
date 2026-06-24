import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

// export const auth = betterAuth({
//     emailAndPassword: { 
//     enabled: true, 
//   }, 
//   database: mongodbAdapter(db, {
//     // Optional: if you don't provide a client, database transactions won't be enabled.
//     client
//   }),
// });

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
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