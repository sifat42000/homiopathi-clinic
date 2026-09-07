import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ShoppingBag,
  Stethoscope,
} from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-[#14532D] px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
          
          {/* Decorative Background */}
          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-white/5" />

          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-green-300/5" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-green-50">
                <Stethoscope size={17} />

                আপনার প্রয়োজন অনুযায়ী পরবর্তী পদক্ষেপ নিন
              </div>

              <h2 className="mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-[46px]">
                চিকিৎসকের পরামর্শ নিতে চান অথবা প্রয়োজনীয় প্রোডাক্ট খুঁজছেন?
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-green-100/80">
                সহজেই Appointment বুক করুন অথবা আমাদের প্রোডাক্টগুলো দেখে
                আপনার প্রয়োজন অনুযায়ী পণ্য নির্বাচন করুন।
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/appointment"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#14532D] transition hover:bg-green-50"
                >
                  <CalendarDays size={19} />

                  অ্যাপয়েন্টমেন্ট নিন

                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
                >
                  <ShoppingBag size={19} />

                  প্রোডাক্ট দেখুন
                </Link>
              </div>
            </div>

            {/* Right */}
            <div className="grid gap-3">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#14532D]">
                  <CheckCircle2 size={21} />
                </div>

                <div>
                  <p className="font-semibold">
                    সহজ Appointment
                  </p>

                  <p className="mt-1 text-sm text-green-100/70">
                    সুবিধামতো সময় নির্বাচন করুন
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#14532D]">
                  <ShoppingBag size={21} />
                </div>

                <div>
                  <p className="font-semibold">
                    সহজ Product Order
                  </p>

                  <p className="mt-1 text-sm text-green-100/70">
                    প্রয়োজনীয় পণ্য সহজেই অর্ডার করুন
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#14532D]">
                  <Stethoscope size={21} />
                </div>

                <div>
                  <p className="font-semibold">
                    প্রয়োজনীয় তথ্য
                  </p>

                  <p className="mt-1 text-sm text-green-100/70">
                    চিকিৎসক ও সেবা সম্পর্কে সহজ তথ্য
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}