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
  APPOINTMENT_TIME_SLOTS,
  getAvailableTimeSlots,
  isPastAppointmentDate,
  isValidDateString,
} from "@/lib/appointment-config";

import {
  ensureAppointmentIndexes,
  serializeAppointment,
  type AppointmentDocument,
} from "@/lib/db/appointments";

import {
  getBookableTreatmentBySlug,
} from "@/lib/db/treatments";

import {
  getWebsiteSettings,
} from "@/lib/db/settings";

class AppointmentRequestError extends Error {
  status: number;

  constructor(
    message: string,
    status = 400
  ) {
    super(message);

    this.status =
      status;
  }
}

export async function GET(
  request: NextRequest
) {
  try {
    await ensureAppointmentIndexes();

    const adminMode =
      request.nextUrl.searchParams.get(
        "admin"
      ) === "1";

    const mineMode =
      request.nextUrl.searchParams.get(
        "mine"
      ) === "1";

    let filter:
      Record<
        string,
        unknown
      >;

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

      filter = {};
    } else if (mineMode) {
      const session =
        await getApiSession(
          request.headers
        );

      if (!session) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Login required.",
          },
          {
            status: 401,
          }
        );
      }

      filter = {
        userId:
          session.user.id,
      };
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request.",
        },
        {
          status: 400,
        }
      );
    }

    const db =
      await getDb();

    const appointments =
      await db
        .collection<AppointmentDocument>(
          "appointments"
        )
        .find(filter)
        .sort({
          createdAt: -1,
        })
        .toArray();

    return NextResponse.json({
      success: true,

      appointments:
        appointments.map(
          (appointment) =>
            serializeAppointment(
              appointment
            )
        ),
    });
  } catch (error) {
    console.error(
      "GET Appointments Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Appointments load করা যায়নি।",
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
    const settings =
      await getWebsiteSettings();

    if (
      !settings.appointmentEnabled
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "বর্তমানে Appointment Booking সাময়িকভাবে বন্ধ আছে।",
        },
        {
          status: 503,
        }
      );
    }

    await ensureAppointmentIndexes();

    const body =
      await request.json();

    const treatmentSlug =
      String(
        body.treatmentSlug ??
          ""
      ).trim();

    const treatment =
      await getBookableTreatmentBySlug(
        treatmentSlug
      );

    if (!treatment) {
      throw new AppointmentRequestError(
        "Treatment পাওয়া যায়নি অথবা বর্তমানে Appointment নেওয়া যাচ্ছে না।",
        404
      );
    }

    const date =
      String(
        body.date ?? ""
      ).trim();

    if (
      !isValidDateString(
        date
      ) ||
      isPastAppointmentDate(
        date
      )
    ) {
      throw new AppointmentRequestError(
        "সঠিক Appointment Date নির্বাচন করুন।"
      );
    }

    const time =
      String(
        body.time ?? ""
      ).trim();

    if (
      !APPOINTMENT_TIME_SLOTS.includes(
        time as
          (typeof APPOINTMENT_TIME_SLOTS)[number]
      )
    ) {
      throw new AppointmentRequestError(
        "সঠিক Time Slot নির্বাচন করুন।"
      );
    }

    if (
      !getAvailableTimeSlots(
        date,
        []
      ).includes(
        time as
          (typeof APPOINTMENT_TIME_SLOTS)[number]
      )
    ) {
      throw new AppointmentRequestError(
        "এই Time Slot এখন আর available নয়।",
        409
      );
    }

    const name =
      String(
        body.patient?.name ??
          ""
      ).trim();

    const phone =
      String(
        body.patient?.phone ??
          ""
      )
        .replace(
          /\D/g,
          ""
        )
        .trim();

    if (
      name.length < 2
    ) {
      throw new AppointmentRequestError(
        "Patient Name সঠিকভাবে দিন।"
      );
    }

    if (
      !/^01[3-9]\d{8}$/.test(
        phone
      )
    ) {
      throw new AppointmentRequestError(
        "সঠিক Mobile Number দিন।"
      );
    }

    let age:
      number | undefined;

    if (
      body.patient?.age !==
        undefined &&
      body.patient?.age !==
        ""
    ) {
      age =
        Number(
          body.patient.age
        );

      if (
        !Number.isInteger(
          age
        ) ||
        age < 0 ||
        age > 120
      ) {
        throw new AppointmentRequestError(
          "Age সঠিক নয়।"
        );
      }
    }

    const gender =
      String(
        body.patient?.gender ??
          ""
      ).trim();

    const note =
      String(
        body.note ?? ""
      )
        .trim()
        .slice(
          0,
          500
        );

    const session =
      await getApiSession(
        request.headers
      );

    const db =
      await getDb();

    const appointments =
      db.collection<AppointmentDocument>(
        "appointments"
      );

    const objectId =
      new ObjectId();

    const appointmentNumber =
      `APT-${objectId
        .toHexString()
        .slice(-10)
        .toUpperCase()}`;

    const activeSlotKey =
      `${date}|${time}`;

    const now =
      new Date();

    const appointment:
      AppointmentDocument & {
        _id: ObjectId;
      } = {
      _id:
        objectId,

      appointmentNumber,

      userId:
        session?.user.id ??
        null,

      treatment: {
        slug:
          treatment.slug,

        title:
          treatment.title,

        englishTitle:
          treatment.englishTitle,

        fee:
          treatment.fee,

        duration:
          treatment.duration,
      },

      patient: {
        name,

        phone,

        ...(age !==
        undefined
          ? {
              age,
            }
          : {}),

        ...(gender
          ? {
              gender,
            }
          : {}),
      },

      date,

      time,

      activeSlotKey,

      ...(note
        ? {
            note,
          }
        : {}),

      status:
        "pending",

      statusHistory: [
        {
          status:
            "pending",

          at: now,
        },
      ],

      createdAt: now,

      updatedAt: now,
    };

    try {
      await appointments.insertOne(
        appointment
      );
    } catch (error) {
      if (
        error &&
        typeof error ===
          "object" &&
        "code" in error &&
        error.code === 11000
      ) {
        return NextResponse.json(
          {
            success: false,

            message:
              "এই Time Slot-টি অন্য একজন Book করেছেন। অন্য Slot নির্বাচন করুন।",
          },
          {
            status: 409,
          }
        );
      }

      throw error;
    }

    return NextResponse.json(
      {
        success: true,

        appointment:
          serializeAppointment(
            appointment
          ),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST Appointment Error:",
      error
    );

    if (
      error instanceof
      AppointmentRequestError
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            error.message,
        },
        {
          status:
            error.status,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,

        message:
          "Appointment Book করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}