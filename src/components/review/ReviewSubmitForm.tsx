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
  Loader2,
  Star,
  X,
} from "lucide-react";

export default function ReviewSubmitForm() {
  const [
    rating,
    setRating,
  ] = useState(5);

  const [
    imageFile,
    setImageFile,
  ] = useState<
    File | null
  >(null);

  const [
    preview,
    setPreview,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    if (!imageFile) {
      setPreview("");

      return;
    }

    const url =
      URL.createObjectURL(
        imageFile
      );

    setPreview(url);

    return () => {
      URL.revokeObjectURL(
        url
      );
    };
  }, [imageFile]);

  const handleImage = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setError("");

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setError(
        "শুধু JPG, PNG অথবা WEBP Image ব্যবহার করুন।"
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image সর্বোচ্চ 5MB হতে পারবে।"
      );

      return;
    }

    setImageFile(file);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    formData.set(
      "rating",
      String(rating)
    );

    if (imageFile) {
      formData.set(
        "image",
        imageFile
      );
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/reviews",
          {
            method: "POST",

            body:
              formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message
        );
      }

      form.reset();

      setRating(5);

      setImageFile(null);

      setSuccess(
        "Review Submit হয়েছে। Admin অনুমোদন করলে Website-এ দেখা যাবে।"
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Review Submit করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-gray-900">
        আপনার মতামত দিন
      </h2>

      <p className="mt-2 text-sm leading-7 text-gray-500">
        আপনার বাস্তব অভিজ্ঞতা সংক্ষেপে লিখুন। Review প্রকাশের আগে Admin
        moderation করা হবে।
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            আপনার নাম *
          </label>

          <input
            name="name"
            required
            minLength={2}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Service *
          </label>

          <select
            name="service"
            required
            defaultValue=""
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
          >
            <option
              value=""
              disabled
            >
              নির্বাচন করুন
            </option>

            <option value="Consultation">
              Consultation
            </option>

            <option value="Appointment">
              Appointment
            </option>

            <option value="Product">
              Product
            </option>

            <option value="Website Experience">
              Website Experience
            </option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Rating *
          </label>

          <div className="flex gap-2">
            {[
              1,
              2,
              3,
              4,
              5,
            ].map(
              (value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setRating(
                      value
                    )
                  }
                >
                  <Star
                    size={26}
                    className={
                      value <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                    }
                  />
                </button>
              )
            )}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            আপনার Review *
          </label>

          <textarea
            name="review"
            required
            minLength={10}
            maxLength={1000}
            rows={5}
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
          />
        </div>

        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-semibold text-gray-700">
            Image (Optional)
          </p>

          {!preview ? (
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-5">
              <ImagePlus
                size={24}
                className="text-[#14532D]"
              />

              <div>
                <p className="text-sm font-semibold">
                  Image Select করুন
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  JPG / PNG / WEBP • Max 5MB
                </p>
              </div>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleImage
                }
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative h-40 w-40 overflow-hidden rounded-2xl border">
              <Image
                src={preview}
                alt="Review preview"
                fill
                unoptimized
                className="object-cover"
              />

              <button
                type="button"
                onClick={() =>
                  setImageFile(
                    null
                  )
                }
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-500 shadow"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2
            size={18}
          />

          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex items-center gap-2 rounded-xl bg-[#14532D] px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        {loading ? (
          <Loader2
            size={18}
            className="animate-spin"
          />
        ) : (
          <Star size={18} />
        )}

        {loading
          ? "Submitting..."
          : "Review Submit"}
      </button>
    </form>
  );
}