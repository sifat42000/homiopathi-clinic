import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Headphones,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { benefits } from "@/data/process";

const benefitIcons = {
  calendar: CalendarDays,
  shoppingBag: ShoppingBag,
  bookOpen: BookOpen,
  headphones: Headphones,
};

export default function BenefitsSection() {
  return (
    <section className="bg-[#14532D] py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-green-100">
              <ShieldCheck size={17} />

              কেন আমাদের বেছে নেবেন?
            </div>

            <h2 className="mt-5 max-w-xl text-3xl font-bold leading-tight sm:text-4xl lg:text-[44px]">
              সহজ ও স্বচ্ছ স্বাস্থ্যসেবা অভিজ্ঞতার জন্য প্রয়োজনীয় সবকিছু
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-green-100/80">
              চিকিৎসকের তথ্য থেকে শুরু করে Appointment, Product Order এবং
              যোগাযোগ—সবকিছু সহজ ও ব্যবহারবান্ধবভাবে সাজানো থাকবে।
            </p>

            <div className="mt-7 space-y-3">
              <div className="flex items-center gap-3 text-sm text-green-50">
                <CheckCircle2 size={18} />

                Mobile Friendly Website
              </div>

              <div className="flex items-center gap-3 text-sm text-green-50">
                <CheckCircle2 size={18} />

                সহজ বাংলা ভাষা
              </div>

              <div className="flex items-center gap-3 text-sm text-green-50">
                <CheckCircle2 size={18} />

                পরিষ্কার ও সহজ Navigation
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon =
                benefitIcons[
                  benefit.icon as keyof typeof benefitIcons
                ];

              return (
                <div
                  key={benefit.id}
                  className="rounded-[24px] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-sm transition hover:bg-white/[0.11]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#14532D]">
                    <Icon size={23} strokeWidth={1.7} />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-green-100/75">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}