"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  CalendarDays,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";
import {
  useWebsiteSettings,
} from "@/components/layout/WebsiteSettingsProvider";

export default function AboutPage() {
  const settings = useWebsiteSettings();

  return (
    <PublicLayout>
      
      {/* Page Hero */}
      <PageHero
        badge="আমাদের সম্পর্কে"
        title="চিকিৎসক ও আমাদের স্বাস্থ্যসেবা সম্পর্কে জানুন"
        description="চিকিৎসকের পরিচয়, যোগ্যতা, চেম্বার এবং আমাদের সেবার উদ্দেশ্য সম্পর্কে প্রয়োজনীয় তথ্য এখানে সহজভাবে তুলে ধরা হয়েছে।"
        currentPage="আমাদের সম্পর্কে"
      />

      {/* Doctor About */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          
          {/* Image */}
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="flex min-h-[520px] items-center justify-center overflow-hidden rounded-[32px] bg-gradient-to-br from-[#DFF3E4] via-[#F6FBF7] to-[#E5F5E9]">
              <div className="text-center">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lg">
                  <Stethoscope
                    size={58}
                    strokeWidth={1.4}
                    className="text-[#14532D]"
                  />
                </div>

                <p className="mt-6 text-2xl font-bold text-[#14532D]">
                  ডাক্তারের Professional Photo
                </p>

                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500">
                  পরবর্তীতে এখানে ডাক্তারের আসল ছবি ব্যবহার করা হবে।
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <span className="inline-flex rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-[#166534]">
              চিকিৎসকের পরিচিতি
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-[#163020] sm:text-4xl">
              {settings.doctorName}
            </h2>

            <p className="mt-2 font-medium text-[#15803D]">
              হোমিওপ্যাথিক চিকিৎসক
            </p>

            <p className="mt-6 text-base leading-8 text-gray-600">
              এখানে চিকিৎসকের প্রকৃত পরিচয়, অভিজ্ঞতা, চিকিৎসা দর্শন এবং
              রোগীদের সাথে কাজ করার পদ্ধতি সম্পর্কে বিস্তারিত তথ্য লেখা হবে।
              এখন আমরা Frontend Structure তৈরি করছি, তাই Demo Content ব্যবহার
              করা হচ্ছে।
            </p>

            <div className="mt-7 space-y-4">
              <div className="flex items-start gap-3">
                <GraduationCap
                  size={22}
                  className="mt-1 shrink-0 text-[#14532D]"
                />

                <div>
                  <h3 className="font-semibold text-gray-900">
                    শিক্ষাগত যোগ্যতা
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    প্রকৃত Degree ও Professional Qualification এখানে থাকবে।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={22}
                  className="mt-1 shrink-0 text-[#14532D]"
                />

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Professional Registration
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    আসল Registration Information এখানে প্রদর্শিত হবে।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays
                  size={22}
                  className="mt-1 shrink-0 text-[#14532D]"
                />

                <div>
                  <h3 className="font-semibold text-gray-900">
                    চেম্বার ও Appointment
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    চেম্বারের সময় এবং Appointment Schedule এখানে যুক্ত হবে।
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/appointment"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white transition hover:bg-[#166534]"
            >
              <CalendarDays size={18} />

              অ্যাপয়েন্টমেন্ট নিন
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#F7FBF8] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[#166534]">
              আমাদের উদ্দেশ্য
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-[#163020] sm:text-4xl">
              স্বাস্থ্যসেবার প্রয়োজনীয় তথ্যকে আরও সহজ ও ব্যবহারবান্ধব করা
            </h2>

            <p className="mt-5 text-base leading-8 text-gray-600">
              রোগী যেন চিকিৎসক, Appointment এবং প্রয়োজনীয় Product সম্পর্কে
              পরিষ্কার তথ্য সহজেই পেতে পারেন—এই লক্ষ্যেই Website-টি সাজানো
              হচ্ছে।
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            
            <div className="rounded-[24px] border border-green-100 bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
                <HeartHandshake size={23} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                সহজ অভিজ্ঞতা
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                ছোট-বড় সবাই যেন সহজে Website ব্যবহার করতে পারেন এমনভাবে
                Interface তৈরি করা হচ্ছে।
              </p>
            </div>

            <div className="rounded-[24px] border border-green-100 bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
                <BookOpenCheck size={23} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                সহজ তথ্য
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                প্রয়োজনীয় বিষয় সহজ বাংলা এবং পরিচিত English শব্দ ব্যবহার করে
                বোঝানো হবে।
              </p>
            </div>

            <div className="rounded-[24px] border border-green-100 bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
                <ShieldCheck size={23} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                স্বচ্ছ তথ্য
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                চিকিৎসকের প্রকৃত তথ্য, Product Details এবং প্রয়োজনীয়
                নির্দেশনা পরিষ্কারভাবে তুলে ধরা হবে।
              </p>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}