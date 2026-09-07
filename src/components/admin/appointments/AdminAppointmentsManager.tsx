"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  XCircle,
} from "lucide-react";

import {
  useAdminOperationsStore,
  type AdminAppointmentStatus,
} from "@/stores/admin-operations-store";

const statuses: {
  value: AdminAppointmentStatus;
  label: string;
}[] = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "confirmed",
    label: "Confirmed",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

function statusClass(
  status: AdminAppointmentStatus
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
  const appointments =
    useAdminOperationsStore(
      (state) =>
        state.appointments
    );

  const updateAppointmentStatus =
    useAdminOperationsStore(
      (state) =>
        state.updateAppointmentStatus
    );

  const [mounted, setMounted] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredAppointments =
    useMemo(() => {
      let result = [
        ...appointments,
      ];

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result = result.filter(
          (appointment) =>
            appointment
              .appointmentNumber
              .toLowerCase()
              .includes(query) ||
            appointment.patientName
              .toLowerCase()
              .includes(query) ||
            appointment.phone.includes(
              query
            ) ||
            appointment.treatment
              .toLowerCase()
              .includes(query)
        );
      }

      if (
        statusFilter !== "all"
      ) {
        result = result.filter(
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

  if (!mounted) {
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        Appointments Loading...
      </div>
    );
  }

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
          Appointment
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Appointment Management
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Patient Appointment Request Confirm, Complete অথবা Cancel করুন।
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

          <p className="mt-1 text-sm text-gray-500">
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

          <p className="mt-1 text-sm text-gray-500">
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

          <p className="mt-1 text-sm text-gray-500">
            Confirmed
          </p>
        </div>

        <div className="rounded-[22px] bg-[#14532D] p-5 text-white">
          <CheckCircle2 size={21} />

          <p className="font-english mt-4 text-3xl font-bold">
            {completed}
          </p>

          <p className="mt-1 text-sm text-green-100/70">
            Completed
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-7 grid gap-3 rounded-[22px] border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
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
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none"
        >
          <option value="all">
            All Status
          </option>

          {statuses.map(
            (status) => (
              <option
                key={status.value}
                value={status.value}
              >
                {status.label}
              </option>
            )
          )}
        </select>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead className="bg-[#F7FBF8]">
              <tr className="text-left text-xs font-semibold uppercase text-gray-500">
                <th className="px-5 py-4">
                  Appointment
                </th>

                <th className="px-5 py-4">
                  Patient
                </th>

                <th className="px-5 py-4">
                  Treatment
                </th>

                <th className="px-5 py-4">
                  Schedule
                </th>

                <th className="px-5 py-4">
                  Fee
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Manage
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.map(
                (
                  appointment
                ) => (
                  <tr
                    key={
                      appointment.id
                    }
                  >
                    <td className="font-english px-5 py-4 font-bold text-[#14532D]">
                      {
                        appointment.appointmentNumber
                      }
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {
                          appointment.patientName
                        }
                      </p>

                      <p className="font-english mt-1 text-xs text-gray-400">
                        {
                          appointment.phone
                        }
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {
                        appointment.treatment
                      }
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-english text-sm font-semibold">
                        {
                          appointment.date
                        }
                      </p>

                      <p className="font-english mt-1 text-xs text-gray-400">
                        {
                          appointment.time
                        }
                      </p>
                    </td>

                    <td className="px-5 py-4 font-bold">
                      ৳
                      {
                        appointment.fee
                      }
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          appointment.status
                        )}`}
                      >
                        {
                          appointment.status
                        }
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={
                          appointment.status
                        }
                        onChange={(
                          event
                        ) =>
                          updateAppointmentStatus(
                            appointment.id,
                            event
                              .target
                              .value as AdminAppointmentStatus
                          )
                        }
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#14532D]"
                      >
                        {statuses.map(
                          (
                            status
                          ) => (
                            <option
                              key={
                                status.value
                              }
                              value={
                                status.value
                              }
                            >
                              {
                                status.label
                              }
                            </option>
                          )
                        )}
                      </select>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {filteredAppointments
          .length === 0 && (
          <div className="py-14 text-center">
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
    </div>
  );
}