"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  Settings,
  ShoppingBag,
  Stethoscope,
} from "lucide-react";

import {
  useAdminSettingsStore,
  type SiteSettings,
} from "@/stores/admin-settings-store";

export default function AdminSettingsManager() {
  const settings =
    useAdminSettingsStore(
      (state) =>
        state.settings
    );

  const updateSettings =
    useAdminSettingsStore(
      (state) =>
        state.updateSettings
    );

  const resetSettings =
    useAdminSettingsStore(
      (state) =>
        state.resetSettings
    );

  const [mounted, setMounted] =
    useState(false);

  const [form, setForm] =
    useState<SiteSettings>(
      settings
    );

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    setMounted(true);

    setForm(settings);
  }, [settings]);

  if (!mounted) {
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        Settings Loading...
      </div>
    );
  }

  const updateField = <
    K extends keyof SiteSettings
  >(
    field: K,
    value: SiteSettings[K]
  ) => {
    setForm(
      (current) => ({
        ...current,

        [field]: value,
      })
    );
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    updateSettings(form);

    setSuccess(
      "Settings সফলভাবে Save হয়েছে।"
    );

    window.setTimeout(() => {
      setSuccess("");
    }, 2000);
  };

  const handleReset = () => {
    const confirmed =
      window.confirm(
        "সব Settings Default অবস্থায় Reset করতে চান?"
      );

    if (!confirmed) {
      return;
    }

    resetSettings();

    setSuccess(
      "Settings Reset হয়েছে।"
    );
  };

  return (
    <div>
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-[#15803D]">
          Configuration
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Website Settings
        </h1>

        <p className="mt-2 text-sm leading-7 text-gray-500">
          Clinic, Contact এবং Website-এর সাধারণ Settings এখানে Manage করা
          হবে।
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-7 space-y-6"
      >
        {/* Brand */}
        <section className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
              <Settings size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Brand Information
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Website-এর মূল পরিচিতি
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Clinic Name
              </label>

              <input
                value={
                  form.clinicName
                }
                onChange={(event) =>
                  updateField(
                    "clinicName",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                English Name
              </label>

              <input
                value={
                  form.englishName
                }
                onChange={(event) =>
                  updateField(
                    "englishName",
                    event.target.value
                  )
                }
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Doctor Name
              </label>

              <input
                value={
                  form.doctorName
                }
                onChange={(event) =>
                  updateField(
                    "doctorName",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Top Announcement
              </label>

              <input
                value={
                  form.announcement
                }
                onChange={(event) =>
                  updateField(
                    "announcement",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Contact Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            
            {/* Phone */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Phone size={15} />

                Phone
              </label>

              <input
                value={form.phone}
                onChange={(event) =>
                  updateField(
                    "phone",
                    event.target.value
                  )
                }
                placeholder="01XXXXXXXXX"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                WhatsApp
              </label>

              <input
                value={
                  form.whatsapp
                }
                onChange={(event) =>
                  updateField(
                    "whatsapp",
                    event.target.value
                  )
                }
                placeholder="01XXXXXXXXX"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Mail size={15} />

                Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value
                  )
                }
                placeholder="example@email.com"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MapPin size={15} />

                Chamber Address
              </label>

              <textarea
                rows={3}
                value={
                  form.address
                }
                onChange={(event) =>
                  updateField(
                    "address",
                    event.target.value
                  )
                }
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Time */}
            <div className="sm:col-span-2">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock3 size={15} />

                Chamber Time
              </label>

              <input
                value={
                  form.chamberTime
                }
                onChange={(event) =>
                  updateField(
                    "chamberTime",
                    event.target.value
                  )
                }
                placeholder="শনিবার–বৃহস্পতিবার, বিকাল ৪টা–রাত ৮টা"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>
          </div>
        </section>

        {/* Commerce */}
        <section className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Service Settings
          </h2>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Default Delivery Charge
            </label>

            <input
              type="number"
              min="0"
              value={
                form.deliveryCharge
              }
              onChange={(event) =>
                updateField(
                  "deliveryCharge",
                  Number(
                    event.target
                      .value
                  )
                )
              }
              className="font-english w-full max-w-sm rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
            />
          </div>

          {/* Switches */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            
            <button
              type="button"
              onClick={() =>
                updateField(
                  "appointmentEnabled",
                  !form.appointmentEnabled
                )
              }
              className={`rounded-2xl border p-5 text-left transition ${
                form.appointmentEnabled
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <Stethoscope
                size={21}
                className={
                  form.appointmentEnabled
                    ? "text-[#14532D]"
                    : "text-gray-400"
                }
              />

              <p className="mt-3 font-semibold text-gray-900">
                Appointment System
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {form.appointmentEnabled
                  ? "Enabled"
                  : "Disabled"}
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                updateField(
                  "shopEnabled",
                  !form.shopEnabled
                )
              }
              className={`rounded-2xl border p-5 text-left transition ${
                form.shopEnabled
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <ShoppingBag
                size={21}
                className={
                  form.shopEnabled
                    ? "text-[#14532D]"
                    : "text-gray-400"
                }
              />

              <p className="mt-3 font-semibold text-gray-900">
                Product Shop
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {form.shopEnabled
                  ? "Enabled"
                  : "Disabled"}
              </p>
            </button>
          </div>
        </section>

        {/* Message */}
        {success && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-[#166534]">
            <CheckCircle2
              size={18}
            />

            {success}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#14532D] px-6 py-3 font-semibold text-white"
          >
            <Save size={18} />

            Settings Save
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-600"
          >
            <RotateCcw
              size={17}
            />

            Reset
          </button>
        </div>
      </form>

      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
        Settings এখন LocalStorage-এ Save হচ্ছে। Public Header, Footer,
        Checkout ইত্যাদির সাথে সম্পূর্ণ Global Connection Backend Phase-এ
        Database Settings-এর মাধ্যমে করব।
      </div>
    </div>
  );
}