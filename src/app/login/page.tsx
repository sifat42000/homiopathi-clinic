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
  Loader2,
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";

import {
  signIn,
} from "@/lib/auth-client";
import {
  useWebsiteSettings,
} from "@/components/layout/WebsiteSettingsProvider";

export default function LoginPage() {
  const settings = useWebsiteSettings();

  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const formData =
      new FormData(
        event.currentTarget
      );

    const email =
      String(
        formData.get(
          "email"
        ) ?? ""
      )
        .trim()
        .toLowerCase();

    const password =
      String(
        formData.get(
          "password"
        ) ?? ""
      );

    try {
      setLoading(true);

      const result =
        await signIn.email({
          email,

          password,
        });

      if (
        result.error
      ) {
        throw new Error(
          result.error.message ||
            "Email অথবা Password সঠিক নয়।"
        );
      }

      /*
        Login cookie/session set হওয়ার
        পর account page-এ পাঠাচ্ছি।
      */

      router.replace(
        "/account"
      );

      /*
        Server + Client components
        দুটোই নতুন session পাবে।
      */
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7FBF8] px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="block text-center"
        >
          <h1 className="text-3xl font-bold text-[#14532D]">
            {settings.clinicName}
          </h1>

          <p className="font-english mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">
            {settings.englishName}
          </p>
        </Link>

        <div className="mt-8 rounded-[28px] border border-gray-100 bg-white p-7 shadow-sm sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
              <LogIn
                size={25}
              />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Login করুন
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              আপনার Account-এ প্রবেশ করুন।
            </p>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-7 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                  className="font-english w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#14532D]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="font-english w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#14532D]"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3.5 font-semibold text-white disabled:opacity-50"
            >
              {loading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <LogIn
                  size={18}
                />
              )}

              {loading
                ? "Login হচ্ছে..."
                : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Account নেই?{" "}
            <Link
              href="/register"
              className="font-bold text-[#14532D]"
            >
              Register করুন
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}