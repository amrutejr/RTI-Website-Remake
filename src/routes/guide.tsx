import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Info } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { guideSteps } from "@/content/guide-steps";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "How to file an RTI online — step-by-step guide" },
      {
        name: "description",
        content:
          "An illustrated walkthrough of filing an RTI application online: OTP verification, the request form fields, supporting documents, the ₹10 payment, registration number and status tracking.",
      },
      { property: "og:title", content: "How to file an RTI online — step-by-step guide" },
      {
        property: "og:description",
        content:
          "Every screen of the RTI Online filing process, with the exact fields each form asks for.",
      },
      { property: "og:url", content: "/guide" },
    ],
    links: [{ rel: "canonical", href: "/guide" }],
  }),
  component: GuidePage,
});

function GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main id="main" tabIndex={-1}>
        <PageHero
          eyebrow="Citizen guide"
          title="Every screen, in order"
          lede="Eight steps from the guidelines screen to the reply, with the exact fields each form asks for and the notes that most applications trip over."
        >
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/guidelines" className="btn-base btn-saffron">
              Start at the guidelines
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/faq" className="btn-base btn-outline-light">
              Read the FAQ
            </Link>
          </div>
        </PageHero>

        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <div className="space-y-20">
            {guideSteps.map((step) => (
              <section
                key={step.n}
                id={`step-${step.n}`}
                className="scroll-mt-28 border-t-2 border-ink pt-8"
              >
                <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
                  <div>
                    <span className="font-display text-4xl text-saffron">{step.n}</span>
                    <h2 className="mt-3 text-3xl md:text-4xl">{step.title}</h2>
                    <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>

                    {step.note && (
                      <div className="mt-6 flex max-w-xl items-start gap-3 rounded-lg border-l-2 border-saffron bg-secondary p-5">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-saffron" aria-hidden />
                        <p className="text-sm leading-relaxed text-secondary-foreground">
                          {step.note}
                        </p>
                      </div>
                    )}
                  </div>

                  {step.fields && (
                    <div className="surface-card p-6">
                      <p className="text-eyebrow text-muted-foreground">What this screen asks</p>
                      <dl className="mt-5 divide-y divide-border">
                        {step.fields.map((f) => (
                          <div key={f.label} className="py-3.5 first:pt-0 last:pb-0">
                            <dt className="text-sm font-medium">{f.label}</dt>
                            <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              {f.hint}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>

                {step.image && (
                  <figure className="mt-9 overflow-hidden rounded-xl border border-border shadow-lift">
                    <img
                      src={step.image.src}
                      alt={step.image.alt}
                      width={step.image.width}
                      height={step.image.height}
                      loading="lazy"
                      className="w-full"
                    />
                    <figcaption className="border-t border-border bg-paper px-5 py-3 text-xs text-muted-foreground">
                      Concept mock-up of the {step.title.toLowerCase()} screen.
                    </figcaption>
                  </figure>
                )}
              </section>
            ))}
          </div>

          <section className="surface-card mt-20 flex flex-wrap items-center justify-between gap-6 p-8">
            <div>
              <h2 className="text-2xl">Still unsure about something?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Twenty-four answers cover fees, appeals, status and reconciliation.
              </p>
            </div>
            <Link to="/faq" className="btn-base btn-ink">
              Read the FAQ
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
