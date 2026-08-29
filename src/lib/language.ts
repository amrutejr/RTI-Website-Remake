export const LANG_KEY = "rti-lang";

export type SiteLanguage = "en" | "hi";

export const languageOptions = [
  { id: "en" as const, label: "English", target: "English" },
  { id: "hi" as const, label: "Hindi", target: "Hindi" },
] as const;

export function readStoredLanguage(): SiteLanguage {
  if (typeof document === "undefined") return "en";
  if (document.documentElement.lang === "hi") return "hi";
  try {
    return localStorage.getItem(LANG_KEY) === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
}

export function persistLanguage(lang: SiteLanguage) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
  }
  try {
    if (lang === "hi") localStorage.setItem(LANG_KEY, "hi");
    else localStorage.removeItem(LANG_KEY);
  } catch {
    /* ignore */
  }
}
