type MetaPayloadValue =
  | string
  | number
  | boolean
  | Array<string | number>;

export type MetaEventPayload = Record<
  string,
  MetaPayloadValue | undefined | null
>;

type QueuedMetaEvent = [
  string,
  MetaEventPayload
];

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      queue?: unknown[][];
    };
    __metaPixelReady?: boolean;
    __metaPixelInitialized?: boolean;
    __metaPixelInitStarted?: boolean;
    __metaPixelScriptFailed?: boolean;
    __metaPixelLastRoute?: string;
  }
}

const metaPixelClientId = () =>
  (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "")
    .trim();

const isDevelopment = () =>
  process.env.NODE_ENV === "development";

function debugMetaPixel(message: string) {
  if (isDevelopment()) {
    console.info(
      `[Meta Pixel] ${message}`
    );
  }
}

function warnMetaPixel(message: string) {
  if (isDevelopment()) {
    console.warn(
      `[Meta Pixel] ${message}`
    );
  }
}

let hasMetaPixelInitStarted = false;
let hasMetaPixelReady = false;
let hasMetaPixelFailed = false;
const queuedMetaEvents: QueuedMetaEvent[] = [];

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

function flushQueuedMetaEvents() {
  if (
    !hasMetaPixelReady ||
    typeof window === "undefined" ||
    typeof window.fbq !== "function" ||
    !window.__metaPixelInitialized
  ) {
    return;
  }

  while (queuedMetaEvents.length > 0) {
    const [eventName, payload] =
      queuedMetaEvents.shift()!;

    debugMetaPixel(
      `Flushing queued ${eventName}.`
    );

    window.fbq("track", eventName, payload);
  }
}

export function initMetaPixel() {
  if (typeof window === "undefined") {
    return;
  }

  const pixelId = metaPixelClientId();

  if (!pixelId) {
    warnMetaPixel(
      "Missing NEXT_PUBLIC_META_PIXEL_ID; Meta Pixel is disabled."
    );

    return;
  }

  if (hasMetaPixelInitStarted) {
    return;
  }

  hasMetaPixelInitStarted = true;
  window.__metaPixelInitStarted = true;

  debugMetaPixel(
    `Initialization started for pixel ${pixelId}.`
  );
}

export function markMetaPixelReady() {
  if (typeof window === "undefined") {
    return;
  }

  const pixelId = metaPixelClientId();

  if (!pixelId) {
    warnMetaPixel(
      "Meta Pixel cannot be initialized because NEXT_PUBLIC_META_PIXEL_ID is missing."
    );

    return;
  }

  if (hasMetaPixelFailed) {
    return;
  }

  hasMetaPixelReady = true;
  window.__metaPixelReady = true;

  if (
    typeof window.fbq === "function" &&
    !window.__metaPixelInitialized
  ) {
    window.__metaPixelInitialized = true;
    window.fbq("init", pixelId);
    debugMetaPixel(
      `Meta Pixel script loaded and initialized with pixel ${pixelId}.`
    );
  }

  flushQueuedMetaEvents();
}

export function markMetaPixelFailed() {
  hasMetaPixelFailed = true;
  hasMetaPixelReady = false;

  if (typeof window !== "undefined") {
    window.__metaPixelReady = false;
    window.__metaPixelScriptFailed = true;
  }

  warnMetaPixel(
    "Meta Pixel script failed to load. Tracking will remain disabled and will not break the site."
  );
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
    warnMetaPixel(
      "Event dropped because NEXT_PUBLIC_META_PIXEL_ID is undefined."
    );

    return;
  }

  if (hasMetaPixelFailed) {
    warnMetaPixel(
      `${eventName} was not sent because the Meta Pixel script failed to load.`
    );

    return;
  }

  const sanitized = normalizePayload(payload);

  if (
    hasMetaPixelReady &&
    typeof window.fbq === "function" &&
    window.__metaPixelInitialized
  ) {
    debugMetaPixel(
      `Firing ${eventName}.`
    );

    window.fbq("track", eventName, sanitized);
    return;
  }

  queuedMetaEvents.push([
    eventName,
    sanitized,
  ]);

  debugMetaPixel(
    `Queued ${eventName} until Meta Pixel is ready.`
  );
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
