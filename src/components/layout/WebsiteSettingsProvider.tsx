"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_WEBSITE_SETTINGS,
} from "@/lib/default-settings";

import type {
  WebsiteSettings,
} from "@/types/website-settings";

const WebsiteSettingsContext = createContext<WebsiteSettings>(
  DEFAULT_WEBSITE_SETTINGS
);

export function WebsiteSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] = useState<WebsiteSettings>(
    DEFAULT_WEBSITE_SETTINGS
  );

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (active && data.settings) {
          setSettings(data.settings);
        }
      } catch {
        // Keep the last known settings when a refresh fails.
      }
    };

    loadSettings();

    const interval = window.setInterval(loadSettings, 5000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <WebsiteSettingsContext.Provider value={settings}>
      {children}
    </WebsiteSettingsContext.Provider>
  );
}

export function useWebsiteSettings() {
  return useContext(WebsiteSettingsContext);
}
