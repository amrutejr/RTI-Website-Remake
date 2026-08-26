import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CornerUpRight,
  FileText,
  RotateCcw,
  Route as RouteIcon,
  Scale,
} from "lucide-react";


import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/process-map")({
  head: () => ({
    meta: [
      { title: "RTI process map — timelines, appeals and complaints" },
      {
        name: "description",
        content:
          "An interactive flowchart of the RTI Act 2005: 30-day replies, 5-day transfers, first appeal within 30 days, second appeal to CIC/SIC and Section 18 complaints.",
      },
      { property: "og:title", content: "RTI process map — interactive flowchart" },
      {
        property: "og:description",
        content:
          "Click any stage to see the statutory time limit and what you can do next under the RTI Act 2005.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/process-map" }],
  }),
  component: ProcessMapPage,
});

type Tone = "start" | "step" | "good" | "bad" | "remedy";

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  tone: Tone;
  clock?: string;
  detail: string;
  next?: string;
};

const nodes: Node[] = [
  {
    id: "request",
    label: "RTI request",
    x: 500,
    y: 44,
    w: 200,
    tone: "start",
    clock: "Day 0",
    detail:
      "You file an application with the CPIO of the public authority holding the information, paying the ₹10 fee (nil if you are below the poverty line).",
    next: "The CPIO must dispose of it within 30 days — or 48 hours where life or liberty is involved.",
  },
  {
    id: "reply-30",
    label: "Reply received",
    x: 160,
    y: 168,
    w: 180,
    tone: "step",
    clock: "Within 30 days",
    detail: "The CPIO answers your request within the statutory 30 days.",
    next: "If the reply satisfies you, the matter ends here. If not, a first appeal lies within 30 days.",
  },
  {
    id: "transfer",
    label: "Transferred to another authority",
    x: 500,
    y: 168,
    w: 210,
    tone: "step",
    clock: "Within 5 days",
    detail:
      "If the information is held by another public authority, section 6(3) requires the application to be transferred within 5 days.",
    next: "The receiving CPIO then has its own 30 days to reply.",
  },
  {
    id: "no-reply-30",
    label: "No reply at all",
    x: 850,
    y: 168,
    w: 190,
    tone: "bad",
    clock: "After 30 days",
    detail:
      "Silence for 30 days is a deemed refusal under section 7(2). You do not have to wait any longer.",
    next: "You may file a first appeal, or a Section 18 complaint to the Information Commission.",
  },
  {
    id: "reply-transfer",
    label: "Reply after transfer",
    x: 372,
    y: 300,
    w: 190,
    tone: "step",
    clock: "Within 30 days",
    detail: "The authority that received the transferred application replies in time.",
    next: "Satisfied, or first appeal within 30 days.",
  },
  {
    id: "no-reply-transfer",
    label: "No reply after transfer",
    x: 664,
    y: 300,
    w: 200,
    tone: "bad",
    clock: "After 30 days",
    detail: "The transferred application is also met with silence — again a deemed refusal.",
    next: "First appeal within 30 days, and/or a Section 18 complaint.",
  },
  {
    id: "satisfied-1",
    label: "Satisfied — closed",
    x: 118,
    y: 440,
    w: 190,
    tone: "good",
    detail: "The information answers your question. Nothing further is required.",
  },
  {
    id: "not-satisfied-1",
    label: "Not satisfied",
    x: 430,
    y: 400,
    w: 180,
    tone: "bad",
    detail:
      "The reply is incomplete, misleading, wrongly denied, or the fee demanded is unreasonable.",
    next: "First appeal to the First Appellate Authority within 30 days of the reply.",
  },
  {
    id: "section-18",
    label: "Section 18 complaint to CIC / SIC",
    x: 860,
    y: 452,
    w: 230,
    tone: "remedy",
    clock: "No time limit",
    detail:
      "Where a CPIO refuses to receive an application, does not appoint a CPIO, or stonewalls entirely, you may complain directly to the Commission.",
    next: "The Commission can inquire and impose penalties on the CPIO.",
  },
  {
    id: "first-appeal",
    label: "First appeal",
    x: 430,
    y: 540,
    w: 200,
    tone: "remedy",
    clock: "Within 30 days",
    detail:
      "Filed free of cost with the First Appellate Authority, an officer senior to the CPIO in the same public authority.",
    next: "A decision is due within 30 days, extendable to 45 with reasons recorded.",
  },
  {
    id: "decision",
    label: "Appeal decided",
    x: 262,
    y: 660,
    w: 180,
    tone: "step",
    clock: "Within 45 days",
    detail: "The First Appellate Authority passes a speaking order on your appeal.",
    next: "Satisfied, or second appeal to the Commission within 90 days.",
  },
  {
    id: "no-decision",
    label: "No decision",
    x: 640,
    y: 660,
    w: 180,
    tone: "bad",
    clock: "After 45 days",
    detail: "The appellate authority lets the 45 days lapse without deciding.",
    next: "Second appeal to the CIC or the relevant SIC within 90 days.",
  },
  {
    id: "satisfied-2",
    label: "Satisfied — closed",
    x: 150,
    y: 776,
    w: 180,
    tone: "good",
    detail: "The appellate order gives you the information you asked for.",
  },
  {
    id: "not-satisfied-2",
    label: "Not satisfied",
    x: 396,
    y: 776,
    w: 170,
    tone: "bad",
    detail: "The order still withholds the information or ignores parts of your request.",
    next: "Second appeal within 90 days.",
  },
  {
    id: "second-appeal",
    label: "Second appeal to CIC / SIC",
    x: 714,
    y: 776,
    w: 250,
    tone: "remedy",
    clock: "Within 90 days",
    detail:
      "The Information Commission is the final appellate authority under the Act. Its orders are binding on the public authority.",
    next: "The Commission may order disclosure, award compensation and penalise the CPIO.",
  },
];

type Edge = {
  from: string;
  to: string;
  label?: string;
  labelDx?: number;
  labelDy?: number;
  points: string;
};

const edges: Edge[] = [
  {
    from: "request",
    to: "reply-30",
    label: "30 days",
    labelDx: -260,
    points: "500,74 500,120 160,120 160,146",
  },
  { from: "request", to: "transfer", label: "5 days", labelDx: 2, labelDy: -26, points: "500,74 500,146" },
  {
    from: "request",
    to: "no-reply-30",
    label: "30 days",
    labelDx: 200,
    points: "500,74 500,120 850,120 850,146",
  },
  {

    from: "transfer",
    to: "reply-transfer",
    label: "30 days",
    points: "500,192 500,256 372,256 372,278",
  },
  {
    from: "transfer",
    to: "no-reply-transfer",
    label: "30 days",
    points: "500,192 500,256 664,256 664,278",
  },
  { from: "reply-30", to: "satisfied-1", points: "160,192 160,418" },
  {
    from: "reply-30",
    to: "not-satisfied-1",
    points: "160,192 160,360 430,360 430,378",
  },
  { from: "reply-transfer", to: "not-satisfied-1", points: "372,324 372,360 430,360 430,378" },
  {
    from: "no-reply-transfer",
    to: "not-satisfied-1",
    points: "664,324 664,360 430,360 430,378",
  },
  {
    from: "no-reply-transfer",
    to: "section-18",
    label: "and",
    points: "664,324 664,430 745,430",
  },
  {
    from: "no-reply-30",
    to: "not-satisfied-1",
    points: "850,192 850,360 430,360 430,378",
  },
  { from: "no-reply-30", to: "section-18", points: "850,192 950,192 950,430" },
  { from: "not-satisfied-1", to: "first-appeal", label: "30 days", points: "430,422 430,518" },
  { from: "first-appeal", to: "decision", label: "45 days", points: "430,562 430,620 262,620 262,638" },
  {
    from: "first-appeal",
    to: "no-decision",
    label: "45 days",
    points: "430,562 430,620 640,620 640,638",
  },
  { from: "decision", to: "satisfied-2", points: "262,682 262,730 150,730 150,754" },
  { from: "decision", to: "not-satisfied-2", points: "262,682 262,730 396,730 396,754" },
  {
    from: "not-satisfied-2",
    to: "second-appeal",
    label: "90 days",
    points: "481,776 589,776",
  },
  { from: "no-decision", to: "second-appeal", label: "90 days", points: "640,682 640,754" },
];

const toneStyle: Record<
  Tone,
  { chip: string; ring: string; dot: string; icon: typeof FileText }
> = {
  start: { chip: "bg-saffron/18 text-saffron", ring: "ring-saffron/45", dot: "bg-saffron", icon: FileText },
  step: {
    chip: "bg-ink-foreground/10 text-ink-foreground/80",
    ring: "ring-ink-foreground/15",
    dot: "bg-ink-foreground/45",
    icon: CornerUpRight,
  },
  good: { chip: "bg-verdant/20 text-verdant", ring: "ring-verdant/40", dot: "bg-verdant", icon: CheckCircle2 },
  bad: {
    chip: "bg-destructive/20 text-destructive",
    ring: "ring-destructive/40",
    dot: "bg-destructive",
    icon: AlertTriangle,
  },
  remedy: { chip: "bg-saffron/20 text-saffron", ring: "ring-saffron/40", dot: "bg-saffron", icon: Scale },
};

/** Turn an orthogonal point list into a path with n8n-style rounded corners. */
function roundedPath(points: string, r = 16) {
  const pts = points
    .trim()
    .split(/\s+/)
    .map((p) => p.split(",").map(Number) as [number, number]);
  if (pts.length < 2) return "";
  let d = `M ${pts[0]![0]} ${pts[0]![1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1]!;
    const [cx, cy] = pts[i]!;
    const [nx, ny] = pts[i + 1]!;
    const d1 = Math.hypot(cx - px, cy - py);
    const d2 = Math.hypot(nx - cx, ny - cy);
    const rr = Math.max(0, Math.min(r, d1 / 2, d2 / 2));
    const ax = cx - ((cx - px) / (d1 || 1)) * rr;
    const ay = cy - ((cy - py) / (d1 || 1)) * rr;
    const bx = cx + ((nx - cx) / (d2 || 1)) * rr;
    const by = cy + ((ny - cy) / (d2 || 1)) * rr;
    d += ` L ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`;
  }
  const last = pts[pts.length - 1]!;
  d += ` L ${last[0]} ${last[1]}`;
  return d;
}


const journeys = [
  {
    id: "happy",
    label: "Answered in time",
    path: ["request", "reply-30", "satisfied-1"],
  },
  {
    id: "appeal",
    label: "Reply, but unsatisfactory",
    path: ["request", "reply-30", "not-satisfied-1", "first-appeal", "decision", "satisfied-2"],
  },
  {
    id: "silence",
    label: "No reply at all",
    path: ["request", "no-reply-30", "not-satisfied-1", "first-appeal", "no-decision", "second-appeal"],
  },
  {
    id: "transfer",
    label: "Transferred, then stonewalled",
    path: ["request", "transfer", "no-reply-transfer", "section-18"],
  },
] as const;

const chart = {
  nodes,
  edges,
  journeys: journeys as readonly { id: string; label: string; path: readonly string[] }[],
  width: 1010,
  height: 830,
};

function ProcessMapPage() {
  const [selected, setSelected] = useState<string>("request");
  const [journey, setJourney] = useState<string | null>(null);

  const activePath = useMemo<readonly string[] | null>(
    () => chart.journeys.find((j) => j.id === journey)?.path ?? null,
    [journey],
  );

  const node = chart.nodes.find((n) => n.id === selected) ?? chart.nodes[0]!;

  const isNodeLit = (id: string) => (activePath ? activePath.includes(id) : true);
  const isEdgeLit = (e: Edge) => {
    if (!activePath) return true;
    const i = activePath.indexOf(e.from);
    return i !== -1 && activePath[i + 1] === e.to;
  };


  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main id="main" tabIndex={-1}>
        <PageHero
          eyebrow="Process map"
          title="Every route your RTI can take"
          lede="The RTI Act runs on clocks: 30 days for a reply, 5 for a transfer, 30 for a first appeal, 90 for a second appeal. Tap any stage to read the rule that governs it."
        />

        <div className="mx-auto max-w-[1460px] px-5 py-12 md:py-16">

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 flex items-center gap-2 text-eyebrow text-muted-foreground">
              <RouteIcon className="h-3.5 w-3.5" aria-hidden />
              Trace a journey
            </span>
            {chart.journeys.map((j) => (
              <button
                key={j.id}
                onClick={() => {
                  const on = journey === j.id;
                  setJourney(on ? null : j.id);
                  if (!on) setSelected(j.path[0]!);
                }}
                className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                  journey === j.id
                    ? "border-saffron bg-accent text-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary"
                }`}
              >
                {j.label}
              </button>
            ))}
            {journey && (
              <button
                onClick={() => setJourney(null)}
                className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
              >
                <RotateCcw className="h-3 w-3" aria-hidden />
                Show all paths
              </button>
            )}
          </div>

          <div className="mt-7 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div>
            <p className="mb-2 text-xs text-muted-foreground lg:hidden">
              Scroll sideways to see the full map.
            </p>
            <div className="overflow-x-auto rounded-xl border border-ink-soft bg-ink p-4 shadow-[0_18px_50px_-30px_oklch(0_0_0/0.6)]">
              <div
                className="relative w-[1010px] rounded-lg"
                style={{
                  height: chart.height,
                  backgroundImage:
                    "radial-gradient(oklch(1 0 0 / 0.13) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                  backgroundPosition: "-1px -1px",
                }}
              >
                <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="absolute inset-0 h-full w-full" aria-hidden>
                  <defs>
                    <marker
                      id="rti-arrow"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                    </marker>
                  </defs>
                  {chart.edges.map((e) => {
                    const lit = isEdgeLit(e);
                    const d = roundedPath(e.points);
                    return (
                      <g key={`${e.from}-${e.to}`}>
                        <path
                          d={d}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={lit && activePath ? 2.6 : 1.6}
                          strokeLinecap="round"
                          markerEnd="url(#rti-arrow)"
                          className={
                            lit && activePath
                              ? "text-saffron"
                              : lit
                                ? "text-ink-foreground/28"
                                : "text-ink-foreground/8"
                          }
                        />
                        {lit && activePath && (
                          <path
                            d={d}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.6}
                            strokeLinecap="round"
                            strokeDasharray="7 12"
                            className="animate-[rti-dash_1.1s_linear_infinite] text-ink-foreground"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>

                {chart.edges
                  .filter((e) => e.label)
                  .map((e) => {
                    const [x, y] = e.points.split(" ")[1]!.split(",").map(Number) as [
                      number,
                      number,
                    ];
                    const lit = isEdgeLit(e) && activePath;
                    return (
                      <span
                        key={`label-${e.from}-${e.to}`}
                        style={{ left: x + 10 + (e.labelDx ?? 0), top: y - 21 + (e.labelDy ?? 0) }}
                        className={`pointer-events-none absolute rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wide ${
                          lit
                            ? "border-saffron/60 bg-saffron/15 text-saffron"
                            : "border-ink-foreground/15 bg-ink text-ink-foreground/55"
                        }`}
                      >
                        {e.label}
                      </span>
                    );
                  })}

                {chart.nodes.map((n) => {
                  const lit = isNodeLit(n.id);
                  const active = selected === n.id;
                  const tone = toneStyle[n.tone];
                  const Icon = tone.icon;
                  return (
                    <button
                      key={n.id}
                      onClick={() => setSelected(n.id)}
                      style={{
                        left: n.x,
                        top: n.y,
                        width: n.w,
                        transform: "translate(-50%, -50%)",
                      }}
                      className={`group absolute flex items-center gap-3 rounded-xl bg-ink-soft/85 p-1.5 pr-3.5 text-left ring-1 backdrop-blur-sm transition-all ${
                        tone.ring
                      } ${
                        active
                          ? "ring-2 ring-saffron shadow-[0_0_0_5px_oklch(0.75_0.15_62/0.16)]"
                          : "hover:ring-ink-foreground/40"
                      } ${lit ? "opacity-100" : "opacity-25"} hover:-translate-y-0.5`}
                      aria-pressed={active}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tone.chip}`}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium leading-snug text-ink-foreground">
                          {n.label}
                        </span>
                        {n.clock && (
                          <span className="mt-0.5 block font-mono text-[10px] tracking-wide text-ink-foreground/55">
                            {n.clock}
                          </span>
                        )}
                      </span>
                      <span
                        className={`absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full ring-2 ring-ink ${tone.dot}`}
                      />
                      <span
                        className={`absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full ring-2 ring-ink ${tone.dot}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            </div>


            <aside className="grid items-start gap-6 md:grid-cols-2 xl:sticky xl:top-24 xl:grid-cols-1">
              <div className="surface-card p-6">
                <p className="text-eyebrow text-saffron">Stage detail</p>
                <h2 className="mt-2 text-xl">{node.label}</h2>
                {node.clock && (
                  <p className="mt-1 text-xs tracking-wide text-muted-foreground">{node.clock}</p>
                )}
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {node.detail}
                </p>
                {node.next && (
                  <div className="mt-5 rounded-md border border-border bg-secondary px-4 py-3">
                    <p className="text-eyebrow text-muted-foreground">What you can do next</p>
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed">{node.next}</p>
                  </div>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/file"
                    className="btn-base btn-saffron !text-sm"
                  >
                    File a request
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link to="/guide" className="btn-base btn-quiet !text-sm">
                    Step-by-step guide
                  </Link>
                </div>
              </div>

              <dl className="self-start rounded-xl border border-ink-soft bg-ink p-6 text-xs text-ink-foreground/70">
                <p className="text-eyebrow text-ink-foreground/50">Legend</p>
                <div className="mt-3 space-y-2.5">
                  {(
                    [
                      ["step", "Ordinary stage"],
                      ["good", "Matter closed"],
                      ["bad", "Deemed refusal / dispute"],
                      ["remedy", "Statutory remedy"],
                    ] as const
                  ).map(([tone, label]) => {
                    const t = toneStyle[tone];
                    const Icon = t.icon;
                    return (
                      <div key={label} className="flex items-center gap-2.5">
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ${t.chip}`}>
                          <Icon className="h-3 w-3" aria-hidden />
                        </span>
                        {label}
                      </div>
                    );
                  })}
                </div>
              </dl>

            </aside>

          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
