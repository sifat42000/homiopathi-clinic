"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  PackageOpen,
  ShoppingCart,
} from "lucide-react";

import type { Product } from "@/data/products";
import { useCartStore } from "@/stores/cart-store";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const addItem = useCartStore(
    (state) => state.addItem
  );

  const [added, setAdded] = useState(false);

  const hasDiscount =
    product.salePrice &&
    product.salePrice < product.regularPrice;

  const handleAddToCart = () => {
    addItem(product, 1);

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1200);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(20,83,45,0.10)]">
      
      {/* Product Image Area */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden bg-[#F1F8F3]"
      >
        <div className="flex aspect-square items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm transition duration-300 group-hover:scale-105">
            <PackageOpen
              size={46}
              strokeWidth={1.4}
              className="text-[#14532D]"
            />
          </div>
        </div>

        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-[#14532D] px-3 py-1.5 text-xs font-semibold text-white">
            {product.badge}
          </span>
        )}

        <span className="absolute bottom-4 right-4 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-[#15803D] shadow-sm">
          স্টকে আছে
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-english text-[11px] font-semibold uppercase tracking-[0.12em] text-[#15803D]">
          {product.category}
        </p>

        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 text-xl font-bold text-gray-900 transition group-hover:text-[#14532D]">
            {product.name}
          </h3>
        </Link>

        <p className="font-english mt-1 text-xs text-gray-400">
          {product.englishName}
        </p>

        <p className="mt-4 flex-1 text-sm leading-7 text-gray-500">
          {product.shortDescription}
        </p>

        {/* Price */}
        <div className="mt-5 flex items-end gap-2">
          {hasDiscount ? (
            <>
              <span className="text-2xl font-bold text-[#14532D]">
                ৳{product.salePrice}
              </span>

              <span className="pb-1 text-sm text-gray-400 line-through">
                ৳{product.regularPrice}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-[#14532D]">
              ৳{product.regularPrice}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="group/button flex items-center justify-center gap-2 rounded-xl border border-[#14532D] px-4 py-3 text-sm font-semibold text-[#14532D] transition hover:bg-green-50"
          >
            বিস্তারিত

            <ArrowRight
              size={16}
              className="transition group-hover/button:translate-x-1"
            />
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`${product.name} কার্টে যোগ করুন`}
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-white transition ${
              added
                ? "bg-[#15803D]"
                : "bg-[#14532D] hover:bg-[#166534]"
            }`}
          >
            {added ? (
              <Check size={19} />
            ) : (
              <ShoppingCart size={19} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}