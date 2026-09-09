import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  ObjectId,
} from "mongodb";

import clientPromise, {
  getDb,
} from "@/lib/mongodb";

import {
  isAdminRequest,
} from "@/lib/api-auth";

import type {
  ProductDocument,
} from "@/lib/db/products";

import type {
  OrderDocument,
} from "@/lib/db/orders";

import type {
  OrderStatus,
} from "@/types/order";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

const allowedTransitions: Record<
  OrderStatus,
  OrderStatus[]
> = {
  pending: [
    "confirmed",
    "cancelled",
  ],

  confirmed: [
    "processing",
    "cancelled",
  ],

  processing: [
    "shipped",
    "cancelled",
  ],

  shipped: [
    "delivered",
  ],

  delivered: [],

  cancelled: [],
};

export async function PATCH(
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

    const {
      id,
    } = await params;

    if (
      !ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Invalid Order ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await request.json();

    const newStatus =
      String(
        body.status ?? ""
      ) as OrderStatus;

    const validStatuses:
      OrderStatus[] = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];

    if (
      !validStatuses.includes(
        newStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Invalid Order Status.",
        },
        {
          status: 400,
        }
      );
    }

    const db =
      await getDb();

    const client =
      await clientPromise;

    const orders =
      db.collection<OrderDocument>(
        "orders"
      );

    const products =
      db.collection<ProductDocument>(
        "products"
      );

    const mongoSession =
      client.startSession();

    try {
      await mongoSession.withTransaction(
        async () => {
          const order =
            await orders.findOne(
              {
                _id:
                  new ObjectId(
                    id
                  ),
              },
              {
                session:
                  mongoSession,
              }
            );

          if (!order) {
            throw new Error(
              "ORDER_NOT_FOUND"
            );
          }

          if (
            !allowedTransitions[
              order.status
            ].includes(
              newStatus
            )
          ) {
            throw new Error(
              `INVALID_TRANSITION:${order.status}`
            );
          }

          /*
            Cancel করলে Product Stock
            আবার Return হবে।
          */

          if (
            newStatus ===
            "cancelled"
          ) {
            for (
              const item of
              order.items
            ) {
              await products.updateOne(
                {
                  id:
                    item.productId,
                },

                {
                  $inc: {
                    stock:
                      item.quantity,
                  },

                  $set: {
                    updatedAt:
                      new Date(),
                  },
                },

                {
                  session:
                    mongoSession,
                }
              );
            }
          }

          const now =
            new Date();

          await orders.updateOne(
            {
              _id:
                new ObjectId(
                  id
                ),

              status:
                order.status,
            },

            {
              $set: {
                status:
                  newStatus,

                updatedAt: now,

                /*
                  COD Delivery complete
                  হলে Paid।
                */
                ...(newStatus ===
                "delivered"
                  ? {
                      paymentStatus:
                        "paid",
                    }
                  : {}),
              },

              $push: {
                statusHistory: {
                  status:
                    newStatus,

                  at: now,
                },
              },
            },

            {
              session:
                mongoSession,
            }
          );
        }
      );
    } finally {
      await mongoSession.endSession();
    }

    return NextResponse.json({
      success: true,

      message:
        "Order Status Update হয়েছে।",
    });
  } catch (error) {
    console.error(
      "PATCH Order Error:",
      error
    );

    if (
      error instanceof Error
    ) {
      if (
        error.message ===
        "ORDER_NOT_FOUND"
      ) {
        return NextResponse.json(
          {
            success: false,

            message:
              "Order পাওয়া যায়নি।",
          },
          {
            status: 404,
          }
        );
      }

      if (
        error.message.startsWith(
          "INVALID_TRANSITION"
        )
      ) {
        return NextResponse.json(
          {
            success: false,

            message:
              "এই Order-এর বর্তমান Status থেকে ওই Status-এ নেওয়া যাবে না।",
          },
          {
            status: 409,
          }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,

        message:
          "Order Status Update করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}