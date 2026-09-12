"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Phone,
  Stethoscope,
  UserRound,
} from "lucide-react";

import type {
  DatabaseTreatment,
} from "@/types/treatment";

function getLocalDateString() {
  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}

type AppointmentBookingProps = {
  initialTreatmentSlug?: string;
};

export default function AppointmentBooking({
  initialTreatmentSlug,
}: AppointmentBookingProps) {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const [
    treatments,
    setTreatments,
  ] = useState<
    DatabaseTreatment[]
  >([]);

  const [
    treatmentSlug,
    setTreatmentSlug,
  ] = useState("");

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [
    availableSlots,
    setAvailableSlots,
  ] = useState<string[]>(
    []
  );

  const [
    treatmentsLoading,
    setTreatmentsLoading,
  ] = useState(true);

  const [
    slotsLoading,
    setSlotsLoading,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadTreatments =
      async () => {
        try {
          const response =
            await fetch(
              "/api/treatments",
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

          const bookable =
            (
              data.treatments ??
              []
            ).filter(
              (
                treatment:
                  DatabaseTreatment
              ) =>
                treatment.availability ===
                "available"
            );

          setTreatments(
            bookable
          );

          const requested =
            initialTreatmentSlug ??
            searchParams.get("treatment");

          const requestedExists =
            bookable.some(
              (
                treatment:
                  DatabaseTreatment
              ) =>
                treatment.slug ===
                requested
            );

          setTreatmentSlug(
            requestedExists
              ? requested
              : bookable[0]
                  ?.slug ??
                  ""
          );
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Treatment load করা যায়নি।"
          );
        } finally {
          setTreatmentsLoading(
            false
          );
        }
      };

    loadTreatments();
  }, [searchParams]);

  const selectedTreatment =
    useMemo(
      () =>
        treatments.find(
          (treatment) =>
            treatment.slug ===
            treatmentSlug
        ),
      [
        treatments,
        treatmentSlug,
      ]
    );

  useEffect(() => {
    setTime("");

    setAvailableSlots(
      []
    );

    if (
      !date ||
      !treatmentSlug
    ) {
      return;
    }

    const loadSlots =
      async () => {
        try {
          setSlotsLoading(
            true
          );

          const response =
            await fetch(
              `/api/appointments/availability?date=${encodeURIComponent(
                date
              )}&treatment=${encodeURIComponent(
                treatmentSlug
              )}`,
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

          setAvailableSlots(
            data.availableSlots ??
              []
          );
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Slot load করা যায়নি।"
          );
        } finally {
          setSlotsLoading(
            false
          );
        }
      };

    loadSlots();
  }, [
    date,
    treatmentSlug,
  ]);

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!time) {
      setError(
        "Time Slot নির্বাচন করুন।"
      );

      return;
    }

    const formData =
      new FormData(
        event.currentTarget
      );

    try {
      setSubmitting(true);

      setError("");

      const response =
        await fetch(
          "/api/appointments",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                treatmentSlug,

                date,

                time,

                patient: {
                  name:
                    formData.get(
                      "name"
                    ),

                  phone:
                    formData.get(
                      "phone"
                    ),

                  age:
                    formData.get(
                      "age"
                    ),

                  gender:
                    formData.get(
                      "gender"
                    ),
                },

                note:
                  formData.get(
                    "note"
                  ),
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

      router.push(
        `/appointment-success?appointment=${encodeURIComponent(
          data.appointment
            .appointmentNumber
        )}`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Appointment করা যায়নি।"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (
    treatmentsLoading
  ) {
    return (
      <div className="py-20">
        <Loader2
          size={30}
          className="mx-auto animate-spin text-[#14532D]"
        />
      </div>
    );
  }

  if (
    treatments.length === 0
  ) {
    return (
      <div className="rounded-[26px] border border-dashed border-gray-200 bg-white p-10 text-center">
        বর্তমানে Appointment-এর জন্য কোনো Treatment Available নেই।
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <h1 className="text-3xl font-bold">
        Appointment Book করুন
      </h1>

      <div className="mt-7">
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Stethoscope
            size={17}
          />

          Treatment
        </label>

        <select
          value={
            treatmentSlug
          }
          onChange={(e) =>
            setTreatmentSlug(
              e.target.value
            )
          }
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
        >
          {treatments.map(
            (treatment) => (
              <option
                key={
                  treatment.databaseId
                }
                value={
                  treatment.slug
                }
              >
                {
                  treatment.title
                }{" "}
                — ৳
                {
                  treatment.fee
                }
              </option>
            )
          )}
        </select>

        {selectedTreatment && (
          <div className="mt-3 rounded-xl bg-[#F7FBF8] p-4 text-sm">
            Fee:{" "}
            <strong>
              ৳
              {
                selectedTreatment.fee
              }
            </strong>{" "}
            • Duration:{" "}
            <strong>
              {
                selectedTreatment.duration
              }{" "}
              মিনিট
            </strong>
          </div>
        )}
      </div>

      <div className="mt-6">
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <CalendarDays
            size={17}
          />

          Date
        </label>

        <input
          type="date"
          required
          min={
            getLocalDateString()
          }
          value={date}
          onChange={(e) =>
            setDate(
              e.target.value
            )
          }
          className="w-full rounded-xl border border-gray-200 px-4 py-3"
        />
      </div>

      {date && (
        <div className="mt-6">
          <label className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Clock3
              size={17}
            />

            Available Time
          </label>

          {slotsLoading ? (
            <Loader2
              className="animate-spin text-[#14532D]"
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {availableSlots.map(
                (slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() =>
                      setTime(
                        slot
                      )
                    }
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold ${
                      time === slot
                        ? "border-[#14532D] bg-[#14532D] text-white"
                        : "border-gray-200"
                    }`}
                  >
                    {slot}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <UserRound
              size={16}
            />

            Patient Name
          </label>

          <input
            name="name"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Phone
              size={16}
            />

            Mobile
          </label>

          <input
            name="phone"
            required
            maxLength={11}
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
          />
        </div>

        <input
          name="age"
          type="number"
          min="0"
          max="120"
          placeholder="Age"
          className="rounded-xl border border-gray-200 px-4 py-3"
        />

        <select
          name="gender"
          defaultValue=""
          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
        >
          <option value="">
            Gender
          </option>

          <option value="male">
            Male
          </option>

          <option value="female">
            Female
          </option>

          <option value="other">
            Other
          </option>
        </select>

        <textarea
          name="note"
          rows={3}
          maxLength={500}
          placeholder="Optional Note"
          className="resize-none rounded-xl border border-gray-200 px-4 py-3 sm:col-span-2"
        />
      </div>

      {error && (
        <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={
          submitting ||
          !date ||
          !time
        }
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-4 font-semibold text-white disabled:opacity-50"
      >
        {submitting ? (
          <Loader2
            size={18}
            className="animate-spin"
          />
        ) : (
          <CheckCircle2
            size={18}
          />
        )}

        Appointment Confirm করুন
      </button>
    </form>
  );
}