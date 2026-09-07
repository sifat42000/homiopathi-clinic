"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

import SectionTitle from "@/components/ui/SectionTitle";
import { faqs } from "@/data/faq";

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  const handleToggle = (id: number) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="bg-[#F7FBF8] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="সাধারণ প্রশ্ন"
          title="আপনার জানতে চাওয়া কিছু সাধারণ প্রশ্নের উত্তর"
          description="Appointment, Product Order এবং চেম্বার সম্পর্কিত সাধারণ প্রশ্নগুলোর উত্তর এখানে সহজভাবে দেওয়া হয়েছে।"
        />

        <div className="mt-12 space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(faq.id)}
                  className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#14532D] sm:flex">
                      <HelpCircle size={19} />
                    </div>

                    <span className="font-semibold leading-7 text-gray-900">
                      {faq.question}
                    </span>
                  </div>

                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-gray-500 transition duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-gray-100 px-5 py-5 text-sm leading-7 text-gray-500 sm:px-6 sm:pl-[76px]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}