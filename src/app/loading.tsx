import {
  HeartPulse,
} from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#F7FBF8] px-4">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
          <HeartPulse size={29} />
        </div>

        <p className="mt-4 text-sm font-semibold text-gray-600">
          Loading...
        </p>
      </div>
    </div>
  );
}