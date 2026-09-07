import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type PageHeroProps = {
  badge?: string;
  title: string;
  description: string;
  currentPage: string;
};

export default function PageHero({
  badge,
  title,
  description,
  currentPage,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#F1F8F3] py-14 sm:py-16 lg:py-20">
      
      {/* Decoration */}
      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-green-200/30 blur-3xl" />

      <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-green-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          
          {badge && (
            <span className="inline-flex rounded-full border border-green-200 bg-white px-4 py-1.5 text-sm font-medium text-[#166534]">
              {badge}
            </span>
          )}

          <h1 className="mt-5 text-4xl font-bold leading-tight text-[#163020] sm:text-5xl">
            {title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-600">
            {description}
          </p>

          {/* Breadcrumb */}
          <div className="mt-7 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="flex items-center gap-1.5 transition hover:text-[#14532D]"
            >
              <Home size={15} />

              হোম
            </Link>

            <ChevronRight size={14} />

            <span className="font-medium text-[#14532D]">
              {currentPage}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}