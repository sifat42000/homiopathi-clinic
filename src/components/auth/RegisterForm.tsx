"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserPlus,
  UserRound,
} from "lucide-react";

import {
  authClient,
} from "@/lib/auth-client";

export default function RegisterForm() {
  const router =
    useRouter();

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const formData =
      new FormData(
        event.currentTarget
      );

    const name = String(
      formData.get("name") ??
        ""
    ).trim();

    const email = String(
      formData.get("email") ??
        ""
    )
      .trim()
      .toLowerCase();

    const phone = String(
      formData.get("phone") ??
        ""
    ).trim();

    const password =
      String(
        formData.get(
          "password"
        ) ?? ""
      );

    const confirmPassword =
      String(
        formData.get(
          "confirmPassword"
        ) ?? ""
      );

    const phoneRegex =
      /^01[3-9]\d{8}$/;

    if (
      !phoneRegex.test(phone)
    ) {
      setError(
        "সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।"
      );

      return;
    }

    if (
      password.length < 8
    ) {
      setError(
        "Password কমপক্ষে ৮ অক্ষরের হতে হবে।"
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Password এবং Confirm Password মিলছে না।"
      );

      return;
    }

    setLoading(true);

    try {
      const {
        data,
        error:
          authError,
      } =
        await authClient.signUp.email(
          {
            name,
            email,
            password,
            phone,
          }
        );

      if (authError) {
        setError(
          authError.message ||
            "Account তৈরি করা যায়নি।"
        );

        return;
      }

      if (!data) {
        setError(
          "Account তৈরি করা যায়নি।"
        );

        return;
      }

      router.push(
        "/account"
      );

      router.refresh();
    } catch {
      setError(
        "Registration করার সময় সমস্যা হয়েছে।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
          <UserPlus
            size={25}
          />
        </div>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          নতুন Account তৈরি করুন
        </h1>

        <p className="mt-2 text-sm leading-7 text-gray-500">
          Account তৈরি করলে Order এবং Appointment History সহজে দেখতে
          পারবেন।
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="register-name"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            পূর্ণ নাম *
          </label>

          <div className="relative">
            <UserRound
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="register-name"
              name="name"
              type="text"
              required
              minLength={2}
              placeholder="আপনার পূর্ণ নাম"
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#14532D]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Email *
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="register-email"
              name="email"
              type="email"
              required
              placeholder="example@email.com"
              className="font-english w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#14532D]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="register-phone"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            মোবাইল *
          </label>

          <div className="relative">
            <Phone
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="register-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength={11}
              required
              placeholder="01XXXXXXXXX"
              className="font-english w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#14532D]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Password *
          </label>

          <div className="relative">
            <LockKeyhole
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="register-password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              required
              minLength={8}
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-12 outline-none focus:border-[#14532D]"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (value) =>
                    !value
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? (
                <EyeOff
                  size={18}
                />
              ) : (
                <Eye
                  size={18}
                />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Confirm Password *
          </label>

          <div className="relative">
            <LockKeyhole
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="confirm-password"
              name="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              required
              minLength={8}
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-12 outline-none focus:border-[#14532D]"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (value) =>
                    !value
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? (
                <EyeOff
                  size={18}
                />
              ) : (
                <Eye
                  size={18}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      <label className="mt-5 flex items-start gap-2 text-sm leading-6 text-gray-500">
        <input
          type="checkbox"
          required
          className="mt-1 h-4 w-4 accent-[#14532D]"
        />

        <span>
          আমি{" "}
          <Link
            href="/terms"
            className="font-semibold text-[#14532D]"
          >
            Terms
          </Link>{" "}
          এবং{" "}
          <Link
            href="/privacy-policy"
            className="font-semibold text-[#14532D]"
          >
            Privacy Policy
          </Link>{" "}
          মেনে নিচ্ছি।
        </span>
      </label>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <UserPlus
          size={18}
        />

        {loading
          ? "Account তৈরি হচ্ছে..."
          : "Account তৈরি করুন"}
      </button>

      <p className="mt-7 text-center text-sm text-gray-500">
        ইতোমধ্যে Account আছে?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#14532D]"
        >
          Login করুন
        </Link>
      </p>
    </form>
  );
}