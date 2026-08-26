import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Copy,
  Download,
  FileText,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { CheckRow, Field, Select, TextArea, TextInput } from "@/components/filing-fields";
import { authoritiesByMinistry, indianStates, ministries } from "@/lib/rti-filing";
import {
  betterQuestions,
  formatOptions,
  recordTypes,
  supportingDocs,
  weakExample,
} from "@/content/rti-checklist";
import {
  assembleApplication,
  clearPrepared,
  completeness,
  downloadText,
  emptyPrepared,
  findWeakPhrases,
  loadPrepared,
  progress,
  requestLines,
  savePrepared,
  type PreparedDraft,
} from "@/lib/rti-draft";

export const Route = createFileRoute("/prepare")({
  head: () => ({
    meta: [
      { title: "Prepare an RTI — checklist and draft builder" },
      {
        name: "description",
        content:
          "Work through the RTI filing preparation checklist: identify the public authority, break your problem into records, frame precise questions, fix the time period and assemble a ready-to-file application.",
      },
      { property: "og:title", content: "Prepare an RTI — checklist and draft builder" },
      {
        property: "og:description",
        content:
          "An eight-part checklist that turns your problem into a precise, records-based RTI application you can file straight away.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/prepare" }],
  }),
  component: PreparePage,
});

const sections = [
  { id: "basic", n: "01", title: "Basic information" },
  { id: "issue", n: "02", title: "Information about the issue" },
  { id: "records", n: "03", title: "Documents and records to request" },
  { id: "framing", n: "04", title: "How to frame questions" },
  { id: "period", n: "05", title: "Time period" },
  { id: "support", n: "06", title: "Supporting documents" },
  { id: "format", n: "07", title: "Preferred response format" },
  { id: "final", n: "08", title: "Final RTI application" },
] as const;

function SectionShell({
  id,
  n,
  title,
  lede,
  children,
}: {
  id: string;
  n: string;
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t-2 border-ink pt-7">
      <span className="font-display text-3xl text-saffron">{n}</span>
      <h2 className="mt-2 text-2xl md:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{lede}</p>
      <div className="mt-7">{children}</div>
    </section>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
        active
          ? "border-saffron bg-accent text-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-secondary"
      }`}
    >
      <span
        className={`grid h-4 w-4 place-items-center rounded-full border ${
          active ? "border-saffron bg-saffron text-saffron-foreground" : "border-input"
        }`}
      >
        {active && <Check className="h-2.5 w-2.5" aria-hidden />}
      </span>
      {children}
    </button>
  );
}

function PreparePage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<PreparedDraft>(emptyPrepared);
  const [newQuestion, setNewQuestion] = useState("");
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [currentSection, setCurrentSection] = useState<(typeof sections)[number]["id"]>("basic");

  useEffect(() => {
    const saved = loadPrepared();
    if (saved) setDraft(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) savePrepared(draft);
  }, [draft, hydrated]);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setCurrentSection(visible.target.id as (typeof sections)[number]["id"]);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.5] },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const set = <K extends keyof PreparedDraft>(key: K, value: PreparedDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const toggle = (key: "records" | "attachments" | "formats", value: string) =>
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(value) ? d[key].filter((v) => v !== value) : [...d[key], value],
    }));

  const authorities = authoritiesByMinistry[draft.ministry] ?? [
    "Central Public Information Officer (main office)",
    "Central Public Information Officer (subordinate office)",
  ];

  const lines = requestLines(draft);
  const flags = useMemo(() => findWeakPhrases(draft), [draft]);
  const items = progress(draft);
  const score = completeness(draft);
  const application = useMemo(() => assembleApplication(draft), [draft]);

  const addQuestion = (q: string) => {
    const text = q.trim();
    if (!text) return;
    setDraft((d) => ({ ...d, questions: [...d.questions, text] }));
    setNewQuestion("");
  };

  const copy = () => {
    void navigator.clipboard.writeText(application);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main id="main" tabIndex={-1}>
        <PageHero
          eyebrow="Before you file"
          title="Prepare an RTI that cannot be brushed aside"
          lede="A precise application gets a precise answer. Work through the eight parts of this checklist and the portal assembles your application as you go — every entry stays in this browser."
        >
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#basic" className="btn-base btn-saffron">
              Start the checklist
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <Link to="/process-map" className="btn-base btn-outline-light">
              See the workflow
            </Link>
          </div>
        </PageHero>

        <div className="sticky top-[4.75rem] z-30 border-b border-border bg-background/90 px-5 py-2.5 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-[1460px] items-center justify-between gap-4">
            <p className="min-w-0 truncate text-sm">
              <span className="font-mono text-[11px] text-muted-foreground">{score}% · </span>
              {sections.find((s) => s.id === currentSection)?.title}
            </p>
            <div className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-saffron transition-all"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1460px] gap-10 px-5 py-12 md:py-16 lg:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[210px_minmax(0,1fr)_380px]">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-eyebrow text-muted-foreground">Checklist</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-saffron transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">{score}% ready</p>
              <ol className="mt-5 space-y-1">
                {sections.map((s, i) => {
                  const done = items[i]?.done;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="flex items-center gap-2.5 rounded-md px-2 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <span
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-[10px] ${
                            done ? "bg-verdant text-ink-foreground" : "bg-secondary"
                          }`}
                        >
                          {done ? <Check className="h-3 w-3" aria-hidden /> : s.n}
                        </span>
                        {s.title}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>

          <div className="space-y-14">
            <SectionShell
              id="basic"
              n="01"
              title="Basic information"
              lede="Who is asking, and which public authority holds the record. An RTI sent to the wrong authority is transferred under section 6(3) — and you lose days."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" required>
                  <TextInput
                    value={draft.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="As it should appear on the reply"
                  />
                </Field>
                <Field label="Email" hint="Optional, but the fastest way to receive a reply.">
                  <TextInput
                    type="email"
                    value={draft.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="Address" required>
                  <TextArea
                    rows={3}
                    value={draft.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="House, street, locality, city, state, PIN"
                  />
                </Field>
                <Field label="Phone" hint="Optional.">
                  <TextInput
                    value={draft.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91"
                  />
                </Field>
              </div>

              <div className="mt-7 border-t border-border pt-6">
                <p className="text-eyebrow text-muted-foreground">Central or State?</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill
                    active={draft.jurisdiction === "central"}
                    onClick={() => set("jurisdiction", "central")}
                  >
                    Central Government
                  </Pill>
                  <Pill
                    active={draft.jurisdiction === "state"}
                    onClick={() => set("jurisdiction", "state")}
                  >
                    State Government
                  </Pill>
                </div>
                {draft.jurisdiction === "state" ? (
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field label="State" required>
                      <Select
                        value={draft.ministry}
                        onChange={(e) => set("ministry", e.target.value)}
                      >
                        <option value="">Select state</option>
                        {indianStates.map((s) => (
                          <option key={s} value={`Government of ${s}`}>
                            {s}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field
                      label="Public authority"
                      required
                      hint="Department, board, corporation or local body holding the record."
                    >
                      <TextInput
                        value={draft.publicAuthority}
                        onChange={(e) => set("publicAuthority", e.target.value)}
                        placeholder="e.g. Public Works Department, Division II"
                      />
                    </Field>
                    <div className="sm:col-span-2 flex items-start gap-3 rounded-lg border-l-2 border-saffron bg-secondary p-5">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-saffron" aria-hidden />
                      <p className="text-sm leading-relaxed text-secondary-foreground">
                        State RTIs are filed with the SPIO under that State&rsquo;s RTI Rules. The
                        fee, the payment mode and the online portal differ from state to state —
                        this portal covers Central public authorities only, so a State application
                        must be sent to the State authority directly.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field label="Ministry / Department" required>
                      <Select
                        value={draft.ministry}
                        onChange={(e) => {
                          set("ministry", e.target.value);
                          set("publicAuthority", "");
                        }}
                      >
                        <option value="">Select ministry or department</option>
                        {ministries.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Public authority / CPIO office" required>
                      <Select
                        value={draft.publicAuthority}
                        onChange={(e) => set("publicAuthority", e.target.value)}
                      >
                        <option value="">Select public authority</option>
                        {authorities.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </div>
                )}
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field
                    label="CPIO / SPIO name and designation"
                    hint="Optional — leave blank and address it to the PIO by office."
                  >
                    <TextInput
                      value={draft.pioName}
                      onChange={(e) => set("pioName", e.target.value)}
                      placeholder="e.g. Shri A. Kumar, Under Secretary"
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-7 space-y-4 border-t border-border pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-secondary px-4 py-3">
                  <p className="text-sm">Application fee</p>
                  <p className="font-mono text-sm">
                    {draft.bpl
                      ? "Nil — BPL exemption"
                      : draft.jurisdiction === "central"
                        ? "₹10 (RTI Rules, 2012)"
                        : "As per State RTI Rules"}
                  </p>
                </div>
                <CheckRow checked={draft.bpl} onChange={(v) => set("bpl", v)}>
                  I am below the poverty line — no fee is payable, and I will enclose the BPL
                  certificate issued by the appropriate government.
                </CheckRow>
              </div>
            </SectionShell>

            <SectionShell
              id="issue"
              n="02"
              title="Information about the issue"
              lede="Give the CPIO enough context to locate the file: what happened, when, in which office, and under which reference number."
            >
              <div className="space-y-5">
                <Field
                  label="What information do you want?"
                  required
                  hint="Two or three sentences. Be concrete — a named scheme, a work, a payment, an application."
                >
                  <TextArea
                    rows={4}
                    value={draft.issue}
                    onChange={(e) => set("issue", e.target.value)}
                    placeholder="My application for a pension revision, submitted on 4 February 2026, has not been decided. I am seeking the record of its processing."
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Application / reference / complaint number"
                    hint="Quote it exactly as printed on your receipt."
                  >
                    <TextInput
                      value={draft.referenceNumber}
                      onChange={(e) => set("referenceNumber", e.target.value)}
                      placeholder="e.g. PEN/2026/004512"
                    />
                  </Field>
                  <Field label="Relevant dates" hint="Dates of submission, hearing, order, payment.">
                    <TextInput
                      value={draft.relevantDates}
                      onChange={(e) => set("relevantDates", e.target.value)}
                      placeholder="Submitted 04/02/2026; reminder 18/03/2026"
                    />
                  </Field>
                  <Field label="Department / office involved">
                    <TextInput
                      value={draft.office}
                      onChange={(e) => set("office", e.target.value)}
                      placeholder="e.g. Pension Section, Regional Office, Kolkata"
                    />
                  </Field>
                  <Field
                    label="Names / designations of officials"
                    hint="Only if you know them — never required."
                  >
                    <TextInput
                      value={draft.officials}
                      onChange={(e) => set("officials", e.target.value)}
                      placeholder="e.g. Section Officer, Pension Section"
                    />
                  </Field>
                </div>
              </div>
            </SectionShell>

            <SectionShell
              id="records"
              n="03"
              title="Documents and records to request"
              lede="Ask for records that already exist. Pick the ones that apply and each becomes a numbered line in your application."
            >
              <div className="flex flex-wrap gap-2">
                {recordTypes.map((r) => (
                  <Pill
                    key={r.id}
                    active={draft.records.includes(r.id)}
                    onClick={() => toggle("records", r.id)}
                  >
                    {r.label}
                  </Pill>
                ))}
              </div>
              {draft.records.length > 0 && (
                <ol className="mt-7 space-y-3 rounded-lg border border-border bg-card p-6">
                  <p className="text-eyebrow text-muted-foreground">Lines added to your request</p>
                  {draft.records.map((id, i) => {
                    const r = recordTypes.find((x) => x.id === id);
                    if (!r) return null;
                    return (
                      <li key={id} className="flex gap-3 text-sm leading-relaxed">
                        <span className="font-mono text-xs text-saffron">{i + 1}.</span>
                        <span>{r.line}</span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </SectionShell>

            <SectionShell
              id="framing"
              n="04"
              title="How to frame questions"
              lede="The PIO is bound to give you records — not opinions. Rewrite every &ldquo;why&rdquo; as a request for the document that answers it."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
                  <p className="text-eyebrow text-destructive">Weak</p>
                  <p className="mt-3 text-sm leading-relaxed">&ldquo;{weakExample}&rdquo;</p>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Invites an explanation, which the PIO can decline to create.
                  </p>
                </div>
                <div className="rounded-lg border border-verdant/35 bg-verdant/5 p-6">
                  <p className="text-eyebrow text-verdant">Better — tap to add</p>
                  <ul className="mt-3 space-y-2">
                    {betterQuestions.map((q) => {
                      const added = draft.questions.includes(q);
                      return (
                        <li key={q}>
                          <button
                            type="button"
                            onClick={() => (added ? null : addQuestion(q))}
                            disabled={added}
                            className={`flex w-full items-start gap-2.5 rounded-md px-3 py-2 text-left text-[13px] leading-relaxed transition-colors ${
                              added
                                ? "bg-secondary text-muted-foreground"
                                : "hover:bg-secondary"
                            }`}
                          >
                            {added ? (
                              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-verdant" aria-hidden />
                            ) : (
                              <Plus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-saffron" aria-hidden />
                            )}
                            {q}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="mt-7 flex items-start gap-3 rounded-lg border-l-2 border-saffron bg-secondary p-5">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-saffron" aria-hidden />
                <p className="text-sm leading-relaxed text-secondary-foreground">
                  <strong className="font-medium">Key principle.</strong> Ask for existing
                  information, records, documents, data or files. Do not ask the PIO for opinions,
                  explanations, interpretations, or to create new information.
                </p>
              </div>

              <div className="mt-7">
                <Field
                  label="Add your own request line"
                  hint="Write it as an instruction: “Provide copies of…”, “Provide the date on which…”."
                >
                  <div className="flex gap-3">
                    <TextInput
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addQuestion(newQuestion);
                        }
                      }}
                      placeholder="Provide copies of all inspection reports for the said work."
                    />
                    <button
                      type="button"
                      onClick={() => addQuestion(newQuestion)}
                      className="btn-base btn-ink shrink-0 !text-sm"
                    >
                      Add
                    </button>
                  </div>
                </Field>

                {draft.questions.length > 0 && (
                  <ul className="mt-5 divide-y divide-border rounded-lg border border-border bg-card">
                    {draft.questions.map((q, i) => (
                      <li key={`${q}-${i}`} className="flex items-start gap-3 px-5 py-3.5">
                        <span className="mt-0.5 font-mono text-xs text-saffron">
                          {lines.length - draft.questions.length + i + 1}.
                        </span>
                        <span className="flex-1 text-sm leading-relaxed">{q}</span>
                        <button
                          type="button"
                          aria-label="Remove line"
                          onClick={() =>
                            set(
                              "questions",
                              draft.questions.filter((_, j) => j !== i),
                            )
                          }
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {flags.length > 0 && (
                  <div className="mt-5 space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
                    <p className="flex items-center gap-2 text-eyebrow text-destructive">
                      <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                      Opinion-seeking phrasing detected
                    </p>
                    {flags.map((f, i) => (
                      <div key={`${f.phrase}-${i}`} className="text-sm leading-relaxed">
                        <p className="text-muted-foreground">
                          &ldquo;{f.text.slice(0, 120)}
                          {f.text.length > 120 ? "…" : ""}&rdquo; contains{" "}
                          <span className="font-mono text-xs text-destructive">{f.phrase}</span>
                        </p>
                        <p className="mt-1">{f.hint}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SectionShell>

            <SectionShell
              id="period"
              n="05"
              title="Time period"
              lede="Always bound your request with dates. An unbounded request is the easiest one to refuse as “too voluminous”."
            >
              <div className="grid max-w-lg gap-5 sm:grid-cols-2">
                <Field label="From">
                  <TextInput
                    type="date"
                    value={draft.periodFrom}
                    onChange={(e) => set("periodFrom", e.target.value)}
                  />
                </Field>
                <Field label="To">
                  <TextInput
                    type="date"
                    value={draft.periodTo}
                    onChange={(e) => set("periodTo", e.target.value)}
                  />
                </Field>
              </div>
              <p className="mt-5 rounded-md border border-border bg-secondary px-4 py-3 text-sm">
                Example: &ldquo;Provide the requested information for the period from 1 April 2025 to
                31 March 2026.&rdquo;
              </p>
            </SectionShell>

            <SectionShell
              id="support"
              n="06"
              title="Useful supporting documents"
              lede="Not mandatory, but an enclosure that pins your case to a file number saves a round of correspondence."
            >
              <div className="flex flex-wrap gap-2">
                {supportingDocs.map((s) => (
                  <Pill
                    key={s.id}
                    active={draft.attachments.includes(s.label)}
                    onClick={() => toggle("attachments", s.label)}
                  >
                    {s.label}
                  </Pill>
                ))}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                Never attach an Aadhaar card, PAN card or any other identity document — a BPL
                certificate is the only exception. Attachments must be PDFs with no blank spaces in
                the file name.
              </p>
            </SectionShell>

            <SectionShell
              id="format"
              n="07"
              title="Preferred response format"
              lede="Say how you want the information delivered. Electronic copies are cheaper for you and faster for the authority."
            >
              <div className="flex flex-wrap gap-2">
                {formatOptions.map((f) => (
                  <Pill
                    key={f.id}
                    active={draft.formats.includes(f.id)}
                    onClick={() => toggle("formats", f.id)}
                  >
                    {f.label}
                  </Pill>
                ))}
              </div>
            </SectionShell>

            <SectionShell
              id="final"
              n="08"
              title="Final RTI application"
              lede="Everything above, assembled in the standard structure. Copy it, download it, or carry it straight into the filing form."
            >
              <div className="surface-card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
                  <p className="flex items-center gap-2 text-eyebrow text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" aria-hidden />
                    Assembled application · {lines.length} request{lines.length === 1 ? "" : "s"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={copy} className="btn-base btn-quiet !text-xs">
                      {copied ? (
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                      )}
                      {copied ? "Copied" : "Copy text"}
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadText("rti-application.txt", application)}
                      className="btn-base btn-quiet !text-xs"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden />
                      Download .txt
                    </button>
                  </div>
                </div>
                <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap px-6 py-6 font-mono text-[12.5px] leading-relaxed text-foreground">
                  {application}
                </pre>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to="/file" className="btn-base btn-saffron">
                  Continue to filing
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link to="/guidelines" className="btn-base btn-quiet !text-sm">
                  Read the guidelines
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    clearPrepared();
                    setDraft(emptyPrepared);
                    void navigate({ to: "/prepare", hash: "basic" });
                  }}
                  className="btn-base btn-quiet !text-sm"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                  Start over
                </button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Your prepared draft is carried into the filing form automatically — the ministry,
                applicant details and the full text of the request are pre-filled.
              </p>
            </SectionShell>
          </div>

          <aside className="hidden xl:block">
            <div className="sticky top-28 space-y-5">
              <div className="surface-card p-6">
                <div className="flex items-center justify-between">
                  <p className="text-eyebrow text-saffron">Live draft</p>
                  <span className="font-mono text-[11px] text-muted-foreground">{score}%</span>
                </div>
                <h2 className="mt-2 text-lg leading-snug">
                  {draft.publicAuthority || "Public authority not chosen"}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {draft.ministry || (draft.jurisdiction === "central" ? "Central Government" : "State Government")}
                </p>

                <dl className="mt-5 space-y-3 border-t border-border pt-5 text-xs">
                  {items.map((it) => (
                    <div key={it.id} className="flex items-center gap-2.5">
                      <span
                        className={`grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                          it.done ? "bg-verdant text-ink-foreground" : "bg-secondary"
                        }`}
                      >
                        {it.done && <Check className="h-2.5 w-2.5" aria-hidden />}
                      </span>
                      <span className={it.done ? "" : "text-muted-foreground"}>{it.label}</span>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 border-t border-border pt-5">
                  <p className="text-eyebrow text-muted-foreground">Request lines</p>
                  {lines.length ? (
                    <ol className="mt-3 space-y-2">
                      {lines.slice(0, 6).map((l, i) => (
                        <li key={`${l}-${i}`} className="flex gap-2 text-xs leading-relaxed">
                          <span className="font-mono text-saffron">{i + 1}.</span>
                          <span className="line-clamp-2 text-muted-foreground">{l}</span>
                        </li>
                      ))}
                      {lines.length > 6 && (
                        <li className="text-xs text-muted-foreground">
                          + {lines.length - 6} more
                        </li>
                      )}
                    </ol>
                  ) : (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Nothing yet — pick record types in part 03.
                    </p>
                  )}
                </div>

                <a href="#final" className="btn-base btn-ink mt-6 w-full !text-sm">
                  See the full application
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
