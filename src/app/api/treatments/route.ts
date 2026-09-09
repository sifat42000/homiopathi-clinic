import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getDb,
} from "@/lib/mongodb";

import {
  isAdminRequest,
} from "@/lib/api-auth";

import {
  createSlug,
} from "@/lib/slug";

import {
  getPublicTreatments,
  serializeTreatment,
  type TreatmentDocument,
} from "@/lib/db/treatments";

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

    if (!adminMode) {
      return NextResponse.json({
        success: true,
        treatments:
          await getPublicTreatments(),
      });
    }

    const db =
      await getDb();

    const treatments =
      await db
        .collection<TreatmentDocument>(
          "treatments"
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

      treatments:
        treatments.map(
          (treatment) =>
            serializeTreatment(
              treatment
            )
        ),
    });
  } catch (error) {
    console.error(
      "GET Treatments Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Treatments load করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}

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

    const body =
      await request.json();

    const title =
      String(
        body.title ?? ""
      ).trim();

    const englishTitle =
      String(
        body.englishTitle ??
          ""
      ).trim();

    const description =
      String(
        body.description ??
          ""
      ).trim();

    const fullDescription =
      String(
        body.fullDescription ??
          ""
      ).trim();

    const fee =
      Number(body.fee);

    const duration =
      Number(
        body.duration
      );

    const availability =
      body.availability ===
      "unavailable"
        ? "unavailable"
        : "available";

    if (
      title.length < 2 ||
      englishTitle.length <
        2
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Treatment Name সঠিকভাবে দিন।",
        },
        {
          status: 400,
        }
      );
    }

    if (
      description.length < 5 ||
      fullDescription.length <
        10
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Treatment Description সঠিকভাবে দিন।",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(
        fee
      ) ||
      fee < 0
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Consultation Fee সঠিক নয়।",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isInteger(
        duration
      ) ||
      duration < 5 ||
      duration > 240
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Duration সঠিক নয়।",
        },
        {
          status: 400,
        }
      );
    }

    let slug =
      createSlug(
        englishTitle
      );

    if (!slug) {
      slug =
        `treatment-${Date.now()}`;
    }

    const db =
      await getDb();

    const collection =
      db.collection<TreatmentDocument>(
        "treatments"
      );

    const duplicate =
      await collection.findOne({
        slug,
      });

    if (duplicate) {
      slug =
        `${slug}-${Date.now()
          .toString()
          .slice(-5)}`;
    }

    const now =
      new Date();

    const treatment:
      TreatmentDocument = {
      id:
        Date.now(),

      title,

      englishTitle,

      slug,

      description,

      fullDescription,

      fee,

      duration,

      availability,

      active: true,

      createdAt: now,

      updatedAt: now,
    };

    const result =
      await collection.insertOne(
        treatment
      );

    const created =
      await collection.findOne({
        _id:
          result.insertedId,
      });

    if (!created) {
      throw new Error(
        "Treatment creation failed"
      );
    }

    return NextResponse.json(
      {
        success: true,

        treatment:
          serializeTreatment(
            created
          ),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST Treatment Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Treatment তৈরি করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}