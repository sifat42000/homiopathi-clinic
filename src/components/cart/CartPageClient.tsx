"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Minus,
  PackageOpen,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import { useCartStore } from "@/stores/cart-store";

// const DELIVERY_CHARGE = 80;

export default function CartPageClient() {
  const items = useCartStore((state) => state.items);

  const increaseItem = useCartStore(
    (state) => state.increaseItem
  );

  const decreaseItem = useCartStore(
    (state) => state.decreaseItem
  );

  const removeItem = useCartStore(
    (state) => state.removeItem
  );

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const [mounted, setMounted] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(80);

  useEffect(() => {
    setMounted(true);

    let active = true;

    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (active && Number.isFinite(data.settings?.deliveryCharge)) {
          setDeliveryCharge(data.settings.deliveryCharge);
        }
      } catch {
        // Keep the default charge when settings cannot be loaded.
      }
    };

    loadSettings();

    const interval = window.setInterval(loadSettings, 5000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-400">
          Cart Loading...
        </p>
      </div>
    );
  }

  const subtotal = items.reduce(
    (total, item) => {
      const price =
        item.salePrice ?? item.regularPrice;

      return total + price * item.quantity;
    },
    0
  );

  const currentDeliveryCharge =
    items.length > 0 ? deliveryCharge : 0;

  const total =
    subtotal + currentDeliveryCharge;

  const totalQuantity = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // Empty Cart
  if (items.length === 0) {
    return (
      <div className="rounded-[28px] border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
          <ShoppingCart
            size={42}
            strokeWidth={1.5}
            className="text-[#14532D]"
          />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          আপনার Cart এখন খালি
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
          প্রয়োজনীয় প্রোডাক্ট নির্বাচন করে Cart-এ যোগ করুন। তারপর এখান থেকে
          Order-এর পরবর্তী ধাপে যেতে পারবেন।
        </p>

        <Link
          href="/products"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white transition hover:bg-[#166534]"
        >
          <ShoppingBag size={18} />

          প্রোডাক্ট দেখুন

          <ArrowRight size={17} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
      
      {/* =====================
          Cart Products
      ====================== */}
      <div>
        
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              আপনার Product
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              মোট {totalQuantity} টি Item
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="flex items-center gap-1.5 text-sm font-semibold text-red-500 transition hover:text-red-600"
          >
            <X size={16} />

            Cart খালি করুন
          </button>
        </div>

        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => {
            const price =
              item.salePrice ??
              item.regularPrice;

            const itemTotal =
              price * item.quantity;

            return (
              <article
                key={item.id}
                className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex gap-4">
                  
                  {/* Image */}
                  <Link
                    href={`/products/${item.slug}`}
                    className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#EEF8F0] sm:h-28 sm:w-28"
                  >
                    <PackageOpen
                      size={38}
                      strokeWidth={1.4}
                      className="text-[#14532D]"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="min-w-0 flex-1">
                    
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                        >
                          <h3 className="font-bold leading-6 text-gray-900 transition hover:text-[#14532D]">
                            {item.name}
                          </h3>
                        </Link>

                        <p className="font-english mt-1 text-xs text-gray-400">
                          {item.englishName}
                        </p>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.id)
                        }
                        aria-label={`${item.name} Cart থেকে সরান`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-lg font-bold text-[#14532D]">
                        ৳{price}
                      </span>

                      {item.salePrice &&
                        item.salePrice <
                          item.regularPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ৳{item.regularPrice}
                          </span>
                        )}
                    </div>

                    {/* Bottom */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      
                      {/* Quantity */}
                      <div className="flex h-10 items-center overflow-hidden rounded-xl border border-gray-200">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseItem(item.id)
                          }
                          className="flex h-full w-10 items-center justify-center transition hover:bg-gray-50"
                          aria-label="Quantity কমান"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="flex h-full min-w-10 items-center justify-center border-x border-gray-200 font-english text-sm font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseItem(item.id)
                          }
                          className="flex h-full w-10 items-center justify-center transition hover:bg-gray-50"
                          aria-label="Quantity বাড়ান"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          Total
                        </p>

                        <p className="text-lg font-bold text-gray-900">
                          ৳{itemTotal}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#14532D]"
        >
          <ShoppingBag size={17} />

          আরও প্রোডাক্ট দেখুন
        </Link>
      </div>

      {/* =====================
          Order Summary
      ====================== */}
      <aside className="sticky top-32 rounded-[26px] border border-green-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Order Summary
        </h2>

        <div className="mt-6 space-y-4">
          
          {/* Subtotal */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Subtotal
            </span>

            <span className="font-semibold text-gray-900">
              ৳{subtotal}
            </span>
          </div>

          {/* Delivery */}
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-gray-500">
              <Truck size={16} />
              Delivery
            </span>

            <span className="font-semibold text-gray-900">
              ৳{currentDeliveryCharge}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Total */}
          <div className="flex items-end justify-between">
            <span className="font-semibold text-gray-700">
              মোট
            </span>

            <span className="text-3xl font-bold text-[#14532D]">
              ৳{total}
            </span>
          </div>
        </div>

        {/* Checkout */}
        <Link
          href="/checkout"
          className="group mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-4 font-semibold text-white transition hover:bg-[#166534]"
        >
          Checkout করুন

          <ArrowRight
            size={18}
            className="transition group-hover:translate-x-1"
          />
        </Link>

        <p className="mt-4 text-center text-xs leading-5 text-gray-400">
          পরবর্তী ধাপে Delivery Information ও Payment Method নির্বাচন করা
          হবে।
        </p>
      </aside>
    </div>
  );
}