import {
  betterAuth,
} from "better-auth";

import {
  mongodbAdapter,
} from "better-auth/adapters/mongodb";

import {
  admin,
} from "better-auth/plugins";

import {
  getDb,
  mongoClient,
} from "@/lib/mongodb";

const trustedOrigins = [
  "https://www.aupshorahomeocenter.com",
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined,
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? []),
].filter(
  (
    origin
  ): origin is string =>
    Boolean(origin?.trim())
);

export const auth =
  betterAuth({
    baseURL:
      process.env.BETTER_AUTH_URL,

    trustedOrigins,

    database:
      mongodbAdapter(
        getDb(),
        {
          client:
            mongoClient,
        }
      ),

    emailAndPassword: {
      enabled: true,

      minPasswordLength: 8,

      maxPasswordLength: 128,

      autoSignIn: true,
    },

    user: {
      additionalFields: {
        phone: {
          type: "string",

          required: true,

          input: true,

          returned: true,
        },
      },
    },

    session: {
      expiresIn:
        60 * 60 * 24 * 7,

      updateAge:
        60 * 60 * 24,
    },

    advanced: {
      database: {
        joins: true,
      },
    },

    plugins: [
      admin(),
    ],
  });