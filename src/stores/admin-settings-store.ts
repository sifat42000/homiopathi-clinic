import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SiteSettings = {
  clinicName: string;

  englishName: string;

  doctorName: string;

  phone: string;

  whatsapp: string;

  email: string;

  address: string;

  chamberTime: string;

  deliveryCharge: number;

  announcement: string;

  appointmentEnabled: boolean;

  shopEnabled: boolean;
};

const defaultSettings: SiteSettings = {
  clinicName:
    "হোমিও কেয়ার",

  englishName:
    "Homeopathic Clinic",

  doctorName:
    "ডা. আপনার ডাক্তারের নাম",

  phone: "",

  whatsapp: "",

  email: "",

  address: "",

  chamberTime: "",

  deliveryCharge: 80,

  announcement:
    "স্বাস্থ্যসেবা, অ্যাপয়েন্টমেন্ট ও প্রয়োজনীয় প্রোডাক্ট—সবকিছু এক জায়গায়",

  appointmentEnabled: true,

  shopEnabled: true,
};

type AdminSettingsStore = {
  settings: SiteSettings;

  updateSettings: (
    settings: SiteSettings
  ) => void;

  resetSettings: () => void;
};

export const useAdminSettingsStore =
  create<AdminSettingsStore>()(
    persist(
      (set) => ({
        settings:
          defaultSettings,

        updateSettings: (
          settings
        ) => {
          set({
            settings,
          });
        },

        resetSettings: () => {
          set({
            settings:
              defaultSettings,
          });
        },
      }),

      {
        name:
          "homeopathy-admin-settings",
      }
    )
  );