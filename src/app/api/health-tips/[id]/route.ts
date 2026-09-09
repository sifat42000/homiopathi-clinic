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

import type {
  HealthTipDocument,
} from "@/lib/db/health-tips";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
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

    const { id } =
      await params;

    if (
      !ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Invalid Health Tip ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await request.json();

    const update:
      Record<
        string,
        unknown
      > = {
      updatedAt:
        new Date(),
    };

    const stringFields = [
      "title",
      "excerpt",
      "category",
      "readTime",
      "date",
      "author",
      "intro",
    ];

    for (
      const field of
      stringFields
    ) {
      if (
        typeof body[field] ===
        "string"
      ) {
        update[field] =
          body[field].trim();
      }
    }

    if (
      typeof body.active ===
      "boolean"
    ) {
      update.active =
        body.active;
    }

    if (
      Array.isArray(
        body.sections
      )
    ) {
      update.sections =
        body.sections
          .map(
            (
              item: {
                heading?: string;
                content?: string;
              }
            ) => ({
              heading:
                String(
                  item.heading ??
                    ""
                ).trim(),

              content:
                String(
                  item.content ??
                    ""
                ).trim(),
            })
          )
          .filter(
            (
              item: {
                heading: string;
                content: string;
              }
            ) =>
              item.heading &&
              item.content
          );
    }

    const db =
      await getDb();

    const result =
      await db
        .collection<HealthTipDocument>(
          "healthTips"
        )
        .updateOne(
          {
            _id:
              new ObjectId(id),
          },

          {
            $set:
              update,
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
            "Health Tip পাওয়া যায়নি।",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Health Tip Update হয়েছে।",
    });
  } catch (error) {
    console.error(
      "PATCH Health Tip Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Health Tip Update করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}

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
            "Invalid Health Tip ID.",
        },
        {
          status: 400,
        }
      );
    }

    const db =
      await getDb();

    const result =
      await db
        .collection<HealthTipDocument>(
          "healthTips"
        )
        .deleteOne({
          _id:
            new ObjectId(id),
        });

    if (
      result.deletedCount ===
      0
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Health Tip পাওয়া যায়নি।",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Health Tip Delete হয়েছে।",
    });
  } catch (error) {
    console.error(
      "DELETE Health Tip Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Health Tip Delete করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}