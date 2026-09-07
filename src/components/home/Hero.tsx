import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAFAF7]">
      {/* Decorative Background */}
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-green-100/60 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-104px)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
        
        {/* Left Side */}
        <div>
          {/* Small Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-[#166534]">
            <ShieldCheck size={17} />

            বিশ্বস্ত পরামর্শ • সহজ অ্যাপয়েন্টমেন্ট
          </div>

          {/* Main Heading */}
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.25] text-[#163020] sm:text-5xl lg:text-[58px]">
            সুস্থতার পথে সহজ ও
            <span className="text-[#14532D]"> বিশ্বস্ত হোমিওপ্যাথিক </span>
            সেবা
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
            অভিজ্ঞ চিকিৎসকের পরামর্শ, সহজে চেম্বার অ্যাপয়েন্টমেন্ট এবং
            প্রয়োজনীয় হোমিওপ্যাথিক প্রোডাক্ট—সবকিছু এখন একই জায়গায়।
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/appointment"
              className="group flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-7 py-3.5 font-semibold text-white transition hover:bg-[#166534]"
            >
              <CalendarDays size={19} />

              অ্যাপয়েন্টমেন্ট নিন

              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/products"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#14532D] bg-white px-7 py-3.5 font-semibold text-[#14532D] transition hover:bg-green-50"
            >
              <ShoppingBag size={19} />

              প্রোডাক্ট দেখুন
            </Link>
          </div>

          {/* Trust Points */}
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2
                size={18}
                className="shrink-0 text-[#15803D]"
              />

              সহজ বুকিং
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2
                size={18}
                className="shrink-0 text-[#15803D]"
              />

              সহজ অর্ডার
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2
                size={18}
                className="shrink-0 text-[#15803D]"
              />

              কাস্টমার সাপোর্ট
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="relative mx-auto w-full max-w-[520px]">
          
          {/* Main Doctor Card */}
          <div className="relative overflow-hidden rounded-[32px] border border-green-100 bg-white p-4 shadow-[0_20px_70px_rgba(20,83,45,0.12)] sm:p-6">
            
            {/* Doctor Photo Placeholder */}
            <div className="relative flex min-h-[460px] items-center justify-center overflow-hidden rounded-[26px] bg-gradient-to-br from-[#E8F5EB] via-[#F4FBF5] to-[#DDF3E3] sm:min-h-[520px]">
              
              {/* Decorative Circle */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/60" />

              <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#CDEBD5]/60" />

              {/* Placeholder */}
              <div className="relative z-10 flex flex-col items-center px-6 text-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-lg">
                  <Stethoscope
                    size={52}
                    strokeWidth={1.5}
                    className="text-[#14532D]"
                  />
                </div>

                <p className="mt-5 text-xl font-semibold text-[#14532D]">
                  ডাক্তারের ছবি
                </p>

                <p className="mt-2 max-w-[250px] text-sm leading-6 text-gray-500">
                  পরবর্তীতে এখানে ডাক্তারের Professional Photo ব্যবহার করব
                </p>
              </div>
            </div>
          </div>

          {/* Doctor Info Floating Card */}
          <div className="absolute -bottom-6 left-1/2 w-[88%] -translate-x-1/2 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl sm:p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
                <Stethoscope size={24} />
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  ডাক্তারের নাম এখানে থাকবে
                </p>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  ডিগ্রি • যোগ্যতা • রেজিস্ট্রেশন তথ্য
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Floating Card */}
          <div className="absolute -left-2 top-10 hidden rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-xl sm:flex sm:items-center sm:gap-3 lg:-left-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <CalendarDays
                size={20}
                className="text-[#14532D]"
              />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Appointment
              </p>

              <p className="text-sm font-semibold text-gray-800">
                সহজে বুক করুন
              </p>
            </div>
          </div>

          {/* Support Floating Card */}
          <div className="absolute -right-2 top-40 hidden rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-xl sm:flex sm:items-center sm:gap-3 lg:-right-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <Clock3
                size={20}
                className="text-[#14532D]"
              />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Service
              </p>

              <p className="text-sm font-semibold text-gray-800">
                সহজ ও দ্রুত
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}