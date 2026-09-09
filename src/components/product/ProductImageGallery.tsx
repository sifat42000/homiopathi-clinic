"use client";

import {
  useState,
} from "react";

import Image from "next/image";

import {
  ImageIcon,
} from "lucide-react";

import type {
  ProductImage,
} from "@/types/product-image";

type ProductImageGalleryProps = {
  images:
    ProductImage[];

  productName:
    string;
};

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [
    selectedIndex,
    setSelectedIndex,
  ] = useState(0);

  if (
    images.length === 0
  ) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-[28px] bg-[#EEF8F0]">
        <div className="text-center">
          <ImageIcon
            size={55}
            strokeWidth={1.3}
            className="mx-auto text-[#14532D]"
          />

          <p className="mt-3 text-sm text-gray-500">
            Product Image
          </p>
        </div>
      </div>
    );
  }

  const selectedImage =
    images[
      Math.min(
        selectedIndex,
        images.length - 1
      )
    ];

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-[28px] border border-gray-100 bg-white">
        <Image
          src={
            selectedImage.url
          }
          alt={productName}
          fill
          priority
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map(
            (
              image,
              index
            ) => (
              <button
                key={
                  image.publicId
                }
                type="button"
                onClick={() =>
                  setSelectedIndex(
                    index
                  )
                }
                className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white ${
                  selectedIndex ===
                  index
                    ? "border-[#14532D]"
                    : "border-gray-100"
                }`}
              >
                <Image
                  src={
                    image.url
                  }
                  alt={`${productName} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}