import {
  CalendarDays,
} from "lucide-react";

import CustomerAppointmentsList from "@/components/account/CustomerAppointmentsList";
import AccountLayout from "@/components/account/AccountLayout";
import PublicLayout from "@/components/layout/PublicLayout";

export default function AccountAppointmentsPage() {
  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-180px)] bg-[#F7FBF8] py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AccountLayout>
            <div className="mb-7 flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#15803D]">
                  My Account / Schedule
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  আমার Appointments
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-7 text-gray-500">
                  আপনার বুক করা সময়, Treatment এবং বর্তমান Status এক জায়গায় দেখুন।
                </p>
              </div>

              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#DDF4E4] text-[#14532D] sm:flex">
                <CalendarDays size={23} />
              </div>
            </div>

            <CustomerAppointmentsList />
          </AccountLayout>
        </div>
      </section>
    </PublicLayout>
  );
}