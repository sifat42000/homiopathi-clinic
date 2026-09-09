import type {
  ObjectId,
} from "mongodb";

import {
  getDb,
} from "@/lib/mongodb";

import type {
  AppointmentPatient,
  AppointmentStatus,
  AppointmentTreatment,
  DatabaseAppointment,
} from "@/types/appointment";

export type AppointmentDocument = {
  _id?: ObjectId;

  appointmentNumber:
    string;

  userId?:
    string | null;

  treatment:
    AppointmentTreatment;

  patient:
    AppointmentPatient;

  date: string;

  time: string;

  /*
    Cancelled নয় এমন Appointment
    এই unique key ধরে slot lock করবে।
  */
  activeSlotKey?: string;

  note?: string;

  status:
    AppointmentStatus;

  statusHistory: {
    status:
      AppointmentStatus;

    at: Date;
  }[];

  createdAt: Date;

  updatedAt: Date;
};

declare global {
  var _appointmentIndexesPromise:
    | Promise<void>
    | undefined;
}

export async function ensureAppointmentIndexes() {
  if (
    global._appointmentIndexesPromise
  ) {
    return global._appointmentIndexesPromise;
  }

  global._appointmentIndexesPromise =
    (async () => {
      const db =
        await getDb();

      const collection =
        db.collection<AppointmentDocument>(
          "appointments"
        );

      await collection.createIndex(
        {
          appointmentNumber: 1,
        },
        {
          unique: true,

          name:
            "unique_appointment_number",
        }
      );

      await collection.createIndex(
        {
          activeSlotKey: 1,
        },
        {
          unique: true,

          sparse: true,

          name:
            "unique_active_appointment_slot",
        }
      );

      await collection.createIndex(
        {
          userId: 1,

          createdAt: -1,
        },
        {
          name:
            "user_appointments",
        }
      );

      await collection.createIndex(
        {
          date: 1,

          time: 1,
        },
        {
          name:
            "appointment_schedule",
        }
      );
    })();

  return global
    ._appointmentIndexesPromise;
}

export function serializeAppointment(
  appointment:
    AppointmentDocument & {
      _id: ObjectId;
    }
): DatabaseAppointment {
  return {
    id:
      appointment._id.toString(),

    appointmentNumber:
      appointment.appointmentNumber,

    userId:
      appointment.userId,

    treatment:
      appointment.treatment,

    patient:
      appointment.patient,

    date:
      appointment.date,

    time:
      appointment.time,

    note:
      appointment.note,

    status:
      appointment.status,

    statusHistory:
      appointment.statusHistory.map(
        (history) => ({
          status:
            history.status,

          at:
            history.at.toISOString(),
        })
      ),

    createdAt:
      appointment.createdAt.toISOString(),

    updatedAt:
      appointment.updatedAt.toISOString(),
  };
}