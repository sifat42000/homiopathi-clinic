type MetaPayloadValue =
  | string
  | number
  | boolean
  | Array<string | number>;

export type MetaEventPayload = Record<
  string,
  MetaPayloadValue | undefined | null
>;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      queue?: unknown[][];
    };
  }
}

const metaPixelClientId = () =>
  (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "")
    .trim();

let hasInitializedMetaPixel = false;

function normalizePayload(
  payload: MetaEventPayload = {}
): MetaEventPayload {
  const safe: MetaEventPayload = {};

  Object.entries(payload).forEach(
    ([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return;
      }

      if (Array.isArray(value)) {
        const cleanValues = value.filter(
          (item) =>
            item !== undefined &&
            item !== null &&
            item !== ""
        );

        if (cleanValues.length > 0) {
          safe[key] = cleanValues as string[] | number[];
        }

        return;
      }

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        safe[key] = value;
      }
    }
  );

  return safe;
}

export function initMetaPixel() {
  if (typeof window === "undefined") {
    return;
  }

  const pixelId = metaPixelClientId();

  if (!pixelId) {
    return;
  }

  if (hasInitializedMetaPixel) {
    if (typeof window.fbq === "function") {
      window.fbq("init", pixelId);
    }

    return;
  }

  hasInitializedMetaPixel = true;

  if (typeof window.fbq !== "function") {
    const queue =
      Array.isArray(
        (window as Window & {
          fbq?: {
            queue?: unknown[][];
          };
        }).fbq?.queue
      )
        ? ((window as Window & {
            fbq?: {
              queue?: unknown[][];
            };
          }).fbq?.queue ?? [])
        : [];

    const fbq = function (
      ...args: unknown[]
    ) {
      queue.push(args);
    };

    (fbq as typeof fbq & {
      queue?: unknown[][];
    }).queue = queue;

    window.fbq = fbq;
  }

  const existingScript = document.querySelector(
    'script[src*="connect.facebook.net"]'
  );

  if (existingScript) {
    if (typeof window.fbq === "function") {
      window.fbq("init", pixelId);
    }

    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src =
    "https://connect.facebook.net/en_US/fbevents.js";
  script.setAttribute(
    "data-pixel-id",
    pixelId
  );

  script.onload = () => {
    if (typeof window.fbq === "function") {
      window.fbq("init", pixelId);
    }
  };

  script.onerror = () => {
    // Intentionally silent so tracking never breaks the app.
  };

  document.head.appendChild(script);
}

export function trackMetaEvent(
  eventName: string,
  payload: MetaEventPayload = {}
) {
  if (typeof window === "undefined") {
    return;
  }

  const pixelId = metaPixelClientId();

  if (!pixelId) {
    return;
  }

  if (typeof window.fbq !== "function") {
    initMetaPixel();
  }

  if (typeof window.fbq !== "function") {
    return;
  }

  const sanitized = normalizePayload(payload);

  window.fbq("track", eventName, sanitized);
}

export function trackMetaPageView(
  pathname = "/"
) {
  const safePath =
    pathname.split("?")[0] || "/";

  trackMetaEvent("PageView", {
    page_path: safePath,
  });
}

export function trackViewContent(
  payload: MetaEventPayload
) {
  trackMetaEvent("ViewContent", payload);
}

export function trackAddToCart(
  payload: MetaEventPayload
) {
  trackMetaEvent("AddToCart", payload);
}

export function trackLead(
  payload: MetaEventPayload
) {
  trackMetaEvent("Lead", payload);
}

export function trackInitiateCheckout(
  payload: MetaEventPayload
) {
  trackMetaEvent("InitiateCheckout", payload);
}

export function trackPurchase(
  payload: MetaEventPayload
) {
  trackMetaEvent("Purchase", payload);
}
