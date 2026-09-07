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

export const auth =
  betterAuth({
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