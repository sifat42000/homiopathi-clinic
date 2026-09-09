import Link from "next/link";

import {
  CalendarCheck2,
  Home,
} from "lucide-react";

import PublicLayout from "@/components/layout/PublicLayout";

type PageProps = {
  searchParams: Promise<{
    appointment?: string;
  }>;
};

export default async function AppointmentSuccessPage({
  searchParams,
}: PageProps) {
  const {
    appointment,
  } = await searchParams;

  return (
    <PublicLayout>
      <section className="bg-[#F7FBF8] py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="rounded-[30px] border border-green-100 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-[#15803D]">
              <CalendarCheck2
                size={38}
              />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Appointment Request গ্রহণ করা হয়েছে
            </h1>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              আপনার Appointment বর্তমানে Pending। Admin/Doctor Confirm করার
              পর Status পরিবর্তন হবে।
            </p>

            {appointment && (
              <div className="mt-7 rounded-2xl bg-[#F7FBF8] p-5">
                <p className="text-xs font-semibold uppercase text-gray-400">
                  Appointment Number
                </p>

                <p className="font-english mt-2 text-xl font-bold text-[#14532D]">
                  {appointment}
                </p>
              </div>
            )}

            <Link
              href="/"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white"
            >
              <Home
                size={18}
              />

              Home
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}