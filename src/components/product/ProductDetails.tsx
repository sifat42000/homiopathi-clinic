"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Minus,
  PackageCheck,
  Plus,
  ShoppingCart,
} from "lucide-react";

import type {
  Product,
} from "@/data/products";

import {
  useCartStore,
} from "@/stores/cart-store";

import ProductImageGallery from "@/components/product/ProductImageGallery";

import DiscountCountdown from "@/components/product/DiscountCountdown";

import {
  getEffectiveProductPrice,
  isTimedDiscountActive,
} from "@/lib/product-pricing";

type ProductDetailsProps = {
  product: Product;
};

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const addItem =
    useCartStore(
      (state) =>
        state.addItem
    );

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    added,
    setAdded,
  ] = useState(false);

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

  const decreaseQuantity =
    () => {
      setQuantity(
        (current) =>
          Math.max(
            1,
            current - 1
          )
      );
    };

  const increaseQuantity =
    () => {
      setQuantity(
        (current) =>
          Math.min(
            product.stock,
            current + 1
          )
      );
    };

  const handleAddToCart =
    () => {
      if (
        product.stock <= 0
      ) {
        return;
      }

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
        quantity
      );

      setAdded(true);

      window.setTimeout(
        () => {
          setAdded(false);
        },
        2500
      );
    };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      {/* Gallery */}
      <ProductImageGallery
        images={
          product.images ??
          []
        }
        productName={
          product.name
        }
      />

      {/* Product Info */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-[#15803D]">
            {
              product.category
            }
          </span>

          {product.badge && (
            <span className="rounded-full bg-[#14532D] px-3 py-1 text-xs font-semibold text-white">
              {
                product.badge
              }
            </span>
          )}

          {timedDiscountActive && (
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
              Limited Time Offer
            </span>
          )}
        </div>

        <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
          {product.name}
        </h1>

        <p className="font-english mt-2 text-sm text-gray-400">
          {
            product.englishName
          }
        </p>

        {/* Price */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-3xl font-bold text-[#14532D]">
              ৳
              {currentPrice}
            </p>

            {hasLowerPrice && (
              <span className="text-lg text-gray-400 line-through">
                ৳
                {
                  product.regularPrice
                }
              </span>
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

        {/* Short Description */}
        <p className="mt-6 leading-8 text-gray-600">
          {
            product.shortDescription
          }
        </p>

        {/* Product Meta */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-[#F7FBF8] p-4">
            <p className="text-xs text-gray-400">
              Size
            </p>

            <p className="mt-1 font-semibold text-gray-800">
              {
                product.size
              }
            </p>
          </div>

          <div className="rounded-xl bg-[#F7FBF8] p-4">
            <p className="text-xs text-gray-400">
              SKU
            </p>

            <p className="font-english mt-1 font-semibold text-gray-800">
              {
                product.sku
              }
            </p>
          </div>
        </div>

        {/* Stock */}
        <div className="mt-5 flex items-center gap-2">
          <PackageCheck
            size={18}
            className={
              product.stock > 0
                ? "text-green-600"
                : "text-red-500"
            }
          />

          <p
            className={`text-sm font-semibold ${
              product.stock > 0
                ? "text-green-700"
                : "text-red-500"
            }`}
          >
            {product.stock > 0
              ? "In Stock"
              : "বর্তমানে Stock নেই"}
          </p>
        </div>

        {/* Quantity + Cart */}
        {product.stock > 0 && (
          <div className="mt-7 flex flex-col gap-4 sm:flex-row">
            <div className="flex h-12 items-center overflow-hidden rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  quantity <= 1
                }
                className="flex h-full w-12 items-center justify-center disabled:opacity-30"
              >
                <Minus
                  size={17}
                />
              </button>

              <span className="font-english flex w-12 items-center justify-center font-bold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                disabled={
                  quantity >=
                  product.stock
                }
                className="flex h-full w-12 items-center justify-center disabled:opacity-30"
              >
                <Plus
                  size={17}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={
                handleAddToCart
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-3 font-semibold text-white"
            >
              {added ? (
                <CheckCircle2
                  size={19}
                />
              ) : (
                <ShoppingCart
                  size={19}
                />
              )}

              {added
                ? "Cart-এ Add হয়েছে"
                : "Add to Cart"}
            </button>
          </div>
        )}

        {/* Full Description */}
        <div className="mt-9 border-t border-gray-100 pt-7">
          <h2 className="text-xl font-bold text-gray-900">
            Product Details
          </h2>

          <p className="mt-4 whitespace-pre-line leading-8 text-gray-600">
            {
              product.description
            }
          </p>
        </div>

        {/* Usage */}
        <div className="mt-7 rounded-2xl border border-green-100 bg-green-50/50 p-5">
          <h2 className="font-bold text-gray-900">
            Usage Information
          </h2>

          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
            {
              product.usageInfo
            }
          </p>
        </div>
      </div>
    </div>
  );
}