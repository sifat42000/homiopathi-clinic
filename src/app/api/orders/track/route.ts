import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getDb,
} from "@/lib/mongodb";

import type {
  OrderDocument,
} from "@/lib/db/orders";

export async function GET(
  request: NextRequest
) {
  try {
    const orderNumber =
      String(
        request.nextUrl.searchParams.get(
          "orderNumber"
        ) ?? ""
      )
        .trim()
        .toUpperCase();

    const phone =
      String(
        request.nextUrl.searchParams.get(
          "phone"
        ) ?? ""
      )
        .replace(/\D/g, "")
        .trim();

    if (
      !orderNumber ||
      !/^01[3-9]\d{8}$/.test(
        phone
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Order Number এবং সঠিক Mobile Number দিন।",
        },
        {
          status: 400,
        }
      );
    }

    const db =
      await getDb();

    const order =
      await db
        .collection<OrderDocument>(
          "orders"
        )
        .findOne({
          orderNumber,

          "customer.phone":
            phone,
        });

    if (!order) {
      return NextResponse.json(
        {
          success: false,

          message:
            "এই Order Number ও Mobile Number-এর কোনো Order পাওয়া যায়নি।",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,

      order: {
        orderNumber:
          order.orderNumber,

        customerName:
          order.customer.name,

        items:
          order.items,

        subtotal:
          order.subtotal,

        deliveryCharge:
          order.deliveryCharge,

        total:
          order.total,

        paymentMethod:
          "cod",

        paymentStatus:
          order.paymentStatus,

        status:
          order.status,

        statusHistory:
          order.statusHistory.map(
            (history) => ({
              status:
                history.status,

              at:
                history.at.toISOString(),
            })
          ),

        createdAt:
          order.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error(
      "Order Tracking Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Order Track করা যাচ্ছে না।",
      },
      {
        status: 500,
      }
    );
  }
}