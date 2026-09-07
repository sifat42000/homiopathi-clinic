import type { Metadata } from "next";

import Link from "next/link";

import {
  ArrowRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Home,
  Stethoscope,
} from "lucide-react";

import { notFound } from "next/navigation";

import PublicLayout from "@/components/layout/PublicLayout";
import TreatmentCard from "@/components/treatment/TreatmentCard";

import { treatments } from "@/data/treatments";

type TreatmentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return treatments.map((treatment) => ({
    slug: treatment.slug,
  }));
}

export async function generateMetadata({
  params,
}: TreatmentPageProps): Promise<Metadata> {
  const { slug } = await params;

  const treatment = treatments.find(
    (item) => item.slug === slug
  );

  if (!treatment) {
    return {
      title: "Treatment Not Found",
    };
  }

  return {
    title: `${treatment.title} | Homeopathy Clinic`,
    description: treatment.description,
  };
}

export default async function TreatmentDetailsPage({
  params,
}: TreatmentPageProps) {
  const { slug } = await params;

  const treatment = treatments.find(
    (item) => item.slug === slug
  );

  if (!treatment) {
    notFound();
  }

  const relatedTreatments = treatments
    .filter(
      (item) => item.id !== treatment.id
    )
    .slice(0, 3);

  return (
    <PublicLayout>
      
      {/* Breadcrumb */}
      <section className="border-b border-gray-100 bg-[#F7FBF8]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="flex items-center gap-1.5 transition hover:text-[#14532D]"
            >
              <Home size={14} />

              হোম
            </Link>

            <ArrowRight size={13} />

            <Link
              href="/treatments"
              className="transition hover:text-[#14532D]"
            >
              চিকিৎসা
            </Link>

            <ArrowRight size={13} />

            <span className="font-medium text-[#14532D]">
              {treatment.title}
            </span>
          </div>
        </div>
      </section>

      {/* Treatment Details */}
      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          
          {/* Main Content */}
          <div>
            <span className="inline-flex rounded-full bg-green-50 px-4 py-1.5 font-english text-xs font-semibold uppercase tracking-[0.12em] text-[#15803D]">
              {treatment.englishTitle}
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {treatment.title}
            </h1>

            <p className="mt-6 text-base leading-8 text-gray-600">
              {treatment.fullDescription}
            </p>

            {/* Information */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              
              <div className="rounded-2xl border border-green-100 bg-[#F7FBF8] p-5">
                <Clock3
                  size={22}
                  className="text-[#14532D]"
                />

                <p className="mt-3 text-xs text-gray-400">
                  Consultation Time
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {treatment.duration} মিনিট
                </p>
              </div>

              <div className="rounded-2xl border border-green-100 bg-[#F7FBF8] p-5">
                <Banknote
                  size={22}
                  className="text-[#14532D]"
                />

                <p className="mt-3 text-xs text-gray-400">
                  Consultation Fee
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  ৳{treatment.fee}
                </p>
              </div>

              <div className="rounded-2xl border border-green-100 bg-[#F7FBF8] p-5">
                <CalendarDays
                  size={22}
                  className="text-[#14532D]"
                />

                <p className="mt-3 text-xs text-gray-400">
                  Availability
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {treatment.availability}
                </p>
              </div>
            </div>

            {/* Important */}
            <div className="mt-8 rounded-[24px] border border-green-100 bg-green-50 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Appointment নেওয়ার আগে
              </h2>

              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-1 shrink-0 text-[#15803D]"
                  />

                  <p className="text-sm leading-7 text-gray-600">
                    Appointment-এর সময় সঠিক নাম ও মোবাইল নম্বর ব্যবহার করুন।
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-1 shrink-0 text-[#15803D]"
                  />

                  <p className="text-sm leading-7 text-gray-600">
                    প্রয়োজন হলে আপনার সমস্যার সংক্ষিপ্ত তথ্য Appointment
                    Form-এ লিখতে পারবেন।
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-1 shrink-0 text-[#15803D]"
                  />

                  <p className="text-sm leading-7 text-gray-600">
                    জরুরি বা গুরুতর অবস্থায় উপযুক্ত জরুরি চিকিৎসা সেবা গ্রহণ
                    করুন।
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Sidebar */}
          <aside className="sticky top-32 rounded-[28px] bg-[#14532D] p-7 text-white shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#14532D]">
              <Stethoscope size={26} />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Appointment নিতে চান?
            </h2>

            <p className="mt-3 text-sm leading-7 text-green-100/75">
              আপনার সুবিধামতো Date এবং Time Slot নির্বাচন করে সহজেই
              Appointment বুক করুন।
            </p>

            <div className="mt-6 rounded-2xl bg-white/10 p-4">
              <p className="text-xs text-green-100/60">
                Consultation Fee
              </p>

              <p className="mt-1 text-3xl font-bold">
                ৳{treatment.fee}
              </p>
            </div>

            <Link
              href={`/appointment?treatment=${treatment.slug}`}
              className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 font-semibold text-[#14532D] transition hover:bg-green-50"
            >
              <CalendarDays size={18} />

              Appointment নিন

              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </aside>
        </div>
      </section>

      {/* Related */}
      <section className="bg-[#F7FBF8] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-[#15803D]">
              অন্যান্য সেবা
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              আরও কিছু Consultation Service
            </h2>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
            {relatedTreatments.map((item) => (
              <TreatmentCard
                key={item.id}
                treatment={item}
              />
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}