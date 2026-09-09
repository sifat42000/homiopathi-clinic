import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  ArrowLeft,
  Clock3,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import PublicLayout from "@/components/layout/PublicLayout";

import HealthTipCard from "@/components/health-tips/HealthTipCard";

import {
  getHealthTipBySlug,
  getRelatedHealthTips,
} from "@/lib/db/health-tips";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } =
    await params;

  const tip =
    await getHealthTipBySlug(
      slug
    );

  if (!tip) {
    return {
      title:
        "Article Not Found",
    };
  }

  return {
    title: `${tip.title} | Homeopathy Clinic`,

    description:
      tip.excerpt,
  };
}

export default async function HealthTipDetailsPage({
  params,
}: Props) {
  const { slug } =
    await params;

  const tip =
    await getHealthTipBySlug(
      slug
    );

  if (!tip) {
    notFound();
  }

  const related =
    await getRelatedHealthTips(
      tip
    );

  return (
    <PublicLayout>
      <article className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            href="/health-tips"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#14532D]"
          >
            <ArrowLeft
              size={16}
            />

            Health Tips
          </Link>

          <p className="mt-8 text-sm font-semibold text-[#15803D]">
            {tip.category}
          </p>

          <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {tip.title}
          </h1>

          <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-400">
            <span>
              {tip.date}
            </span>

            <span className="flex items-center gap-1">
              <Clock3
                size={15}
              />

              {tip.readTime}
            </span>

            <span>
              {tip.author}
            </span>
          </div>

          <p className="mt-8 text-lg leading-9 text-gray-600">
            {tip.intro}
          </p>

          <div className="mt-10 space-y-10">
            {tip.sections.map(
              (
                section,
                index
              ) => (
                <section
                  key={`${section.heading}-${index}`}
                >
                  <h2 className="text-2xl font-bold text-gray-900">
                    {
                      section.heading
                    }
                  </h2>

                  <p className="mt-4 whitespace-pre-line leading-8 text-gray-600">
                    {
                      section.content
                    }
                  </p>
                </section>
              )
            )}
          </div>

          <div className="mt-12 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
            এই Article সাধারণ তথ্য ও সচেতনতার জন্য। এটি ব্যক্তিগত Diagnosis
            বা Treatment-এর বিকল্প নয়।
          </div>
        </div>
      </article>

      {related.length >
        0 && (
        <section className="bg-[#F7FBF8] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Related Health Tips
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map(
                (item) => (
                  <HealthTipCard
                    key={
                      item.databaseId
                    }
                    tip={item}
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}