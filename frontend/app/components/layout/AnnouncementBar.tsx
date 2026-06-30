"use client";

import { useState, useEffect, useRef } from "react";
import { useSettings } from "../../context/SettingsContext";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const settings = useSettings();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(true);

  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      isVisibleRef.current = false;
    }, 7000);
  };

  useEffect(() => {
    startTimer();

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY && !isVisibleRef.current) {
        setIsVisible(true);
        isVisibleRef.current = true;
        startTimer();
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isEnabled = settings.ANNOUNCEMENT_ENABLED === undefined || String(settings.ANNOUNCEMENT_ENABLED).trim() !== 'false';
  if (!isEnabled) return null;

  const announcementText = settings.ANNOUNCEMENT_TEXT || "Free Delivery on Orders Above Rs. 5000";
  const announcementLink = settings.ANNOUNCEMENT_LINK || null;

  return (
    <div
      className={`w-full bg-gold text-black text-sm font-medium flex items-center justify-center tracking-wide transition-all duration-700 ease-in-out overflow-hidden
        ${isVisible ? 'max-h-[40px] opacity-100 py-2' : 'max-h-0 opacity-0 py-0'}
      `}
    >
      {announcementLink ? (
        <a href={announcementLink} className="hover:underline">{announcementText}</a>
      ) : (
        <span>{announcementText}</span>
      )}
    </div>
  );
}
