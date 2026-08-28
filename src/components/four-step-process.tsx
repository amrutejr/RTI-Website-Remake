import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const processCards = [
  {
    num: "01",
    title: "Describe Your Problem",
    desc: "Write your grievance in simple language — Hindi, English, or mixed. No legal jargon needed.",
  },
  {
    num: "02",
    title: "AI Drafts Your RTI",
    desc: "Our AI translates your complaint into a formal application citing the right sections and requesting specific records.",
  },
  {
    num: "03",
    title: "Review & Edit",
    desc: "Review the draft, change the department if needed, and check the rejection risk analysis before submitting.",
  },
  {
    num: "04",
    title: "Pay ₹10 & Submit",
    desc: "Complete the mandatory fee payment and receive a tracking number to monitor your application status.",
  },
];

export function FourStepProcess() {
  return (
    <section id="process" className="border-y border-border bg-paper">
      <div className="rule-grid">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-24">
          <div className="mb-14 text-center">
            <p className="text-eyebrow text-muted-foreground">The Process</p>
            <h2 className="mt-3 text-4xl md:text-5xl text-foreground">
              From question to answer in four steps
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-sm text-muted-foreground leading-relaxed">
              From plain language to legal application in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processCards.map((card, i) => (
              <div key={card.num} className="relative group">
                <div className="surface-card h-full p-7 transition-transform duration-300 hover:-translate-y-1 flex flex-col justify-between">
                  <div>
                    <span className="font-display text-4xl text-saffron block mb-3">
                      {card.num}
                    </span>
                    <h3 className="text-xl text-foreground font-medium mb-2.5">
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {card.desc}
                    </p>
                  </div>
                </div>

                {/* Arrow Connector between cards on desktop */}
                {i < processCards.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3.5 -translate-y-1/2 z-20 text-muted-foreground/40 pointer-events-none">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/maya"
              className="btn-base btn-saffron"
            >
              Start Filing Now
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
