"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Menu, Phone, X } from "lucide-react";
import { navItems } from "@/data/navigation";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 lg:hidden"
        aria-label="মেনু খুলুন"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white lg:hidden">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <Link href="/" onClick={closeMenu}>
              <div>
                <h2 className="text-xl font-bold text-[#14532D]">
                  হোমিও কেয়ার
                </h2>

                <p className="font-english text-[10px] uppercase tracking-[0.18em] text-gray-400">
                  Homeopathic Clinic
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={closeMenu}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700"
              aria-label="মেনু বন্ধ করুন"
            >
              <X size={22} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-5 py-6">
            <div className="flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="border-b border-gray-100 py-4 text-base font-medium text-gray-700 transition hover:text-[#14532D]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Appointment Button */}
            <Link
              href="/appointment"
              onClick={closeMenu}
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3.5 font-semibold text-white transition hover:bg-[#166534]"
            >
              <CalendarDays size={19} />

              অ্যাপয়েন্টমেন্ট নিন
            </Link>

            {/* Call Button */}
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#14532D] px-5 py-3.5 font-semibold text-[#14532D]"
            >
              <Phone size={18} />

              যোগাযোগ করুন
            </button>
          </nav>
        </div>
      )}
    </>
  );
}