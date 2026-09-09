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
  TreatmentDocument,
} from "@/lib/db/treatments";

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
            "Invalid Treatment ID.",
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

    const collection =
      db.collection<TreatmentDocument>(
        "treatments"
      );

    const treatment =
      await collection.findOne({
        _id:
          new ObjectId(id),
      });

    if (!treatment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Treatment পাওয়া যায়নি।",
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

    if (
      typeof body.title ===
      "string"
    ) {
      const title =
        body.title.trim();

      if (
        title.length < 2
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Treatment Name সঠিক নয়।",
          },
          {
            status: 400,
          }
        );
      }

      update.title =
        title;
    }

    if (
      typeof body.englishTitle ===
      "string"
    ) {
      const englishTitle =
        body.englishTitle.trim();

      if (
        englishTitle.length <
        2
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "English Treatment Name সঠিক নয়।",
          },
          {
            status: 400,
          }
        );
      }

      update.englishTitle =
        englishTitle;
    }

    if (
      typeof body.description ===
      "string"
    ) {
      update.description =
        body.description.trim();
    }

    if (
      typeof body.fullDescription ===
      "string"
    ) {
      update.fullDescription =
        body.fullDescription.trim();
    }

    if (
      body.fee !==
      undefined
    ) {
      const fee =
        Number(body.fee);

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
              "Fee সঠিক নয়।",
          },
          {
            status: 400,
          }
        );
      }

      update.fee =
        fee;
    }

    if (
      body.duration !==
      undefined
    ) {
      const duration =
        Number(
          body.duration
        );

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

      update.duration =
        duration;
    }

    if (
      body.availability !==
      undefined
    ) {
      if (
        body.availability !==
          "available" &&
        body.availability !==
          "unavailable"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid Availability.",
          },
          {
            status: 400,
          }
        );
      }

      update.availability =
        body.availability;
    }

    if (
      typeof body.active ===
      "boolean"
    ) {
      update.active =
        body.active;
    }

    await collection.updateOne(
      {
        _id:
          new ObjectId(id),
      },
      {
        $set: update,
      }
    );

    return NextResponse.json({
      success: true,

      message:
        "Treatment Update হয়েছে।",
    });
  } catch (error) {
    console.error(
      "PATCH Treatment Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Treatment Update করা যায়নি।",
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
            "Invalid Treatment ID.",
        },
        {
          status: 400,
        }
      );
    }

    const db =
      await getDb();

    const treatments =
      db.collection<TreatmentDocument>(
        "treatments"
      );

    const treatment =
      await treatments.findOne({
        _id:
          new ObjectId(id),
      });

    if (!treatment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Treatment পাওয়া যায়নি।",
        },
        {
          status: 404,
        }
      );
    }

    const usedAppointment =
      await db
        .collection(
          "appointments"
        )
        .findOne({
          "treatment.slug":
            treatment.slug,
        });

    if (usedAppointment) {
      return NextResponse.json(
        {
          success: false,

          message:
            "এই Treatment-এর Appointment History আছে। Delete না করে Inactive করুন।",
        },
        {
          status: 409,
        }
      );
    }

    await treatments.deleteOne({
      _id:
        new ObjectId(id),
    });

    return NextResponse.json({
      success: true,

      message:
        "Treatment Delete হয়েছে।",
    });
  } catch (error) {
    console.error(
      "DELETE Treatment Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Treatment Delete করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}