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
  getApiSession,
  isAdminRequest,
} from "@/lib/api-auth";

import {
  deleteCloudinaryImage,
  uploadReviewImage,
} from "@/lib/cloudinary";

import {
  serializeReview,
  type ReviewDocument,
} from "@/lib/db/reviews";

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================
   GET REVIEWS
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
    }

    const db =
      await getDb();

    const reviews =
      await db
        .collection<ReviewDocument>(
          "reviews"
        )
        .find(
          adminMode
            ? {}
            : {
                status:
                  "approved",
              }
        )
        .sort({
          createdAt: -1,
        })
        .toArray();

    return NextResponse.json({
      success: true,

      reviews:
        reviews.map(
          (review) =>
            serializeReview(
              review
            )
        ),
    });
  } catch (error) {
    console.error(
      "GET Reviews Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Reviews load করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   SUBMIT REVIEW
========================= */

export async function POST(
  request: NextRequest
) {
  let uploadedPublicId:
    string | null = null;

  try {
    const formData =
      await request.formData();

    const name =
      String(
        formData.get(
          "name"
        ) ?? ""
      ).trim();

    const service =
      String(
        formData.get(
          "service"
        ) ?? ""
      ).trim();

    const review =
      String(
        formData.get(
          "review"
        ) ?? ""
      ).trim();

    const rating =
      Number(
        formData.get(
          "rating"
        )
      );

    if (
      name.length < 2
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "নাম সঠিকভাবে দিন।",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !service ||
      service.length > 100
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Service নির্বাচন করুন।",
        },
        {
          status: 400,
        }
      );
    }

    if (
      review.length < 10 ||
      review.length > 1000
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Review কমপক্ষে ১০ এবং সর্বোচ্চ ১০০০ অক্ষরের হতে হবে।",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isInteger(
        rating
      ) ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "১ থেকে ৫ Star নির্বাচন করুন।",
        },
        {
          status: 400,
        }
      );
    }

    const imageValue =
      formData.get(
        "image"
      );

    let image;

    if (
      imageValue instanceof
        File &&
      imageValue.size > 0
    ) {
      if (
        !allowedTypes.includes(
          imageValue.type
        )
      ) {
        return NextResponse.json(
          {
            success: false,

            message:
              "শুধু JPG, PNG অথবা WEBP Image ব্যবহার করুন।",
          },
          {
            status: 400,
          }
        );
      }

      if (
        imageValue.size >
        MAX_IMAGE_SIZE
      ) {
        return NextResponse.json(
          {
            success: false,

            message:
              "Review Image সর্বোচ্চ 5MB হতে পারবে।",
          },
          {
            status: 400,
          }
        );
      }

      image =
        await uploadReviewImage(
          imageValue
        );

      uploadedPublicId =
        image.publicId;
    }

    const session =
      await getApiSession(
        request.headers
      );

    const now =
      new Date();

    const document:
      ReviewDocument = {
      userId:
        session?.user.id ??
        null,

      name,

      service,

      review,

      rating,

      ...(image
        ? {
            image,
          }
        : {}),

      /*
        User কখনো সরাসরি
        approved করতে পারবে না।
      */
      status:
        "pending",

      createdAt: now,

      updatedAt: now,
    };

    const db =
      await getDb();

    const result =
      await db
        .collection<ReviewDocument>(
          "reviews"
        )
        .insertOne(
          document
        );

    return NextResponse.json(
      {
        success: true,

        message:
          "Review Submit হয়েছে। Admin approval-এর পর Website-এ দেখা যাবে.",

        reviewId:
          result.insertedId.toString(),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST Review Error:",
      error
    );

    /*
      Cloudinary upload success
      কিন্তু MongoDB fail হলে
      orphan image delete।
    */
    if (
      uploadedPublicId
    ) {
      try {
        await deleteCloudinaryImage(
          uploadedPublicId
        );
      } catch (
        cleanupError
      ) {
        console.error(
          "Review image cleanup error:",
          cleanupError
        );
      }
    }

    return NextResponse.json(
      {
        success: false,

        message:
          "Review Submit করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}