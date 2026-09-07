export type FrontendAppointment = {
  appointmentNumber: string;

  treatmentSlug: string;
  treatmentTitle: string;

  consultationFee: number;
  duration: number;

  date: string;
  time: string;

  patient: {
    name: string;
    phone: string;
    age?: string;
    gender?: string;
  };

  note?: string;

  status: "pending";

  createdAt: string;
};