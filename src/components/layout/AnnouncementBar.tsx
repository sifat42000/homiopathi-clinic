import {
  getWebsiteSettings,
} from "@/lib/db/settings";

export default async function AnnouncementBar() {
  const settings =
    await getWebsiteSettings();

  if (
    !settings.announcementEnabled ||
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