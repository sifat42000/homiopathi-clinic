import {
  NextRequest,
  NextResponse,
} from "next/server";

import type {
  ObjectId,
} from "mongodb";

import {
  getDb,
} from "@/lib/mongodb";

import {
  isAdminRequest,
  userHasAdminRole,
} from "@/lib/api-auth";

type AuthUserDocument = {
  _id?: ObjectId;

  id?: string;

  name?: string;

  email?: string;

  phone?: string;

  role?: string;

  createdAt?:
    | Date
    | string;
};

function getUserId(
  user: AuthUserDocument
) {
  if (
    typeof user.id ===
      "string" &&
    user.id
  ) {
    return user.id;
  }

  if (user._id) {
    return user._id.toString();
  }

  return "";
}

function toIso(
  value:
    | Date
    | string
    | undefined
) {
  if (!value) {
    return undefined;
  }

  if (
    value instanceof Date
  ) {
    return value.toISOString();
  }

  const date =
    new Date(value);

  return Number.isNaN(
    date.getTime()
  )
    ? undefined
    : date.toISOString();
}

export async function GET(
  request: NextRequest
) {
  try {
    const admin =
      await isAdminRequest(
        request.headers
      );

    if (!admin) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Admin access required.",
        },
        {
          status: 403,
        }
      );
    }

    const db =
      await getDb();

    const allUsers =
      await db
        .collection<AuthUserDocument>(
          "user"
        )
        .find({})
        .sort({
          createdAt: -1,
        })
        .toArray();

    const customerUsers =
      allUsers.filter(
        (user) =>
          !userHasAdminRole(
            user.role
          )
      );

    const userIds =
      customerUsers
        .map(getUserId)
        .filter(Boolean);

    if (
      userIds.length === 0
    ) {
      return NextResponse.json({
        success: true,

        customers: [],
      });
    }

    const [
      profiles,
      orderStats,
      appointmentStats,
      reviewStats,
    ] =
      await Promise.all([
        db
          .collection(
            "customerProfiles"
          )
          .find({
            userId: {
              $in:
                userIds,
            },
          })
          .toArray(),

        db
          .collection(
            "orders"
          )
          .aggregate([
            {
              $match: {
                userId: {
                  $in:
                    userIds,
                },
              },
            },

            {
              $group: {
                _id:
                  "$userId",

                totalOrders: {
                  $sum: 1,
                },

                deliveredOrders: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          "$status",
                          "delivered",
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },

                totalPurchase: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          "$status",
                          "delivered",
                        ],
                      },
                      "$total",
                      0,
                    ],
                  },
                },

                lastOrderAt: {
                  $max:
                    "$createdAt",
                },
              },
            },
          ])
          .toArray(),

        db
          .collection(
            "appointments"
          )
          .aggregate([
            {
              $match: {
                userId: {
                  $in:
                    userIds,
                },
              },
            },

            {
              $group: {
                _id:
                  "$userId",

                totalAppointments: {
                  $sum: 1,
                },
              },
            },
          ])
          .toArray(),

        db
          .collection(
            "reviews"
          )
          .aggregate([
            {
              $match: {
                userId: {
                  $in:
                    userIds,
                },
              },
            },

            {
              $group: {
                _id:
                  "$userId",

                totalReviews: {
                  $sum: 1,
                },
              },
            },
          ])
          .toArray(),
      ]);

    const profileMap =
      new Map(
        profiles.map(
          (profile) => [
            profile.userId,
            profile,
          ]
        )
      );

    const orderMap =
      new Map(
        orderStats.map(
          (stat) => [
            stat._id,
            stat,
          ]
        )
      );

    const appointmentMap =
      new Map(
        appointmentStats.map(
          (stat) => [
            stat._id,
            stat,
          ]
        )
      );

    const reviewMap =
      new Map(
        reviewStats.map(
          (stat) => [
            stat._id,
            stat,
          ]
        )
      );

    const customers =
      customerUsers
        .map((user) => {
          const userId =
            getUserId(
              user
            );

          const profile =
            profileMap.get(
              userId
            );

          const order =
            orderMap.get(
              userId
            );

          const appointment =
            appointmentMap.get(
              userId
            );

          const review =
            reviewMap.get(
              userId
            );

          return {
            userId,

            name:
              profile?.name ??
              user.name ??
              "Customer",

            email:
              user.email ??
              "",

            phone:
              profile?.phone ??
              user.phone ??
              "",

            createdAt:
              toIso(
                user.createdAt
              ),

            totalOrders:
              Number(
                order?.totalOrders ??
                  0
              ),

            deliveredOrders:
              Number(
                order?.deliveredOrders ??
                  0
              ),

            totalPurchase:
              Number(
                order?.totalPurchase ??
                  0
              ),

            totalAppointments:
              Number(
                appointment
                  ?.totalAppointments ??
                  0
              ),

            totalReviews:
              Number(
                review?.totalReviews ??
                  0
              ),

            lastOrderAt:
              toIso(
                order?.lastOrderAt
              ),
          };
        })
        .filter(
          (customer) =>
            customer.userId
        );

    return NextResponse.json({
      success: true,

      customers,
    });
  } catch (error) {
    console.error(
      "Admin Customers Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Customers load করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}