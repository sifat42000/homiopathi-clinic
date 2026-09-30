"use client";

import {
  useEffect,
  useRef,
} from "react";

import Script from "next/script";
import {
  usePathname,
  useSearchParams,
} from "next/navigation";

import {
  initMetaPixel,
  markMetaPixelFailed,
  markMetaPixelReady,
  trackMetaPageView,
} from "@/lib/meta-pixel";

export default function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackedRouteRef = useRef<string | null>(null);
  const pixelId =
    process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

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

  return (
    <Script
      id="meta-pixel-script"
      src="https://connect.facebook.net/en_US/fbevents.js"
      strategy="afterInteractive"
      data-pixel-id={pixelId}
      onLoad={() => {
        markMetaPixelReady();
      }}
      onError={() => {
        markMetaPixelFailed();
      }}
    />
  );
}
