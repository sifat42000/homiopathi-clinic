import Link from "next/link";

import {
  ArrowRight,
  Clock3,
  Stethoscope,
} from "lucide-react";

import type {
  DatabaseTreatment,
} from "@/types/treatment";

type Props = {
  treatment:
    DatabaseTreatment;
};

export default function DatabaseTreatmentCard({
  treatment,
}: Props) {
  return (
    <article className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
        <Stethoscope
          size={23}
        />
      </div>

      <h2 className="mt-5 text-xl font-bold text-gray-900">
        {treatment.title}
      </h2>

      <p className="font-english mt-1 text-xs text-gray-400">
        {
          treatment.englishTitle
        }
      </p>

      <p className="mt-4 line-clamp-3 leading-7 text-gray-500">
        {
          treatment.description
        }
      </p>

      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <span className="rounded-lg bg-[#F7FBF8] px-3 py-2 font-semibold">
          ৳{treatment.fee}
        </span>

        <span className="flex items-center gap-1 rounded-lg bg-[#F7FBF8] px-3 py-2">
          <Clock3
            size={14}
          />

          {treatment.duration} মিনিট
        </span>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          href={`/treatments/${treatment.slug}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold"
        >
          বিস্তারিত

          <ArrowRight
            size={15}
          />
        </Link>

        {treatment.availability ===
          "available" && (
          <Link
            href={`/appointment?treatment=${treatment.slug}`}
            className="flex flex-1 items-center justify-center rounded-xl bg-[#14532D] px-4 py-3 text-sm font-semibold text-white"
          >
            Appointment
          </Link>
        )}
      </div>
    </article>
  );
}