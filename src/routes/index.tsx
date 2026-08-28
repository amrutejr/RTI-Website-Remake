import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeIndianRupee,
  ChevronDown,
  Clock,
  CreditCard,
  FileText,
  Gavel,
  Landmark,
  Phone,
  Scale,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StatsBanner } from "@/components/stats-banner";
import { CitizenFilingJourney } from "@/components/citizen-filing-journey";
import { FourStepProcess } from "@/components/four-step-process";
import { SampleComplaints } from "@/components/sample-complaints";
import { faqCount } from "@/content/faq";
import heroArt from "@/assets/hero-transparency.jpg";
import citizenPhoto from "@/assets/citizen-filing.jpg";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RTI Online — File Right to Information Requests in India" },
      {
        name: "description",
        content:
          "File RTI applications and first appeals online with Central Government ministries, pay securely by UPI, card or net banking, and track every request in one place.",
      },
      {
        property: "og:title",
        content: "RTI Online — File Right to Information Requests in India",
      },
      {
        property: "og:description",
        content:
          "A modern portal for Indian citizens to file RTI applications and first appeals, pay securely and track status.",
      },
    ],
  }),
  component: Index,
});

type Action = {
  icon: typeof FileText;
  title: string;
  body: string;
  cta: string;
  to?: "/guidelines" | "/guide" | "/track" | "/file" | "/prepare" | "/maya";
  search?: { type: "appeal" };
  href?: string;
};

const actions: Action[] = [
  {
    icon: Sparkles,
    title: "File an RTI using AI",
    body: "Talk to Maya. She asks follow-ups, drafts a records-based request and files it on this portal.",
    cta: "File with Maya",
    to: "/maya",
  },
  {
    icon: FileText,
    title: "Prepare & submit RTI request",
    body: "Work through the preparation checklist, turn your problem into precise record requests, then pay the ₹10 fee online.",
    cta: "Prepare an RTI",
    to: "/prepare",
  },
  {
    icon: Gavel,
    title: "Submit first appeal",
    body: "No reply within 30 days, or unsatisfied with it? File a first appeal free of cost.",
    cta: "File appeal",
    to: "/guidelines",
    search: { type: "appeal" },
  },
  {
    icon: Search,
    title: "View status & history",
    body: "Follow your request from registration to reply, with the full trail of every filing.",
    cta: "Track request",
    to: "/track",
  },
  {
    icon: Scale,
    title: "Second appeal to CIC",
    body: "First appeal details are now fetched automatically by the CIC portal — no re-entry.",
    cta: "Go to CIC",
    href: "https://cic.gov.in/",
  },
];


const steps = [
  {
    n: "01",
    title: "Read the guidelines",
    body: "Confirm the public authority falls under the Central Government and prepare a clear, specific question.",
  },
  {
    n: "02",
    title: "Write your application",
    body: "Fill in your details, choose the ministry or department and describe the information sought in up to 3,000 characters.",
  },
  {
    n: "03",
    title: "Pay the fee",
    body: "₹10 by UPI, net banking, or Master/Visa/RuPay card. Citizens below the poverty line pay nothing.",
  },
  {
    n: "04",
    title: "Receive the reply",
    body: "Get a registration number instantly, then SMS and email alerts as the CPIO responds within 30 days.",
  },
];

const payments = [
  { icon: Smartphone, label: "UPI" },
  { icon: Landmark, label: "Net banking" },
  { icon: CreditCard, label: "Debit / credit card" },
  { icon: BadgeIndianRupee, label: "RuPay" },
];

const faqs = [
  {
    q: "Who can file an RTI application on this portal?",
    a: "Any citizen of India may file an application for information held by ministries, departments and other public authorities of the Central Government.",
  },
  {
    q: "Can I file for a State Government department?",
    a: "No. Applications for public authorities under State Governments, including the Government of NCT Delhi, must be filed on the respective state portal. Requests filed here are returned without refund of the fee.",
  },
  {
    q: "What does it cost?",
    a: "A prescribed fee of ₹10 for an application. First appeals carry no fee. Applicants below the poverty line are exempt from the fee on submitting proof.",
  },
  {
    q: "How long does a reply take?",
    a: "The CPIO normally responds within 30 days of registration, or 48 hours where the information concerns the life or liberty of a person.",
  },
  {
    q: "How will I be notified?",
    a: "You receive a unique registration number immediately, followed by SMS and email alerts at every stage. You can also check status any time with your registration number.",
  },
];

function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />


      <main id="main" tabIndex={-1}>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-ink text-ink-foreground">
          <img
            src={heroArt}
            alt="Layers of government records opening into light around an Ashoka chakra motif"
            width={1600}
            height={1104}
            className="pointer-events-none absolute inset-y-0 right-0 h-full w-[62%] object-cover opacity-70 [mask-image:linear-gradient(to_right,transparent,black_38%)]"
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="max-w-2xl">
              <p className="text-eyebrow text-saffron">
                Section 6(1) · Right to Information Act, 2005
              </p>
              <h1 className="mt-5 text-5xl leading-[1.03] md:text-6xl">
                Ask the government
                <span className="block italic text-saffron">a plain question.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-foreground/75 md:text-lg">
                File an RTI application or first appeal with any Ministry, Department
                or Public Authority of the Central Government. Pay online, get a
                registration number instantly, and track the reply end to end.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/maya" className="btn-base btn-saffron">
                  File an RTI using AI
                  <Sparkles className="h-4 w-4" aria-hidden />
                </Link>
                <Link to="/prepare" className="btn-base btn-outline-light">
                  Prepare & submit a request
                </Link>
              </div>

              <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-7">
                {[
                  ["₹10", "Application fee"],
                  ["30 days", "Statutory reply window"],
                  ["2,000+", "Central public authorities"],
                ].map(([v, k]) => (
                  <div key={k}>
                    <dt className="font-display text-2xl text-saffron md:text-3xl">
                      {v}
                    </dt>
                    <dd className="mt-1 text-xs text-ink-foreground/60">{k}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside className="self-end rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-eyebrow text-saffron">Notice</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-foreground/80">
                The Central Information Commission has integrated its Second Appeal
                filing portal with this portal. Enter your First Appeal registration
                number, email and filing date — application details are fetched
                automatically.
              </p>
              <a
                href="https://cic.gov.in/"
                className="mt-5 inline-flex items-center gap-1.5 text-sm text-saffron hover:underline"
              >
                File a second appeal at CIC
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </aside>
          </div>
        </section>

        {/* ════════ KEY STATS BANNER ════════ */}
        <StatsBanner />

        {/* Actions */}
        <section id="actions" className="mx-auto max-w-6xl px-5 py-20 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-eyebrow text-muted-foreground">Start here</p>
              <h2 className="mt-3 text-4xl md:text-5xl">What you can do</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Everything is online, from the first application to the second appeal.
              No paper, no visits, no intermediaries.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {actions.map(({ icon: Icon, title, body, cta, to, href, search }) => {
              const inner = (
                <>
                  <div>
                    <span className="grid h-11 w-11 place-items-center rounded-md bg-accent">
                      <Icon className="h-5 w-5 text-accent-foreground" aria-hidden />
                    </span>
                    <h3 className="mt-6 text-2xl">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                  <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium">
                    {cta}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </>
              );
              const cls =
                "surface-card group flex flex-col justify-between p-7 transition-transform duration-300 hover:-translate-y-1";
              return to ? (
                <Link key={title} to={to} {...(search ? { search } : {})} className={cls}>
                  {inner}
                </Link>
              ) : (
                <a key={title} href={href} className={cls}>
                  {inner}
                </a>
              );
            })}
          </div>
        </section>

        {/* ════════ CITIZEN-FIRST FILING JOURNEY ════════ */}
        <CitizenFilingJourney />

        {/* ════════ FOUR STEP PROCESS ════════ */}
        <FourStepProcess />

        {/* ════════ SAMPLE COMPLAINTS & SAFETY ════════ */}
        <section id="sample-complaints" className="mx-auto max-w-6xl px-5 py-20 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <SampleComplaints />

            <div className="surface-card p-6 md:p-8">
              <p className="text-eyebrow text-muted-foreground">Safety & Responsibility</p>
              <h3 className="mt-2 text-2xl sm:text-3xl font-normal leading-tight text-foreground">
                Built for responsible public information access
              </h3>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                RTI applications are framed around verifiable records, administrative decisions, and public expenditure rather than personal disputes.
              </p>
              <ul className="mt-6 space-y-3.5 text-sm leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-verdant shrink-0" />
                  <span>No real government credentials, Aadhaar data, or biometric records are ever requested or stored.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-verdant shrink-0" />
                  <span>The workflow supports safe testing, practice drafting, and instant validation before final submission.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-verdant shrink-0" />
                  <span>Requests are filtered to ensure compliance with Section 8 exemptions under the RTI Act, 2005.</span>
                </li>
              </ul>
              <div className="mt-7 rounded-lg border border-border bg-secondary p-4">
                <p className="text-xs text-secondary-foreground">
                  💡 <strong className="font-semibold">Pro Tip:</strong> Precise requests with specific dates and file references get answered 3× faster by CPIOs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scope */}
        <section id="scope" className="mx-auto max-w-6xl px-5 py-20 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-border shadow-lift">
              <img
                src={citizenPhoto}
                alt="A citizen filing an RTI application on a laptop at home"
                width={1200}
                height={1408}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-eyebrow text-muted-foreground">Who and what</p>
              <h2 className="mt-3 text-4xl md:text-5xl">
                Built for every citizen of India
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                This portal covers all Ministries, Departments and other Public
                Authorities of the Central Government. Applications for public
                authorities under State Governments — including the Government of NCT
                Delhi — must be filed on the relevant state portal.
              </p>
              <div className="mt-7 rounded-lg border-l-2 border-saffron bg-secondary p-5">
                <p className="text-sm leading-relaxed text-secondary-foreground">
                  <strong className="font-semibold">Please note:</strong> a request
                  filed here for a State public authority is returned without refund
                  of the amount paid. Check the authority before you pay.
                </p>
              </div>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Instant registration number",
                  "SMS and email alerts",
                  "Fee exemption for BPL applicants",
                  "Full filing history in one place",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <ShieldCheck
                      className="mt-0.5 h-4 w-4 shrink-0 text-verdant"
                      aria-hidden
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Payments */}
        <section
          id="payments"
          className="bg-gradient-ink text-ink-foreground"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_auto] md:items-center md:py-20">
            <div>
              <p className="text-eyebrow text-saffron">Secure payments</p>
              <h2 className="mt-3 text-4xl md:text-5xl">
                Pay the ₹10 fee your way
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-foreground/70">
                Payments run through the Government of India payment gateway. Nothing
                is stored on this portal.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {payments.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/15 bg-white/5 px-4 py-5 text-center"
                >
                  <Icon className="mx-auto h-5 w-5 text-saffron" aria-hidden />
                  <p className="mt-3 text-xs text-ink-foreground/80">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ + help */}
        <section id="help" className="mx-auto max-w-6xl px-5 py-20 md:py-24">
          <div className="grid gap-14 lg:grid-cols-[1fr_340px]">
            <div>
              <p className="text-eyebrow text-muted-foreground">Questions</p>
              <h2 className="mt-3 text-4xl md:text-5xl">Before you file</h2>
              <div className="mt-10 divide-y divide-border border-y border-border">
                {faqs.map((f, i) => {
                  const open = openFaq === i;
                  return (
                    <div key={f.q}>
                      <button
                        onClick={() => setOpenFaq(open ? null : i)}
                        className="flex w-full items-center justify-between gap-6 py-5 text-left"
                        aria-expanded={open}
                      >
                        <span className="text-lg">{f.q}</span>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                            open ? "rotate-180" : ""
                          }`}
                          aria-hidden
                        />
                      </button>
                      <div
                        className={`grid overflow-hidden transition-all duration-300 ${
                          open
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <p className="min-h-0 max-w-2xl pb-6 text-sm leading-relaxed text-muted-foreground">
                          {f.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/faq" className="btn-base btn-quiet">
                  All {faqCount} questions
                </Link>
                <Link to="/guide" className="btn-base btn-quiet">
                  Step-by-step guide
                </Link>
                <Link to="/process-map" className="btn-base btn-quiet">
                  Interactive process map
                </Link>

              </div>
            </div>


            <aside className="surface-card h-fit p-7">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-accent">
                <Phone className="h-5 w-5 text-accent-foreground" aria-hidden />
              </span>
              <h3 className="mt-6 text-2xl">Help desk</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                For any query or feedback related to this portal.
              </p>
              <p className="mt-5 font-display text-2xl">011-24010690 / 691</p>
              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                9:00 AM – 5:30 PM, Monday to Friday, except public holidays. Call
                waiting may occur during high volume.
              </p>
              <a
                href="mailto:helprtionline-dopt@nic.in"
                className="btn-base btn-ink mt-6 w-full"
              >
                Email the help desk
              </a>
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter />

    </div>
  );
}
