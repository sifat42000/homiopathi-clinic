"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import {
  ImagePlus,
  Trash2,
} from "lucide-react";

import type {
  ProductImage,
} from "@/types/product-image";

type ProductImageFieldProps = {
  existingImages:
    ProductImage[];

  newFiles: File[];

  onAddFiles: (
    files: File[]
  ) => void;

  onRemoveExisting: (
    image: ProductImage
  ) => void;

  onRemoveNew: (
    index: number
  ) => void;
};

const MAX_IMAGES = 5;

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function ProductImageField({
  existingImages,
  newFiles,
  onAddFiles,
  onRemoveExisting,
  onRemoveNew,
}: ProductImageFieldProps) {
  const [
    previews,
    setPreviews,
  ] = useState<string[]>(
    []
  );

  const [error, setError] =
    useState("");

  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  useEffect(() => {
    const urls =
      newFiles.map(
        (file) =>
          URL.createObjectURL(
            file
          )
      );

    setPreviews(urls);

    return () => {
      urls.forEach(
        (url) =>
          URL.revokeObjectURL(
            url
          )
      );
    };
  }, [newFiles]);

  const totalImages =
    existingImages.length +
    newFiles.length;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setError("");

    const selected =
      Array.from(
        event.target.files ??
          []
      );

    if (
      selected.length === 0
    ) {
      return;
    }

    const remaining =
      MAX_IMAGES -
      totalImages;

    if (
      remaining <= 0
    ) {
      setError(
        "একটি Product-এ সর্বোচ্চ ৫টি ছবি রাখা যাবে।"
      );

      return;
    }

    const validFiles: File[] =
      [];

    for (
      const file of
      selected
    ) {
      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        setError(
          "শুধু JPG, PNG অথবা WEBP Image ব্যবহার করুন।"
        );

        continue;
      }

      if (
        file.size >
        MAX_FILE_SIZE
      ) {
        setError(
          "প্রতিটি Image সর্বোচ্চ 5MB হতে পারবে।"
        );

        continue;
      }

      validFiles.push(
        file
      );
    }

    onAddFiles(
      validFiles.slice(
        0,
        remaining
      )
    );

    if (
      inputRef.current
    ) {
      inputRef.current.value =
        "";
    }
  };

  return (
    <div className="sm:col-span-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-700">
            Product Images
          </p>

          <p className="mt-1 text-xs text-gray-400">
            JPG, PNG, WEBP • Max
            5MB • সর্বোচ্চ ৫টি
          </p>
        </div>

        <span className="font-english text-xs font-semibold text-gray-400">
          {totalImages}/5
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {existingImages.map(
          (image) => (
            <div
              key={
                image.publicId
              }
              className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50"
            >
              <Image
                src={image.url}
                alt="Product"
                fill
                className="object-cover"
                sizes="160px"
              />

              <button
                type="button"
                onClick={() =>
                  onRemoveExisting(
                    image
                  )
                }
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-500 shadow"
              >
                <Trash2
                  size={15}
                />
              </button>
            </div>
          )
        )}

        {previews.map(
          (preview, index) => (
            <div
              key={preview}
              className="relative aspect-square overflow-hidden rounded-2xl border border-green-200 bg-gray-50"
            >
              <Image
                src={preview}
                alt="New product preview"
                fill
                unoptimized
                className="object-cover"
              />

              <span className="absolute bottom-2 left-2 rounded-full bg-[#14532D] px-2 py-1 text-[9px] font-semibold text-white">
                NEW
              </span>

              <button
                type="button"
                onClick={() =>
                  onRemoveNew(
                    index
                  )
                }
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-500 shadow"
              >
                <Trash2
                  size={15}
                />
              </button>
            </div>
          )
        )}

        {totalImages <
          MAX_IMAGES && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-[#FAFAF7] text-center transition hover:border-green-300">
            <ImagePlus
              size={27}
              className="text-[#14532D]"
            />

            <span className="mt-2 text-xs font-semibold text-gray-600">
              Image Add
            </span>

            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={
                handleChange
              }
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}