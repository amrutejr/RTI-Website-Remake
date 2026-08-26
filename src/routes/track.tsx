import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarClock, Check, Circle, FileSearch, Landmark, Search } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { Field, TextInput } from "@/components/filing-fields";
import { demoFilings, loadFilings, type FiledRti } from "@/lib/rti-filing";

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>): { rn?: string } =>
    typeof search["rn"] === "string" && search["rn"] ? { rn: search["rn"] } : {},
  head: () => ({
    meta: [
      { title: "RTI tracker — check the status of your request or appeal" },
      {
        name: "description",
        content:
          "Track any RTI request or first appeal by registration number: see where it sits with the Nodal Officer or CPIO, the 30-day due date and the reply timeline.",
      },
      { property: "og:title", content: "RTI tracker — check the status of your request" },
      {
        property: "og:description",
        content:
          "Enter a registration number to see the full timeline of your RTI request or appeal.",
      },
      { property: "og:url", content: "/track" },
    ],
    links: [{ rel: "canonical", href: "/track" }],
  }),
  component: TrackPage,
});

function TrackPage() {
  const { rn } = Route.useSearch();
  const navigate = useNavigate();
  const [filings, setFilings] = useState<FiledRti[]>(demoFilings);
  const [query, setQuery] = useState(rn ?? "");

  useEffect(() => {
    setFilings(loadFilings());
  }, []);

  const selected = useMemo(
    () => filings.find((f) => f.registrationNumber === rn) ?? filings[0],
    [filings, rn],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return filings;
    return filings.filter(
      (f) =>
        f.registrationNumber.toLowerCase().includes(q) ||
        f.subject.toLowerCase().includes(q) ||
        f.publicAuthority.toLowerCase().includes(q),
    );
  }, [filings, query]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main id="main" tabIndex={-1}>
        <PageHero
          eyebrow="View status"
          title="RTI tracker"
          lede="Search by registration number, subject or public authority. Anything you filed in this browser appears here alongside two sample applications."
        >
          <div className="mt-7 flex max-w-md items-center gap-3 rounded-md border border-white/20 bg-white/5 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-saffron" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="DOPTG/R/2026/601234"
              aria-label="Search by registration number"
              className="w-full bg-transparent text-sm text-ink-foreground outline-none placeholder:text-ink-foreground/45"
            />
          </div>
        </PageHero>

        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 lg:grid lg:grid-cols-[340px_minmax(0,1fr)] md:py-16">
          <aside className="order-2 lg:order-1">
            <p className="text-eyebrow text-muted-foreground">
              {results.length} application{results.length === 1 ? "" : "s"}
            </p>
            <ul className="mt-4 space-y-3">
              {results.map((f) => {
                const active = selected?.registrationNumber === f.registrationNumber;
                const stage = f.events.filter((e) => e.done).length;
                return (
                  <li key={f.registrationNumber}>
                    <button
                      onClick={() => navigate({ to: "/track", search: { rn: f.registrationNumber } })}
                      className={`w-full rounded-lg border p-4 text-left transition-colors ${
                        active
                          ? "border-saffron bg-accent"
                          : "border-border bg-card hover:bg-secondary"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-mono text-xs">{f.registrationNumber}</span>
                        <span className="text-eyebrow text-muted-foreground">
                          {f.kind === "appeal" ? "Appeal" : "Request"}
                        </span>
                      </span>
                      <span className="mt-2 block text-sm leading-snug">{f.subject}</span>
                      <span className="mt-3 flex items-center gap-1.5">
                        {f.events.map((e, i) => (
                          <span
                            key={i}
                            className={`h-1 flex-1 rounded-full ${
                              i < stage ? "bg-verdant" : "bg-border"
                            }`}
                          />
                        ))}
                      </span>
                    </button>
                  </li>
                );
              })}
              {results.length === 0 && (
                <li className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                  No application matches that search.
                </li>
              )}
            </ul>
            <Link to="/file" className="btn-base btn-quiet mt-6 w-full !text-sm">
              File a new request
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </aside>

          {selected && (
            <section className="order-1 surface-card p-6 md:p-9 lg:order-2">
              <p className="text-eyebrow text-saffron">
                {selected.kind === "appeal" ? "First appeal" : "RTI request"}
              </p>
              <h2 className="mt-2 text-2xl leading-snug md:text-3xl">{selected.subject}</h2>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {selected.registrationNumber}
              </p>

              <dl className="mt-7 grid gap-4 sm:grid-cols-3">
                <Stat icon={Landmark} label="Public authority" value={selected.publicAuthority} />
                <Stat icon={CalendarClock} label="Filed on" value={selected.filedOn} />
                <Stat icon={FileSearch} label="Reply due by" value={selected.dueOn} />
              </dl>

              <h3 className="mt-9 text-xl">Timeline</h3>
              <ol className="mt-5 space-y-0">
                {selected.events.map((e, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                          e.done ? "bg-verdant text-ink-foreground" : "bg-secondary"
                        }`}
                      >
                        {e.done ? (
                          <Check className="h-4 w-4" aria-hidden />
                        ) : (
                          <Circle className="h-3 w-3 text-muted-foreground" aria-hidden />
                        )}
                      </span>
                      {i < selected.events.length - 1 && (
                        <span
                          className={`w-px flex-1 ${e.done ? "bg-verdant/40" : "bg-border"}`}
                        />
                      )}
                    </div>
                    <div className="pb-7">
                      <p className="text-sm font-medium">{e.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {e.detail}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{e.date}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-4 space-y-5 border-t border-border pt-7">
                <Field
                  label="Registered email"
                  hint="On the live portal, the reply is emailed to this address and an SMS alert is sent."
                >
                  <TextInput value={selected.email} readOnly />
                </Field>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/file"
                    search={{ type: "appeal" }}
                    className="btn-base btn-ink !text-sm"
                  >
                    File a first appeal
                  </Link>
                  <Link to="/faq" className="btn-base btn-quiet !text-sm">
                    Questions about replies
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Landmark;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary p-4">
      <dt className="flex items-center gap-2 text-eyebrow text-muted-foreground">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </dt>
      <dd className="mt-2 text-sm leading-snug">{value}</dd>
    </div>
  );
}
