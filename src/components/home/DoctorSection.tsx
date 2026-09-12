"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import SectionTitle from "@/components/ui/SectionTitle";
import {
  useWebsiteSettings,
} from "@/components/layout/WebsiteSettingsProvider";

export default function DoctorSection() {
  const settings = useWebsiteSettings();

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          
          {/* Left - Doctor Image */}
          <div className="relative mx-auto w-full max-w-[500px]">
            <div className="overflow-hidden rounded-[32px] bg-[#EEF8F0] p-4 shadow-[0_20px_60px_rgba(20,83,45,0.10)]">
              <div className="relative flex min-h-[500px] items-center justify-center overflow-hidden rounded-[26px] bg-gradient-to-br from-[#DDF3E3] via-[#F5FBF6] to-[#E8F5EB]">
                
                {/* Decoration */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/60" />

                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#CDEBD5]/60" />

                {/* Temporary Doctor Placeholder */}
                <div className="relative z-10 flex flex-col items-center px-6 text-center">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-xl">
                    <Stethoscope
                      size={58}
                      strokeWidth={1.4}
                      className="text-[#14532D]"
                    />
                  </div>

                  <p className="mt-6 text-2xl font-bold text-[#14532D]">
                    ডাক্তারের ছবি
                  </p>

                  <p className="mt-2 max-w-[280px] text-sm leading-6 text-gray-500">
                    পরে এখানে ডাক্তারের একটি Professional Portrait Photo
                    ব্যবহার করা হবে।
                  </p>
                </div>
              </div>
            </div>

            {/* Registration Card */}
            <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl sm:left-8 sm:right-auto sm:w-[300px]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50">
                  <ShieldCheck
                    size={22}
                    className="text-[#14532D]"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Professional Information
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    ডিগ্রি, যোগ্যতা ও রেজিস্ট্রেশন তথ্য এখানে প্রদর্শিত হবে।
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Doctor Details */}
          <div className="pt-6 lg:pt-0">
            <SectionTitle
              badge="আপনার চিকিৎসককে জানুন"
              title="অভিজ্ঞ চিকিৎসকের পরামর্শে আপনার স্বাস্থ্যসেবা"
              description="চিকিৎসকের যোগ্যতা, অভিজ্ঞতা এবং চেম্বারের প্রয়োজনীয় তথ্য সহজভাবে এখানে তুলে ধরা হবে, যাতে অ্যাপয়েন্টমেন্ট নেওয়ার আগে রোগী প্রয়োজনীয় তথ্য জানতে পারেন।"
              align="left"
            />

            {/* Doctor Name */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-900">
                {settings.doctorName}
              </h3>

              <p className="mt-1 text-sm font-medium text-[#15803D]">
                হোমিওপ্যাথিক চিকিৎসক
              </p>
            </div>

            {/* Qualification */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <GraduationCap
                  size={21}
                  className="mt-0.5 shrink-0 text-[#14532D]"
                />

                <div>
                  <p className="font-semibold text-gray-800">
                    শিক্ষাগত যোগ্যতা
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    ডাক্তারের প্রকৃত ডিগ্রি ও Professional Qualification এখানে
                    থাকবে।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award
                  size={21}
                  className="mt-0.5 shrink-0 text-[#14532D]"
                />

                <div>
                  <p className="font-semibold text-gray-800">
                    রেজিস্ট্রেশন
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Professional Registration Number এখানে দেওয়া হবে।
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Grid */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-[#FAFAF7] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                    <CalendarDays
                      size={20}
                      className="text-[#14532D]"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      সহজ Appointment
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      অনলাইনে বুকিং সুবিধা
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#FAFAF7] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                    <Clock3
                      size={20}
                      className="text-[#14532D]"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      চেম্বার সময়
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      {settings.chamberTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#FAFAF7] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                    <MapPin
                      size={20}
                      className="text-[#14532D]"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      চেম্বার
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      {settings.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#FAFAF7] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                    <CheckCircle2
                      size={20}
                      className="text-[#14532D]"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Patient Support
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      সহজ যোগাযোগ ব্যবস্থা
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/about"
                className="group flex items-center justify-center gap-2 rounded-xl border border-[#14532D] bg-white px-6 py-3.5 font-semibold text-[#14532D] transition hover:bg-green-50"
              >
                ডাক্তার সম্পর্কে জানুন

                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/appointment"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white transition hover:bg-[#166534]"
              >
                <CalendarDays size={18} />

                অ্যাপয়েন্টমেন্ট নিন
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}