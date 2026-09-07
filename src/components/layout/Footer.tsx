import Link from "next/link";
import {
  Clock3,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F2F1D] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold">
                হোমিও কেয়ার
              </h2>

              <p className="font-english mt-1 text-[10px] uppercase tracking-[0.2em] text-green-200/60">
                Homeopathic Clinic
              </p>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-green-100/65">
              চিকিৎসকের পরামর্শ, সহজ Appointment এবং প্রয়োজনীয়
              হোমিওপ্যাথিক প্রোডাক্ট—সবকিছু একটি সহজ ও ব্যবহারবান্ধব
              প্ল্যাটফর্মে।
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-green-100/80">
              <HeartPulse size={17} />
              স্বাস্থ্যসেবায় সহজ ডিজিটাল অভিজ্ঞতা
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold">
              Quick Links
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-green-100/65">
              <Link
                href="/about"
                className="transition hover:text-white"
              >
                আমাদের সম্পর্কে
              </Link>

              <Link
                href="/treatments"
                className="transition hover:text-white"
              >
                চিকিৎসা সেবা
              </Link>

              <Link
                href="/products"
                className="transition hover:text-white"
              >
                প্রোডাক্ট
              </Link>

              <Link
                href="/health-tips"
                className="transition hover:text-white"
              >
                স্বাস্থ্য টিপস
              </Link>

              <Link
                href="/reviews"
                className="transition hover:text-white"
              >
                রিভিউ
              </Link>
            </div>
          </div>

          {/* Customer */}
          <div>
            <h3 className="font-semibold">
              প্রয়োজনীয় লিংক
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-green-100/65">
              <Link
                href="/appointment"
                className="transition hover:text-white"
              >
                Appointment
              </Link>

              {/* নতুন Order Tracking Link */}
              <Link
                href="/order-tracking"
                className="transition hover:text-white"
              >
                Order Tracking
              </Link>

              <Link
                href="/contact"
                className="transition hover:text-white"
              >
                যোগাযোগ
              </Link>

              <Link
                href="/faq"
                className="transition hover:text-white"
              >
                সাধারণ প্রশ্ন
              </Link>

              <Link
                href="/login"
                className="transition hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/cart"
                className="transition hover:text-white"
              >
                Shopping Cart
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold">
              চেম্বার ও যোগাযোগ
            </h3>

            <div className="mt-5 space-y-4 text-sm text-green-100/65">
              <div className="flex items-start gap-3">
                <Phone
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  মোবাইল নম্বর পরে যুক্ত হবে
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Mail
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  Email Address পরে যুক্ত হবে
                </span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  চেম্বারের পূর্ণ ঠিকানা পরে যুক্ত হবে
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Clock3
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  চেম্বারের সময় পরে যুক্ত হবে
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-green-100/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} Homeopathy Clinic. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/privacy-policy"
              className="transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/medical-disclaimer"
              className="transition hover:text-white"
            >
              Medical Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}