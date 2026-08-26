import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { MayaChat } from "@/components/maya-chat";
import { faqCount, faqGroups } from "@/content/faq";
import maya from "@/assets/maya-mascot.png";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "RTI Online FAQ — answers on filing, fees and appeals" },
      {
        name: "description",
        content:
          "Answers to the most common RTI Online questions: which authorities you can file with, payment modes, registration numbers, first appeals, status tracking and helpdesk scope.",
      },
      { property: "og:title", content: "RTI Online FAQ — answers on filing, fees and appeals" },
      {
        property: "og:description",
        content: "Frequently asked questions about filing an RTI application or first appeal online.",
      },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqGroups.flatMap((g) =>
            g.items.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a.join(" ") },
            })),
          ),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqGroups;
    return faqGroups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (i) => i.q.toLowerCase().includes(q) || i.a.join(" ").toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  const matches = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main id="main" tabIndex={-1}>
        <PageHero
          eyebrow="Frequently asked questions"
          title={`${faqCount} answers about filing online`}
        >
          <div className="mt-8 flex max-w-md items-center gap-3 rounded-md border border-white/20 bg-white/5 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-saffron" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions — fee, appeal, status…"
              aria-label="Search questions"
              className="w-full bg-transparent text-sm text-ink-foreground outline-none placeholder:text-ink-foreground/45"
            />
          </div>
          {query && (
            <p className="mt-3 text-xs text-ink-foreground/60">
              {matches} {matches === 1 ? "question" : "questions"} matching “{query}”
            </p>
          )}
        </PageHero>

        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[200px_minmax(0,1fr)_340px]">
          <nav className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-eyebrow text-muted-foreground">Topics</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {faqGroups.map((g) => (
                  <li key={g.id}>
                    <a href={`#${g.id}`} className="text-muted-foreground hover:text-saffron">
                      {g.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="space-y-14">
            {groups.map((group) => (
              <section key={group.id} id={group.id} className="scroll-mt-28">
                <h2 className="text-3xl md:text-4xl">{group.label}</h2>
                <div className="mt-6 divide-y divide-border border-y border-border">
                  {group.items.map((item) => {
                    const key = `${group.id}-${item.q}`;
                    const isOpen = open === key;
                    return (
                      <div key={key}>
                        <button
                          onClick={() => setOpen(isOpen ? null : key)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-6 py-5 text-left"
                        >
                          <span className="text-[17px] leading-snug">{item.q}</span>
                          <ChevronDown
                            className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden
                          />
                        </button>
                        <div
                          className={`grid overflow-hidden transition-all duration-300 ${
                            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="min-h-0 max-w-2xl space-y-3 pb-6">
                            {item.a.map((p) => (
                              <p key={p} className="text-sm leading-relaxed text-muted-foreground">
                                {p}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            {groups.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nothing matched that search. Try “fee”, “appeal”, “status” or “reconciliation”.
              </p>
            )}

            <section className="surface-card flex flex-wrap items-center justify-between gap-6 p-8">
              <div>
                <h2 className="text-2xl">Question not answered here?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ask Maya, or write to the helpdesk about filing through this portal.
                </p>
              </div>
              <Link to="/contact" className="btn-base btn-ink">
                Contact the helpdesk
              </Link>
            </section>
          </div>

          <aside className="max-xl:order-first lg:col-span-2 xl:col-span-1 xl:sticky xl:top-28 xl:h-[min(36rem,calc(100dvh-8rem))]">
            <div className="flex h-full min-h-[28rem] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lift">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <img
                  src={maya}
                  alt="Maya"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-saffron/40"
                />
                <div>
                  <p className="font-display text-lg leading-tight">Ask Maya</p>
                  <p className="text-[11px] text-muted-foreground">Clarifies doubts from the official FAQ</p>
                </div>
              </div>
              <MayaChat initialMode="ask" compact />
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
