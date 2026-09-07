"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Minus,
  PackageCheck,
  PackageOpen,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

import type { Product } from "@/data/products";
import { useCartStore } from "@/stores/cart-store";

type ProductDetailsProps = {
  product: Product;
};

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore(
    (state) => state.addItem
  );

  const finalPrice =
    product.salePrice ?? product.regularPrice;

  const hasDiscount =
    product.salePrice &&
    product.salePrice < product.regularPrice;

  const decreaseQuantity = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  const increaseQuantity = () => {
    setQuantity((current) =>
      current < product.stock
        ? current + 1
        : current
    );
  };

  const handleAddToCart = () => {
    addItem(product, quantity);

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
      
      {/* Left - Product Image */}
      <div>
        <div className="relative overflow-hidden rounded-[32px] border border-green-100 bg-[#EEF8F0]">
          <div className="flex aspect-square items-center justify-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-lg">
              <PackageOpen
                size={72}
                strokeWidth={1.3}
                className="text-[#14532D]"
              />
            </div>
          </div>

          {product.badge && (
            <span className="absolute left-6 top-6 rounded-full bg-[#14532D] px-4 py-2 text-sm font-semibold text-white">
              {product.badge}
            </span>
          )}
        </div>

        {/* Thumbnail Demo */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((item) => (
            <button
              type="button"
              key={item}
              className={`flex aspect-square items-center justify-center rounded-2xl border bg-[#F7FBF8] ${
                item === 1
                  ? "border-[#14532D]"
                  : "border-gray-100"
              }`}
            >
              <PackageOpen
                size={26}
                className="text-[#14532D]"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Right */}
      <div>
        <span className="inline-flex rounded-full bg-green-50 px-4 py-1.5 font-english text-xs font-semibold uppercase tracking-[0.12em] text-[#15803D]">
          {product.category}
        </span>

        <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
          {product.name}
        </h1>

        <p className="font-english mt-2 text-sm text-gray-400">
          {product.englishName}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
          <span className="text-gray-500">
            SKU:{" "}
            <strong className="font-english text-gray-700">
              {product.sku}
            </strong>
          </span>

          <span className="flex items-center gap-1.5 font-medium text-[#15803D]">
            <CheckCircle2 size={17} />
            স্টকে আছে ({product.stock})
          </span>
        </div>

        {/* Price */}
        <div className="mt-7 flex items-end gap-3">
          <span className="text-4xl font-bold text-[#14532D]">
            ৳{finalPrice}
          </span>

          {hasDiscount && (
            <span className="pb-1 text-lg text-gray-400 line-through">
              ৳{product.regularPrice}
            </span>
          )}
        </div>

        <p className="mt-6 text-base leading-8 text-gray-600">
          {product.shortDescription}
        </p>

        {/* Basic Info */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-[#FAFAF7] p-4">
            <p className="text-xs text-gray-400">
              Package Size
            </p>

            <p className="font-english mt-1 font-semibold text-gray-800">
              {product.size}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-[#FAFAF7] p-4">
            <p className="text-xs text-gray-400">
              Category
            </p>

            <p className="font-english mt-1 font-semibold text-gray-800">
              {product.category}
            </p>
          </div>
        </div>

        {/* Quantity */}
        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold text-gray-700">
            পরিমাণ
          </p>

          <div className="flex items-center gap-3">
            <div className="flex h-12 items-center overflow-hidden rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={decreaseQuantity}
                className="flex h-full w-12 items-center justify-center transition hover:bg-gray-50"
              >
                <Minus size={17} />
              </button>

              <span className="flex h-full min-w-12 items-center justify-center border-x border-gray-200 font-english font-semibold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                className="flex h-full w-12 items-center justify-center transition hover:bg-gray-50"
              >
                <Plus size={17} />
              </button>
            </div>

            <span className="text-sm text-gray-400">
              সর্বোচ্চ {product.stock} টি
            </span>
          </div>
        </div>

        {/* Real Add To Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-7 py-4 font-semibold text-white transition sm:w-auto ${
            added
              ? "bg-[#15803D]"
              : "bg-[#14532D] hover:bg-[#166534]"
          }`}
        >
          {added ? (
            <>
              <CheckCircle2 size={20} />
              কার্টে যোগ হয়েছে
            </>
          ) : (
            <>
              <ShoppingCart size={20} />

              কার্টে যোগ করুন — ৳
              {finalPrice * quantity}
            </>
          )}
        </button>

        {/* Trust */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-xl border border-gray-100 p-3">
            <PackageCheck
              size={19}
              className="shrink-0 text-[#14532D]"
            />

            <span className="text-xs text-gray-600">
              Quality Packaging
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-100 p-3">
            <Truck
              size={19}
              className="shrink-0 text-[#14532D]"
            />

            <span className="text-xs text-gray-600">
              Delivery Available
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-100 p-3">
            <ShieldCheck
              size={19}
              className="shrink-0 text-[#14532D]"
            />

            <span className="text-xs text-gray-600">
              Secure Order
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}