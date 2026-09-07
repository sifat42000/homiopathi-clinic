"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Phone,
  RotateCcw,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { appointmentSlots } from "@/data/appointment";
import { treatments } from "@/data/treatments";

import { useAppointmentStore } from "@/stores/appointment-store";

import type { FrontendAppointment } from "@/types/appointment";

type AppointmentBookingProps = {
  initialTreatmentSlug?: string;
};

function getTodayDateString() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function AppointmentBooking({
  initialTreatmentSlug,
}: AppointmentBookingProps) {
  const validInitialTreatment =
    treatments.some(
      (item) =>
        item.slug === initialTreatmentSlug
    )
      ? initialTreatmentSlug
      : "";

  const [treatmentSlug, setTreatmentSlug] =
    useState(validInitialTreatment ?? "");

  const [appointmentDate, setAppointmentDate] =
    useState("");

  const [selectedTime, setSelectedTime] =
    useState("");

  const [error, setError] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const setLastAppointment =
    useAppointmentStore(
      (state) =>
        state.setLastAppointment
    );

  const lastAppointment =
    useAppointmentStore(
      (state) =>
        state.lastAppointment
    );

  const clearLastAppointment =
    useAppointmentStore(
      (state) =>
        state.clearLastAppointment
    );

  const selectedTreatment =
    useMemo(() => {
      return treatments.find(
        (item) =>
          item.slug === treatmentSlug
      );
    }, [treatmentSlug]);

  const today =
    getTodayDateString();

  const createAppointmentNumber = () => {
    const timestamp = Date.now()
      .toString()
      .slice(-8);

    return `APT-${timestamp}`;
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!selectedTreatment) {
      setError(
        "প্রথমে একটি Consultation Service নির্বাচন করুন।"
      );

      return;
    }

    if (!appointmentDate) {
      setError(
        "Appointment-এর তারিখ নির্বাচন করুন।"
      );

      return;
    }

    if (!selectedTime) {
      setError(
        "একটি Time Slot নির্বাচন করুন।"
      );

      return;
    }

    const formData =
      new FormData(event.currentTarget);

    const name = String(
      formData.get("name") ?? ""
    ).trim();

    const phone = String(
      formData.get("phone") ?? ""
    ).trim();

    const age = String(
      formData.get("age") ?? ""
    ).trim();

    const gender = String(
      formData.get("gender") ?? ""
    ).trim();

    const note = String(
      formData.get("note") ?? ""
    ).trim();

    const phoneRegex =
      /^01[3-9]\d{8}$/;

    if (!phoneRegex.test(phone)) {
      setError(
        "সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন। যেমন: 017XXXXXXXX"
      );

      return;
    }

    const appointment: FrontendAppointment = {
      appointmentNumber:
        createAppointmentNumber(),

      treatmentSlug:
        selectedTreatment.slug,

      treatmentTitle:
        selectedTreatment.title,

      consultationFee:
        selectedTreatment.fee,

      duration:
        selectedTreatment.duration,

      date: appointmentDate,

      time: selectedTime,

      patient: {
        name,
        phone,
        age: age || undefined,
        gender:
          gender || undefined,
      },

      note:
        note || undefined,

      status: "pending",

      createdAt:
        new Date().toISOString(),
    };

    setLastAppointment(
      appointment
    );

    setSubmitted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNewAppointment = () => {
    clearLastAppointment();

    setSubmitted(false);
    setTreatmentSlug("");
    setAppointmentDate("");
    setSelectedTime("");
    setError("");
  };

  /* =========================
     Success Screen
  ========================= */

  if (
    submitted &&
    lastAppointment
  ) {
    return (
      <div className="mx-auto max-w-4xl">
        
        {/* Success */}
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#E7F5EA]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#14532D] text-white">
              <Check
                size={34}
                strokeWidth={2.3}
              />
            </div>
          </div>

          <p className="mt-6 text-sm font-semibold text-[#15803D]">
            Appointment Request Submitted
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            আপনার Appointment Request পাওয়া গেছে
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-500">
            Backend যুক্ত করার পর Doctor/Admin এখান থেকে Appointment Confirm
            করতে পারবেন এবং Customer Notification পাঠানো হবে।
          </p>

          <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-2xl border border-green-100 bg-white px-5 py-4 shadow-sm">
            <CalendarDays
              size={21}
              className="text-[#14532D]"
            />

            <div className="text-left">
              <p className="text-xs text-gray-400">
                Appointment Number
              </p>

              <p className="font-english text-lg font-bold text-[#14532D]">
                {
                  lastAppointment.appointmentNumber
                }
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          
          {/* Appointment */}
          <div className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Appointment Details
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs text-gray-400">
                  Consultation
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {
                    lastAppointment.treatmentTitle
                  }
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays
                  size={18}
                  className="mt-0.5 text-[#14532D]"
                />

                <div>
                  <p className="text-xs text-gray-400">
                    Date
                  </p>

                  <p className="font-english mt-1 font-semibold text-gray-700">
                    {
                      lastAppointment.date
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock3
                  size={18}
                  className="mt-0.5 text-[#14532D]"
                />

                <div>
                  <p className="text-xs text-gray-400">
                    Time
                  </p>

                  <p className="font-english mt-1 font-semibold text-gray-700">
                    {
                      lastAppointment.time
                    }
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Consultation Fee
                </p>

                <p className="mt-1 text-2xl font-bold text-[#14532D]">
                  ৳
                  {
                    lastAppointment.consultationFee
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Patient */}
          <div className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Patient Information
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-3">
                <UserRound
                  size={18}
                  className="mt-0.5 text-[#14532D]"
                />

                <div>
                  <p className="text-xs text-gray-400">
                    নাম
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {
                      lastAppointment.patient.name
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  size={18}
                  className="mt-0.5 text-[#14532D]"
                />

                <div>
                  <p className="text-xs text-gray-400">
                    Mobile
                  </p>

                  <p className="font-english mt-1 font-semibold text-gray-800">
                    {
                      lastAppointment.patient.phone
                    }
                  </p>
                </div>
              </div>

              {lastAppointment.patient.age && (
                <div>
                  <p className="text-xs text-gray-400">
                    বয়স
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {
                      lastAppointment.patient.age
                    }
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-400">
                  Status
                </p>

                <span className="mt-2 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Pending Confirmation
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={
              handleNewAppointment
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-[#14532D] bg-white px-6 py-3.5 font-semibold text-[#14532D]"
          >
            <RotateCcw size={17} />

            নতুন Appointment
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white"
          >
            হোমে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  /* =========================
     Booking Form
  ========================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="grid items-start gap-8 lg:grid-cols-[1fr_380px]"
    >
      
      {/* Form */}
      <div className="space-y-6">
        
        {/* Treatment */}
        <section className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="font-english text-xs font-semibold uppercase tracking-[0.12em] text-[#15803D]">
            Step 01
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            Consultation নির্বাচন করুন
          </h2>

          <div className="mt-6">
            <label
              htmlFor="treatment"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              চিকিৎসা সেবা *
            </label>

            <select
              id="treatment"
              value={treatmentSlug}
              onChange={(event) => {
                setTreatmentSlug(
                  event.target.value
                );
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#14532D]"
            >
              <option value="">
                Consultation নির্বাচন করুন
              </option>

              {treatments.map(
                (treatment) => (
                  <option
                    key={treatment.id}
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
          </div>

          {selectedTreatment && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-[#F7FBF8] p-4">
                <p className="text-xs text-gray-400">
                  Consultation Fee
                </p>

                <p className="mt-1 text-lg font-bold text-[#14532D]">
                  ৳
                  {
                    selectedTreatment.fee
                  }
                </p>
              </div>

              <div className="rounded-xl bg-[#F7FBF8] p-4">
                <p className="text-xs text-gray-400">
                  সময়
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {
                    selectedTreatment.duration
                  }{" "}
                  মিনিট
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Date */}
        <section className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="font-english text-xs font-semibold uppercase tracking-[0.12em] text-[#15803D]">
            Step 02
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            Date ও Time নির্বাচন করুন
          </h2>

          <div className="mt-6">
            <label
              htmlFor="appointmentDate"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Appointment Date *
            </label>

            <input
              id="appointmentDate"
              type="date"
              min={today}
              value={
                appointmentDate
              }
              onChange={(event) => {
                setAppointmentDate(
                  event.target.value
                );

                setSelectedTime("");
              }}
              className="font-english w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#14532D]"
            />
          </div>

          {/* Slots */}
          <div className="mt-7">
            <p className="mb-3 text-sm font-semibold text-gray-700">
              Time Slot *
            </p>

            {!appointmentDate ? (
              <div className="rounded-xl bg-[#F7FBF8] px-4 py-4 text-sm text-gray-500">
                আগে Appointment Date নির্বাচন করুন।
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {appointmentSlots.map(
                  (slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() =>
                        setSelectedTime(
                          slot
                        )
                      }
                      className={`rounded-xl border px-3 py-3 font-english text-sm font-semibold transition ${
                        selectedTime ===
                        slot
                          ? "border-[#14532D] bg-[#14532D] text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50"
                      }`}
                    >
                      {slot}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* Patient */}
        <section className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="font-english text-xs font-semibold uppercase tracking-[0.12em] text-[#15803D]">
            Step 03
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            Patient Information
          </h2>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                রোগীর নাম *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="পূর্ণ নাম লিখুন"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[#14532D]"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                মোবাইল নম্বর *
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={11}
                required
                placeholder="01XXXXXXXXX"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[#14532D]"
              />
            </div>

            <div>
              <label
                htmlFor="age"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                বয়স{" "}
                <span className="font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <input
                id="age"
                name="age"
                type="number"
                min="0"
                max="120"
                placeholder="যেমন: 35"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[#14532D]"
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Gender{" "}
                <span className="font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <select
                id="gender"
                name="gender"
                defaultValue=""
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#14532D]"
              >
                <option value="">
                  নির্বাচন করুন
                </option>

                <option value="Male">
                  পুরুষ
                </option>

                <option value="Female">
                  নারী
                </option>

                <option value="Other">
                  অন্যান্য
                </option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="note"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                সংক্ষিপ্ত Note{" "}
                <span className="font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <textarea
                id="note"
                name="note"
                rows={4}
                placeholder="প্রয়োজনে খুব সংক্ষেপে Appointment সম্পর্কিত তথ্য লিখুন..."
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[#14532D]"
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Summary */}
      <aside className="sticky top-32 rounded-[28px] border border-green-100 bg-white p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
          <Stethoscope size={23} />
        </div>

        <h2 className="mt-5 text-xl font-bold text-gray-900">
          Appointment Summary
        </h2>

        <div className="mt-6 space-y-5">
          
          <div>
            <p className="text-xs text-gray-400">
              Consultation
            </p>

            <p className="mt-1 font-semibold text-gray-800">
              {selectedTreatment
                ? selectedTreatment.title
                : "এখনো নির্বাচন করা হয়নি"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">
              Date
            </p>

            <p className="font-english mt-1 font-semibold text-gray-800">
              {appointmentDate ||
                "Not selected"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">
              Time
            </p>

            <p className="font-english mt-1 font-semibold text-gray-800">
              {selectedTime ||
                "Not selected"}
            </p>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="flex items-end justify-between">
            <span className="text-sm font-semibold text-gray-600">
              Consultation Fee
            </span>

            <span className="text-2xl font-bold text-[#14532D]">
              ৳
              {selectedTreatment
                ? selectedTreatment.fee
                : 0}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-4 font-semibold text-white transition hover:bg-[#166534]"
        >
          <CalendarDays size={19} />

          Appointment Confirm করুন
        </button>

        <div className="mt-5 flex items-start gap-2 rounded-xl bg-green-50 px-4 py-3">
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-[#15803D]"
          />

          <p className="text-xs leading-6 text-gray-500">
            Backend Phase-এ booked slot automatically unavailable হবে এবং
            Doctor/Admin Appointment manage করতে পারবেন।
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#15803D]">
          <CheckCircle2 size={15} />

          Easy Appointment Booking
        </div>
      </aside>
    </form>
  );
}