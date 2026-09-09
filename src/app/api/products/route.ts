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
  createSlug,
} from "@/lib/slug";

import {
  isAdminRequest,
} from "@/lib/api-auth";

import {
  serializeProduct,
  type ProductDocument,
} from "@/lib/db/products";

import type {
  ProductImage,
} from "@/types/product-image";

function sanitizeImages(
  value: unknown
): ProductImage[] {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .filter(
      (
        image
      ): image is ProductImage => {
        if (
          !image ||
          typeof image !==
            "object"
        ) {
          return false;
        }

        const item =
          image as Partial<ProductImage>;

        return Boolean(
          typeof item.publicId ===
            "string" &&
            typeof item.url ===
              "string" &&
            typeof item.width ===
              "number" &&
            typeof item.height ===
              "number" &&
            typeof item.format ===
              "string"
        );
      }
    )
    .slice(0, 5);
}

/* =========================
   GET PRODUCTS
========================= */

export async function GET(
  request: NextRequest
) {
  try {
    const adminMode =
      request.nextUrl.searchParams.get(
        "admin"
      ) === "1";

    if (adminMode) {
      const isAdmin =
        await isAdminRequest(
          request.headers
        );

      if (!isAdmin) {
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
    }

    const db =
      await getDb();

    const products =
      await db
        .collection<ProductDocument>(
          "products"
        )
        .find(
          adminMode
            ? {}
            : {
                active: true,
              }
        )
        .sort({
          createdAt: -1,
        })
        .toArray();

    return NextResponse.json({
      success: true,

      products:
        products.map(
          (product) =>
            serializeProduct(
              product
            )
        ),
    });
  } catch (error) {
    console.error(
      "GET Products Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Products load করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   CREATE PRODUCT
========================= */

export async function POST(
  request: NextRequest
) {
  try {
    const isAdmin =
      await isAdminRequest(
        request.headers
      );

    if (!isAdmin) {
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

    const body =
      await request.json();

    /* =====================
       REQUIRED FIELDS
    ===================== */

    const requiredFields = [
      "name",
      "englishName",
      "categoryId",
      "size",
      "shortDescription",
      "description",
    ];

    for (
      const field of
      requiredFields
    ) {
      if (
        !String(
          body[field] ?? ""
        ).trim()
      ) {
        return NextResponse.json(
          {
            success: false,

            message:
              `${field} required.`,
          },
          {
            status: 400,
          }
        );
      }
    }

    /* =====================
       PRICE + STOCK
    ===================== */

    const regularPrice =
      Number(
        body.regularPrice
      );

    const stock =
      Number(
        body.stock
      );

    const salePrice =
      body.salePrice ===
        undefined ||
      body.salePrice === "" ||
      body.salePrice === null
        ? undefined
        : Number(
            body.salePrice
          );

    if (
      !Number.isFinite(
        regularPrice
      ) ||
      regularPrice <= 0
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Regular Price সঠিক নয়।",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isInteger(
        stock
      ) ||
      stock < 0
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Stock সঠিক নয়।",
        },
        {
          status: 400,
        }
      );
    }

    if (
      salePrice !==
        undefined &&
      (
        !Number.isFinite(
          salePrice
        ) ||
        salePrice <= 0 ||
        salePrice >=
          regularPrice
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Sale Price অবশ্যই Regular Price-এর চেয়ে কম হতে হবে।",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================
       DISCOUNT
    ===================== */

    const discountEnabled =
      Boolean(
        body.discountEnabled
      );

    let discountPrice:
      number | undefined;

    let discountStartAt:
      Date | undefined;

    let discountEndAt:
      Date | undefined;

    if (
      discountEnabled
    ) {
      discountPrice =
        Number(
          body.discountPrice
        );

      discountStartAt =
        new Date(
          body.discountStartAt
        );

      discountEndAt =
        new Date(
          body.discountEndAt
        );

      if (
        !Number.isFinite(
          discountPrice
        ) ||
        discountPrice <= 0 ||
        discountPrice >=
          regularPrice
      ) {
        return NextResponse.json(
          {
            success: false,

            message:
              "Discount Price অবশ্যই Regular Price-এর চেয়ে কম হতে হবে।",
          },
          {
            status: 400,
          }
        );
      }

      if (
        Number.isNaN(
          discountStartAt.getTime()
        ) ||
        Number.isNaN(
          discountEndAt.getTime()
        ) ||
        discountEndAt <=
          discountStartAt
      ) {
        return NextResponse.json(
          {
            success: false,

            message:
              "Discount Start এবং End Time সঠিকভাবে দিন।",
          },
          {
            status: 400,
          }
        );
      }
    }

    /* =====================
       CATEGORY
    ===================== */

    const categoryId =
      String(
        body.categoryId
      );

    if (
      !ObjectId.isValid(
        categoryId
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Category সঠিক নয়।",
        },
        {
          status: 400,
        }
      );
    }

    const db =
      await getDb();

    const category =
      await db
        .collection(
          "categories"
        )
        .findOne({
          _id:
            new ObjectId(
              categoryId
            ),

          active: true,
        });

    if (!category) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Active Category পাওয়া যায়নি।",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================
       SLUG
    ===================== */

    const englishName =
      String(
        body.englishName
      ).trim();

    let slug =
      createSlug(
        englishName
      );

    if (!slug) {
      slug =
        `product-${Date.now()}`;
    }

    const products =
      db.collection<ProductDocument>(
        "products"
      );

    const slugExists =
      await products.findOne({
        slug,
      });

    if (
      slugExists
    ) {
      slug =
        `${slug}-${Date.now()
          .toString()
          .slice(-5)}`;
    }

    /* =====================
       CREATE PRODUCT
    ===================== */

    const now =
      new Date();

    const product:
      ProductDocument = {
      id:
        Date.now(),

      name:
        String(
          body.name
        ).trim(),

      englishName,

      slug,

      shortDescription:
        String(
          body.shortDescription
        ).trim(),

      description:
        String(
          body.description
        ).trim(),

      regularPrice,

      ...(salePrice !==
      undefined
        ? {
            salePrice,
          }
        : {}),

      /*
        Discount Settings
      */
      discountEnabled,

      ...(discountEnabled &&
      discountPrice !==
        undefined &&
      discountStartAt &&
      discountEndAt
        ? {
            discountPrice,

            discountStartAt,

            discountEndAt,
          }
        : {}),

      stock,

      ...(String(
        body.badge ?? ""
      ).trim()
        ? {
            badge:
              String(
                body.badge
              ).trim(),
          }
        : {}),

      category:
        String(
          category.name
        ),

      categoryId,

      size:
        String(
          body.size
        ).trim(),

      sku:
        `PRD-${Date.now()
          .toString()
          .slice(-6)}`,

      usageInfo:
        String(
          body.usageInfo ??
            "Product Label এবং প্রয়োজনীয় নির্দেশনা অনুসরণ করুন।"
        ).trim(),

      images:
        sanitizeImages(
          body.images
        ),

      active: true,

      createdAt:
        now,

      updatedAt:
        now,
    };

    /* =====================
       SAVE TO MONGODB
    ===================== */

    const result =
      await products.insertOne(
        product
      );

    const created =
      await products.findOne({
        _id:
          result.insertedId,
      });

    if (!created) {
      throw new Error(
        "Created product not found"
      );
    }

    return NextResponse.json(
      {
        success: true,

        product:
          serializeProduct(
            created
          ),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST Product Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Product তৈরি করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}