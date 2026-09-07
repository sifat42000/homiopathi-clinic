import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
} from "lucide-react";

import type { HealthTip } from "@/data/healthTips";

type HealthTipCardProps = {
  tip: HealthTip;
};

export default function HealthTipCard({
  tip,
}: HealthTipCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(20,83,45,0.10)]">
      
      {/* Placeholder */}
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

      <div className="flex flex-1 flex-col p-6">
        <span className="self-start rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-[#15803D]">
          {tip.category}
        </span>

        <Link
          href={`/health-tips/${tip.slug}`}
        >
          <h2 className="mt-4 text-xl font-bold leading-8 text-gray-900 transition group-hover:text-[#14532D]">
            {tip.title}
          </h2>
        </Link>

        <p className="mt-3 flex-1 text-sm leading-7 text-gray-500">
          {tip.excerpt}
        </p>

        <div className="mt-5 flex flex-wrap gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />

            {tip.date}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock3 size={14} />

            {tip.readTime}
          </span>
        </div>

        <Link
          href={`/health-tips/${tip.slug}`}
          className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#14532D]"
        >
          বিস্তারিত পড়ুন

          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
}