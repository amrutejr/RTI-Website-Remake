"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { languageOptions } from "@/lib/language";

export function LanguageSelect() {
  const { language, setLanguage, translating, error } = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = languageOptions.find((opt) => opt.id === language) ?? languageOptions[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative flex items-center gap-2"
      data-no-translate
    >
      <span className="hidden font-display text-[12px] tracking-normal text-ink-foreground sm:inline">
        Select Language
      </span>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-2.5 py-1 text-[11px] text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron disabled:opacity-70"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label="Select language"
        aria-busy={translating}
        disabled={translating}
        onClick={() => setOpen((v) => !v)}
      >
        {translating ? "Translating…" : current.label}
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Language"
          className="absolute right-0 top-full z-[60] mt-1 min-w-[10rem] rounded-xl border border-white/10 bg-zinc-900 p-1 text-[12px] text-white shadow-lift"
        >
          {languageOptions.map((opt) => {
            const selected = opt.id === language;
            return (
              <li key={opt.id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left ${
                    selected ? "bg-blue-600" : "hover:bg-white/10"
                  }`}
                  onClick={() => {
                    setLanguage(opt.id);
                    setOpen(false);
                  }}
                >
                  {selected ? (
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  ) : (
                    <span className="inline-block w-3.5 shrink-0" aria-hidden />
                  )}
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {error ? (
        <span className="max-w-36 truncate text-[10px] text-red-300" title={error}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
