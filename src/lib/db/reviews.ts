import type {
  ObjectId,
} from "mongodb";

import {
  getDb,
} from "@/lib/mongodb";

import type {
  DatabaseReview,
  ReviewImage,
  ReviewStatus,
} from "@/types/review";

export type ReviewDocument = {
  _id?: ObjectId;

  userId?: string | null;

  name: string;

  review: string;

  rating: number;

  service: string;

  image?: ReviewImage;

  status: ReviewStatus;

  createdAt: Date;

  updatedAt: Date;
};

export function serializeReview(
  review: ReviewDocument & {
    _id: ObjectId;
  }
): DatabaseReview {
  return {
    id:
      review._id.toString(),

    userId:
      review.userId,

    name:
      review.name,

    review:
      review.review,

    rating:
      review.rating,

    service:
      review.service,

    image:
      review.image,

    status:
      review.status,

    createdAt:
      review.createdAt.toISOString(),

    updatedAt:
      review.updatedAt.toISOString(),
  };
}

export async function getApprovedReviews(
  limit?: number
) {
  const db =
    await getDb();

  let query =
    db
      .collection<ReviewDocument>(
        "reviews"
      )
      .find({
        status: "approved",
      })
      .sort({
        createdAt: -1,
      });

  if (limit) {
    query =
      query.limit(limit);
  }

  const reviews =
    await query.toArray();

  return reviews.map(
    (review) =>
      serializeReview(
        review
      )
  );
}