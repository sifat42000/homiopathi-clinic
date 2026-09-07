import {
  BadgeCheck,
  Star,
} from "lucide-react";

import PublicLayout from "@/components/layout/PublicLayout";
import ReviewCard from "@/components/review/ReviewCard";
import ReviewSubmitForm from "@/components/review/ReviewSubmitForm";
import PageHero from "@/components/ui/PageHero";

import { reviews } from "@/data/reviews";

export default function ReviewsPage() {
  const averageRating =
    reviews.reduce(
      (total, review) =>
        total + review.rating,
      0
    ) / reviews.length;

  return (
    <PublicLayout>
      <PageHero
        badge="Reviews"
        title="রোগী ও কাস্টমারের অভিজ্ঞতা"
        description="আমাদের সেবা ও Website ব্যবহারের অভিজ্ঞতা সম্পর্কে যাচাইকৃত Review দেখুন অথবা আপনার নিজের অভিজ্ঞতা শেয়ার করুন।"
        currentPage="রিভিউ"
      />

      {/* Summary */}
      <section className="bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-5 rounded-[24px] border border-green-100 bg-[#F7FBF8] p-6 text-center sm:flex-row sm:gap-8">
            
            <div>
              <p className="font-english text-4xl font-bold text-[#14532D]">
                {averageRating.toFixed(1)}
              </p>

              <div className="mt-2 flex justify-center gap-1">
                {Array.from({
                  length: 5,
                }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>

            <div className="hidden h-16 w-px bg-green-200 sm:block" />

            <div>
              <div className="flex items-center justify-center gap-2 text-[#15803D]">
                <BadgeCheck size={20} />

                <span className="font-semibold">
                  যাচাইকৃত Review
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                বর্তমানে {reviews.length}টি Demo Review প্রদর্শিত হচ্ছে
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-[#F7FBF8] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <p className="text-sm font-semibold text-[#15803D]">
              Customer Experience
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              মানুষ কী বলছেন
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Submit */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ReviewSubmitForm />
        </div>
      </section>
    </PublicLayout>
  );
}