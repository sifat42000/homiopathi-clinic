import type {
  ObjectId,
} from "mongodb";

import {
  getDb,
} from "@/lib/mongodb";

import {
  healthTips,
} from "@/data/healthTips";

import type {
  DatabaseHealthTip,
} from "@/types/health-tip";

export type HealthTipDocument = {
  _id?: ObjectId;

  id: number;

  title: string;

  slug: string;

  excerpt: string;

  category: string;

  readTime: string;

  date: string;

  author: string;

  intro: string;

  sections: {
    heading: string;

    content: string;
  }[];

  active: boolean;

  createdAt: Date;

  updatedAt: Date;
};

export function serializeHealthTip(
  tip: HealthTipDocument & {
    _id: ObjectId;
  }
): DatabaseHealthTip {
  return {
    databaseId:
      tip._id.toString(),

    id:
      tip.id,

    title:
      tip.title,

    slug:
      tip.slug,

    excerpt:
      tip.excerpt,

    category:
      tip.category,

    readTime:
      tip.readTime,

    date:
      tip.date,

    author:
      tip.author,

    intro:
      tip.intro,

    sections:
      tip.sections,

    active:
      tip.active,

    createdAt:
      tip.createdAt.toISOString(),

    updatedAt:
      tip.updatedAt.toISOString(),
  };
}

function getStaticHealthTipBySlug(
  slug: string
) {
  const cleanSlug =
    decodeURIComponent(
      slug
    )
      .trim()
      .toLowerCase();

  const tip =
    healthTips.find(
      (item) =>
        item.slug === cleanSlug
    );

  if (!tip) {
    return null;
  }

  const timestamp =
    new Date(0).toISOString();

  return {
    ...tip,
    databaseId: `static-health-tip-${tip.id}`,
    active: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  } satisfies DatabaseHealthTip;
}

export async function getPublicHealthTips() {
  const db =
    await getDb();

  const tips =
    await db
      .collection<HealthTipDocument>(
        "healthTips"
      )
      .find({
        active: true,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

  return tips.map(
    (tip) =>
      serializeHealthTip(
        tip
      )
  );
}

export async function getHealthTipBySlug(
  slug: string
) {
  const db =
    await getDb();

  const tip =
    await db
      .collection<HealthTipDocument>(
        "healthTips"
      )
      .findOne({
        slug:
          decodeURIComponent(
            slug
          )
            .trim()
            .toLowerCase(),

        active: true,
      });

  if (!tip) {
    return getStaticHealthTipBySlug(
      slug
    );
  }

  return serializeHealthTip(
    tip
  );
}

export async function getRelatedHealthTips(
  current:
    DatabaseHealthTip,
  limit = 3
) {
  const db =
    await getDb();

  const tips =
    await db
      .collection<HealthTipDocument>(
        "healthTips"
      )
      .find({
        active: true,

        category:
          current.category,

        slug: {
          $ne:
            current.slug,
        },
      })
      .limit(limit)
      .toArray();

  return tips.map(
    (tip) =>
      serializeHealthTip(
        tip
      )
  );
}