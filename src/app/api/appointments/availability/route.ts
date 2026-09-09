import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getDb,
} from "@/lib/mongodb";

import {
  ensureAppointmentIndexes,
  type AppointmentDocument,
} from "@/lib/db/appointments";

import {
  getAvailableTimeSlots,
  isPastAppointmentDate,
  isValidDateString,
} from "@/lib/appointment-config";

import {
  getBookableTreatmentBySlug,
} from "@/lib/db/treatments";

import {
  getWebsiteSettings,
} from "@/lib/db/settings";

export async function GET(
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
            "বর্তমানে Appointment Booking বন্ধ আছে।",
        },
        {
          status: 503,
        }
      );
    }

    const date =
      String(
        request.nextUrl.searchParams.get(
          "date"
        ) ?? ""
      ).trim();

    const treatmentSlug =
      String(
        request.nextUrl.searchParams.get(
          "treatment"
        ) ?? ""
      ).trim();

    if (
      !isValidDateString(
        date
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "সঠিক Date নির্বাচন করুন।",
        },
        {
          status: 400,
        }
      );
    }

    if (
      isPastAppointmentDate(
        date
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Past Date-এ Appointment নেওয়া যাবে না।",
        },
        {
          status: 400,
        }
      );
    }

    const treatment =
      await getBookableTreatmentBySlug(
        treatmentSlug
      );

    if (!treatment) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Treatment পাওয়া যায়নি অথবা Appointment unavailable.",
        },
        {
          status: 404,
        }
      );
    }

    await ensureAppointmentIndexes();

    const db =
      await getDb();

    const booked =
      await db
        .collection<AppointmentDocument>(
          "appointments"
        )
        .find(
          {
            date,

            activeSlotKey: {
              $exists: true,
            },
          },
          {
            projection: {
              time: 1,
            },
          }
        )
        .toArray();

    const bookedTimes =
      booked.map(
        (appointment) =>
          appointment.time
      );

    const availableSlots =
      getAvailableTimeSlots(
        date,
        bookedTimes
      );

    return NextResponse.json({
      success: true,

      treatment,

      date,

      availableSlots,
    });
  } catch (error) {
    console.error(
      "Appointment Availability Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Available Slot load করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}