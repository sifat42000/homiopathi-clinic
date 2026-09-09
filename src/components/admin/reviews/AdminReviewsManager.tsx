"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Image from "next/image";

import {
  CheckCircle2,
  Loader2,
  Search,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";

import type {
  DatabaseReview,
  ReviewStatus,
} from "@/types/review";

export default function AdminReviewsManager() {
  const [
    reviews,
    setReviews,
  ] = useState<
    DatabaseReview[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [error, setError] =
    useState("");

  const loadReviews =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/reviews?admin=1",
            {
              cache:
                "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message
          );
        }

        setReviews(
          data.reviews
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Reviews load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const filtered =
    useMemo(() => {
      let result = [
        ...reviews,
      ];

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (review) =>
              review.name
                .toLowerCase()
                .includes(
                  query
                ) ||
              review.service
                .toLowerCase()
                .includes(
                  query
                ) ||
              review.review
                .toLowerCase()
                .includes(
                  query
                )
          );
      }

      if (
        statusFilter !==
        "all"
      ) {
        result =
          result.filter(
            (review) =>
              review.status ===
              statusFilter
          );
      }

      return result;
    }, [
      reviews,
      search,
      statusFilter,
    ]);

  const changeStatus =
    async (
      id: string,
      status:
        ReviewStatus
    ) => {
      try {
        const response =
          await fetch(
            `/api/reviews/${id}`,
            {
              method:
                "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  status,
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message
          );
        }

        await loadReviews();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Review Update করা যায়নি।"
        );
      }
    };

  const deleteReview =
    async (
      review:
        DatabaseReview
    ) => {
      if (
        !window.confirm(
          `${review.name}-এর Review Delete করতে চান?`
        )
      ) {
        return;
      }

      try {
        const response =
          await fetch(
            `/api/reviews/${review.id}`,
            {
              method:
                "DELETE",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message
          );
        }

        await loadReviews();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Review Delete করা যায়নি।"
        );
      }
    };

  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-[#15803D]">
          Real Reviews
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Review Management
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          নতুন Review প্রথমে Pending থাকবে। যাচাই করে Approve অথবা Reject করুন।
        </p>
      </div>

      <div className="mt-7 grid gap-3 rounded-[22px] border border-gray-100 bg-white p-4 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Customer, Service অথবা Review..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4"
          />
        </div>

        <select
          value={
            statusFilter
          }
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
        >
          <option value="all">
            All Reviews
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="rejected">
            Rejected
          </option>
        </select>
      </div>

      {error && (
        <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20">
          <Loader2
            className="mx-auto animate-spin text-[#14532D]"
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {filtered.map(
            (review) => (
              <article
                key={review.id}
                className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="font-bold">
                      {
                        review.name
                      }
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      {
                        review.service
                      }
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold">
                    {
                      review.status
                    }
                  </span>
                </div>

                <div className="mt-4 flex gap-1">
                  {Array.from({
                    length: 5,
                  }).map(
                    (_, index) => (
                      <Star
                        key={
                          index
                        }
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

                <p className="mt-4 leading-7 text-gray-600">
                  {
                    review.review
                  }
                </p>

                {review.image && (
                  <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-2xl">
                    <Image
                      src={
                        review.image
                          .url
                      }
                      alt="Review"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
                  <button
                    onClick={() =>
                      changeStatus(
                        review.id,
                        "approved"
                      )
                    }
                    className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700"
                  >
                    <CheckCircle2
                      size={15}
                    />
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      changeStatus(
                        review.id,
                        "rejected"
                      )
                    }
                    className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                  >
                    <XCircle
                      size={15}
                    />
                    Reject
                  </button>

                  <button
                    onClick={() =>
                      deleteReview(
                        review
                      )
                    }
                    className="ml-auto p-2 text-red-500"
                  >
                    <Trash2
                      size={17}
                    />
                  </button>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </div>
  );
}