import { Link } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import emblem from "@/assets/ashoka-emblem.png";
import { LanguageSelect } from "@/components/language-select";

const TEXT_SIZE_KEY = "rti-text-size";
type TextSize = "small" | "default" | "large";

const primaryLinks = [
  { label: "Prepare", to: "/prepare" },
  { label: "File", to: "/file" },
  { label: "Track", to: "/track" },
  { label: "FAQ", to: "/faq" },
] as const;

const moreLinks = [
  { label: "File with Maya", to: "/maya" },
  { label: "Step-by-step guide", to: "/guide" },
  { label: "Process map", to: "/process-map" },
  { label: "Contact", to: "/contact" },
] as const;

const mobileLinks = [...primaryLinks, ...moreLinks];

function readStoredSize(): TextSize {
  if (typeof document === "undefined") return "default";
  const fromDom = document.documentElement.dataset["textSize"];
  if (fromDom === "small" || fromDom === "large") return fromDom;
  try {
    const stored = localStorage.getItem(TEXT_SIZE_KEY);
    if (stored === "small" || stored === "large") return stored;
  } catch {
    /* ignore */
  }
  return "default";
}

function applyTextSize(size: TextSize) {
  const html = document.documentElement;
  if (size === "default") {
    delete html.dataset["textSize"];
    localStorage.removeItem(TEXT_SIZE_KEY);
  } else {
    html.dataset["textSize"] = size;
    localStorage.setItem(TEXT_SIZE_KEY, size);
  }
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [textSize, setTextSize] = useState<TextSize>("default");
  const moreRef = useRef<HTMLDivElement>(null);
  const moreId = useId();

  useEffect(() => {
    setTextSize(readStoredSize());
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  const setSize = (size: TextSize) => {
    applyTextSize(size);
    setTextSize(size);
  };

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <div className="relative z-50 bg-ink text-ink-foreground/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-2 text-[11px] tracking-wide">
          <p className="flex items-center gap-2">
            <img
              src={emblem}
              alt="State Emblem of India"
              className="h-5 w-auto object-contain brightness-0 invert"
            />
            Government of India · Department of Personnel &amp; Training
          </p>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">भारत सरकार</span>
            <LanguageSelect />
            <div className="flex items-center gap-1" role="group" aria-label="Text size">
              <button
                type="button"
                className={`rounded px-1.5 py-0.5 text-[10px] hover:bg-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron ${
                  textSize === "small" ? "bg-ink-soft text-ink-foreground" : ""
                }`}
                aria-pressed={textSize === "small"}
                aria-label="Decrease text size"
                onClick={() => setSize("small")}
              >
                A-
              </button>
              <button
                type="button"
                className={`rounded px-1.5 py-0.5 hover:bg-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron ${
                  textSize === "default" ? "bg-ink-soft text-ink-foreground" : ""
                }`}
                aria-pressed={textSize === "default"}
                aria-label="Default text size"
                onClick={() => setSize("default")}
              >
                A
              </button>
              <button
                type="button"
                className={`rounded px-1.5 py-0.5 text-[13px] hover:bg-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron ${
                  textSize === "large" ? "bg-ink-soft text-ink-foreground" : ""
                }`}
                aria-pressed={textSize === "large"}
                aria-label="Increase text size"
                onClick={() => setSize("large")}
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={emblem}
              alt="State Emblem of India — Satyameva Jayate"
              className="h-11 w-auto object-contain"
            />
            <span className="leading-tight">
              <span className="block font-display text-xl">RTI Online</span>
              <span className="block text-[11px] text-muted-foreground">
                Right to Information · Act 2005
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
            {primaryLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-sm text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-expanded={moreOpen}
                aria-controls={moreId}
                onClick={() => setMoreOpen((v) => !v)}
              >
                More
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              {moreOpen && (
                <div
                  id={moreId}
                  className="absolute right-0 top-full z-50 mt-3 min-w-48 rounded-lg border border-border bg-card py-1.5 shadow-lift"
                >
                  {moreLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setMoreOpen(false)}
                      className="block px-3.5 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                      activeProps={{ className: "block px-3.5 py-2 text-sm text-foreground" }}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <Link to="/maya" className="text-sm text-muted-foreground hover:text-foreground">
              File with Maya
            </Link>
            <Link to="/guidelines" className="btn-base btn-saffron !py-2.5 !text-sm">
              File RTI
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <button
            type="button"
            className="rounded-md p-1 xl:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <div id="mobile-nav" className="border-t border-border bg-background px-5 py-4 xl:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {mobileLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-2 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/guidelines"
                onClick={() => setMenuOpen(false)}
                className="btn-base btn-saffron mt-2"
              >
                File RTI
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
