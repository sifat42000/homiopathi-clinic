import type { Metadata } from "next";

import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Home,
  UserRound,
} from "lucide-react";

import { notFound } from "next/navigation";

import HealthTipCard from "@/components/health-tips/HealthTipCard";
import PublicLayout from "@/components/layout/PublicLayout";

import { healthTips } from "@/data/healthTips";

type HealthTipPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return healthTips.map((tip) => ({
    slug: tip.slug,
  }));
}

export async function generateMetadata({
  params,
}: HealthTipPageProps): Promise<Metadata> {
  const { slug } =
    await params;

  const tip = healthTips.find(
    (item) =>
      item.slug === slug
  );

  if (!tip) {
    return {
      title:
        "Health Tip Not Found",
    };
  }

  return {
    title: `${tip.title} | Homeopathy Clinic`,
    description: tip.excerpt,
  };
}

export default async function HealthTipDetailsPage({
  params,
}: HealthTipPageProps) {
  const { slug } =
    await params;

  const tip = healthTips.find(
    (item) =>
      item.slug === slug
  );

  if (!tip) {
    notFound();
  }

  const relatedTips =
    healthTips
      .filter(
        (item) =>
          item.id !== tip.id
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
              className="flex items-center gap-1.5 hover:text-[#14532D]"
            >
              <Home size={14} />

              হোম
            </Link>

            <ArrowRight size={13} />

            <Link
              href="/health-tips"
              className="hover:text-[#14532D]"
            >
              স্বাস্থ্য টিপস
            </Link>

            <ArrowRight size={13} />

            <span className="text-[#14532D]">
              {tip.title}
            </span>
          </div>
        </div>
      </section>

      {/* Article Header */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <span className="inline-flex rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-[#15803D]">
            {tip.category}
          </span>

          <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {tip.title}
          </h1>

          <p className="mt-5 text-lg leading-8 text-gray-500">
            {tip.excerpt}
          </p>

          {/* Meta */}
          <div className="mt-7 flex flex-wrap gap-5 border-y border-gray-100 py-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <UserRound size={16} />

              {tip.author}
            </span>

            <span className="flex items-center gap-2">
              <CalendarDays size={16} />

              {tip.date}
            </span>

            <span className="flex items-center gap-2">
              <Clock3 size={16} />

              {tip.readTime}
            </span>
          </div>

          {/* Cover Placeholder */}
          <div className="mt-8 flex aspect-[16/7] items-center justify-center rounded-[28px] bg-[#EAF6ED]">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
              <BookOpen
                size={42}
                className="text-[#14532D]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="bg-[#F7FBF8] py-12 sm:py-16">
        <article className="mx-auto max-w-3xl rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-9">
          
          <p className="text-base leading-9 text-gray-600">
            {tip.intro}
          </p>

          <div className="mt-8 space-y-9">
            {tip.sections.map(
              (section) => (
                <section
                  key={
                    section.heading
                  }
                >
                  <h2 className="text-2xl font-bold leading-8 text-gray-900">
                    {
                      section.heading
                    }
                  </h2>

                  <p className="mt-3 text-base leading-9 text-gray-600">
                    {
                      section.content
                    }
                  </p>
                </section>
              )
            )}
          </div>

          {/* Disclaimer */}
          <div className="mt-10 rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <p className="text-sm leading-7 text-amber-900">
              এই লেখাটি সাধারণ স্বাস্থ্য সচেতনতার জন্য। ব্যক্তিগত রোগ নির্ণয়
              বা চিকিৎসার বিকল্প হিসেবে ব্যবহার করবেন না। গুরুতর বা জরুরি
              স্বাস্থ্য সমস্যায় উপযুক্ত চিকিৎসা সেবা গ্রহণ করুন।
            </p>
          </div>
        </article>
      </section>

      {/* Related */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-[#15803D]">
              আরও পড়ুন
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              আরও কিছু স্বাস্থ্য টিপস
            </h2>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
            {relatedTips.map(
              (item) => (
                <HealthTipCard
                  key={item.id}
                  tip={item}
                />
              )
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}