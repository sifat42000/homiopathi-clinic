"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  trackViewContent,
} from "@/lib/meta-pixel";

type TreatmentViewTrackerProps = {
  treatment: {
    slug: string;
    title?: string;
    englishTitle?: string;
    fee?: number;
  };
};

export default function TreatmentViewTracker({
  treatment,
}: TreatmentViewTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!treatment?.slug || trackedRef.current) {
      return;
    }

    trackedRef.current = true;

    trackViewContent({
      content_category: "healthcare_service",
      content_type: "service",
      value:
        typeof treatment.fee === "number"
          ? treatment.fee
          : undefined,
      currency: "BDT",
    });
  }, [treatment]);

  return null;
}
