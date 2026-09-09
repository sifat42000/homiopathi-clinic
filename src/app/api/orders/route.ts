import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  ObjectId,
} from "mongodb";

import {
  getDb,
  mongoClient,
} from "@/lib/mongodb";

import {
  getApiSession,
  isAdminRequest,
} from "@/lib/api-auth";

import {
  getWebsiteSettings,
} from "@/lib/db/settings";

import {
  getEffectiveProductPrice,
} from "@/lib/product-pricing";

import type {
  ProductDocument,
} from "@/lib/db/products";

import {
  serializeOrder,
  type OrderDocument,
} from "@/lib/db/orders";

class OrderRequestError extends Error {
  status: number;

  constructor(
    message: string,
    status = 400
  ) {
    super(message);

    this.status =
      status;
  }
}

/* =========================
   GET ORDERS
========================= */

export async function GET(
  request: NextRequest
) {
  try {
    const db =
      await getDb();

    const orders =
      db.collection<OrderDocument>(
        "orders"
      );

    const adminMode =
      request.nextUrl.searchParams.get(
        "admin"
      ) === "1";

    const mineMode =
      request.nextUrl.searchParams.get(
        "mine"
      ) === "1";

    let filter:
      Record<
        string,
        unknown
      >;

    if (adminMode) {
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

      filter = {};
    } else if (mineMode) {
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

      filter = {
        userId:
          session.user.id,
      };
    } else {
      return NextResponse.json(
        {
          success: false,

          message:
            "Invalid request.",
        },
        {
          status: 400,
        }
      );
    }

    const results =
      await orders
        .find(filter)
        .sort({
          createdAt: -1,
        })
        .toArray();

    return NextResponse.json({
      success: true,

      orders:
        results.map(
          (order) =>
            serializeOrder(
              order
            )
        ),
    });
  } catch (error) {
    console.error(
      "GET Orders Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Orders load করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   CREATE ORDER
========================= */

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    /* =========================
       WEBSITE SETTINGS
    ========================= */

    const websiteSettings =
      await getWebsiteSettings();

    if (
      !websiteSettings.shopEnabled
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "বর্তমানে নতুন Product Order সাময়িকভাবে বন্ধ আছে।",
        },
        {
          status: 503,
        }
      );
    }

    const deliveryCharge =
      websiteSettings.deliveryCharge;

    /* =========================
       CUSTOMER
    ========================= */

    const name =
      String(
        body.customer?.name ??
          ""
      ).trim();

    const phone =
      String(
        body.customer?.phone ??
          ""
      )
        .replace(
          /\D/g,
          ""
        )
        .trim();

    const email =
      String(
        body.customer?.email ??
          ""
      ).trim();

    if (
      name.length < 2
    ) {
      throw new OrderRequestError(
        "Customer Name সঠিকভাবে দিন।"
      );
    }

    if (
      !/^01[3-9]\d{8}$/.test(
        phone
      )
    ) {
      throw new OrderRequestError(
        "সঠিক ১১ সংখ্যার Mobile Number দিন।"
      );
    }

    /* =========================
       SHIPPING ADDRESS
    ========================= */

    const division =
      String(
        body.shippingAddress
          ?.division ?? ""
      ).trim();

    const district =
      String(
        body.shippingAddress
          ?.district ?? ""
      ).trim();

    const area =
      String(
        body.shippingAddress
          ?.area ?? ""
      ).trim();

    const address =
      String(
        body.shippingAddress
          ?.address ?? ""
      ).trim();

    if (
      !division ||
      !district ||
      !area ||
      address.length < 5
    ) {
      throw new OrderRequestError(
        "Delivery Address সম্পূর্ণভাবে দিন।"
      );
    }

    /* =========================
       CART ITEMS
    ========================= */

    if (
      !Array.isArray(
        body.items
      ) ||
      body.items.length ===
        0
    ) {
      throw new OrderRequestError(
        "Cart খালি।"
      );
    }

    const quantityMap =
      new Map<
        number,
        number
      >();

    for (
      const item of
      body.items
    ) {
      const productId =
        Number(
          item.productId
        );

      const quantity =
        Number(
          item.quantity
        );

      if (
        !Number.isFinite(
          productId
        ) ||
        !Number.isInteger(
          quantity
        ) ||
        quantity < 1 ||
        quantity > 99
      ) {
        throw new OrderRequestError(
          "Cart Item সঠিক নয়।"
        );
      }

      quantityMap.set(
        productId,

        (quantityMap.get(
          productId
        ) ?? 0) +
          quantity
      );
    }

    const requestedItems =
      Array.from(
        quantityMap.entries()
      ).map(
        ([
          productId,
          quantity,
        ]) => ({
          productId,
          quantity,
        })
      );

    const productIds =
      requestedItems.map(
        (item) =>
          item.productId
      );

    /* =========================
       DATABASE
    ========================= */

    const db =
      await getDb();

    const client =
      mongoClient;

    const products =
      db.collection<ProductDocument>(
        "products"
      );

    const orders =
      db.collection<OrderDocument>(
        "orders"
      );

    const loginSession =
      await getApiSession(
        request.headers
      );

    const mongoSession =
      client.startSession();

    const orderObjectId =
      new ObjectId();

    const orderNumber =
      `HC-${orderObjectId
        .toHexString()
        .slice(-10)
        .toUpperCase()}`;

    let createdOrder:
      | (OrderDocument & {
          _id: ObjectId;
        })
      | null = null;

    try {
      await mongoSession.withTransaction(
        async () => {
          /* =========================
             LOAD REAL PRODUCTS
          ========================= */

          const databaseProducts =
            await products
              .find(
                {
                  id: {
                    $in:
                      productIds,
                  },

                  active: true,
                },
                {
                  session:
                    mongoSession,
                }
              )
              .toArray();

          if (
            databaseProducts.length !==
            productIds.length
          ) {
            throw new OrderRequestError(
              "এক বা একাধিক Product পাওয়া যায়নি অথবা Inactive।",
              409
            );
          }

          const productMap =
            new Map(
              databaseProducts.map(
                (product) => [
                  product.id,
                  product,
                ]
              )
            );

          const orderItems = [];

          let subtotal = 0;

          const priceTime =
            new Date();

          /* =========================
             SERVER PRICE CALCULATION
          ========================= */

          for (
            const requested of
            requestedItems
          ) {
            const product =
              productMap.get(
                requested.productId
              );

            if (!product) {
              throw new OrderRequestError(
                "Product পাওয়া যায়নি।",
                409
              );
            }

            if (
              product.stock <
              requested.quantity
            ) {
              throw new OrderRequestError(
                `${product.name} পর্যাপ্ত Stock নেই। বর্তমানে ${product.stock}টি available.`,
                409
              );
            }

            /*
              Timed Discount Active হলে
              discountPrice।

              Active না হলে
              salePrice অথবা regularPrice।
            */
            const unitPrice =
              getEffectiveProductPrice(
                {
                  regularPrice:
                    product.regularPrice,

                  salePrice:
                    product.salePrice,

                  discountEnabled:
                    product.discountEnabled,

                  discountPrice:
                    product.discountPrice,

                  discountStartAt:
                    product.discountStartAt,

                  discountEndAt:
                    product.discountEndAt,
                },

                priceTime
              );

            const lineTotal =
              unitPrice *
              requested.quantity;

            subtotal +=
              lineTotal;

            orderItems.push({
              productId:
                product.id,

              productName:
                product.name,

              englishName:
                product.englishName,

              slug:
                product.slug,

              sku:
                product.sku,

              quantity:
                requested.quantity,

              unitPrice,

              lineTotal,

              imageUrl:
                product.images?.[0]
                  ?.url,
            });
          }

          /* =========================
             STOCK DECREASE
          ========================= */

          for (
            const requested of
            requestedItems
          ) {
            const stockResult =
              await products.updateOne(
                {
                  id:
                    requested.productId,

                  active: true,

                  stock: {
                    $gte:
                      requested.quantity,
                  },
                },

                {
                  $inc: {
                    stock:
                      -requested.quantity,
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

            if (
              stockResult.modifiedCount !==
              1
            ) {
              throw new OrderRequestError(
                "Order করার সময় Product Stock পরিবর্তন হয়েছে। আবার চেষ্টা করুন।",
                409
              );
            }
          }

          /* =========================
             ORDER
          ========================= */

          const now =
            new Date();

          const orderNote =
            String(
              body.orderNote ??
                ""
            )
              .trim()
              .slice(
                0,
                500
              );

          const total =
            subtotal +
            deliveryCharge;

          const order:
            OrderDocument & {
              _id:
                ObjectId;
            } = {
            _id:
              orderObjectId,

            orderNumber,

            userId:
              loginSession?.user
                .id ??
              null,

            customer: {
              name,

              phone,

              ...(email
                ? {
                    email,
                  }
                : loginSession
                    ?.user.email
                ? {
                    email:
                      loginSession
                        .user
                        .email,
                  }
                : {}),
            },

            shippingAddress: {
              division,

              district,

              area,

              address,
            },

            items:
              orderItems,

            subtotal,

            deliveryCharge,

            total,

            paymentMethod:
              "cod",

            paymentStatus:
              "unpaid",

            status:
              "pending",

            ...(orderNote
              ? {
                  orderNote,
                }
              : {}),

            statusHistory: [
              {
                status:
                  "pending",

                at: now,
              },
            ],

            createdAt: now,

            updatedAt: now,
          };

          await orders.insertOne(
            order,
            {
              session:
                mongoSession,
            }
          );

          createdOrder =
            order;
        }
      );
    } finally {
      await mongoSession.endSession();
    }

    if (!createdOrder) {
      throw new Error(
        "Order creation failed."
      );
    }

    return NextResponse.json(
      {
        success: true,

        message:
          "Order successfully created.",

        order:
          serializeOrder(
            createdOrder
          ),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST Order Error:",
      error
    );

    if (
      error instanceof
      OrderRequestError
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            error.message,
        },
        {
          status:
            error.status,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,

        message:
          "Order তৈরি করা যায়নি। আবার চেষ্টা করুন।",
      },
      {
        status: 500,
      }
    );
  }
}