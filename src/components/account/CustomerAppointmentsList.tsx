"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  CalendarDays,
  Loader2,
} from "lucide-react";

import type {
  AppointmentStatus,
  DatabaseAppointment,
} from "@/types/appointment";

const labels: Record<
  AppointmentStatus,
  string
> = {
  pending: "Pending",

  confirmed:
    "Confirmed",

  completed:
    "Completed",

  cancelled:
    "Cancelled",
};

export default function CustomerAppointmentsList() {
  const [
    appointments,
    setAppointments,
  ] = useState<
    DatabaseAppointment[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadAppointments =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            "/api/appointments?mine=1",
            {
              cache:
                "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message
          );
        }

        setAppointments(
          data.appointments
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Appointment History load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  if (loading) {
    return (
      <div className="py-16">
        <Loader2
          size={30}
          className="mx-auto animate-spin text-[#14532D]"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (
    appointments.length ===
    0
  ) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center">
        <CalendarDays
          size={40}
          className="mx-auto text-gray-300"
        />

        <h2 className="mt-4 text-xl font-bold">
          কোনো Appointment নেই
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Login থাকা অবস্থায় Book করা Appointment এখানে দেখা যাবে।
        </p>

        <Link
          href="/appointment"
          className="mt-5 inline-flex rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white"
        >
          Appointment নিন
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map(
        (appointment) => (
          <article
            key={
              appointment.id
            }
            className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <p className="font-english font-bold text-[#14532D]">
                  {
                    appointment.appointmentNumber
                  }
                </p>

                <h2 className="mt-3 font-bold text-gray-900">
                  {
                    appointment.treatment.title
                  }
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {
                    appointment.treatment.englishTitle
                  }
                </p>
              </div>

              <div className="sm:text-right">
                <p className="font-english font-bold text-gray-900">
                  {
                    appointment.date
                  }
                </p>

                <p className="font-english mt-1 text-[#14532D]">
                  {
                    appointment.time
                  }
                </p>

                <p className="mt-2 text-xs font-bold uppercase text-gray-500">
                  {
                    labels[
                      appointment.status
                    ]
                  }
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-4 text-sm text-gray-500">
              <span>
                Fee: ৳
                {
                  appointment.treatment.fee
                }
              </span>

              <span>•</span>

              <span>
                {
                  appointment.treatment.duration
                }{" "}
                মিনিট
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-[#F7FBF8] p-4">
              <p className="mb-3 text-xs font-bold uppercase text-gray-400">
                Status History
              </p>

              <div className="space-y-2">
                {appointment.statusHistory.map(
                  (
                    history,
                    index
                  ) => (
                    <div
                      key={`${history.status}-${index}`}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span>
                        {
                          labels[
                            history.status
                          ]
                        }
                      </span>

                      <span className="font-english text-xs text-gray-400">
                        {new Date(
                          history.at
                        ).toLocaleString()}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </article>
        )
      )}
    </div>
  );
}