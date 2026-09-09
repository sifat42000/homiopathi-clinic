export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type AppointmentPatient = {
  name: string;

  phone: string;

  age?: number;

  gender?: string;
};

export type AppointmentTreatment = {
  slug: string;

  title: string;

  englishTitle: string;

  fee: number;

  duration: number;
};

export type AppointmentStatusHistory = {
  status: AppointmentStatus;

  at: string;
};

export type DatabaseAppointment = {
  id: string;

  appointmentNumber: string;

  userId?: string | null;

  treatment:
    AppointmentTreatment;

  patient:
    AppointmentPatient;

  date: string;

  time: string;

  note?: string;

  status:
    AppointmentStatus;

  statusHistory:
    AppointmentStatusHistory[];

  createdAt: string;

  updatedAt: string;
};

/*
  পুরনো frontend import যেন
  সাথে সাথে build না ভাঙে।
*/
export type FrontendAppointment =
  DatabaseAppointment;