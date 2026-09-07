import {
  BadgeCheck,
  CalendarDays,
  Quote,
  Star,
} from "lucide-react";

import type { Review } from "@/data/reviews";

type ReviewCardProps = {
  review: Review;
};

export default function ReviewCard({
  review,
}: ReviewCardProps) {
  return (
    <article className="relative flex h-full flex-col rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(20,83,45,0.09)] sm:p-7">
      
      {/* Quote */}
      <div className="absolute right-6 top-6 text-green-100">
        <Quote
          size={44}
          fill="currentColor"
          strokeWidth={1}
        />
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <Star
              key={index}
              size={17}
              className={
                index < review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-200"
              }
            />
          )
        )}
      </div>

      {/* Review */}
      <p className="relative z-10 mt-5 flex-1 text-[15px] leading-8 text-gray-600">
        “{review.review}”
      </p>

      {/* Date */}
      <div className="mt-5 flex items-center gap-1.5 text-xs text-gray-400">
        <CalendarDays size={14} />

        {review.date}
      </div>

      <div className="my-6 h-px bg-gray-100" />

      {/* Customer */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E7F5EA] text-sm font-bold text-[#14532D]">
          {review.initials}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-semibold text-gray-900">
              {review.name}
            </p>

            {review.verified && (
              <BadgeCheck
                size={17}
                className="shrink-0 text-[#15803D]"
              />
            )}
          </div>

          <p className="font-english mt-0.5 text-xs text-gray-400">
            {review.service}
          </p>
        </div>
      </div>
    </article>
  );
}