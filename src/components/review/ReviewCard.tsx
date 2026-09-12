import Image from "next/image";

import {
  Star,
} from "lucide-react";

import type {
  DatabaseReview,
} from "@/types/review";
import type { Review } from "@/data/reviews";

type ReviewCardProps = {
  review: DatabaseReview | Review;
};

export default function ReviewCard({
  review,
}: ReviewCardProps) {
  return (
    <article className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex gap-1">
        {Array.from({
          length: 5,
        }).map(
          (_, index) => (
            <Star
              key={index}
              size={16}
              className={
                index <
                review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-200"
              }
            />
          )
        )}
      </div>

      <p className="mt-5 leading-8 text-gray-600">
        “{review.review}”
      </p>

      {"image" in review && review.image && (
        <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-2xl bg-gray-50">
          <Image
            src={
              review.image.url
            }
            alt="Customer review"
            fill
            className="object-cover"
            sizes="400px"
          />
        </div>
      )}

      <div className="mt-5 border-t border-gray-100 pt-4">
        <p className="font-bold text-gray-900">
          {review.name}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {review.service}
        </p>
      </div>
    </article>
  );
}