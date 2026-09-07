import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  FileText,
  MessageSquareText,
  Package,
  ShoppingCart,
  Stethoscope,
  Tags,
} from "lucide-react";

import { allProducts } from "@/data/products";
import { treatments } from "@/data/treatments";
import { reviews } from "@/data/reviews";
import { healthTips } from "@/data/healthTips";

export default function AdminDashboardPage() {
  const statistics = [
    {
      label: "Products",
      value: allProducts.length,
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "Treatments",
      value: treatments.length,
      icon: Stethoscope,
      href: "#",
    },
    {
      label: "Reviews",
      value: reviews.length,
      icon: MessageSquareText,
      href: "#",
    },
    {
      label: "Health Tips",
      value: healthTips.length,
      icon: FileText,
      href: "#",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#15803D]">
            Overview
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm leading-7 text-gray-500">
            Product, Order, Appointment এবং Website Content এখান থেকে
            পরিচালনা করা হবে।
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white"
        >
          Website দেখুন

          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
                  <Icon size={21} />
                </div>

                <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-[#15803D]">
                  Frontend
                </span>
              </div>

              <p className="mt-5 font-english text-3xl font-bold text-gray-900">
                {item.value}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Order + Appointment Stats */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        
        <div className="rounded-[24px] bg-[#14532D] p-6 text-white">
          <ShoppingCart size={25} />

          <p className="mt-5 font-english text-4xl font-bold">
            0
          </p>

          <h2 className="mt-2 text-lg font-semibold">
            Total Orders
          </h2>

          <p className="mt-2 text-sm leading-6 text-green-100/70">
            Backend যুক্ত হলে Real Order Count এখানে automatically দেখাবে।
          </p>
        </div>

        <div className="rounded-[24px] border border-green-100 bg-white p-6 shadow-sm">
          <CalendarDays
            size={25}
            className="text-[#14532D]"
          />

          <p className="font-english mt-5 text-4xl font-bold text-gray-900">
            0
          </p>

          <h2 className="mt-2 text-lg font-semibold text-gray-900">
            Total Appointments
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            MongoDB Appointment Data যুক্ত হলে এখানে Real Count আসবে।
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="mt-8 rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Quick Management
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/products"
            className="group rounded-2xl bg-[#F7FBF8] p-5 transition hover:bg-green-50"
          >
            <Package
              size={22}
              className="text-[#14532D]"
            />

            <p className="mt-4 font-semibold text-gray-800">
              Products
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Add / Edit / Delete
            </p>
          </Link>

          <Link
            href="/admin/categories"
            className="rounded-2xl bg-[#F7FBF8] p-5 transition hover:bg-green-50"
          >
            <Tags
              size={22}
              className="text-[#14532D]"
            />

            <p className="mt-4 font-semibold text-gray-800">
              Categories
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Manage Categories
            </p>
          </Link>

          <div className="cursor-not-allowed rounded-2xl bg-[#F7FBF8] p-5 opacity-50">
            <ShoppingCart
              size={22}
              className="text-[#14532D]"
            />

            <p className="mt-4 font-semibold text-gray-800">
              Orders
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Step 29
            </p>
          </div>

          <div className="cursor-not-allowed rounded-2xl bg-[#F7FBF8] p-5 opacity-50">
            <CalendarDays
              size={22}
              className="text-[#14532D]"
            />

            <p className="mt-4 font-semibold text-gray-800">
              Appointments
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Step 30
            </p>
          </div>
        </div>
      </section>

      {/* Notice */}
      <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 p-5">
        <p className="text-sm leading-7 text-amber-900">
          Admin Panel এখন Frontend Mode-এ আছে। কোনো Authentication বা Admin
          Protection এখনো নেই। Backend Phase-এ শুধু Admin Role-এর User
          `/admin` access করতে পারবে।
        </p>
      </div>
    </div>
  );
}