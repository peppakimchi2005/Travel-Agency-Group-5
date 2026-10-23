import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index.js";
import * as schema from "./db/schema.js";

export const auth = betterAuth({
  // Connects Better Auth to your Neon database through Drizzle.
  // "pg" is correct because Neon is PostgreSQL underneath.
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  // Lets users sign up and log in with an email and password.
  emailAndPassword: {
    enabled: true,
  },

  // Frontend URLs that are allowed to talk to the auth server.
  trustedOrigins: [process.env.CLIENT_URL],
});