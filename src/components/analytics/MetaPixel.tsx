"use client";

import {
  useEffect,
} from "react";
import Script from "next/script";
import {
  usePathname,
  useSearchParams,
} from "next/navigation";

import {
  initMetaPixel,
  markMetaPixelReady,
  trackMetaPageView,
} from "@/lib/meta-pixel";

export default function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pixelId =
    process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

  const scriptContent = `
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if(!f._fbq)f._fbq=n;
      n.push=n;
      n.loaded=!0;
      n.version='2.0';
      n.queue=[];
      t=b.createElement(e);
      t.async=!0;
      t.src=v;
      s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  `;

  useEffect(() => {
    initMetaPixel();

    const timer = window.setTimeout(() => {
      if (typeof window.fbq === "function") {
        markMetaPixelReady();
        trackMetaPageView(window.location.pathname || "/");
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
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

    (
      window as Window & {
        __metaPixelLastRoute?: string;
      }
    ).__metaPixelLastRoute = routeKey;

    trackMetaPageView(routePath);
  }, [pathname, searchParams]);

  if (!pixelId) {
    return null;
  }

  return (
    <Script
      id="meta-pixel-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: scriptContent,
      }}
    />
  );
}
