import Link from "next/link";
import {
  CalendarDays,
  UserRound,
} from "lucide-react";

import CartButton from "@/components/layout/CartButton";
import MobileMenu from "@/components/layout/MobileMenu";
import { navItems } from "@/data/navigation";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      
      {/* Top Announcement Bar */}
      <div className="bg-[#14532D] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2 text-center text-xs sm:px-6 sm:text-sm lg:px-8">
          স্বাস্থ্যসেবা, অ্যাপয়েন্টমেন্ট ও প্রয়োজনীয় প্রোডাক্ট—সবকিছু এক জায়গায়
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div>
              <h1 className="text-xl font-bold leading-none text-[#14532D] sm:text-2xl">
                হোমিও কেয়ার
              </h1>

              <p className="font-english mt-1 text-[9px] uppercase tracking-[0.18em] text-gray-400 sm:text-[10px]">
                Homeopathic Clinic
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 transition hover:text-[#14532D]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 lg:flex">
            
            {/* Account */}
            <Link
              href="/login"
              aria-label="লগইন"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-green-50 hover:text-[#14532D]"
            >
              <UserRound size={20} />
            </Link>

            {/* Real Cart */}
            <CartButton />

            {/* Appointment */}
            <Link
              href="/appointment"
              className="ml-2 flex items-center gap-2 rounded-xl bg-[#14532D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#166534]"
            >
              <CalendarDays size={17} />

              অ্যাপয়েন্টমেন্ট
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <CartButton mobile />

            <MobileMenu />
          </div>

        </div>
      </div>
    </header>
  );
}