"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowRight,
  CalendarClock,
  Check,
  CheckCircle2,
  Home,
  MapPin,
  PackageCheck,
  PackageOpen,
  Phone,
  ReceiptText,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { useOrderStore } from "@/stores/order-store";

export default function OrderSuccessClient() {
  const lastOrder = useOrderStore(
    (state) => state.lastOrder
  );

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p className="text-sm text-gray-400">
          Order Loading...
        </p>
      </div>
    );
  }

  if (!lastOrder) {
    return (
      <div className="mx-auto max-w-2xl rounded-[28px] border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
          <ReceiptText
            size={40}
            className="text-[#14532D]"
          />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          কোনো সাম্প্রতিক Order পাওয়া যায়নি
        </h1>

        <p className="mt-3 text-sm leading-7 text-gray-500">
          নতুন Order করতে Product Page থেকে Product নির্বাচন করুন।
        </p>

        <Link
          href="/products"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white"
        >
          <ShoppingBag size={18} />

          প্রোডাক্ট দেখুন
        </Link>
      </div>
    );
  }

  const orderDate = new Date(
    lastOrder.createdAt
  ).toLocaleString("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto max-w-5xl">
      
      {/* Success */}
      <div className="text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#E7F5EA]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#14532D] text-white">
            <Check
              size={34}
              strokeWidth={2.3}
            />
          </div>
        </div>

        <p className="mt-6 text-sm font-semibold text-[#15803D]">
          Order Successfully Submitted
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
          আপনার Order আমরা পেয়েছি
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-500">
          আপনার Order Information সফলভাবে গ্রহণ করা হয়েছে। Backend যুক্ত
          করার পর এখান থেকে Admin Order Confirm এবং Customer Notification
          System পরিচালনা করবে।
        </p>

        {/* Order Number */}
        <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-2xl border border-green-100 bg-white px-5 py-4 shadow-sm">
          <ReceiptText
            size={20}
            className="text-[#14532D]"
          />

          <div className="text-left">
            <p className="text-xs text-gray-400">
              Order Number
            </p>

            <p className="font-english text-lg font-bold text-[#14532D]">
              {lastOrder.orderNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-10 grid gap-3 sm:grid-cols-4">
        
        <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-center">
          <CheckCircle2
            size={22}
            className="mx-auto text-[#15803D]"
          />

          <p className="mt-2 text-sm font-semibold text-gray-800">
            Order Placed
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center">
          <PackageCheck
            size={22}
            className="mx-auto text-gray-400"
          />

          <p className="mt-2 text-sm font-semibold text-gray-600">
            Confirmation
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center">
          <Truck
            size={22}
            className="mx-auto text-gray-400"
          />

          <p className="mt-2 text-sm font-semibold text-gray-600">
            Delivery
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center">
          <Check
            size={22}
            className="mx-auto text-gray-400"
          />

          <p className="mt-2 text-sm font-semibold text-gray-600">
            Completed
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        
        {/* Products */}
        <section className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">
            Order Details
          </h2>

          <div className="mt-6 space-y-5">
            {lastOrder.items.map((item) => {
              const price = item.unitPrice;

              return (
                <div
                  key={item.productId}
                  className="flex gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#EEF8F0]">
                    <PackageOpen
                      size={27}
                      className="text-[#14532D]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">
                      {item.productName}
                    </p>

                    <p className="font-english mt-1 text-xs text-gray-400">
                      {item.quantity} × ৳{price}
                    </p>
                  </div>

                  <p className="font-bold text-gray-800">
                    ৳{price * item.quantity}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-7 border-t border-gray-100 pt-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold">
                  ৳{lastOrder.subtotal}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Delivery
                </span>

                <span className="font-semibold">
                  ৳{lastOrder.deliveryCharge}
                </span>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="flex items-end justify-between">
                <span className="font-semibold">
                  সর্বমোট
                </span>

                <span className="text-2xl font-bold text-[#14532D]">
                  ৳{lastOrder.total}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Customer */}
        <aside className="space-y-5">
          
          <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-gray-900">
              Customer Information
            </h3>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-xs text-gray-400">
                  নাম
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {lastOrder.customer.name}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Phone
                  size={16}
                  className="mt-0.5 text-[#14532D]"
                />

                <span className="font-english text-gray-600">
                  {lastOrder.customer.phone}
                </span>
              </div>

              {lastOrder.customer.email && (
                <div>
                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <p className="font-english mt-1 break-all text-gray-600">
                    {lastOrder.customer.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin
                size={18}
                className="text-[#14532D]"
              />

              <h3 className="font-bold text-gray-900">
                Delivery Address
              </h3>
            </div>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              {lastOrder.shippingAddress.address}
              <br />

              {lastOrder.shippingAddress.area},{" "}
              {lastOrder.shippingAddress.district},{" "}
              {lastOrder.shippingAddress.division}
            </p>
          </div>

          {/* Other */}
          <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-2">
                <CalendarClock
                  size={17}
                  className="mt-0.5 text-[#14532D]"
                />

                <div>
                  <p className="text-xs text-gray-400">
                    Order Time
                  </p>

                  <p className="mt-1 text-gray-700">
                    {orderDate}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Payment
                </p>

                <p className="mt-1 font-semibold text-gray-700">
                  {lastOrder.paymentMethod ===
                  "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Status
                </p>

                <span className="mt-2 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Pending Confirmation
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-xl border border-[#14532D] bg-white px-6 py-3.5 font-semibold text-[#14532D] transition hover:bg-green-50"
        >
          <Home size={18} />

          হোমে ফিরে যান
        </Link>

        <Link
          href="/products"
          className="group flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white transition hover:bg-[#166534]"
        >
          আরও প্রোডাক্ট দেখুন

          <ArrowRight
            size={17}
            className="transition group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}