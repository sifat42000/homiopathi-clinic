import Link from "next/link";

import {
  Activity,
  ArrowRight,
  Baby,
  Banknote,
  Clock3,
  Heart,
  HeartPulse,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import type { Treatment } from "@/data/treatments";

type TreatmentCardProps = {
  treatment: Treatment;
};

const treatmentIcons = {
  stethoscope: Stethoscope,
  sparkles: Sparkles,
  heartPulse: HeartPulse,
  baby: Baby,
  heart: Heart,
  activity: Activity,
};

export default function TreatmentCard({
  treatment,
}: TreatmentCardProps) {
  const Icon =
    treatmentIcons[
      treatment.icon as keyof typeof treatmentIcons
    ];

  return (
    <article className="group flex h-full flex-col rounded-[24px] border border-green-100 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(20,83,45,0.10)] sm:p-7">
      
      {/* Icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-[#14532D] transition group-hover:bg-[#14532D] group-hover:text-white">
        <Icon
          size={26}
          strokeWidth={1.7}
        />
      </div>

      {/* Content */}
      <div className="mt-6 flex-1">
        <p className="font-english text-xs font-semibold uppercase tracking-[0.12em] text-[#15803D]">
          {treatment.englishTitle}
        </p>

        <h2 className="mt-2 text-xl font-bold leading-8 text-gray-900">
          {treatment.title}
        </h2>

        <p className="mt-3 text-sm leading-7 text-gray-500">
          {treatment.description}
        </p>
      </div>

      {/* Information */}
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-[#F7FBF8] px-3 py-1.5 text-xs text-gray-600">
          <Clock3
            size={14}
            className="text-[#14532D]"
          />

          {treatment.duration} মিনিট
        </span>

        <span className="flex items-center gap-1.5 rounded-full bg-[#F7FBF8] px-3 py-1.5 text-xs text-gray-600">
          <Banknote
            size={14}
            className="text-[#14532D]"
          />

          ৳{treatment.fee}
        </span>
      </div>

      {/* Link */}
      <Link
        href={`/treatments/${treatment.slug}`}
        className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#14532D]"
      >
        বিস্তারিত জানুন

        <ArrowRight
          size={17}
          className="transition group-hover:translate-x-1"
        />
      </Link>
    </article>
  );
}