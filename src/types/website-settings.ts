export type WebsiteSettings = {
  clinicName: string;

  englishName: string;

  doctorName: string;

  doctorDegree: string;

  doctorQualification: string;

  doctorRegistration: string;

  doctorPhotoUrl?: string;

  doctorPhotoPublicId?: string;

  phone: string;

  whatsapp: string;

  email: string;

  address: string;

  chamberTime: string;

  deliveryCharge: number;

  deliveryChargeInside: number;

  deliveryChargeOutside: number;

  announcement: string;

  announcementEnabled: boolean;

  appointmentEnabled: boolean;

  shopEnabled: boolean;

  updatedAt?: string;
};