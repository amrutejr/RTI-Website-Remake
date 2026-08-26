import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Copy,
  CreditCard,
  FileText,
  Landmark,
  Paperclip,
  ShieldCheck,
  User,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { CheckRow, Field, Select, TextArea, TextInput } from "@/components/filing-fields";
import {
  authoritiesByMinistry,
  buildFiling,
  emptyDraft,
  indianStates,
  makeRegistrationNumber,
  ministries,
  paymentModes,
  saveFiling,
  type FilingDraft,
  type FilingKind,
} from "@/lib/rti-filing";
import { assembleBody, loadPrepared } from "@/lib/rti-draft";

export const Route = createFileRoute("/file")({
  validateSearch: (search: Record<string, unknown>): { type?: FilingKind } =>
    search["type"] === "appeal" ? { type: "appeal" } : {},
  head: () => ({
    meta: [
      { title: "File an RTI online — guided 5-step process" },
      {
        name: "description",
        content:
          "Complete onboarding to file an RTI application online: verify your email and mobile, choose the public authority, enter applicant details, write your request, pay ₹10 and get a registration number.",
      },
      { property: "og:title", content: "File an RTI online — guided 5-step process" },
      {
        property: "og:description",
        content:
          "A guided walkthrough that takes you from email verification to registration number in five steps.",
      },
      { property: "og:url", content: "/file" },
    ],
    links: [{ rel: "canonical", href: "/file" }],
  }),
  component: FilePage,
});

const steps = [
  { n: 1, label: "Verify identity", icon: ShieldCheck },
  { n: 2, label: "Public authority", icon: Landmark },
  { n: 3, label: "Applicant details", icon: User },
  { n: 4, label: "Your request", icon: FileText },
  { n: 5, label: "Payment", icon: CreditCard },
  { n: 6, label: "Receipt", icon: BadgeCheck },
] as const;

function FilePage() {
  const { type } = Route.useSearch();
  const navigate = useNavigate();
  const isAppeal = type === "appeal";

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<FilingDraft>({
    ...emptyDraft,
    kind: isAppeal ? "appeal" : "request",
  });
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [registration, setRegistration] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  // Carry a prepared checklist draft into the form (see /prepare).
  useEffect(() => {
    const prepared = loadPrepared();
    if (!prepared) return;
    const body = assembleBody(prepared);
    if (!body && !prepared.name) return;
    setDraft((d) => ({
      ...d,
      email: prepared.email || d.email,
      mobile: prepared.phone.replace(/\D/g, "").slice(-10) || d.mobile,
      ministry: ministries.includes(prepared.ministry) ? prepared.ministry : d.ministry,
      publicAuthority: prepared.publicAuthority || d.publicAuthority,
      name: prepared.name || d.name,
      address: prepared.address || d.address,
      bpl: prepared.bpl || d.bpl,
      subject: prepared.issue.split(/[.\n]/)[0]?.slice(0, 90) || d.subject,
      text: body.slice(0, 3000) || d.text,
      attachment: prepared.attachments[0] ?? d.attachment,
    }));
    setPrefilled(true);
  }, []);

  const set = <K extends keyof FilingDraft>(key: K, value: FilingDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const authorities = authoritiesByMinistry[draft.ministry] ?? [
    "Central Public Information Officer (main office)",
    "Central Public Information Officer (subordinate office)",
  ];

  const valid = useMemo(() => {
    switch (step) {
      case 1:
        return draft.emailVerified && draft.mobileVerified;
      case 2:
        return Boolean(draft.ministry && draft.publicAuthority);
      case 3:
        return Boolean(
          draft.name &&
            draft.address &&
            draft.state &&
            draft.pincode.length === 6 &&
            draft.citizen === "Indian",
        );
      case 4:
        return draft.text.trim().length >= 20 && draft.text.length <= 3000;
      case 5:
        return Boolean(draft.paymentMode);
      default:
        return true;
    }
  }, [step, draft]);

  const submit = () => {
    const reg = makeRegistrationNumber();
    const filing = buildFiling(draft, reg);
    saveFiling(filing);
    setRegistration(reg);
    setStep(6);
  };

  const next = () => (step === 5 ? submit() : setStep((s) => Math.min(6, s + 1)));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main id="main" tabIndex={-1}>
        <PageHero
          eyebrow={isAppeal ? "First appeal" : "Online RTI request"}
          title={isAppeal ? "File your first appeal" : "File your RTI application"}
          lede="Six short screens. Nothing is sent to a real public authority — this is a design concept, and your entries stay in this browser."
        >
          {prefilled && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-saffron/50 bg-saffron/15 px-4 py-1.5 text-xs text-ink-foreground">
              <Check className="h-3.5 w-3.5 text-saffron" aria-hidden />
              Loaded from your preparation checklist — review each screen before submitting.
            </p>
          )}
        </PageHero>

        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[240px_minmax(0,1fr)] md:py-16">
          <div className="lg:hidden">
            <div className="flex items-center gap-1.5" aria-hidden>
              {steps.map((s) => (
                <span
                  key={s.n}
                  className={`h-1.5 flex-1 rounded-full ${
                    s.n < step
                      ? "bg-verdant"
                      : s.n === step
                        ? "bg-gradient-saffron"
                        : "bg-secondary"
                  }`}
                />
              ))}
            </div>
            <p className="mt-3 text-sm">
              <span className="text-eyebrow text-saffron">
                Step {step} of {steps.length}
              </span>
              <span className="mt-1 block font-medium">{steps[step - 1]?.label}</span>
            </p>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-eyebrow text-muted-foreground">Progress</p>
              <ol className="mt-4 space-y-1">
                {steps.map((s) => {
                  const active = s.n === step;
                  const done = s.n < step;
                  return (
                    <li key={s.n}>
                      <button
                        onClick={() => s.n < step && setStep(s.n)}
                        disabled={s.n >= step}
                        className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 text-left text-sm transition-colors ${
                          active
                            ? "bg-secondary font-medium text-foreground"
                            : done
                              ? "text-muted-foreground hover:bg-secondary"
                              : "text-muted-foreground/60"
                        }`}
                      >
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-md text-xs ${
                            done
                              ? "bg-verdant text-ink-foreground"
                              : active
                                ? "bg-gradient-saffron text-saffron-foreground"
                                : "bg-secondary"
                          }`}
                        >
                          {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : s.n}
                        </span>
                        {s.label}
                      </button>
                    </li>
                  );
                })}
              </ol>
              <Link to="/guidelines" className="btn-base btn-quiet mt-7 w-full !text-sm">
                Re-read guidelines
              </Link>
            </div>
          </aside>

          <div className="surface-card p-6 md:p-9">
            {step === 1 && (
              <div className="space-y-7">
                <Header
                  eyebrow="Step 1 of 6"
                  title="Verify your email and mobile"
                  note="One-time passwords are sent to both. OTPs on this portal do not expire — you can come back later."
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Email address" required>
                    <TextInput
                      type="email"
                      value={draft.email}
                      placeholder="you@example.com"
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </Field>
                  <Field label="Mobile number" required hint="10 digits, without +91">
                    <TextInput
                      inputMode="numeric"
                      maxLength={10}
                      value={draft.mobile}
                      placeholder="9876543210"
                      onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))}
                    />
                  </Field>
                </div>

                <button
                  className="btn-base btn-ink !text-sm"
                  disabled={!draft.email.includes("@") || draft.mobile.length !== 10}
                  onClick={() => setOtpSent(true)}
                >
                  {otpSent ? "Resend one-time passwords" : "Send one-time passwords"}
                </button>

                {otpSent && (
                  <div className="grid gap-5 border-t border-border pt-7 sm:grid-cols-2">
                    <Field label="Email OTP" hint="Demo: any 4 digits works">
                      <div className="flex gap-2">
                        <TextInput
                          maxLength={4}
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                        />
                        <button
                          className="btn-base btn-quiet shrink-0 !py-2 !text-sm"
                          disabled={emailOtp.length !== 4}
                          onClick={() => set("emailVerified", true)}
                        >
                          {draft.emailVerified ? "Verified" : "Verify"}
                        </button>
                      </div>
                    </Field>
                    <Field label="Mobile OTP" hint="Demo: any 4 digits works">
                      <div className="flex gap-2">
                        <TextInput
                          maxLength={4}
                          value={mobileOtp}
                          onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ""))}
                        />
                        <button
                          className="btn-base btn-quiet shrink-0 !py-2 !text-sm"
                          disabled={mobileOtp.length !== 4}
                          onClick={() => set("mobileVerified", true)}
                        >
                          {draft.mobileVerified ? "Verified" : "Verify"}
                        </button>
                      </div>
                    </Field>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-7">
                <Header
                  eyebrow="Step 2 of 6"
                  title="Choose the public authority"
                  note="Pick the ministry or department that holds the information. If it belongs elsewhere, the Nodal Officer transfers it within five days."
                />
                <Field label="Ministry / Department" required>
                  <Select
                    value={draft.ministry}
                    onChange={(e) => {
                      set("ministry", e.target.value);
                      set("publicAuthority", "");
                    }}
                  >
                    <option value="">Select a ministry or department</option>
                    {ministries.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Public authority / CPIO" required>
                  <Select
                    value={draft.publicAuthority}
                    disabled={!draft.ministry}
                    onChange={(e) => set("publicAuthority", e.target.value)}
                  >
                    <option value="">Select a public authority</option>
                    {authorities.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </Select>
                </Field>
                <p className="rounded-md border border-border bg-secondary px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                  Only Central ministries, departments and their attached offices are covered here.
                  For State information, use your State's own RTI portal.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-7">
                <Header
                  eyebrow="Step 3 of 6"
                  title="Applicant details"
                  note="Only citizens of India may file. Do not attach Aadhaar, PAN or any other identity document."
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" required>
                    <TextInput
                      value={draft.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="As it should appear on the reply"
                    />
                  </Field>
                  <Field label="Gender">
                    <Select value={draft.gender} onChange={(e) => set("gender", e.target.value)}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Transgender</option>
                    </Select>
                  </Field>
                  <Field label="Address" required>
                    <TextInput
                      value={draft.address}
                      onChange={(e) => set("address", e.target.value)}
                      placeholder="House, street, locality"
                    />
                  </Field>
                  <Field label="State / UT" required>
                    <Select value={draft.state} onChange={(e) => set("state", e.target.value)}>
                      <option value="">Select state</option>
                      {indianStates.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="PIN code" required>
                    <TextInput
                      inputMode="numeric"
                      maxLength={6}
                      value={draft.pincode}
                      onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))}
                    />
                  </Field>
                  <Field label="Area">
                    <Select
                      value={draft.educationRural}
                      onChange={(e) => set("educationRural", e.target.value)}
                    >
                      <option>Urban</option>
                      <option>Rural</option>
                    </Select>
                  </Field>
                </div>
                <div className="space-y-4 border-t border-border pt-6">
                  <CheckRow
                    checked={draft.citizen === "Indian"}
                    onChange={(v) => set("citizen", v ? "Indian" : "")}
                  >
                    I am a citizen of India.
                  </CheckRow>
                  <CheckRow checked={draft.bpl} onChange={(v) => set("bpl", v)}>
                    I am below the poverty line — no fee is payable.
                  </CheckRow>
                  {draft.bpl && (
                    <Field
                      label="BPL certificate"
                      hint="PDF only, up to 1 MB, filename without blank spaces."
                    >
                      <TextInput
                        value={draft.bplProof}
                        onChange={(e) => set("bplProof", e.target.value)}
                        placeholder="bpl_certificate.pdf"
                      />
                    </Field>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-7">
                <Header
                  eyebrow="Step 4 of 6"
                  title={isAppeal ? "Grounds for the appeal" : "Text of your request"}
                  note="Up to 3,000 characters. Allowed special characters: , . - _ ( ) / @ : & ? \\ %"
                />
                <Field label="Subject" hint="A single line describing what you are asking for.">
                  <TextInput
                    value={draft.subject}
                    onChange={(e) => set("subject", e.target.value)}
                    placeholder="Copy of inspection report dated 12 March 2026"
                  />
                </Field>
                <Field label={isAppeal ? "Grounds of appeal" : "Information sought"} required>
                  <TextArea
                    rows={10}
                    maxLength={3000}
                    value={draft.text}
                    onChange={(e) => set("text", e.target.value)}
                    placeholder="State clearly the information you want, with dates, file numbers or periods wherever possible."
                  />
                </Field>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Minimum 20 characters</span>
                  <span>{draft.text.length} / 3000</span>
                </div>
                <Field
                  label="Supporting document (optional)"
                  hint="PDF only, up to 1 MB. Never upload Aadhaar, PAN or other identity proof."
                >
                  <div className="flex items-center gap-3 rounded-md border border-dashed border-input px-4 py-4">
                    <Paperclip className="h-4 w-4 text-muted-foreground" aria-hidden />
                    <TextInput
                      value={draft.attachment}
                      onChange={(e) => set("attachment", e.target.value)}
                      placeholder="supporting_document.pdf"
                    />
                  </div>
                </Field>
                {draft.text.length > 2900 && (
                  <p className="text-xs text-destructive">
                    If your request is longer, upload the rest as a PDF supporting document.
                  </p>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-7">
                <Header
                  eyebrow="Step 5 of 6"
                  title="Pay the application fee"
                  note={
                    draft.bpl
                      ? "You have declared BPL status, so no fee is payable. Continue to generate your registration number."
                      : "A fee of ₹10 applies to an RTI request. First appeals are free of cost."
                  }
                />
                {!draft.bpl && !isAppeal && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {paymentModes.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => set("paymentMode", m.id)}
                        className={`rounded-lg border p-4 text-left transition-colors ${
                          draft.paymentMode === m.id
                            ? "border-saffron bg-accent"
                            : "border-border bg-card hover:bg-secondary"
                        }`}
                      >
                        <span className="block text-sm font-medium">{m.label}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">{m.hint}</span>
                      </button>
                    ))}
                  </div>
                )}
                <dl className="rounded-lg border border-border bg-secondary p-5 text-sm">
                  <Row label="Public authority" value={draft.publicAuthority || "—"} />
                  <Row label="Applicant" value={draft.name || "—"} />
                  <Row
                    label="Amount payable"
                    value={draft.bpl || isAppeal ? "₹0 (exempt)" : "₹10"}
                  />
                </dl>
              </div>
            )}

            {step === 6 && registration && (
              <div className="space-y-7">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-verdant/15">
                    <BadgeCheck className="h-6 w-6 text-verdant" aria-hidden />
                  </span>
                  <div>
                    <p className="text-eyebrow text-verdant">Submitted</p>
                    <h2 className="text-2xl md:text-3xl">
                      {isAppeal ? "Appeal registered" : "Request registered"}
                    </h2>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-secondary p-6">
                  <p className="text-eyebrow text-muted-foreground">Registration number</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <p className="font-mono text-3xl tracking-wide md:text-4xl">{registration}</p>
                    <button
                      className="btn-base btn-quiet !py-1.5 !text-xs"
                      onClick={() => {
                        navigator.clipboard?.writeText(registration);
                        setCopied(true);
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" aria-hidden />
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    Keep this number safe. It is also emailed to {draft.email || "your email"} along
                    with an SMS alert. Use it to track the request.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/track"
                    search={{ rn: registration }}
                    className="btn-base btn-saffron !text-sm"
                  >
                    Track this request
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link to="/guide" className="btn-base btn-quiet !text-sm">
                    What happens next
                  </Link>
                </div>
              </div>
            )}

            {step < 6 && (
              <div className="mt-9 flex items-center justify-between border-t border-border pt-6">
                <button
                  onClick={() => (step === 1 ? navigate({ to: "/guidelines" }) : setStep(step - 1))}
                  className="btn-base btn-quiet !text-sm"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Back
                </button>
                <button
                  onClick={next}
                  disabled={!valid}
                  className="btn-base btn-saffron !text-sm"
                >
                  {step === 5 ? "Submit application" : "Save and continue"}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Header({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string;
  title: string;
  note: string;
}) {
  return (
    <div>
      <p className="text-eyebrow text-saffron">{eyebrow}</p>
      <h2 className="mt-2 text-2xl md:text-3xl">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-border py-2.5 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
