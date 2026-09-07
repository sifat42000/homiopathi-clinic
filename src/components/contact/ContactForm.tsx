"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage(
      "ফর্মের Frontend প্রস্তুত হয়েছে। Backend ধাপে Message পাঠানোর System চালু করব।"
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900">
        আমাদের একটি Message পাঠান
      </h2>

      <p className="mt-2 text-sm leading-7 text-gray-500">
        প্রয়োজনীয় তথ্য দিয়ে আপনার প্রশ্ন বা Message লিখুন।
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            আপনার নাম
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="আপনার নাম লিখুন"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#14532D]"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            মোবাইল নম্বর
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="01XXXXXXXXX"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#14532D]"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            className="font-english w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#14532D]"
          />
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            বিষয়
          </label>

          <select
            id="subject"
            name="subject"
            required
            defaultValue=""
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#14532D]"
          >
            <option value="" disabled>
              একটি বিষয় নির্বাচন করুন
            </option>

            <option value="appointment">
              Appointment
            </option>

            <option value="product">
              Product
            </option>

            <option value="treatment">
              Treatment
            </option>

            <option value="general">
              সাধারণ প্রশ্ন
            </option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="mt-5">
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          আপনার Message
        </label>

        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="আপনার প্রয়োজনীয় Message লিখুন..."
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#14532D]"
        />
      </div>

      <button
        type="submit"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white transition hover:bg-[#166534] sm:w-auto"
      >
        <Send size={18} />

        Message পাঠান
      </button>

      {message && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-[#166534]">
          {message}
        </div>
      )}
    </form>
  );
}