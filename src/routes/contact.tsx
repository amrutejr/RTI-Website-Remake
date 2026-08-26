import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact the RTI Online helpdesk" },
      {
        name: "description",
        content:
          "Helpdesk number, office hours, helpline email scope and the Under Secretary (IR-1) address for queries about filing an RTI application online.",
      },
      { property: "og:title", content: "Contact the RTI Online helpdesk" },
      {
        property: "og:description",
        content: "Reach the RTI Online helpdesk by phone or email, or write to the Under Secretary (IR-1).",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main id="main" tabIndex={-1}>
        <PageHero
          eyebrow="Contact us"
          title="Talk to the helpdesk"
          lede="For queries or problems faced while filing an online RTI through this portal."
        />

        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="surface-card p-8">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-accent">
                <Phone className="h-5 w-5 text-accent-foreground" aria-hidden />
              </span>
              <h2 className="mt-6 text-2xl">Help desk</h2>
              <p className="mt-4 font-display text-3xl">011-24010690 / 691</p>
              <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                9:00 AM – 5:30 PM, Monday to Friday, except public holidays. Due to high call
                volume, call waiting may occur.
              </p>
            </div>

            <div className="surface-card p-8">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-accent">
                <Mail className="h-5 w-5 text-accent-foreground" aria-hidden />
              </span>
              <h2 className="mt-6 text-2xl">Helpline email</h2>
              <a
                href="mailto:helprtionline-dopt@nic.in"
                className="mt-4 inline-block font-display text-2xl hover:text-saffron"
              >
                helprtionline-dopt[at]nic[dot]in
              </a>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Exclusively for queries or problems faced while filing an online RTI through this
                portal. Replies are limited to the RTI Online portal of the Central Government.
              </p>
            </div>
          </div>

          <div className="surface-card mt-6 p-8">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-accent">
              <MapPin className="h-5 w-5 text-accent-foreground" aria-hidden />
            </span>
            <h2 className="mt-6 text-2xl">If your query is still unresolved</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Write to the official below.
            </p>
            <address className="mt-6 not-italic text-[15px] leading-relaxed">
              Under Secretary (IR-1)
              <br />
              W/H 31049, Kartvya Bhavan 3
              <br />
              New Delhi – 110001
              <br />
              <a href="mailto:usir-dopt@nic.in" className="hover:text-saffron">
                usir-dopt[at]nic[dot]in
              </a>
            </address>
          </div>

          <div className="surface-card mt-6 flex flex-wrap items-center justify-between gap-6 p-8">
            <div>
              <h2 className="text-2xl">Most answers are already written down</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Check the FAQ and the step-by-step guide before calling.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/faq" className="btn-base btn-quiet">
                FAQ
              </Link>
              <Link to="/guide" className="btn-base btn-ink">
                Step-by-step guide
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
