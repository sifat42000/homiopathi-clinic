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
} from "@/lib/api-auth";

import {
  deleteCloudinaryImages,
} from "@/lib/cloudinary";

import type {
  ProductDocument,
} from "@/lib/db/products";

import type {
  ProductImage,
} from "@/types/product-image";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

function sanitizeImages(
  value: unknown
): ProductImage[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const images =
    value.filter(
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

        return (
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
    );

  if (images.length > 5) {
    return null;
  }

  return images;
}

/* =========================
   UPDATE PRODUCT
========================= */

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

    const { id } =
      await params;

    if (
      !ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid Product ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await request.json();

    const db =
      await getDb();

    const products =
      db.collection<ProductDocument>(
        "products"
      );

    const existingProduct =
      await products.findOne({
        _id:
          new ObjectId(id),
      });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product পাওয়া যায়নি।",
        },
        {
          status: 404,
        }
      );
    }

    const update: Record<
      string,
      unknown
    > = {
      updatedAt:
        new Date(),
    };

    const unset: Record<
      string,
      ""
    > = {};

    /* =========================
       STRING FIELDS
    ========================= */

    const stringFields = [
      "name",
      "englishName",
      "shortDescription",
      "description",
      "size",
      "usageInfo",
    ];

    for (
      const field of
      stringFields
    ) {
      if (
        typeof body[field] ===
        "string"
      ) {
        const value =
          body[field].trim();

        if (!value) {
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

        update[field] =
          value;
      }
    }

    /* =========================
       BADGE
    ========================= */

    if (
      typeof body.badge ===
      "string"
    ) {
      const badge =
        body.badge.trim();

      if (badge) {
        update.badge =
          badge;
      } else {
        unset.badge = "";
      }
    }

    /* =========================
       ACTIVE STATUS
    ========================= */

    if (
      typeof body.active ===
      "boolean"
    ) {
      update.active =
        body.active;
    }

    /* =========================
       REGULAR PRICE
    ========================= */

    let finalRegularPrice =
      existingProduct.regularPrice;

    if (
      body.regularPrice !==
      undefined
    ) {
      const regularPrice =
        Number(
          body.regularPrice
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

      finalRegularPrice =
        regularPrice;

      update.regularPrice =
        regularPrice;
    }

    /* =========================
       SALE PRICE
    ========================= */

    if (
      body.salePrice === "" ||
      body.salePrice === null
    ) {
      unset.salePrice = "";
    } else if (
      body.salePrice !==
      undefined
    ) {
      const salePrice =
        Number(
          body.salePrice
        );

      if (
        !Number.isFinite(
          salePrice
        ) ||
        salePrice <= 0 ||
        salePrice >=
          finalRegularPrice
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Sale Price Regular Price-এর চেয়ে কম হতে হবে।",
          },
          {
            status: 400,
          }
        );
      }

      update.salePrice =
        salePrice;
    }

    /* =========================
       STOCK
    ========================= */

    if (
      body.stock !== undefined
    ) {
      const stock =
        Number(body.stock);

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

      update.stock =
        stock;
    }

    /* =========================
       CATEGORY
    ========================= */

    if (
      body.categoryId !==
      undefined
    ) {
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
              "Invalid Category.",
          },
          {
            status: 400,
          }
        );
      }

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
            status: 404,
          }
        );
      }

      update.categoryId =
        categoryId;

      update.category =
        category.name;
    }

    /* =========================
       IMAGES
    ========================= */

    if (
      body.images !== undefined
    ) {
      const images =
        sanitizeImages(
          body.images
        );

      if (!images) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Image Data সঠিক নয় অথবা সর্বোচ্চ ৫টি Image ব্যবহার করা যাবে।",
          },
          {
            status: 400,
          }
        );
      }

      update.images =
        images;
    }

    /* =========================
       TIMED DISCOUNT
    ========================= */

    if (
      body.discountEnabled !==
      undefined
    ) {
      const discountEnabled =
        Boolean(
          body.discountEnabled
        );

      update.discountEnabled =
        discountEnabled;

      if (
        discountEnabled
      ) {
        const discountPrice =
          Number(
            body.discountPrice
          );

        const discountStartAt =
          new Date(
            body.discountStartAt
          );

        const discountEndAt =
          new Date(
            body.discountEndAt
          );

        if (
          !Number.isFinite(
            discountPrice
          ) ||
          discountPrice <= 0 ||
          discountPrice >=
            finalRegularPrice
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
          )
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Discount Start এবং End Time সঠিক নয়।",
            },
            {
              status: 400,
            }
          );
        }

        if (
          discountEndAt <=
          discountStartAt
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Discount End Time অবশ্যই Start Time-এর পরে হতে হবে।",
            },
            {
              status: 400,
            }
          );
        }

        update.discountPrice =
          discountPrice;

        update.discountStartAt =
          discountStartAt;

        update.discountEndAt =
          discountEndAt;
      } else {
        unset.discountPrice =
          "";

        unset.discountStartAt =
          "";

        unset.discountEndAt =
          "";
      }
    }

    const updateOperation: {
      $set: Record<
        string,
        unknown
      >;

      $unset?: Record<
        string,
        ""
      >;
    } = {
      $set: update,
    };

    if (
      Object.keys(unset)
        .length > 0
    ) {
      updateOperation.$unset =
        unset;
    }

    const result =
      await products.updateOne(
        {
          _id:
            new ObjectId(id),
        },

        updateOperation
      );

    if (
      result.matchedCount ===
      0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product পাওয়া যায়নি।",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Product Update হয়েছে।",
    });
  } catch (error) {
    console.error(
      "PATCH Product Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Product Update করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   DELETE PRODUCT
========================= */

export async function DELETE(
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

    if (
      !ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid Product ID.",
        },
        {
          status: 400,
        }
      );
    }

    const db =
      await getDb();

    const products =
      db.collection<ProductDocument>(
        "products"
      );

    const product =
      await products.findOne({
        _id:
          new ObjectId(id),
      });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product পাওয়া যায়নি।",
        },
        {
          status: 404,
        }
      );
    }

    const publicIds =
      (
        product.images ?? []
      ).map(
        (image) =>
          image.publicId
      );

    if (
      publicIds.length > 0
    ) {
      await deleteCloudinaryImages(
        publicIds
      );
    }

    await products.deleteOne({
      _id:
        new ObjectId(id),
    });

    return NextResponse.json({
      success: true,

      message:
        "Product এবং Product Images Delete হয়েছে।",
    });
  } catch (error) {
    console.error(
      "DELETE Product Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Product Delete করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}