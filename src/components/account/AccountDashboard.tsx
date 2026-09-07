import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBag,
  Star,
  UserRound,
} from "lucide-react";

export default function AccountDashboard() {
  return (
    <div>
      {/* Welcome */}
      <div>
        <p className="text-sm font-semibold text-[#15803D]">
          Customer Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          স্বাগতম, Demo Customer
        </h1>

        <p className="mt-2 text-sm leading-7 text-gray-500">
          Backend Phase-এ Login করা Customer-এর আসল নাম ও তথ্য এখানে
          automatically দেখাবে।
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        
        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
            <Package size={21} />
          </div>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            0
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Total Orders
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
            <CalendarDays size={21} />
          </div>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            0
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Appointments
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
            <Clock3 size={21} />
          </div>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            0
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Pending
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
            <Star size={21} />
          </div>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            0
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Reviews
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="mt-8 rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
        <h2 className="text-xl font-bold text-gray-900">
          Quick Actions
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/products"
            className="group flex items-center justify-between rounded-2xl bg-[#F7FBF8] p-4 transition hover:bg-green-50"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag
                size={20}
                className="text-[#14532D]"
              />

              <span className="font-semibold text-gray-700">
                Product Order
              </span>
            </div>

            <ArrowRight
              size={17}
              className="text-gray-400 transition group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/appointment"
            className="group flex items-center justify-between rounded-2xl bg-[#F7FBF8] p-4 transition hover:bg-green-50"
          >
            <div className="flex items-center gap-3">
              <CalendarDays
                size={20}
                className="text-[#14532D]"
              />

              <span className="font-semibold text-gray-700">
                Appointment
              </span>
            </div>

            <ArrowRight
              size={17}
              className="text-gray-400 transition group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/account/profile"
            className="group flex items-center justify-between rounded-2xl bg-[#F7FBF8] p-4 transition hover:bg-green-50"
          >
            <div className="flex items-center gap-3">
              <UserRound
                size={20}
                className="text-[#14532D]"
              />

              <span className="font-semibold text-gray-700">
                Profile
              </span>
            </div>

            <ArrowRight
              size={17}
              className="text-gray-400 transition group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="mt-8 rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            Recent Orders
          </h2>

          <Link
            href="/account/orders"
            className="text-sm font-semibold text-[#14532D]"
          >
            সব দেখুন
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-gray-200 px-5 py-10 text-center">
          <Package
            size={32}
            className="mx-auto text-gray-300"
          />

          <p className="mt-4 font-semibold text-gray-700">
            এখনো কোনো Order নেই
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Backend যুক্ত হলে Customer-এর Order এখানে দেখা যাবে।
          </p>
        </div>
      </section>

      {/* Notice */}
      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-5">
        <CheckCircle2
          size={20}
          className="mt-0.5 shrink-0 text-[#15803D]"
        />

        <p className="text-sm leading-7 text-gray-600">
          এই Dashboard এখন Frontend Demo। Backend Phase-এ Login করা
          Customer-এর Order, Appointment, Review ও Profile Information
          MongoDB থেকে এখানে আসবে।
        </p>
      </div>
    </div>
  );
}