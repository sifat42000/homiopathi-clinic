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
  ensureAppointmentIndexes,
  type AppointmentDocument,
} from "@/lib/db/appointments";

import type {
  AppointmentStatus,
} from "@/types/appointment";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

const allowedTransitions: Record<
  AppointmentStatus,
  AppointmentStatus[]
> = {
  pending: [
    "confirmed",
    "cancelled",
  ],

  confirmed: [
    "completed",
    "cancelled",
  ],

  completed: [],

  cancelled: [],
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
            "Invalid Appointment ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await request.json();

    const newStatus =
      String(
        body.status ?? ""
      ) as AppointmentStatus;

    const validStatuses:
      AppointmentStatus[] = [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
      ];

    if (
      !validStatuses.includes(
        newStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Invalid Appointment Status.",
        },
        {
          status: 400,
        }
      );
    }

    await ensureAppointmentIndexes();

    const db =
      await getDb();

    const appointments =
      db.collection<AppointmentDocument>(
        "appointments"
      );

    const appointment =
      await appointments.findOne({
        _id:
          new ObjectId(id),
      });

    if (!appointment) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Appointment পাওয়া যায়নি।",
        },
        {
          status: 404,
        }
      );
    }

    if (
      !allowedTransitions[
        appointment.status
      ].includes(
        newStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "বর্তমান Status থেকে ওই Status-এ পরিবর্তন করা যাবে না।",
        },
        {
          status: 409,
        }
      );
    }

    const now =
      new Date();

    if (
      newStatus ===
      "cancelled"
    ) {
      /*
        Cancel হলে unique slot lock
        remove → Time আবার available।
      */
      await appointments.updateOne(
        {
          _id:
            new ObjectId(id),

          status:
            appointment.status,
        },

        {
          $set: {
            status:
              newStatus,

            updatedAt: now,
          },

          $unset: {
            activeSlotKey: "",
          },

          $push: {
            statusHistory: {
              status:
                newStatus,

              at: now,
            },
          },
        }
      );
    } else {
      await appointments.updateOne(
        {
          _id:
            new ObjectId(id),

          status:
            appointment.status,
        },

        {
          $set: {
            status:
              newStatus,

            updatedAt: now,
          },

          $push: {
            statusHistory: {
              status:
                newStatus,

              at: now,
            },
          },
        }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Appointment Status Update হয়েছে।",
    });
  } catch (error) {
    console.error(
      "Appointment Status Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Appointment Status Update করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}