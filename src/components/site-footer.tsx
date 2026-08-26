import { Link } from "@tanstack/react-router";
import emblem from "@/assets/ashoka-emblem.png";

const portalLinks = [
  { label: "File with Maya", to: "/maya" },
  { label: "Prepare an RTI", to: "/prepare" },
  { label: "Submit request", to: "/guidelines" },
  { label: "Submit first appeal", to: "/guidelines", search: { type: "appeal" as const } },
  { label: "Track status", to: "/track" },
  { label: "Step-by-step guide", to: "/guide" },
  { label: "Process map", to: "/process-map" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact us", to: "/contact" },
];

const externalLinks = [
  ["National Portal of India", "https://india.gov.in/"],
  ["Complaint & second appeal to CIC", "https://cic.gov.in/"],
  ["Official RTI Online portal", "https://rtionline.gov.in/"],
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={emblem}
                alt="State Emblem of India"
                className="h-10 w-auto object-contain"
              />
              <span className="font-display text-lg">RTI Online</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A portal to file RTI applications and first appeals online for the Central
              Government, with an integrated payment gateway.
            </p>
          </div>
          <div>
            <p className="text-eyebrow text-muted-foreground">Portal</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {portalLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    {...(l.search ? { search: l.search } : {})}
                    className="hover:text-saffron"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-eyebrow text-muted-foreground">Elsewhere</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {externalLinks.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="hover:text-saffron">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          © 2026 Department of Personnel &amp; Training. Content owned and managed by DoP&amp;T.
          This is a design concept of the RTI Online portal — no application filed here reaches
          any public authority.
        </p>
      </div>
    </footer>
  );
}
