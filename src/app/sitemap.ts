import type { MetadataRoute } from "next";

import { healthTips } from "@/data/healthTips";
import { treatments } from "@/data/treatments";
import { getPublicHealthTips } from "@/lib/db/health-tips";
import { getPublicProducts } from "@/lib/db/products";
import { getPublicTreatments } from "@/lib/db/treatments";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const publicPages = [
  "/",
  "/about",
  "/appointment",
  "/contact",
  "/faq",
  "/health-tips",
  "/products",
  "/reviews",
  "/treatments",
  "/privacy-policy",
  "/terms",
  "/medical-disclaimer",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productResult, healthTipResult, treatmentResult] =
    await Promise.allSettled([
      getPublicProducts(),
      getPublicHealthTips(),
      getPublicTreatments(),
    ]);

  const productEntries =
    productResult.status === "fulfilled"
      ? productResult.value.map((product) => ({
          url: `${siteUrl}/products/${encodeURIComponent(product.slug)}`,
          lastModified: product.updatedAt,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }))
      : [];

  const healthTipEntries =
    healthTipResult.status === "fulfilled"
      ? healthTipResult.value.map((tip) => ({
          url: `${siteUrl}/health-tips/${encodeURIComponent(tip.slug)}`,
          lastModified: tip.updatedAt,
          changeFrequency: "monthly" as const,
          priority: 0.65,
        }))
      : healthTips.map((tip) => ({
          url: `${siteUrl}/health-tips/${encodeURIComponent(tip.slug)}`,
          changeFrequency: "monthly" as const,
          priority: 0.65,
        }));

  const treatmentEntries =
    treatmentResult.status === "fulfilled"
      ? treatmentResult.value.map((treatment) => ({
          url: `${siteUrl}/treatments/${encodeURIComponent(treatment.slug)}`,
          lastModified: treatment.updatedAt,
          changeFrequency: "monthly" as const,
          priority: 0.75,
        }))
      : treatments.map((treatment) => ({
          url: `${siteUrl}/treatments/${encodeURIComponent(treatment.slug)}`,
          changeFrequency: "monthly" as const,
          priority: 0.75,
        }));

  return [
    ...publicPages.map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
      priority: path === "/" ? 1 : 0.6,
    })),
    ...productEntries,
    ...healthTipEntries,
    ...treatmentEntries,
  ];
}