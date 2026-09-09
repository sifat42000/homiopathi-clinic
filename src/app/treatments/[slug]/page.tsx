import Link from "next/link";

import {
  ArrowLeft,
  CalendarCheck2,
  Clock3,
  Stethoscope,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import PublicLayout from "@/components/layout/PublicLayout";

import {
  getTreatmentBySlug,
} from "@/lib/db/treatments";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic =
  "force-dynamic";

export default async function TreatmentDetailsPage({
  params,
}: Props) {
  const { slug } =
    await params;

  const treatment =
    await getTreatmentBySlug(
      slug
    );

  if (!treatment) {
    notFound();
  }

  return (
    <PublicLayout>
      <section className="bg-[#F7FBF8] py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            href="/treatments"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#14532D]"
          >
            <ArrowLeft
              size={16}
            />

            Treatments
          </Link>

          <div className="mt-8 rounded-[30px] border border-gray-100 bg-white p-7 shadow-sm sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
              <Stethoscope
                size={27}
              />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl">
              {treatment.title}
            </h1>

            <p className="font-english mt-2 text-sm text-gray-400">
              {
                treatment.englishTitle
              }
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="rounded-xl bg-[#F7FBF8] px-4 py-3">
                <p className="text-xs text-gray-400">
                  Fee
                </p>

                <p className="mt-1 text-lg font-bold">
                  ৳
                  {
                    treatment.fee
                  }
                </p>
              </div>

              <div className="rounded-xl bg-[#F7FBF8] px-4 py-3">
                <p className="text-xs text-gray-400">
                  Duration
                </p>

                <p className="mt-1 flex items-center gap-2 font-bold">
                  <Clock3
                    size={16}
                  />

                  {
                    treatment.duration
                  }{" "}
                  মিনিট
                </p>
              </div>
            </div>

            <p className="mt-8 text-lg leading-9 text-gray-600">
              {
                treatment.description
              }
            </p>

            <div className="mt-8 border-t border-gray-100 pt-7">
              <h2 className="text-2xl font-bold">
                বিস্তারিত
              </h2>

              <p className="mt-4 whitespace-pre-line leading-8 text-gray-600">
                {
                  treatment.fullDescription
                }
              </p>
            </div>

            {treatment.availability ===
            "available" ? (
              <Link
                href={`/appointment?treatment=${treatment.slug}`}
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white"
              >
                <CalendarCheck2
                  size={19}
                />

                Appointment নিন
              </Link>
            ) : (
              <div className="mt-9 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                এই Consultation-এর Appointment বর্তমানে unavailable।
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}