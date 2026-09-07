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

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

/* =========================
   UPDATE CATEGORY
========================= */

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: RouteProps
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

    const { id } =
      await params;

    if (
      !ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Invalid Category ID.",
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

    const categories =
      db.collection(
        "categories"
      );

    const updateData: Record<
      string,
      unknown
    > = {
      updatedAt:
        new Date(),
    };

    if (
      typeof body.active ===
      "boolean"
    ) {
      updateData.active =
        body.active;
    }

    if (
      typeof body.name ===
      "string"
    ) {
      const name =
        body.name.trim();

      if (
        name.length < 2
      ) {
        return NextResponse.json(
          {
            success: false,

            message:
              "Category Name সঠিক নয়।",
          },
          {
            status: 400,
          }
        );
      }

      const duplicate =
        await categories.findOne(
          {
            _id: {
              $ne:
                new ObjectId(
                  id
                ),
            },

            normalizedName:
              name.toLowerCase(),
          }
        );

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,

            message:
              "এই Category আগে থেকেই আছে।",
          },
          {
            status: 409,
          }
        );
      }

      updateData.name =
        name;

      updateData.normalizedName =
        name.toLowerCase();

      updateData.slug =
        createSlug(name);
    }

    const result =
      await categories.updateOne(
        {
          _id:
            new ObjectId(id),
        },
        {
          $set:
            updateData,
        }
      );

    if (
      result.matchedCount ===
      0
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Category পাওয়া যায়নি।",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Category Update হয়েছে।",
    });
  } catch (error) {
    console.error(
      "PATCH Category Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Category Update করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   DELETE CATEGORY
========================= */

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: RouteProps
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

    const { id } =
      await params;

    if (
      !ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Invalid Category ID.",
        },
        {
          status: 400,
        }
      );
    }

    const db =
      await getDb();

    const categories =
      db.collection(
        "categories"
      );

    const products =
      db.collection(
        "products"
      );

    const category =
      await categories.findOne({
        _id:
          new ObjectId(id),
      });

    if (!category) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Category পাওয়া যায়নি।",
        },
        {
          status: 404,
        }
      );
    }

    const productUsingCategory =
      await products.findOne({
        $or: [
          {
            categoryId: id,
          },

          {
            category:
              category.name,
          },
        ],
      });

    if (
      productUsingCategory
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "এই Category একটি Product-এ ব্যবহার হচ্ছে। আগে Product-এর Category পরিবর্তন করুন।",
        },
        {
          status: 409,
        }
      );
    }

    await categories.deleteOne({
      _id:
        new ObjectId(id),
    });

    return NextResponse.json({
      success: true,

      message:
        "Category Delete হয়েছে।",
    });
  } catch (error) {
    console.error(
      "DELETE Category Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Category Delete করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}