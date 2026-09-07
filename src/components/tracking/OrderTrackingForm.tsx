"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  CheckCircle2,
  Clock3,
  PackageCheck,
  PackageOpen,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { useOrderStore } from "@/stores/order-store";

import type { FrontendOrder } from "@/types/order";

export default function OrderTrackingForm() {
  const lastOrder = useOrderStore(
    (state) => state.lastOrder
  );

  const [mounted, setMounted] =
    useState(false);

  const [error, setError] =
    useState("");

  const [foundOrder, setFoundOrder] =
    useState<FrontendOrder | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setFoundOrder(null);

    const formData =
      new FormData(event.currentTarget);

    const orderNumber = String(
      formData.get("orderNumber") ?? ""
    )
      .trim()
      .toUpperCase();

    const phone = String(
      formData.get("phone") ?? ""
    ).trim();

    if (!lastOrder) {
      setError(
        "এই Browser-এ কোনো Demo Order পাওয়া যায়নি। আগে একটি Product Order করুন।"
      );

      return;
    }

    const matches =
      lastOrder.orderNumber.toUpperCase() ===
        orderNumber &&
      lastOrder.customer.phone === phone;

    if (!matches) {
      setError(
        "Order Number অথবা মোবাইল নম্বর সঠিক নয়।"
      );

      return;
    }

    setFoundOrder(lastOrder);
  };

  if (!mounted) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-400">
          Tracking System Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      
      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
            <Search size={25} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl">
            আপনার Order Track করুন
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-gray-500">
            Order Number এবং Order করার সময় ব্যবহৃত Mobile Number দিন।
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-2xl gap-5 sm:grid-cols-2">
          
          {/* Order Number */}
          <div>
            <label
              htmlFor="tracking-order"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Order Number *
            </label>

            <input
              id="tracking-order"
              name="orderNumber"
              type="text"
              required
              placeholder="HC-12345678"
              className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 uppercase outline-none placeholder:text-gray-400 focus:border-[#14532D]"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="tracking-phone"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              মোবাইল নম্বর *
            </label>

            <input
              id="tracking-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength={11}
              required
              placeholder="01XXXXXXXXX"
              className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[#14532D]"
            />
          </div>
        </div>

        {error && (
          <div className="mx-auto mt-5 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="mx-auto mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-7 py-3.5 font-semibold text-white transition hover:bg-[#166534]"
        >
          <Search size={18} />

          Order Track করুন
        </button>
      </form>

      {/* Result */}
      {foundOrder && (
        <div className="mt-8">
          
          {/* Success */}
          <div className="flex items-start gap-3 rounded-[22px] border border-green-200 bg-green-50 p-5">
            <CheckCircle2
              size={21}
              className="mt-0.5 shrink-0 text-[#15803D]"
            />

            <div>
              <p className="font-semibold text-[#166534]">
                Order পাওয়া গেছে
              </p>

              <p className="font-english mt-1 text-sm text-gray-600">
                {foundOrder.orderNumber}
              </p>
            </div>
          </div>

          {/* Tracking */}
          <div className="mt-6 rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-gray-900">
              Order Status
            </h2>

            <div className="mt-7 grid gap-3 sm:grid-cols-4">
              
              {/* Placed */}
              <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
                <CheckCircle2
                  size={24}
                  className="mx-auto text-[#15803D]"
                />

                <p className="mt-3 text-sm font-bold text-gray-800">
                  Order Placed
                </p>

                <p className="mt-1 text-xs text-green-700">
                  Complete
                </p>
              </div>

              {/* Pending */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
                <Clock3
                  size={24}
                  className="mx-auto text-amber-600"
                />

                <p className="mt-3 text-sm font-bold text-gray-800">
                  Confirmation
                </p>

                <p className="mt-1 text-xs text-amber-700">
                  Pending
                </p>
              </div>

              {/* Processing */}
              <div className="rounded-2xl border border-gray-100 bg-[#FAFAF7] p-5 text-center">
                <PackageCheck
                  size={24}
                  className="mx-auto text-gray-400"
                />

                <p className="mt-3 text-sm font-bold text-gray-600">
                  Processing
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Waiting
                </p>
              </div>

              {/* Delivery */}
              <div className="rounded-2xl border border-gray-100 bg-[#FAFAF7] p-5 text-center">
                <Truck
                  size={24}
                  className="mx-auto text-gray-400"
                />

                <p className="mt-3 text-sm font-bold text-gray-600">
                  Delivery
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Waiting
                </p>
              </div>
            </div>

            {/* Order Information */}
            <div className="mt-8 grid gap-6 md:grid-cols-[1fr_280px]">
              
              {/* Products */}
              <div>
                <h3 className="font-bold text-gray-900">
                  Products
                </h3>

                <div className="mt-4 space-y-3">
                  {foundOrder.items.map(
                    (item) => {
                      const price =
                        item.salePrice ??
                        item.regularPrice;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF8F0]">
                            <PackageOpen
                              size={22}
                              className="text-[#14532D]"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-800">
                              {item.name}
                            </p>

                            <p className="font-english mt-1 text-xs text-gray-400">
                              {item.quantity} × ৳
                              {price}
                            </p>
                          </div>

                          <p className="font-semibold text-gray-800">
                            ৳
                            {price *
                              item.quantity}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-2xl bg-[#F7FBF8] p-5">
                <p className="text-sm font-bold text-gray-900">
                  Summary
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-semibold">
                      ৳{foundOrder.subtotal}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Delivery
                    </span>

                    <span className="font-semibold">
                      ৳
                      {
                        foundOrder.deliveryCharge
                      }
                    </span>
                  </div>

                  <div className="h-px bg-gray-200" />

                  <div className="flex items-end justify-between">
                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="text-xl font-bold text-[#14532D]">
                      ৳{foundOrder.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Notice */}
      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5">
        <p className="text-sm leading-7 text-amber-900">
          Frontend Demo পর্যায়ে Order Tracking শুধু এই Browser-এ তৈরি হওয়া
          সর্বশেষ Order খুঁজতে পারবে। Backend যুক্ত হলে Order Number এবং
          Mobile Number দিয়ে MongoDB থেকে যেকোনো Order-এর Real Status দেখা
          যাবে।
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#14532D]"
        >
          <ShoppingBag size={17} />

          নতুন Product Order করুন
        </Link>
      </div>
    </div>
  );
}