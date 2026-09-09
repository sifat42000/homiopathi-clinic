import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getDb,
} from "@/lib/mongodb";

import {
  isAdminRequest,
} from "@/lib/api-auth";

import type {
  OrderDocument,
} from "@/lib/db/orders";

import type {
  ProductDocument,
} from "@/lib/db/products";

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

    const orders =
      db.collection<OrderDocument>(
        "orders"
      );

    const products =
      db.collection<ProductDocument>(
        "products"
      );

    const appointments =
      db.collection<AppointmentDocument>(
        "appointments"
      );

    const reviews =
      db.collection<ReviewDocument>(
        "reviews"
      );

    /*
      Better Auth default MongoDB
      user collection.
    */
    const users =
      db.collection(
        "user"
      );

    const [
      totalUsers,

      totalProducts,

      activeProducts,

      lowStockProducts,

      totalOrders,

      pendingOrders,

      deliveredOrders,

      pendingAppointments,

      confirmedAppointments,

      pendingReviews,

      revenueResult,

      recentOrders,
    ] =
      await Promise.all([
        users.countDocuments(),

        products.countDocuments(),

        products.countDocuments({
          active: true,
        }),

        products.countDocuments({
          active: true,

          stock: {
            $lte: 5,
          },
        }),

        orders.countDocuments(),

        orders.countDocuments({
          status:
            "pending",
        }),

        orders.countDocuments({
          status:
            "delivered",
        }),

        appointments.countDocuments({
          status:
            "pending",
        }),

        appointments.countDocuments({
          status:
            "confirmed",
        }),

        reviews.countDocuments({
          status:
            "pending",
        }),

        orders
          .aggregate<{
            total: number;
          }>([
            {
              $match: {
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
          .find({})
          .sort({
            createdAt: -1,
          })
          .limit(5)
          .project({
            orderNumber: 1,

            customer: 1,

            total: 1,

            status: 1,

            createdAt: 1,
          })
          .toArray(),
      ]);

    const deliveredRevenue =
      revenueResult[0]
        ?.total ?? 0;

    return NextResponse.json({
      success: true,

      stats: {
        totalUsers,

        totalProducts,

        activeProducts,

        lowStockProducts,

        totalOrders,

        pendingOrders,

        deliveredOrders,

        deliveredRevenue,

        pendingAppointments,

        confirmedAppointments,

        pendingReviews,
      },

      recentOrders:
        recentOrders.map(
          (order) => ({
            id:
              order._id.toString(),

            orderNumber:
              order.orderNumber,

            customerName:
              order.customer?.name ??
              "Customer",

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
      "Admin Dashboard Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Dashboard data load করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}