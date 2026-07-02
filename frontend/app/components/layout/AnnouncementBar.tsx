"use client";

import { useSettings } from "../../context/SettingsContext";

export default function AnnouncementBar() {
  const settings = useSettings();

  const isEnabled = settings.ANNOUNCEMENT_ENABLED === undefined || String(settings.ANNOUNCEMENT_ENABLED).trim() !== 'false';
  if (!isEnabled) return null;

  const announcementText = settings.ANNOUNCEMENT_TEXT || "Free Delivery on Orders Above Rs. 5000";
  const announcementLink = settings.ANNOUNCEMENT_LINK || null;

  return (
    <div className="w-full bg-gold text-black text-sm font-medium flex items-center justify-center tracking-wide py-2">
      {announcementLink ? (
        <a href={announcementLink} className="hover:underline">{announcementText}</a>
      ) : (
        <span>{announcementText}</span>
      )}
    </div>
  );
}
