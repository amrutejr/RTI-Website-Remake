import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { guidelineClusters } from "@/content/guidelines";

type FilingType = "request" | "appeal";

export const Route = createFileRoute("/guidelines")({
  validateSearch: (search: Record<string, unknown>): { type?: FilingType } =>
    search["type"] === "appeal" ? { type: "appeal" } : {},

  head: () => ({
    meta: [
      { title: "Guidelines for use of the RTI Online Portal" },
      {
        name: "description",
        content:
          "All 21 guidelines for filing an RTI application or first appeal online: application text limits, supporting documents, payment modes, registration numbers and appeals.",
      },
      { property: "og:title", content: "Guidelines for use of the RTI Online Portal" },
      {
        property: "og:description",
        content:
          "Read the 21 official guidelines before submitting an RTI request or first appeal online.",
      },
      { property: "og:url", content: "/guidelines" },
    ],
    links: [{ rel: "canonical", href: "/guidelines" }],
  }),
  component: GuidelinesPage,
});

function GuidelinesPage() {
  const { type } = Route.useSearch();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const isAppeal = type === "appeal";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main id="main" tabIndex={-1}>
        <PageHero
          eyebrow={isAppeal ? "Submit first appeal" : "Submit RTI request"}
          title="Guidelines for use of the RTI Online Portal"
          lede="Twenty-one points that govern every filing on this portal. Read them once and the rest of the process is straightforward."
        />

        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-eyebrow text-muted-foreground">On this page</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {guidelineClusters.map((c) => (
                  <li key={c.id}>
                    <a href={`#${c.id}`} className="text-muted-foreground hover:text-saffron">
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
              <Link to="/guide" className="btn-base btn-quiet mt-8 w-full !text-sm">
                See the visual guide
              </Link>
            </div>
          </nav>

          <div className="space-y-14">
            {guidelineClusters.map((cluster) => (
              <section key={cluster.id} id={cluster.id} className="scroll-mt-28">
                <p className="text-eyebrow text-saffron">{cluster.label}</p>
                <h2 className="mt-2 text-3xl md:text-4xl">{cluster.title}</h2>
                <ol className="mt-7 space-y-6">
                  {cluster.points.map((p) => (
                    <li key={p.n} className="flex gap-5">
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-secondary font-display text-base text-secondary-foreground">
                        {p.n}
                      </span>
                      <div>
                        <p className="text-[15px] leading-relaxed">{p.text}</p>
                        {p.sub && (
                          <ul className="mt-3 space-y-1.5 border-l-2 border-saffron pl-4">
                            {p.sub.map((s) => (
                              <li key={s} className="text-sm leading-relaxed text-muted-foreground">
                                {s}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ))}

            <section className="surface-card p-7 md:p-9">
              <label className="flex cursor-pointer items-start gap-3">
                <span className="relative mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-input bg-card">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  {accepted && <Check className="h-4 w-4 text-saffron" aria-hidden />}
                </span>
                <span className="text-[15px] font-medium">
                  I have read and understood the above guidelines.
                </span>
              </label>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  disabled={!accepted}
                  onClick={() =>
                    navigate({ to: "/file", search: isAppeal ? { type: "appeal" } : {} })
                  }
                  className="btn-base btn-saffron disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  {isAppeal ? "Continue to first appeal" : "Continue to the request form"}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
                {!isAppeal && (
                  <Link to="/prepare" className="btn-base btn-quiet">
                    Prepare the application first
                  </Link>
                )}
                <Link to="/" className="btn-base btn-quiet">
                  Cancel
                </Link>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                This is a design concept. Continuing opens the guided filing screens; nothing is
                sent to a real public authority.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
