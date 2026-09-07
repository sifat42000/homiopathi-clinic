import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Star,
} from "lucide-react";

import ReviewCard from "@/components/review/ReviewCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { reviews } from "@/data/reviews";

export default function ReviewsSection() {
  return (
    <section className="bg-[#F7FBF8] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <SectionTitle
          badge="রোগী ও কাস্টমারের অভিজ্ঞতা"
          title="আমাদের সেবা সম্পর্কে মানুষ কী বলছেন"
          description="প্রকাশের আগে প্রতিটি রিভিউ যাচাই করা হবে। প্রকৃত রোগী ও কাস্টমারের অভিজ্ঞতাকে গুরুত্ব দিয়ে এখানে তুলে ধরা হবে।"
        />

        {/* Summary */}
        <div className="mx-auto mt-8 flex max-w-xl flex-col items-center justify-center gap-3 rounded-2xl border border-green-100 bg-white p-5 text-center sm:flex-row sm:gap-5">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={19}
                className="fill-amber-400 text-amber-400"
              />
            ))}
          </div>

          <div className="hidden h-7 w-px bg-gray-200 sm:block" />

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BadgeCheck
              size={18}
              className="text-[#15803D]"
            />

            যাচাইকৃত রিভিউ ও অভিজ্ঞতা
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
            />
          ))}
        </div>

        {/* View All Reviews */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/reviews"
            className="group inline-flex items-center gap-2 rounded-xl border border-[#14532D] bg-white px-6 py-3.5 font-semibold text-[#14532D] transition hover:bg-[#14532D] hover:text-white"
          >
            সব রিভিউ দেখুন

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