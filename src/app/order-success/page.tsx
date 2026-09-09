import Link from "next/link";

import {
  CheckCircle2,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";

import PublicLayout from "@/components/layout/PublicLayout";

type OrderSuccessPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const {
    order,
  } = await searchParams;

  return (
    <PublicLayout>
      <section className="bg-[#F7FBF8] py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="rounded-[30px] border border-green-100 bg-white p-7 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-[#15803D]">
              <CheckCircle2
                size={38}
              />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              আপনার Order গ্রহণ করা হয়েছে
            </h1>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              Order বর্তমানে Pending অবস্থায় আছে। Confirm হওয়ার পর
              Processing শুরু হবে।
            </p>

            {order && (
              <div className="mt-7 rounded-2xl bg-[#F7FBF8] p-5">
                <p className="text-xs font-semibold uppercase text-gray-400">
                  Order Number
                </p>

                <p className="font-english mt-2 text-xl font-bold text-[#14532D]">
                  {order}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Order Tracking-এর জন্য Number-টি সংরক্ষণ করুন।
                </p>
              </div>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/order-tracking"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3.5 font-semibold text-white"
              >
                <PackageSearch
                  size={18}
                />

                Order Track করুন
              </Link>

              <Link
                href="/products"
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3.5 font-semibold text-gray-700"
              >
                <ShoppingBag
                  size={18}
                />

                আরও Product
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}