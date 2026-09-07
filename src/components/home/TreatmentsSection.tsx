import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Baby,
  Heart,
  HeartPulse,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import SectionTitle from "@/components/ui/SectionTitle";
import { treatments } from "@/data/treatments";

const treatmentIcons = {
  stethoscope: Stethoscope,
  sparkles: Sparkles,
  heartPulse: HeartPulse,
  baby: Baby,
  heart: Heart,
  activity: Activity,
};

export default function TreatmentsSection() {
  return (
    <section className="bg-[#F7FBF8] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <SectionTitle
          badge="আমাদের সেবা"
          title="যেসব বিষয়ে চিকিৎসকের পরামর্শ নিতে পারবেন"
          description="আপনার প্রয়োজন অনুযায়ী সঠিক সেবা নির্বাচন করুন এবং সহজেই অনলাইনে অ্যাপয়েন্টমেন্ট বুক করুন।"
        />

        {/* Treatment Cards */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {treatments.map((treatment) => {
            const Icon =
              treatmentIcons[
                treatment.icon as keyof typeof treatmentIcons
              ];

            return (
              <div
                key={treatment.id}
                className="group flex h-full flex-col rounded-[24px] border border-green-100 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(20,83,45,0.10)] sm:p-7"
              >
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-[#14532D] transition group-hover:bg-[#14532D] group-hover:text-white">
                  {Icon && <Icon size={26} strokeWidth={1.7} />}
                </div>

                {/* Content */}
                <div className="mt-6 flex-1">
                  <p className="font-english text-xs font-semibold uppercase tracking-[0.12em] text-[#15803D]">
                    {treatment.englishTitle}
                  </p>

                  <h3 className="mt-2 text-xl font-bold leading-8 text-gray-900">
                    {treatment.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {treatment.description}
                  </p>
                </div>

                {/* Details Link */}
                <Link
                  href={`/treatments/${treatment.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#14532D]"
                >
                  বিস্তারিত জানুন

                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/treatments"
            className="group inline-flex items-center gap-2 rounded-xl border border-[#14532D] bg-white px-6 py-3.5 font-semibold text-[#14532D] transition hover:bg-[#14532D] hover:text-white"
          >
            সব চিকিৎসা সেবা দেখুন

            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}