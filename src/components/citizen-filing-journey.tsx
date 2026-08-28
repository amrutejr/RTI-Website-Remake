import { useState } from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

const steps = [
  {
    stepNumber: 1,
    badge: "INPUT",
    title: "Share your issue in everyday language",
    description: "Citizen writes grievance in everyday language without needing legal jargon or complex formats.",
    detailTitle: "Citizen writes grievance in everyday language.",
  },
  {
    stepNumber: 2,
    badge: "DRAFT",
    title: "AI drafts a legally framed RTI request",
    description: "AI converts it to formal, record-based RTI wording citing relevant sections and authorities.",
    detailTitle: "AI converts it to formal, record-based RTI wording.",
  },
  {
    stepNumber: 3,
    badge: "SUBMIT",
    title: "Review, pay, and receive tracking confirmation",
    description: "Review, pay mock fee, and get a tracking confirmation with immediate registration number.",
    detailTitle: "Review, pay mock fee, and get a tracking confirmation.",
  },
];

export function CitizenFilingJourney() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="border-y border-white/15 bg-gradient-ink text-ink-foreground py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-14 text-center">
          <p className="text-eyebrow text-saffron">How It Works</p>
          <h2 className="mt-3 text-4xl md:text-5xl text-ink-foreground">
            A citizen-first filing journey
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-sm text-ink-foreground/75 leading-relaxed">
            Translate plain grievances into legally sound RTI requests in three guided steps.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left Panel: Step Selector */}
          <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm md:p-8">
            <div className="space-y-4">
              {steps.map((s) => {
                const isActive = activeStep === s.stepNumber;
                return (
                  <button
                    key={s.stepNumber}
                    type="button"
                    onClick={() => setActiveStep(s.stepNumber)}
                    className={`group flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all duration-200 ${
                      isActive
                        ? "border-saffron bg-saffron/15 text-ink-foreground ring-1 ring-saffron/40 shadow-sm"
                        : "border-white/10 bg-white/[0.02] text-ink-foreground/80 hover:bg-white/[0.06] hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-md font-display text-lg transition-colors ${
                        isActive
                          ? "bg-gradient-saffron text-saffron-foreground font-bold shadow"
                          : "border border-white/20 bg-white/5 text-saffron"
                      }`}
                    >
                      {s.stepNumber}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm md:text-base transition-colors ${
                          isActive ? "font-medium text-ink-foreground" : "text-ink-foreground/80 group-hover:text-ink-foreground"
                        }`}
                      >
                        {s.title}
                      </p>
                    </div>

                    {isActive && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-saffron" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Status & Application Flow */}
          <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm md:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-white/15 pb-5">
              <div>
                <p className="text-eyebrow text-saffron">Status</p>
                <h3 className="mt-1 text-2xl text-ink-foreground">Application flow</h3>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-verdant/40 bg-verdant/15 px-3 py-1 text-xs font-medium text-ink-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-verdant" />
                Secure mock
              </div>
            </div>

            <div className="space-y-3.5">
              {steps.map((s) => {
                const isCurrent = activeStep === s.stepNumber;
                return (
                  <div
                    key={s.stepNumber}
                    onClick={() => setActiveStep(s.stepNumber)}
                    className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                      isCurrent
                        ? "border-saffron/50 bg-white/10 ring-1 ring-saffron/30"
                        : "border-white/10 bg-white/[0.03] opacity-75 hover:opacity-100 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-ink-foreground/60">
                      <span className={isCurrent ? "text-saffron font-semibold" : ""}>
                        Step {s.stepNumber}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-mono ${
                          isCurrent ? "bg-saffron/20 text-saffron" : "bg-white/10 text-ink-foreground/60"
                        }`}
                      >
                        {s.badge}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-foreground/90">
                      {s.detailTitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
