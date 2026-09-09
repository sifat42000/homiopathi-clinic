export type TreatmentAvailability =
  | "available"
  | "unavailable";

export type DatabaseTreatment = {
  databaseId: string;

  id: number;

  title: string;

  englishTitle: string;

  slug: string;

  description: string;

  fullDescription: string;

  fee: number;

  duration: number;

  availability:
    TreatmentAvailability;

  active: boolean;

  createdAt: string;

  updatedAt: string;
};