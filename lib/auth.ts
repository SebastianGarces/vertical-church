import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/auth-schema";
import { sendEmail } from "./email";
import PasswordResetEmail from "@/emails/password-reset";

const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  // Only set baseURL in production to avoid cookie domain issues in local dev
  ...(isProduction && process.env.BETTER_AUTH_URL
    ? { baseURL: process.env.BETTER_AUTH_URL }
    : {}),
  emailAndPassword: {
    enabled: true,
    // Disable public signup - admin users created via seed script only
    disableSignUp: isProduction,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password - Vertical Church Admin",
        react: PasswordResetEmail({ resetUrl: url, userName: user.name }),
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  advanced: {
    // Only enable cross-subdomain cookies in production with a proper domain
    ...(process.env.BETTER_AUTH_COOKIE_DOMAIN
      ? {
          crossSubDomainCookies: {
            enabled: true,
            domain: process.env.BETTER_AUTH_COOKIE_DOMAIN,
          },
        }
      : {}),
  },
  trustedOrigins: [
    "https://vertical.family",
    "https://admin.vertical.family",
    "http://localhost:3000",
    "http://admin.localhost:3000",
    // Add additional origins from env (comma-separated)
    ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",").map((o) => o.trim()) || []),
  ],
});

export type Session = typeof auth.$Infer.Session;
