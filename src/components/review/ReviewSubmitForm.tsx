"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  CheckCircle2,
  ImagePlus,
  Send,
  Star,
  Trash2,
} from "lucide-react";

export default function ReviewSubmitForm() {
  const [rating, setRating] = useState(0);

  const [hoverRating, setHoverRating] =
    useState(0);

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setError("");

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "শুধু JPG, PNG অথবা WEBP ছবি ব্যবহার করুন।"
      );

      event.target.value = "";

      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "ছবির Size সর্বোচ্চ 5MB হতে পারবে।"
      );

      event.target.value = "";

      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const preview =
      URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(preview);
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (rating === 0) {
      setError(
        "Review Submit করার আগে Star Rating নির্বাচন করুন।"
      );

      return;
    }

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const name = String(
      formData.get("name") ?? ""
    ).trim();

    const review = String(
      formData.get("review") ?? ""
    ).trim();

    if (name.length < 2) {
      setError(
        "আপনার নাম সঠিকভাবে লিখুন।"
      );

      return;
    }

    if (review.length < 15) {
      setError(
        "Review কমপক্ষে ১৫ অক্ষরের লিখুন।"
      );

      return;
    }

    /*
      Frontend Demo Only

      Backend Phase-এ এখানে:
      1. Image → Cloudinary
      2. Review → MongoDB
      3. status → pending
      4. Admin approve/reject
    */

    console.log({
      rating,
      imageFile,
    });

    setSuccess(true);

    form.reset();

    setRating(0);
    setHoverRating(0);

    removeImage();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-green-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900">
        আপনার অভিজ্ঞতা শেয়ার করুন
      </h2>

      <p className="mt-2 text-sm leading-7 text-gray-500">
        আপনার সত্যিকারের অভিজ্ঞতা লিখুন। Review প্রকাশের আগে Admin যাচাই
        করবেন।
      </p>

      {/* Rating */}
      <div className="mt-7">
        <p className="mb-3 text-sm font-semibold text-gray-700">
          আপনার Rating *
        </p>

        <div
          className="flex items-center gap-1"
          onMouseLeave={() =>
            setHoverRating(0)
          }
        >
          {Array.from({
            length: 5,
          }).map((_, index) => {
            const value = index + 1;

            const active =
              value <=
              (hoverRating || rating);

            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setRating(value)
                }
                onMouseEnter={() =>
                  setHoverRating(value)
                }
                aria-label={`${value} Star`}
                className="p-1"
              >
                <Star
                  size={30}
                  className={
                    active
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200"
                  }
                />
              </button>
            );
          })}

          {rating > 0 && (
            <span className="ml-3 font-english text-sm font-semibold text-gray-500">
              {rating}/5
            </span>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        
        {/* Name */}
        <div>
          <label
            htmlFor="review-name"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            আপনার নাম *
          </label>

          <input
            id="review-name"
            name="name"
            type="text"
            required
            placeholder="আপনার নাম লিখুন"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#14532D]"
          />
        </div>

        {/* Service */}
        <div>
          <label
            htmlFor="review-service"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            কোন সেবার Review? *
          </label>

          <select
            id="review-service"
            name="service"
            required
            defaultValue=""
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#14532D]"
          >
            <option
              value=""
              disabled
            >
              নির্বাচন করুন
            </option>

            <option value="appointment">
              Appointment / Consultation
            </option>

            <option value="product">
              Product Order
            </option>

            <option value="website">
              Website Experience
            </option>
          </select>
        </div>
      </div>

      {/* Review */}
      <div className="mt-5">
        <label
          htmlFor="review"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          আপনার Review *
        </label>

        <textarea
          id="review"
          name="review"
          required
          rows={5}
          placeholder="আপনার সত্যিকারের অভিজ্ঞতা লিখুন..."
          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#14532D]"
        />
      </div>

      {/* Image */}
      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-gray-700">
          Review-এর ছবি{" "}
          <span className="font-normal text-gray-400">
            (Optional)
          </span>
        </p>

        {!imagePreview ? (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-[#FAFAF7] px-5 py-8 text-center transition hover:border-green-300 hover:bg-green-50/40">
            <ImagePlus
              size={32}
              className="text-[#14532D]"
            />

            <p className="mt-3 text-sm font-semibold text-gray-700">
              ছবি নির্বাচন করুন
            </p>

            <p className="mt-1 font-english text-xs text-gray-400">
              JPG, PNG, WEBP • Max 5MB
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={
                handleImageChange
              }
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
            <div className="relative aspect-[4/3]">
              <Image
                src={imagePreview}
                alt="Review image preview"
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <button
              type="button"
              onClick={removeImage}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-500 shadow-md"
              aria-label="ছবি সরান"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-red-600">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-4">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0 text-[#15803D]"
          />

          <div>
            <p className="font-semibold text-[#166534]">
              Review গ্রহণ করা হয়েছে
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Frontend Demo হিসেবে Review submit হয়েছে। Backend Phase-এ এটি
              Pending অবস্থায় Admin Panel-এ যাবে এবং Approve হলে Website-এ
              প্রকাশ হবে।
            </p>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white transition hover:bg-[#166534] sm:w-auto"
      >
        <Send size={18} />

        Review Submit করুন
      </button>
    </form>
  );
}