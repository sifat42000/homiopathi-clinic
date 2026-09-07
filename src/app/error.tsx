"use client";

import {
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7FBF8] px-4">
      <div className="w-full max-w-xl rounded-[28px] border border-red-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <AlertTriangle size={29} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          কিছু একটা সমস্যা হয়েছে
        </h1>

        <p className="mt-3 text-sm leading-7 text-gray-500">
          Page load করার সময় একটি unexpected error হয়েছে। আবার চেষ্টা করুন।
        </p>

        {process.env.NODE_ENV ===
          "development" && (
          <p className="font-english mt-4 break-words rounded-xl bg-gray-50 p-3 text-left text-xs text-red-500">
            {error.message}
          </p>
        )}

        <button
          type="button"
          onClick={reset}
          className="mx-auto mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white"
        >
          <RefreshCcw size={17} />

          আবার চেষ্টা করুন
        </button>
      </div>
    </div>
  );
}