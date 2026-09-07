import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  reviews,
  type Review,
} from "@/data/reviews";

import {
  healthTips,
  type HealthTip,
} from "@/data/healthTips";

export type ReviewStatus =
  | "pending"
  | "approved"
  | "rejected";

export type AdminReview = Review & {
  status: ReviewStatus;
  submittedAt: string;
};

export type AdminHealthTip = HealthTip & {
  active: boolean;
  updatedAt: string;
};

type HealthTipWithoutId = Omit<
  HealthTip,
  "id"
>;

type AdminContentStore = {
  reviews: AdminReview[];

  healthTips: AdminHealthTip[];

  updateReviewStatus: (
    id: number,
    status: ReviewStatus
  ) => void;

  deleteReview: (
    id: number
  ) => void;

  addHealthTip: (
    healthTip: HealthTipWithoutId
  ) => void;

  updateHealthTip: (
    id: number,
    healthTip: HealthTipWithoutId
  ) => void;

  deleteHealthTip: (
    id: number
  ) => void;

  toggleHealthTipStatus: (
    id: number
  ) => void;
};

const initialReviews: AdminReview[] = [
  ...reviews.map((review) => ({
    ...review,

    status: "approved" as const,

    submittedAt:
      "2026-09-07T00:00:00.000Z",
  })),

  {
    id: 999,

    name: "Demo Customer",

    review:
      "এটি Admin Review Moderation System পরীক্ষা করার জন্য একটি Demo Pending Review।",

    rating: 5,

    service:
      "Website Experience",

    verified: false,

    initials: "DC",

    date:
      "০৭ সেপ্টেম্বর ২০২৬",

    status: "pending",

    submittedAt:
      "2026-09-07T08:30:00.000Z",
  },
];

const initialHealthTips: AdminHealthTip[] =
  healthTips.map((tip) => ({
    ...tip,

    active: true,

    updatedAt:
      "2026-09-07T00:00:00.000Z",
  }));

export const useAdminContentStore =
  create<AdminContentStore>()(
    persist(
      (set) => ({
        reviews: initialReviews,

        healthTips:
          initialHealthTips,

        updateReviewStatus: (
          id,
          status
        ) =>
          set((state) => ({
            reviews:
              state.reviews.map(
                (review) =>
                  review.id === id
                    ? {
                        ...review,

                        status,

                        verified:
                          status ===
                          "approved",
                      }
                    : review
              ),
          })),

        deleteReview: (id) =>
          set((state) => ({
            reviews:
              state.reviews.filter(
                (review) =>
                  review.id !== id
              ),
          })),

        addHealthTip: (
          healthTip
        ) =>
          set((state) => {
            const nextId =
              state.healthTips.length >
              0
                ? Math.max(
                    ...state.healthTips.map(
                      (item) =>
                        item.id
                    )
                  ) + 1
                : 1;

            return {
              healthTips: [
                ...state.healthTips,

                {
                  ...healthTip,

                  id: nextId,

                  active: true,

                  updatedAt:
                    new Date().toISOString(),
                },
              ],
            };
          }),

        updateHealthTip: (
          id,
          healthTip
        ) =>
          set((state) => ({
            healthTips:
              state.healthTips.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,

                        ...healthTip,

                        updatedAt:
                          new Date().toISOString(),
                      }
                    : item
              ),
          })),

        deleteHealthTip: (
          id
        ) =>
          set((state) => ({
            healthTips:
              state.healthTips.filter(
                (item) =>
                  item.id !== id
              ),
          })),

        toggleHealthTipStatus: (
          id
        ) =>
          set((state) => ({
            healthTips:
              state.healthTips.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,

                        active:
                          !item.active,

                        updatedAt:
                          new Date().toISOString(),
                      }
                    : item
              ),
          })),
      }),

      {
        name:
          "homeopathy-admin-content",
      }
    )
  );