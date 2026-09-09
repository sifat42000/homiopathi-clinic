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
  deleteCloudinaryImage,
} from "@/lib/cloudinary";

import type {
  ReviewDocument,
} from "@/lib/db/reviews";

import type {
  ReviewStatus,
} from "@/types/review";

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
            "Invalid Review ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await request.json();

    const status =
      String(
        body.status ?? ""
      ) as ReviewStatus;

    if (
      ![
        "pending",
        "approved",
        "rejected",
      ].includes(status)
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Invalid Review Status.",
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
        .collection<ReviewDocument>(
          "reviews"
        )
        .updateOne(
          {
            _id:
              new ObjectId(id),
          },

          {
            $set: {
              status,

              updatedAt:
                new Date(),
            },
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
            "Review পাওয়া যায়নি।",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Review Status Update হয়েছে।",
    });
  } catch (error) {
    console.error(
      "PATCH Review Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Review Update করা যায়নি।",
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
            "Invalid Review ID.",
        },
        {
          status: 400,
        }
      );
    }

    const db =
      await getDb();

    const collection =
      db.collection<ReviewDocument>(
        "reviews"
      );

    const review =
      await collection.findOne({
        _id:
          new ObjectId(id),
      });

    if (!review) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Review পাওয়া যায়নি।",
        },
        {
          status: 404,
        }
      );
    }

    if (
      review.image?.publicId
    ) {
      await deleteCloudinaryImage(
        review.image.publicId
      );
    }

    await collection.deleteOne({
      _id:
        new ObjectId(id),
    });

    return NextResponse.json({
      success: true,

      message:
        "Review Delete হয়েছে।",
    });
  } catch (error) {
    console.error(
      "DELETE Review Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Review Delete করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}