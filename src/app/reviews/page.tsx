import PublicLayout from "@/components/layout/PublicLayout";

import ReviewCard from "@/components/review/ReviewCard";

import ReviewSubmitForm from "@/components/review/ReviewSubmitForm";

import {
  getApprovedReviews,
} from "@/lib/db/reviews";

export const dynamic =
  "force-dynamic";

export default async function ReviewsPage() {
  const reviews =
    await getApprovedReviews();

  return (
    <PublicLayout>
      <section className="bg-[#F7FBF8] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-[#15803D]">
              Reviews
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Customer Reviews
            </h1>

            <p className="mt-4 leading-8 text-gray-500">
              Admin-এর মাধ্যমে অনুমোদিত Customer Review এখানে দেখা যাবে।
            </p>
          </div>

          {reviews.length >
          0 ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map(
                (review) => (
                  <ReviewCard
                    key={
                      review.id
                    }
                    review={
                      review
                    }
                  />
                )
              )}
            </div>
          ) : (
            <div className="mt-10 rounded-[24px] border border-dashed border-gray-200 bg-white py-14 text-center text-gray-400">
              এখনো কোনো Approved Review নেই।
            </div>
          )}

          <div className="mx-auto mt-14 max-w-3xl">
            <ReviewSubmitForm />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}