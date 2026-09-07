"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  Clock3,
  Search,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  useAdminContentStore,
  type ReviewStatus,
} from "@/stores/admin-content-store";

function statusClass(
  status: ReviewStatus
) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700";

    case "approved":
      return "bg-green-50 text-green-700";

    case "rejected":
      return "bg-red-50 text-red-600";
  }
}

export default function AdminReviewsManager() {
  const reviews =
    useAdminContentStore(
      (state) =>
        state.reviews
    );

  const updateReviewStatus =
    useAdminContentStore(
      (state) =>
        state.updateReviewStatus
    );

  const deleteReview =
    useAdminContentStore(
      (state) =>
        state.deleteReview
    );

  const [mounted, setMounted] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredReviews =
    useMemo(() => {
      let result = [
        ...reviews,
      ];

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result = result.filter(
          (review) =>
            review.name
              .toLowerCase()
              .includes(query) ||
            review.review
              .toLowerCase()
              .includes(query) ||
            review.service
              .toLowerCase()
              .includes(query)
        );
      }

      if (
        statusFilter !== "all"
      ) {
        result = result.filter(
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

  if (!mounted) {
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        Reviews Loading...
      </div>
    );
  }

  const pendingCount =
    reviews.filter(
      (review) =>
        review.status ===
        "pending"
    ).length;

  const approvedCount =
    reviews.filter(
      (review) =>
        review.status ===
        "approved"
    ).length;

  const rejectedCount =
    reviews.filter(
      (review) =>
        review.status ===
        "rejected"
    ).length;

  const handleDelete = (
    id: number,
    name: string
  ) => {
    const confirmed =
      window.confirm(
        `${name}-এর Review Delete করতে চান?`
      );

    if (!confirmed) {
      return;
    }

    deleteReview(id);
  };

  return (
    <div>
      {/* Heading */}
      <div>
        <p className="text-sm font-semibold text-[#15803D]">
          Moderation
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Review Management
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Customer Review যাচাই করে Approve অথবা Reject করুন।
        </p>
      </div>

      {/* Stats */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        
        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <Star
            size={21}
            className="text-[#14532D]"
          />

          <p className="font-english mt-4 text-3xl font-bold text-gray-900">
            {reviews.length}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Total Reviews
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <Clock3
            size={21}
            className="text-amber-600"
          />

          <p className="font-english mt-4 text-3xl font-bold text-gray-900">
            {pendingCount}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Pending
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <CheckCircle2
            size={21}
            className="text-green-600"
          />

          <p className="font-english mt-4 text-3xl font-bold text-gray-900">
            {approvedCount}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Approved
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <XCircle
            size={21}
            className="text-red-500"
          />

          <p className="font-english mt-4 text-3xl font-bold text-gray-900">
            {rejectedCount}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Rejected
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="mt-7 grid gap-3 rounded-[22px] border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
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
            placeholder="Customer, Review অথবা Service Search..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#14532D]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none"
        >
          <option value="all">
            All Status
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

      {/* Reviews */}
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {filteredReviews.map(
          (review) => (
            <article
              key={review.id}
              className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-900">
                    {review.name}
                  </p>

                  <p className="font-english mt-1 text-xs text-gray-400">
                    {review.service}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                    review.status
                  )}`}
                >
                  {review.status}
                </span>
              </div>

              {/* Stars */}
              <div className="mt-4 flex gap-1">
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

              <p className="mt-4 text-sm leading-7 text-gray-600">
                {review.review}
              </p>

              <p className="mt-4 text-xs text-gray-400">
                {review.date}
              </p>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    updateReviewStatus(
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
                  type="button"
                  onClick={() =>
                    updateReviewStatus(
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
                  type="button"
                  onClick={() =>
                    updateReviewStatus(
                      review.id,
                      "pending"
                    )
                  }
                  className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700"
                >
                  <Clock3
                    size={15}
                  />

                  Pending
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      review.id,
                      review.name
                    )
                  }
                  className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-red-500"
                >
                  <Trash2
                    size={16}
                  />
                </button>
              </div>
            </article>
          )
        )}
      </div>

      {filteredReviews.length ===
        0 && (
        <div className="mt-6 rounded-[24px] border border-dashed border-gray-200 bg-white py-14 text-center text-sm text-gray-400">
          কোনো Review পাওয়া যায়নি।
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
        Public Review Form এখনো সরাসরি এই Admin Store-এর সাথে connected নয়।
        Backend Phase-এ Review Submit করলে MongoDB-তে Pending অবস্থায় যাবে এবং
        Admin এখান থেকে Approve/Reject করবেন।
      </div>
    </div>
  );
}