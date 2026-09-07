import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
} from "lucide-react";

import SectionTitle from "@/components/ui/SectionTitle";
import { healthTips } from "@/data/healthTips";

export default function HealthTipsSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="স্বাস্থ্য টিপস"
          title="সুস্থ জীবনযাপনের জন্য প্রয়োজনীয় কিছু তথ্য"
          description="সহজ ভাষায় স্বাস্থ্য সচেতনতা, জীবনযাপন এবং দৈনন্দিন সুস্থতা সম্পর্কিত প্রয়োজনীয় লেখা পড়ুন।"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {healthTips.map((tip) => (
            <article
              key={tip.id}
              className="group overflow-hidden rounded-[24px] border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(20,83,45,0.10)]"
            >
              {/* Image Placeholder */}
              <Link
                href={`/health-tips/${tip.slug}`}
                className="flex aspect-[16/10] items-center justify-center bg-[#EAF6ED]"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm transition group-hover:scale-105">
                  <BookOpen
                    size={36}
                    strokeWidth={1.5}
                    className="text-[#14532D]"
                  />
                </div>
              </Link>

              <div className="p-6">
                <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-[#15803D]">
                  {tip.category}
                </span>

                <Link href={`/health-tips/${tip.slug}`}>
                  <h3 className="mt-4 text-xl font-bold leading-8 text-gray-900 transition group-hover:text-[#14532D]">
                    {tip.title}
                  </h3>
                </Link>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {tip.excerpt}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    {tip.date}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock3 size={14} />
                    {tip.readTime}
                  </div>
                </div>

                <Link
                  href={`/health-tips/${tip.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#14532D]"
                >
                  বিস্তারিত পড়ুন

                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/health-tips"
            className="group inline-flex items-center gap-2 rounded-xl border border-[#14532D] bg-white px-6 py-3.5 font-semibold text-[#14532D] transition hover:bg-[#14532D] hover:text-white"
          >
            সব স্বাস্থ্য টিপস দেখুন

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