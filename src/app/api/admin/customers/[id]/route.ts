import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  ObjectId,
} from "mongodb";

import {
  getDb,
} from "@/lib/mongodb";

import {
  isAdminRequest,
  userHasAdminRole,
} from "@/lib/api-auth";

import {
  serializeOrder,
  type OrderDocument,
} from "@/lib/db/orders";

import {
  serializeAppointment,
  type AppointmentDocument,
} from "@/lib/db/appointments";

import {
  serializeReview,
  type ReviewDocument,
} from "@/lib/db/reviews";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

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
  request: NextRequest,
  {
    params,
  }: RouteProps
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

    const { id } =
      await params;

    const db =
      await getDb();

    const userFilter:
      Record<
        string,
        unknown
      >[] = [
      {
        id,
      },
    ];

    if (
      ObjectId.isValid(id)
    ) {
      userFilter.push({
        _id:
          new ObjectId(id),
      });
    }

    const user =
      await db
        .collection<AuthUserDocument>(
          "user"
        )
        .findOne({
          $or:
            userFilter,
        });

    if (
      !user ||
      userHasAdminRole(
        user.role
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Customer পাওয়া যায়নি।",
        },
        {
          status: 404,
        }
      );
    }

    const userId =
      user.id ??
      user._id?.toString() ??
      id;

    const [
      profile,
      orders,
      appointments,
      reviews,
    ] =
      await Promise.all([
        db
          .collection(
            "customerProfiles"
          )
          .findOne({
            userId,
          }),

        db
          .collection<OrderDocument>(
            "orders"
          )
          .find({
            userId,
          })
          .sort({
            createdAt: -1,
          })
          .toArray(),

        db
          .collection<AppointmentDocument>(
            "appointments"
          )
          .find({
            userId,
          })
          .sort({
            createdAt: -1,
          })
          .toArray(),

        db
          .collection<ReviewDocument>(
            "reviews"
          )
          .find({
            userId,
          })
          .sort({
            createdAt: -1,
          })
          .toArray(),
      ]);

    const deliveredOrders =
      orders.filter(
        (order) =>
          order.status ===
          "delivered"
      );

    const totalPurchase =
      deliveredOrders.reduce(
        (
          total,
          order
        ) =>
          total +
          order.total,
        0
      );

    return NextResponse.json({
      success: true,

      customer: {
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
          orders.length,

        deliveredOrders:
          deliveredOrders.length,

        totalPurchase,

        totalAppointments:
          appointments.length,

        totalReviews:
          reviews.length,

        lastOrderAt:
          orders[0]
            ?.createdAt
            ?.toISOString(),

        profile: {
          division:
            profile?.division ??
            "",

          district:
            profile?.district ??
            "",

          area:
            profile?.area ??
            "",

          address:
            profile?.address ??
            "",
        },

        orders:
          orders.map(
            (order) =>
              serializeOrder(
                order
              )
          ),

        appointments:
          appointments.map(
            (appointment) =>
              serializeAppointment(
                appointment
              )
          ),

        reviews:
          reviews.map(
            (review) =>
              serializeReview(
                review
              )
          ),
      },
    });
  } catch (error) {
    console.error(
      "Customer Details Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Customer Details load করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}