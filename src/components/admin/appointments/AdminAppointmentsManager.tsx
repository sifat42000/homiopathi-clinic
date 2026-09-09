"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Search,
  XCircle,
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

const nextStatuses: Record<
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

function statusClass(
  status:
    AppointmentStatus
) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700";

    case "confirmed":
      return "bg-blue-50 text-blue-700";

    case "completed":
      return "bg-green-50 text-green-700";

    case "cancelled":
      return "bg-red-50 text-red-600";
  }
}

export default function AdminAppointmentsManager() {
  const [
    appointments,
    setAppointments,
  ] = useState<
    DatabaseAppointment[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [
    updatingId,
    setUpdatingId,
  ] = useState<
    string | null
  >(null);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [error, setError] =
    useState("");

  const loadAppointments =
    useCallback(async () => {
      try {
        setLoading(true);

        setError("");

        const response =
          await fetch(
            "/api/appointments?admin=1",
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
            : "Appointments load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const filtered =
    useMemo(() => {
      let result = [
        ...appointments,
      ];

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (appointment) =>
              appointment.appointmentNumber
                .toLowerCase()
                .includes(
                  query
                ) ||
              appointment.patient.name
                .toLowerCase()
                .includes(
                  query
                ) ||
              appointment.patient.phone.includes(
                query
              ) ||
              appointment.treatment.title
                .toLowerCase()
                .includes(
                  query
                )
          );
      }

      if (
        statusFilter !==
        "all"
      ) {
        result =
          result.filter(
            (appointment) =>
              appointment.status ===
              statusFilter
          );
      }

      return result;
    }, [
      appointments,
      search,
      statusFilter,
    ]);

  const updateStatus =
    async (
      appointment:
        DatabaseAppointment,

      status:
        AppointmentStatus
    ) => {
      const confirmed =
        window.confirm(
          `${appointment.appointmentNumber} → ${labels[status]} করতে চান?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setUpdatingId(
          appointment.id
        );

        setError("");

        const response =
          await fetch(
            `/api/appointments/${appointment.id}`,
            {
              method:
                "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  status,
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message
          );
        }

        await loadAppointments();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Status Update করা যায়নি।"
        );
      } finally {
        setUpdatingId(
          null
        );
      }
    };

  const pending =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "pending"
    ).length;

  const confirmed =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "confirmed"
    ).length;

  const completed =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "completed"
    ).length;

  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-[#15803D]">
          Real Appointment
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Appointment Management
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          সব Appointment এখন MongoDB থেকে Load হচ্ছে।
        </p>
      </div>

      {/* Stats */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <CalendarDays
            size={21}
            className="text-[#14532D]"
          />

          <p className="font-english mt-4 text-3xl font-bold">
            {
              appointments.length
            }
          </p>

          <p className="text-sm text-gray-500">
            Total
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <Clock3
            size={21}
            className="text-amber-600"
          />

          <p className="font-english mt-4 text-3xl font-bold">
            {pending}
          </p>

          <p className="text-sm text-gray-500">
            Pending
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <CalendarCheck2
            size={21}
            className="text-blue-600"
          />

          <p className="font-english mt-4 text-3xl font-bold">
            {confirmed}
          </p>

          <p className="text-sm text-gray-500">
            Confirmed
          </p>
        </div>

        <div className="rounded-[22px] bg-[#14532D] p-5 text-white">
          <CheckCircle2
            size={21}
          />

          <p className="font-english mt-4 text-3xl font-bold">
            {completed}
          </p>

          <p className="text-sm text-green-100/70">
            Completed
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mt-7 grid gap-3 rounded-[22px] border border-gray-100 bg-white p-4 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Appointment, Patient, Phone বা Treatment..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#14532D]"
          />
        </div>

        <select
          value={
            statusFilter
          }
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
        >
          <option value="all">
            All Status
          </option>

          {Object.entries(
            labels
          ).map(
            ([
              value,
              label,
            ]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            )
          )}
        </select>
      </div>

      {loading ? (
        <div className="py-20">
          <Loader2
            size={30}
            className="mx-auto animate-spin text-[#14532D]"
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map(
            (appointment) => (
              <article
                key={
                  appointment.id
                }
                className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-english font-bold text-[#14532D]">
                        {
                          appointment.appointmentNumber
                        }
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          appointment.status
                        )}`}
                      >
                        {
                          labels[
                            appointment.status
                          ]
                        }
                      </span>
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-gray-900">
                      {
                        appointment.patient.name
                      }
                    </h2>

                    <p className="font-english mt-1 text-sm text-gray-500">
                      {
                        appointment.patient.phone
                      }
                    </p>

                    <p className="mt-3 font-semibold text-gray-700">
                      {
                        appointment.treatment.title
                      }
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {
                        appointment.treatment.englishTitle
                      }
                    </p>
                  </div>

                  <div className="lg:text-right">
                    <p className="font-english text-lg font-bold text-gray-900">
                      {
                        appointment.date
                      }
                    </p>

                    <p className="font-english mt-1 text-lg font-semibold text-[#14532D]">
                      {
                        appointment.time
                      }
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Fee: ৳
                      {
                        appointment.treatment.fee
                      }
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {
                        appointment.treatment.duration
                      }{" "}
                      মিনিট
                    </p>
                  </div>
                </div>

                {(appointment.patient.age ||
                  appointment.patient.gender ||
                  appointment.note) && (
                  <div className="mt-5 rounded-2xl bg-[#F7FBF8] p-4 text-sm text-gray-600">
                    {appointment.patient.age !==
                      undefined && (
                      <p>
                        Age:{" "}
                        {
                          appointment.patient.age
                        }
                      </p>
                    )}

                    {appointment.patient.gender && (
                      <p className="mt-1">
                        Gender:{" "}
                        {
                          appointment.patient.gender
                        }
                      </p>
                    )}

                    {appointment.note && (
                      <p className="mt-2 leading-7">
                        Note:{" "}
                        {
                          appointment.note
                        }
                      </p>
                    )}
                  </div>
                )}

                {/* Status History */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {appointment.statusHistory.map(
                    (
                      history,
                      index
                    ) => (
                      <span
                        key={`${history.status}-${index}`}
                        className="rounded-full bg-gray-50 px-3 py-1.5 text-xs text-gray-500"
                      >
                        {
                          labels[
                            history.status
                          ]
                        }
                      </span>
                    )
                  )}
                </div>

                {nextStatuses[
                  appointment.status
                ].length >
                  0 && (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                    {nextStatuses[
                      appointment.status
                    ].map(
                      (status) => (
                        <button
                          key={
                            status
                          }
                          type="button"
                          disabled={
                            updatingId ===
                            appointment.id
                          }
                          onClick={() =>
                            updateStatus(
                              appointment,
                              status
                            )
                          }
                          className={`rounded-xl px-4 py-2.5 text-xs font-semibold disabled:opacity-50 ${
                            status ===
                            "cancelled"
                              ? "bg-red-50 text-red-600"
                              : "bg-[#14532D] text-white"
                          }`}
                        >
                          {updatingId ===
                          appointment.id
                            ? "Updating..."
                            : labels[
                                status
                              ]}
                        </button>
                      )
                    )}
                  </div>
                )}
              </article>
            )
          )}
        </div>
      )}

      {!loading &&
        filtered.length ===
          0 && (
          <div className="mt-6 rounded-[24px] border border-dashed border-gray-200 bg-white py-16 text-center">
            <XCircle
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm text-gray-400">
              কোনো Appointment পাওয়া যায়নি।
            </p>
          </div>
        )}
    </div>
  );
}