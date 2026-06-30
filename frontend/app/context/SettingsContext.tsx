"use client";

import { createContext, useContext, useState } from "react";

const SettingsContext = createContext<Record<string, string>>({});

export function SettingsProvider({
  children,
  initialSettings = {},
}: {
  children: React.ReactNode;
  initialSettings?: Record<string, string>;
}) {
  // Initialised with server-fetched data — no client-side fetch, no flash
  const [settings] = useState<Record<string, string>>(initialSettings);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
