"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  KeyRound,
  Mail,
} from "lucide-react";

export default function ForgotPasswordForm() {
  const [submitted, setSubmitted] =
    useState(false);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitted(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
          <KeyRound size={25} />
        </div>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          Password Reset করুন
        </h1>

        <p className="mt-2 text-sm leading-7 text-gray-500">
          আপনার Account-এর Email দিন। Backend যুক্ত হলে Password Reset Link
          Email-এ পাঠানো হবে।
        </p>
      </div>

      <div className="mt-8">
        <label
          htmlFor="forgot-email"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Email Address
        </label>

        <div className="relative">
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            id="forgot-email"
            name="email"
            type="email"
            required
            placeholder="example@email.com"
            className="font-english w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none placeholder:text-gray-400 focus:border-[#14532D]"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white"
      >
        Reset Link পাঠান
      </button>

      {submitted && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-7 text-[#166534]">
          Frontend form ঠিকভাবে কাজ করছে। Backend Phase-এ এখানে আসল Reset
          Email পাঠানো হবে।
        </div>
      )}

      <Link
        href="/login"
        className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-[#14532D]"
      >
        <ArrowLeft size={16} />

        Login Page-এ ফিরে যান
      </Link>
    </form>
  );
}