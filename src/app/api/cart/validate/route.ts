import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getDb,
} from "@/lib/mongodb";

import {
  getWebsiteSettings,
} from "@/lib/db/settings";

import {
  getEffectiveProductPrice,
} from "@/lib/product-pricing";

import type {
  ProductDocument,
} from "@/lib/db/products";

type RequestedItem = {
  productId: number;

  quantity: number;
};

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    if (
      !Array.isArray(
        body.items
      ) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Cart খালি।",
        },
        {
          status: 400,
        }
      );
    }

    const quantityMap =
      new Map<
        number,
        number
      >();

    for (
      const rawItem of
      body.items
    ) {
      const productId =
        Number(
          rawItem.productId
        );

      const quantity =
        Number(
          rawItem.quantity
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
        return NextResponse.json(
          {
            success: false,

            message:
              "Cart-এর Product Information সঠিক নয়।",
          },
          {
            status: 400,
          }
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

    const requestedItems:
      RequestedItem[] =
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

    const [
      db,
      settings,
    ] =
      await Promise.all([
        getDb(),

        getWebsiteSettings(),
      ]);

    const products =
      await db
        .collection<ProductDocument>(
          "products"
        )
        .find({
          id: {
            $in:
              productIds,
          },
        })
        .toArray();

    const productMap =
      new Map(
        products.map(
          (product) => [
            product.id,
            product,
          ]
        )
      );

    const issues: {
      productId?: number;

      code: string;

      message: string;
    }[] = [];

    if (
      !settings.shopEnabled
    ) {
      issues.push({
        code:
          "SHOP_DISABLED",

        message:
          "বর্তমানে নতুন Product Order সাময়িকভাবে বন্ধ আছে।",
      });
    }

    const validatedItems: {
      productId: number;

      name: string;

      englishName: string;

      slug: string;

      sku: string;

      quantity: number;

      stock: number;

      unitPrice: number;

      lineTotal: number;

      imageUrl?: string;
    }[] = [];

    let subtotal = 0;

    const priceTime =
      new Date();

    for (
      const requested of
      requestedItems
    ) {
      const product =
        productMap.get(
          requested.productId
        );

      if (!product) {
        issues.push({
          productId:
            requested.productId,

          code:
            "PRODUCT_NOT_FOUND",

          message:
            `একটি Product আর পাওয়া যাচ্ছে না। Product ID: ${requested.productId}`,
        });

        continue;
      }

      if (
        !product.active
      ) {
        issues.push({
          productId:
            requested.productId,

          code:
            "PRODUCT_INACTIVE",

          message:
            `${product.name} বর্তমানে Available নয়।`,
        });

        continue;
      }

      if (
        product.stock <= 0
      ) {
        issues.push({
          productId:
            requested.productId,

          code:
            "OUT_OF_STOCK",

          message:
            `${product.name} বর্তমানে Out of Stock।`,
        });

        continue;
      }

      if (
        requested.quantity >
        product.stock
      ) {
        issues.push({
          productId:
            requested.productId,

          code:
            "INSUFFICIENT_STOCK",

          message:
            `${product.name}-এর ${requested.quantity}টি চাওয়া হয়েছে, কিন্তু বর্তমানে ${product.stock}টি Stock আছে।`,
        });
      }

      const effectiveQuantity =
        Math.min(
          requested.quantity,
          product.stock
        );

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
        effectiveQuantity;

      subtotal +=
        lineTotal;

      validatedItems.push({
        productId:
          product.id,

        name:
          product.name,

        englishName:
          product.englishName,

        slug:
          product.slug,

        sku:
          product.sku,

        quantity:
          effectiveQuantity,

        stock:
          product.stock,

        unitPrice,

        lineTotal,

        imageUrl:
          product.images?.[0]
            ?.url,
      });
    }

    const deliveryCharge =
      settings.deliveryCharge;

    const total =
      subtotal +
      deliveryCharge;

    return NextResponse.json({
      success: true,

      valid:
        issues.length === 0,

      shopEnabled:
        settings.shopEnabled,

      items:
        validatedItems,

      issues,

      subtotal,

      deliveryCharge,

      total,

      checkedAt:
        priceTime.toISOString(),
    });
  } catch (error) {
    console.error(
      "Cart Validation Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Cart-এর বর্তমান Price এবং Stock Check করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}