import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  MongoServerError,
} from "mongodb";

import {
  getDb,
} from "@/lib/mongodb";

import {
  isAdminRequest,
} from "@/lib/api-auth";

import {
  ensureDatabaseIndexes,
  productionIndexCollections,
} from "@/lib/db/ensure-indexes";

/* =========================
   VIEW INDEX STATUS
========================= */

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

    const collections = [];

    for (
      const collectionName of
      productionIndexCollections
    ) {
      try {
        const indexes =
          await db
            .collection(
              collectionName
            )
            .indexes();

        collections.push({
          collection:
            collectionName,

          indexes:
            indexes.map(
              (index) => ({
                name:
                  index.name,

                key:
                  index.key,

                unique:
                  Boolean(
                    index.unique
                  ),

                sparse:
                  Boolean(
                    index.sparse
                  ),
              })
            ),
        });
      } catch {
        collections.push({
          collection:
            collectionName,

          indexes: [],
        });
      }
    }

    return NextResponse.json({
      success: true,

      collections,
    });
  } catch (error) {
    console.error(
      "Database Setup Status Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Database Index Status load করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   CREATE PRODUCTION INDEXES
========================= */

export async function POST(
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

    const results =
      await ensureDatabaseIndexes();

    return NextResponse.json({
      success: true,

      message:
        "Production Database Indexes সফলভাবে তৈরি/verify হয়েছে।",

      indexes:
        results,
    });
  } catch (error) {
    console.error(
      "Database Setup Error:",
      error
    );

    if (
      error instanceof
        MongoServerError &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Unique Index তৈরি করা যায়নি কারণ Database-এ duplicate data আছে। Duplicate slug/order number/id খুঁজে ঠিক করে আবার Setup চালান।",

          error:
            error.message,
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,

        message:
          "Production Database Setup করা যায়নি।",

        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}