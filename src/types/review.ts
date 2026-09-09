export type ReviewStatus =
  | "pending"
  | "approved"
  | "rejected";

export type ReviewImage = {
  publicId: string;

  url: string;

  width: number;

  height: number;

  format: string;
};

export type DatabaseReview = {
  id: string;

  userId?: string | null;

  name: string;

  review: string;

  rating: number;

  service: string;

  image?: ReviewImage;

  status: ReviewStatus;

  createdAt: string;

  updatedAt: string;
};