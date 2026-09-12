"use client";

import { useEffect, useState } from "react";

type AnnouncementSettings = {
  announcement: string;
  announcementEnabled: boolean;
};

export default function AnnouncementBar() {
  const [settings, setSettings] =
    useState<AnnouncementSettings | null>(null);

  useEffect(() => {
    let active = true;

    const loadAnnouncement = async () => {
      try {
        const response = await fetch("/api/settings", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (active) {
          setSettings(data.settings);
        }
      } catch {
        // Keep the existing announcement visible when a refresh fails.
      }
    };

    loadAnnouncement();

    const interval = window.setInterval(loadAnnouncement, 5000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  if (
    !settings?.announcementEnabled ||
    !settings.announcement
  ) {
    return null;
  }

  return (
    <div className="bg-[#14532D] px-4 py-2.5 text-center text-sm font-medium text-white">
      {settings.announcement}
    </div>
  );
}