import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-gradient-ink text-ink-foreground">
      <div className="mx-auto max-w-6xl px-5 py-10 md:py-12">
        <p className="text-eyebrow text-saffron">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl leading-[1.08] md:text-4xl">{title}</h1>
        {lede && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-foreground/75">{lede}</p>
        )}
        {children}
      </div>
    </section>
  );
}
