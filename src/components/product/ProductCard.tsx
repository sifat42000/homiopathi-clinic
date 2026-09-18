"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import Link from "next/link";

import {
  Package,
  ShoppingCart,
} from "lucide-react";

import type {
  Product,
} from "@/data/products";

import {
  useCartStore,
} from "@/stores/cart-store";

import DiscountCountdown from "@/components/product/DiscountCountdown";

import {
  getEffectiveProductPrice,
  isTimedDiscountActive,
} from "@/lib/product-pricing";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const addItem =
    useCartStore(
      (state) =>
        state.addItem
    );

  const [
    now,
    setNow,
  ] = useState<
    number | null
  >(null);

  useEffect(() => {
    setNow(
      Date.now()
    );

    const timer =
      window.setInterval(
        () => {
          setNow(
            Date.now()
          );
        },
        1000
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, []);

  const currentPrice =
    now === null
      ? product.salePrice ??
        product.regularPrice
      : getEffectiveProductPrice(
          product,
          new Date(now)
        );

  const timedDiscountActive =
    now === null
      ? false
      : isTimedDiscountActive(
          product,
          new Date(now)
        );

  const hasLowerPrice =
    currentPrice <
    product.regularPrice;

  const handleAddToCart =
    () => {
      if (
        product.stock <= 0
      ) {
        return;
      }

      /*
        Cart estimate-এর জন্য
        current effective price পাঠাচ্ছি।
        Final Order Price server
        আবার MongoDB থেকে calculate করবে।
      */
      const cartProduct: Product =
        {
          ...product,

          salePrice:
            currentPrice <
            product.regularPrice
              ? currentPrice
              : undefined,
        };

      addItem(
        cartProduct,
        1
      );
    };

  return (
    <article className="group overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#EEF8F0]"
      >
        {product.images?.[0] ? (
          <Image
            src={
              product.images[0]
                .url
            }
            alt={
              product.name
            }
            fill
            className="object-contain p-4 transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 320px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package
              size={45}
              strokeWidth={1.4}
              className="text-[#14532D]"
            />
          </div>
        )}

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-[#14532D] px-3 py-1 text-xs font-semibold text-white">
            {
              product.badge
            }
          </span>
        )}

        {timedDiscountActive && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
            Limited Offer
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs font-semibold text-[#15803D]">
          {
            product.category
          }
        </p>

        <Link
          href={`/products/${product.slug}`}
        >
          <h2 className="mt-2 line-clamp-2 text-lg font-bold text-gray-900 transition hover:text-[#14532D]">
            {product.name}
          </h2>
        </Link>

        <p className="font-english mt-1 text-xs text-gray-400">
          {
            product.englishName
          }
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-7 text-gray-500">
          {
            product.shortDescription
          }
        </p>

        {/* Price */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xl font-bold text-[#14532D]">
              ৳
              {currentPrice}
            </p>

            {hasLowerPrice && (
              <p className="text-sm text-gray-400 line-through">
                ৳
                {
                  product.regularPrice
                }
              </p>
            )}
          </div>

          <DiscountCountdown
            enabled={
              product.discountEnabled
            }
            startAt={
              product.discountStartAt
            }
            endAt={
              product.discountEndAt
            }
          />
        </div>

        {/* Stock */}
        <p
          className={`mt-4 text-xs font-semibold ${
            product.stock > 0
              ? "text-green-700"
              : "text-red-500"
          }`}
        >
          {product.stock > 0
            ? "In Stock"
            : "Out of Stock"}
        </p>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href={`/products/${product.slug}`}
            className="flex items-center justify-center rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#14532D] hover:text-[#14532D]"
          >
            বিস্তারিত
          </Link>

          <button
            type="button"
            onClick={
              handleAddToCart
            }
            disabled={
              product.stock <= 0
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-3 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingCart
              size={17}
            />

            Cart
          </button>
        </div>
      </div>
    </article>
  );
}