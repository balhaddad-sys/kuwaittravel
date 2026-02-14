"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Direction = "rtl" | "ltr";
type Language = "ar" | "en";

interface DirectionContextValue {
  direction: Direction;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
}

const DirectionContext = createContext<DirectionContextValue | null>(null);

export function useDirection() {
  const ctx = useContext(DirectionContext);
  if (!ctx) throw new Error("useDirection must be used within DirectionProvider");
  return ctx;
}

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar");

  useEffect(() => {
    const stored = localStorage.getItem("language") as Language | null;
    if (stored) setLanguageState(stored);
  }, []);

  useEffect(() => {
    const dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const direction = language === "ar" ? "rtl" : "ltr";

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (ar: string, en: string) => (language === "ar" ? ar : en);

  return (
    <DirectionContext.Provider value={{ direction, language, setLanguage, t }}>
      {children}
    </DirectionContext.Provider>
  );
}
