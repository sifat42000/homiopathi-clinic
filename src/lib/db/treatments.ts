import type {
  ObjectId,
} from "mongodb";

import {
  getDb,
} from "@/lib/mongodb";

import {
  treatments,
} from "@/data/treatments";

import type {
  DatabaseTreatment,
  TreatmentAvailability,
} from "@/types/treatment";

export type TreatmentDocument = {
  _id?: ObjectId;

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

  createdAt: Date;

  updatedAt: Date;
};

export function serializeTreatment(
  treatment:
    TreatmentDocument & {
      _id: ObjectId;
    }
): DatabaseTreatment {
  return {
    databaseId:
      treatment._id.toString(),

    id:
      treatment.id,

    title:
      treatment.title,

    englishTitle:
      treatment.englishTitle,

    slug:
      treatment.slug,

    description:
      treatment.description,

    fullDescription:
      treatment.fullDescription,

    fee:
      treatment.fee,

    duration:
      treatment.duration,

    availability:
      treatment.availability,

    active:
      treatment.active,

    createdAt:
      treatment.createdAt.toISOString(),

    updatedAt:
      treatment.updatedAt.toISOString(),
  };
}

function getStaticTreatmentBySlug(
  slug: string
) {
  const cleanSlug =
    decodeURIComponent(
      slug
    )
      .trim()
      .toLowerCase();

  const treatment =
    treatments.find(
      (item) =>
        item.slug === cleanSlug
    );

  if (!treatment) {
    return null;
  }

  return serializeStaticTreatment(
    treatment
  );
}

function serializeStaticTreatment(
  treatment: (typeof treatments)[number]
) {
  const timestamp =
    new Date(0).toISOString();

  return {
    id: treatment.id,
    title: treatment.title,
    englishTitle:
      treatment.englishTitle,
    slug: treatment.slug,
    description:
      treatment.description,
    fullDescription:
      treatment.fullDescription,
    fee: treatment.fee,
    duration: treatment.duration,
    availability: "available" as TreatmentAvailability,
    databaseId: `static-treatment-${treatment.id}`,
    active: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  } satisfies DatabaseTreatment;
}

export async function getPublicTreatments() {
  const db =
    await getDb();

  const dbTreatments =
    await db
      .collection<TreatmentDocument>(
        "treatments"
      )
      .find({
        active: true,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

  if (dbTreatments.length === 0) {
    return treatments.map(
      (treatment) =>
        serializeStaticTreatment(
          treatment
        )
    );
  }

  return dbTreatments.map(
    (treatment) =>
      serializeTreatment(
        treatment
      )
  );
}

export async function getTreatmentBySlug(
  slug: string
) {
  const db =
    await getDb();

  const cleanSlug =
    decodeURIComponent(
      slug
    )
      .trim()
      .toLowerCase();

  const treatment =
    await db
      .collection<TreatmentDocument>(
        "treatments"
      )
      .findOne({
        slug:
          cleanSlug,

        active: true,
      });

  if (!treatment) {
    return getStaticTreatmentBySlug(
      slug
    );
  }

  return serializeTreatment(
    treatment
  );
}

export async function getBookableTreatmentBySlug(
  slug: string
) {
  const db =
    await getDb();

  const cleanSlug =
    decodeURIComponent(
      slug
    )
      .trim()
      .toLowerCase();

  const treatment =
    await db
      .collection<TreatmentDocument>(
        "treatments"
      )
      .findOne({
        slug:
          cleanSlug,

        active: true,

        availability:
          "available",
      });

  if (!treatment) {
    return null;
  }

  return serializeTreatment(
    treatment
  );
}