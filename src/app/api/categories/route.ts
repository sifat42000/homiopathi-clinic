import {
  NextRequest,
  NextResponse,
} from "next/server";

import type {
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

type CategoryDocument = {
  _id?: ObjectId;

  name: string;

  normalizedName: string;

  slug: string;

  active: boolean;

  createdAt: Date;

  updatedAt: Date;
};

function serializeCategory(
  category: CategoryDocument & {
    _id: ObjectId;
  }
) {
  return {
    id:
      category._id.toString(),

    name:
      category.name,

    slug:
      category.slug,

    active:
      category.active,

    createdAt:
      category.createdAt.toISOString(),

    updatedAt:
      category.updatedAt.toISOString(),
  };
}

/* =========================
   GET CATEGORIES
========================= */

export async function GET(
  request: NextRequest
) {
  try {
    const db =
      await getDb();

    const collection =
      db.collection<CategoryDocument>(
        "categories"
      );

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
              "Unauthorized",
          },
          {
            status: 403,
          }
        );
      }
    }

    const filter =
      adminMode
        ? {}
        : {
            active: true,
          };

    const categories =
      await collection
        .find(filter)
        .sort({
          name: 1,
        })
        .toArray();

    return NextResponse.json({
      success: true,

      categories:
        categories.map(
          (category) =>
            serializeCategory(
              category as CategoryDocument & {
                _id: ObjectId;
              }
            )
        ),
    });
  } catch (error) {
    console.error(
      "GET Categories Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Categories load করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   CREATE CATEGORY
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

    const name = String(
      body.name ?? ""
    ).trim();

    if (
      name.length < 2
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Category Name সঠিকভাবে দিন।",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedName =
      name.toLowerCase();

    const db =
      await getDb();

    const collection =
      db.collection<CategoryDocument>(
        "categories"
      );

    const exists =
      await collection.findOne({
        normalizedName,
      });

    if (exists) {
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

    const now =
      new Date();

    const newCategory: CategoryDocument =
      {
        name,

        normalizedName,

        slug:
          createSlug(name),

        active: true,

        createdAt: now,

        updatedAt: now,
      };

    const result =
      await collection.insertOne(
        newCategory
      );

    return NextResponse.json(
      {
        success: true,

        category:
          serializeCategory({
            ...newCategory,

            _id: result.insertedId,
          }),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST Category Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Category তৈরি করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}