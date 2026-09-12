import {
  getDb,
} from "@/lib/mongodb";

import {
  DEFAULT_WEBSITE_SETTINGS,
} from "@/lib/default-settings";

import type {
  WebsiteSettings,
} from "@/types/website-settings";

type WebsiteSettingsDocument = {
  key: "main";

  clinicName: string;

  englishName: string;

  doctorName: string;

  doctorDegree?: string;

  doctorQualification?: string;

  doctorRegistration?: string;

  doctorPhotoUrl?: string;

  doctorPhotoPublicId?: string;

  phone: string;

  whatsapp: string;

  email: string;

  address: string;

  chamberTime: string;

  deliveryCharge: number;

  deliveryChargeInside?: number;

  deliveryChargeOutside?: number;

  announcement: string;

  announcementEnabled: boolean;

  appointmentEnabled: boolean;

  shopEnabled: boolean;

  createdAt: Date;

  updatedAt: Date;
};

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  const db =
    await getDb();

  const collection =
    db.collection<WebsiteSettingsDocument>(
      "websiteSettings"
    );

  const settings =
    await collection.findOne({
      key: "main",
    });

  if (!settings) {
    return {
      ...DEFAULT_WEBSITE_SETTINGS,
    };
  }

  return {
    clinicName:
      settings.clinicName,

    englishName:
      settings.englishName,

    doctorName:
      settings.doctorName,

    doctorDegree:
      settings.doctorDegree ??
      "",

    doctorQualification:
      settings.doctorQualification ??
      "",

    doctorRegistration:
      settings.doctorRegistration ??
      "",

    ...(settings.doctorPhotoUrl
      ? {
          doctorPhotoUrl:
            settings.doctorPhotoUrl,
        }
      : {}),

    ...(settings.doctorPhotoPublicId
      ? {
          doctorPhotoPublicId:
            settings.doctorPhotoPublicId,
        }
      : {}),

    phone:
      settings.phone,

    whatsapp:
      settings.whatsapp,

    email:
      settings.email,

    address:
      settings.address,

    chamberTime:
      settings.chamberTime,

    deliveryCharge:
      settings.deliveryCharge,

    deliveryChargeInside:
      settings.deliveryChargeInside ??
      settings.deliveryCharge,

    deliveryChargeOutside:
      settings.deliveryChargeOutside ??
      160,

    announcement:
      settings.announcement,

    announcementEnabled:
      settings.announcementEnabled,

    appointmentEnabled:
      settings.appointmentEnabled,

    shopEnabled:
      settings.shopEnabled,

    updatedAt:
      settings.updatedAt.toISOString(),
  };
}

export async function saveWebsiteSettings(
  settings: WebsiteSettings
) {
  const db =
    await getDb();

  const collection =
    db.collection<WebsiteSettingsDocument>(
      "websiteSettings"
    );

  const now =
    new Date();

  await collection.updateOne(
    {
      key: "main",
    },

    {
      $set: {
        clinicName:
          settings.clinicName,

        englishName:
          settings.englishName,

        doctorName:
          settings.doctorName,

        doctorDegree:
          settings.doctorDegree,

        doctorQualification:
          settings.doctorQualification,

        doctorRegistration:
          settings.doctorRegistration,

        doctorPhotoUrl:
          settings.doctorPhotoUrl ??
          "",

        doctorPhotoPublicId:
          settings.doctorPhotoPublicId ??
          "",

        phone:
          settings.phone,

        whatsapp:
          settings.whatsapp,

        email:
          settings.email,

        address:
          settings.address,

        chamberTime:
          settings.chamberTime,

        deliveryCharge:
          settings.deliveryCharge,

        deliveryChargeInside:
          settings.deliveryChargeInside,

        deliveryChargeOutside:
          settings.deliveryChargeOutside,

        announcement:
          settings.announcement,

        announcementEnabled:
          settings.announcementEnabled,

        appointmentEnabled:
          settings.appointmentEnabled,

        shopEnabled:
          settings.shopEnabled,

        updatedAt: now,
      },

      $setOnInsert: {
        key: "main",

        createdAt: now,
      },
    },

    {
      upsert: true,
    }
  );
}

export async function getDeliveryCharge() {
  const settings =
    await getWebsiteSettings();

  return settings.deliveryCharge;
}