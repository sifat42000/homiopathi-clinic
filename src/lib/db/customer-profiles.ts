import type {
  ObjectId,
} from "mongodb";

import {
  getDb,
} from "@/lib/mongodb";

import type {
  CustomerProfile,
} from "@/types/customer-profile";

export type CustomerProfileDocument = {
  _id?: ObjectId;

  userId: string;

  name: string;

  phone: string;

  division: string;

  district: string;

  area: string;

  address: string;

  createdAt: Date;

  updatedAt: Date;
};

declare global {
  var _customerProfileIndexesPromise:
    | Promise<void>
    | undefined;
}

export async function ensureCustomerProfileIndexes() {
  if (
    global._customerProfileIndexesPromise
  ) {
    return global
      ._customerProfileIndexesPromise;
  }

  global._customerProfileIndexesPromise =
    (async () => {
      const db =
        await getDb();

      await db
        .collection<CustomerProfileDocument>(
          "customerProfiles"
        )
        .createIndex(
          {
            userId: 1,
          },
          {
            unique: true,

            name:
              "unique_customer_profile_user",
          }
        );
    })();

  return global
    ._customerProfileIndexesPromise;
}

export function serializeCustomerProfile(
  profile:
    CustomerProfileDocument & {
      _id: ObjectId;
    },

  email: string
): CustomerProfile {
  return {
    userId:
      profile.userId,

    name:
      profile.name,

    email,

    phone:
      profile.phone,

    division:
      profile.division,

    district:
      profile.district,

    area:
      profile.area,

    address:
      profile.address,

    createdAt:
      profile.createdAt.toISOString(),

    updatedAt:
      profile.updatedAt.toISOString(),
  };
}