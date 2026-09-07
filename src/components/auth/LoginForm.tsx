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
  LogIn,
  Mail,
} from "lucide-react";

import {
  authClient,
} from "@/lib/auth-client";

export default function LoginForm() {
  const router =
    useRouter();

  const [
    showPassword,
    setShowPassword,
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

    const email = String(
      formData.get("email") ??
        ""
    )
      .trim()
      .toLowerCase();

    const password =
      String(
        formData.get(
          "password"
        ) ?? ""
      );

    const rememberMe =
      formData.get(
        "rememberMe"
      ) === "on";

    setLoading(true);

    try {
      const {
        data,
        error:
          authError,
      } =
        await authClient.signIn.email(
          {
            email,
            password,
            rememberMe,
          }
        );

      if (authError) {
        setError(
          authError.message ||
            "Email অথবা Password সঠিক নয়।"
        );

        return;
      }

      if (!data?.user) {
        setError(
          "Login করা যায়নি।"
        );

        return;
      }

      const role =
        data.user.role;

      const isAdmin =
        typeof role === "string" &&
        role
          .split(",")
          .includes("admin");

      router.push(
        isAdmin
          ? "/admin"
          : "/account"
      );

      router.refresh();
    } catch {
      setError(
        "Login করার সময় সমস্যা হয়েছে।"
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
          <LogIn size={25} />
        </div>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          আপনার Account-এ Login করুন
        </h1>

        <p className="mt-2 text-sm leading-7 text-gray-500">
          Email এবং Password দিয়ে Login করুন।
        </p>
      </div>

      <div className="mt-8">
        <label
          htmlFor="login-email"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Email
        </label>

        <div className="relative">
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            id="login-email"
            name="email"
            type="email"
            required
            className="font-english w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#14532D]"
          />
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="login-password"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Password
        </label>

        <div className="relative">
          <LockKeyhole
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            id="login-password"
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

      <label className="mt-5 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
        <input
          name="rememberMe"
          type="checkbox"
          defaultChecked
          className="h-4 w-4 accent-[#14532D]"
        />

        আমাকে মনে রাখুন
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
        <LogIn size={18} />

        {loading
          ? "Login হচ্ছে..."
          : "Login করুন"}
      </button>

      <p className="mt-7 text-center text-sm text-gray-500">
        নতুন Account?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#14532D]"
        >
          Register করুন
        </Link>
      </p>
    </form>
  );
}