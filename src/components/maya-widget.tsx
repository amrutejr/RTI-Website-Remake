import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";

import maya from "@/assets/maya-mascot.png";
import { MayaChat } from "@/components/maya-chat";
import type { MayaMode } from "@/lib/maya";

const HINT_KEY = "rti-online:maya-hint";

export function MayaWidget() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [seed, setSeed] = useState(0);
  const [mode, setMode] = useState<MayaMode>("idle");

  useEffect(() => {
    try {
      setHint(localStorage.getItem(HINT_KEY) !== "1");
    } catch {
      setHint(true);
    }
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const next = (e as CustomEvent<{ mode?: Exclude<MayaMode, "idle"> }>).detail?.mode ?? "idle";
      setMode(next);
      setSeed((n) => n + 1);
      setOpen(true);
      setHint(false);
    };
    window.addEventListener("maya:open", onOpen);
    return () => window.removeEventListener("maya:open", onOpen);
  }, []);

  if (pathname === "/maya" || pathname === "/faq") return null;

  const dismissHint = () => {
    setHint(false);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="pointer-events-auto flex h-[min(32rem,calc(100dvh-8rem))] w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
          <div className="flex items-center gap-3 border-b border-border bg-gradient-ink px-4 py-3 text-ink-foreground">
            <img
              src={maya}
              alt=""
              className="h-10 w-10 rounded-full object-cover ring-2 ring-saffron/70"
            />
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg leading-tight">Maya</p>
              <p className="text-[11px] text-ink-foreground/70">RTI assistant · always here to help</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-ink-foreground/80 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-saffron"
              aria-label="Close Maya"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <MayaChat key={`${seed}-${mode}`} initialMode={mode} compact />
        </div>
      )}

      {hint && !open && (
        <div className="pointer-events-auto relative max-w-56 rounded-2xl rounded-br-md border border-border bg-card px-3.5 py-2.5 text-sm shadow-lift">
          <p className="pr-5 leading-snug">Hi, I’m Maya. I can file an RTI with you.</p>
          <button
            type="button"
            className="absolute right-1.5 top-1.5 text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
            onClick={dismissHint}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <button
        type="button"
        className="pointer-events-auto group flex items-center gap-2"
        aria-expanded={open}
        aria-label={open ? "Close Maya" : "Open Maya, RTI assistant"}
        onClick={() => {
          dismissHint();
          setOpen((v) => !v);
        }}
      >
        <span className="hidden rounded-full bg-ink px-3 py-1 text-xs font-medium text-ink-foreground shadow-lift sm:block">
          Maya
        </span>
        <span className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-saffron shadow-glow ring-2 ring-white">
          {open ? (
            <X className="h-7 w-7 text-saffron-foreground" />
          ) : (
            <img
              src={maya}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          )}
          {!open && (
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-verdant ring-2 ring-white" />
          )}
        </span>
      </button>
    </div>
  );
}
