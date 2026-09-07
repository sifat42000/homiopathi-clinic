import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Stethoscope,
} from "lucide-react";

import SectionTitle from "@/components/ui/SectionTitle";
import { appointmentSteps } from "@/data/process";

const processIcons = {
  stethoscope: Stethoscope,
  calendar: CalendarDays,
  clipboard: ClipboardList,
  check: CheckCircle2,
};

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="কীভাবে কাজ করে?"
          title="মাত্র কয়েকটি সহজ ধাপেই Appointment নিন"
          description="জটিল কোনো প্রক্রিয়া নয়। আপনার প্রয়োজনীয় সেবা নির্বাচন করে সহজেই চেম্বারের Appointment বুক করতে পারবেন।"
        />

        <div className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Desktop Connecting Line */}
          <div className="absolute left-[12%] right-[12%] top-14 hidden h-px bg-green-200 lg:block" />

          {appointmentSteps.map((item) => {
            const Icon =
              processIcons[item.icon as keyof typeof processIcons];

            return (
              <div
                key={item.id}
                className="relative z-10 rounded-[24px] border border-green-100 bg-[#FAFAF7] p-6 text-center transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_50px_rgba(20,83,45,0.08)]"
              >
                {/* Step Circle */}
                <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border-8 border-white bg-[#E7F5EA] shadow-sm">
                  <Icon
                    size={34}
                    strokeWidth={1.7}
                    className="text-[#14532D]"
                  />

                  <span className="absolute -right-1 -top-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#14532D] font-english text-xs font-bold text-white">
                    {item.step}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}