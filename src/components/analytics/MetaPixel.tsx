"use client";

import {
  useEffect,
  useRef,
} from "react";
import {
  usePathname,
  useSearchParams,
} from "next/navigation";

import {
  initMetaPixel,
  trackMetaPageView,
} from "@/lib/meta-pixel";

export default function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackedRouteRef = useRef<string | null>(null);

  useEffect(() => {
    initMetaPixel();
  }, []);

  useEffect(() => {
    const routePath = pathname || "/";
    const queryString = searchParams?.toString();
    const routeKey =
      queryString
        ? `${routePath}?${queryString}`
        : routePath;

    const lastTrackedRoute =
      (window as Window & {
        __metaPixelLastRoute?: string;
      }).__metaPixelLastRoute ?? null;

    if (lastTrackedRoute === routeKey) {
      return;
    }

    trackedRouteRef.current = routeKey;

    (
      window as Window & {
        __metaPixelLastRoute?: string;
      }
    ).__metaPixelLastRoute = routeKey;

    trackMetaPageView(routePath);
  }, [pathname, searchParams]);

  return null;
}
