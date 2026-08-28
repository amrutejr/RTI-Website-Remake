import { useEffect, useState } from "react";

interface StatItemProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

function StatCounter({ value, prefix = "", suffix = "", label }: StatItemProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = value / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center group transition-transform duration-200 hover:-translate-y-0.5">
      <div className="font-display text-4xl sm:text-5xl md:text-6xl text-saffron tracking-tight">
        {prefix}
        {count.toLocaleString("en-IN")}
        {suffix}
      </div>
      <div className="mt-2 text-eyebrow text-ink-foreground/75 group-hover:text-ink-foreground transition-colors">
        {label}
      </div>
    </div>
  );
}

export function StatsBanner() {
  return (
    <section className="border-y border-white/15 bg-gradient-ink text-ink-foreground py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          <div className="pt-4 sm:pt-0">
            <StatCounter value={12847} suffix="+" label="RTIs Filed" />
          </div>
          <div className="pt-4 sm:pt-0 sm:pl-6">
            <StatCounter value={3} label="Departments" />
          </div>
          <div className="pt-4 sm:pt-0 sm:pl-6">
            <StatCounter value={94} suffix="%" label="Success Rate" />
          </div>
          <div className="pt-4 sm:pt-0 sm:pl-6">
            <StatCounter value={18} label="Avg. Days to Respond" />
          </div>
        </div>
      </div>
    </section>
  );
}
