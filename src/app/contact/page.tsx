"use client";

import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import ContactForm from "@/components/contact/ContactForm";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";
import {
  useWebsiteSettings,
} from "@/components/layout/WebsiteSettingsProvider";

export default function ContactPage() {
  const settings = useWebsiteSettings();

  return (
    <PublicLayout>
      
      {/* Page Hero */}
      <PageHero
        badge="যোগাযোগ"
        title="প্রয়োজনে আমাদের সাথে সহজেই যোগাযোগ করুন"
        description="Appointment, Product অথবা সাধারণ কোনো প্রশ্ন থাকলে নিচের যোগাযোগের মাধ্যম অথবা Contact Form ব্যবহার করতে পারবেন।"
        currentPage="যোগাযোগ"
      />

      {/* Contact Information */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Phone */}
            <div className="rounded-[22px] border border-gray-100 bg-[#FAFAF7] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
                <Phone size={22} />
              </div>

              <h3 className="mt-5 font-bold text-gray-900">
                ফোন
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {settings.phone}
              </p>
            </div>

            {/* Email */}
            <div className="rounded-[22px] border border-gray-100 bg-[#FAFAF7] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
                <Mail size={22} />
              </div>

              <h3 className="mt-5 font-bold text-gray-900">
                Email
              </h3>

              <p className="font-english mt-2 text-sm leading-6 text-gray-500">
                {settings.email}
              </p>
            </div>

            {/* Address */}
            <div className="rounded-[22px] border border-gray-100 bg-[#FAFAF7] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
                <MapPin size={22} />
              </div>

              <h3 className="mt-5 font-bold text-gray-900">
                চেম্বারের ঠিকানা
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {settings.address}
              </p>
            </div>

            {/* Time */}
            <div className="rounded-[22px] border border-gray-100 bg-[#FAFAF7] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
                <Clock3 size={22} />
              </div>

              <h3 className="mt-5 font-bold text-gray-900">
                চেম্বারের সময়
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {settings.chamberTime}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="bg-[#F7FBF8] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          
          {/* Form */}
          <ContactForm />

          {/* Map / Chamber */}
          <div className="overflow-hidden rounded-[28px] border border-green-100 bg-white p-5 sm:p-6">
            <div className="flex min-h-[360px] items-center justify-center rounded-[22px] bg-[#E8F5EB]">
              <div className="max-w-xs px-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                  <MapPin
                    size={36}
                    className="text-[#14532D]"
                  />
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  Chamber Location
                </h3>

                <p className="mt-2 text-sm leading-7 text-gray-500">
                  পরে এখানে Google Map অথবা চেম্বারের Location Map যুক্ত করা
                  হবে।
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[#14532D] p-5 text-white">
              <div className="flex items-start gap-3">
                <MessageCircle
                  size={21}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <h4 className="font-semibold">
                    দ্রুত যোগাযোগ প্রয়োজন?
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-green-100/75">
                    ভবিষ্যতে এখানে Phone ও WhatsApp Quick Contact যুক্ত করা
                    হবে।
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}