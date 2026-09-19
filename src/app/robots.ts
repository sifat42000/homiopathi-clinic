import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/account/",
          "/api/",
          "/cart/",
          "/checkout/",
          "/login/",
          "/register/",
          "/forgot-password/",
          "/order-success/",
          "/appointment-success/",
          "/order-tracking/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}