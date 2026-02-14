"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

type Direction = "rtl" | "ltr";
type Language = "ar" | "en";

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "ar";
  return (localStorage.getItem("language") as Language) || "ar";
}

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
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  const applyDirection = useCallback((lang: Language) => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    applyDirection(language);
  }, [language, applyDirection]);

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
