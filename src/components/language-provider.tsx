"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { persistLanguage, readStoredLanguage, type SiteLanguage } from "@/lib/language";
import { restoreEnglish, translatePageToHindi } from "@/lib/page-translate";

type LanguageContextValue = {
  language: SiteLanguage;
  translating: boolean;
  error: string | null;
  setLanguage: (lang: SiteLanguage) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>("en");
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const languageRef = useRef<SiteLanguage>(language);
  const busyRef = useRef(false);
  const genRef = useRef(0);
  languageRef.current = language;

  const runTranslate = useCallback(async (showBusy = true) => {
    if (languageRef.current !== "hi" || busyRef.current) return;
    const gen = ++genRef.current;
    busyRef.current = true;
    if (showBusy) {
      setTranslating(true);
      setError(null);
    }
    try {
      await translatePageToHindi();
    } catch (err) {
      if (gen !== genRef.current) return;
      setError(err instanceof Error ? err.message : "Translation failed.");
    } finally {
      busyRef.current = false;
      if (gen === genRef.current) setTranslating(false);
    }
  }, []);

  useEffect(() => {
    const stored = readStoredLanguage();
    setLanguageState(stored);
    persistLanguage(stored);
    if (stored === "hi") void runTranslate();
  }, [runTranslate]);

  useEffect(() => {
    if (language !== "hi") return;

    let timer = 0;
    const schedule = () => {
      if (busyRef.current || languageRef.current !== "hi") return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void runTranslate(false);
      }, 160);
    };

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { subtree: true, childList: true });
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [language, runTranslate]);

  const setLanguage = useCallback(
    (lang: SiteLanguage) => {
      genRef.current += 1;
      busyRef.current = false;
      persistLanguage(lang);
      setLanguageState(lang);
      setError(null);
      if (lang === "en") {
        restoreEnglish();
        setTranslating(false);
        return;
      }
      void runTranslate();
    },
    [runTranslate],
  );

  const value = useMemo(
    () => ({ language, translating, error, setLanguage }),
    [language, translating, error, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
