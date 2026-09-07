import Link from "next/link";

import {
  ArrowLeft,
  Home,
  SearchX,
} from "lucide-react";

import PublicLayout from "@/components/layout/PublicLayout";

export default function NotFound() {
  return (
    <PublicLayout>
      <section className="bg-[#F7FBF8] py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-[#14532D]">
            <SearchX size={42} />
          </div>

          <p className="font-english mt-7 text-6xl font-bold text-[#14532D] sm:text-7xl">
            404
          </p>

          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Page পাওয়া যায়নি
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500">
            আপনি যে Page খুঁজছেন সেটি হয়তো সরানো হয়েছে, URL পরিবর্তন হয়েছে
            অথবা Page-টি এখনো তৈরি হয়নি।
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white"
            >
              <Home size={18} />

              হোমে ফিরে যান
            </Link>

            <Link
              href="/products"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#14532D] bg-white px-6 py-3.5 font-semibold text-[#14532D]"
            >
              <ArrowLeft size={17} />

              Product দেখুন
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}