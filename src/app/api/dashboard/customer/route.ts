import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getDb,
} from "@/lib/mongodb";

import {
  getApiSession,
} from "@/lib/api-auth";

import type {
  OrderDocument,
} from "@/lib/db/orders";

import type {
  AppointmentDocument,
} from "@/lib/db/appointments";

import type {
  ReviewDocument,
} from "@/lib/db/reviews";

export async function GET(
  request: NextRequest
) {
  try {
    const session =
      await getApiSession(
        request.headers
      );

    if (!session) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Login required.",
        },
        {
          status: 401,
        }
      );
    }

    const userId =
      session.user.id;

    const db =
      await getDb();

    const orders =
      db.collection<OrderDocument>(
        "orders"
      );

    const appointments =
      db.collection<AppointmentDocument>(
        "appointments"
      );

    const reviews =
      db.collection<ReviewDocument>(
        "reviews"
      );

    const [
      totalOrders,

      deliveredOrders,

      pendingOrders,

      totalAppointments,

      confirmedAppointments,

      totalReviews,

      spendingResult,

      recentOrders,
    ] =
      await Promise.all([
        orders.countDocuments({
          userId,
        }),

        orders.countDocuments({
          userId,

          status:
            "delivered",
        }),

        orders.countDocuments({
          userId,

          status: {
            $in: [
              "pending",
              "confirmed",
              "processing",
              "shipped",
            ],
          },
        }),

        appointments.countDocuments({
          userId,
        }),

        appointments.countDocuments({
          userId,

          status:
            "confirmed",
        }),

        reviews.countDocuments({
          userId,
        }),

        orders
          .aggregate<{
            total: number;
          }>([
            {
              $match: {
                userId,

                status:
                  "delivered",
              },
            },

            {
              $group: {
                _id: null,

                total: {
                  $sum:
                    "$total",
                },
              },
            },
          ])
          .toArray(),

        orders
          .find({
            userId,
          })
          .sort({
            createdAt: -1,
          })
          .limit(3)
          .project({
            orderNumber: 1,

            total: 1,

            status: 1,

            createdAt: 1,
          })
          .toArray(),
      ]);

    return NextResponse.json({
      success: true,

      user: {
        name:
          session.user.name,

        email:
          session.user.email,
      },

      stats: {
        totalOrders,

        deliveredOrders,

        pendingOrders,

        totalSpent:
          spendingResult[0]
            ?.total ?? 0,

        totalAppointments,

        confirmedAppointments,

        totalReviews,
      },

      recentOrders:
        recentOrders.map(
          (order) => ({
            id:
              order._id.toString(),

            orderNumber:
              order.orderNumber,

            total:
              order.total,

            status:
              order.status,

            createdAt:
              order.createdAt instanceof
              Date
                ? order.createdAt.toISOString()
                : order.createdAt,
          })
        ),
    });
  } catch (error) {
    console.error(
      "Customer Dashboard Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Dashboard load করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}