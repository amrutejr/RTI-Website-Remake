import {
  formatOptions,
  recordTypes,
  rewriteHints,
  weakPhrases,
} from "@/content/rti-checklist";

export type Jurisdiction = "central" | "state";

export interface PreparedDraft {
  /** 1. Basic information */
  name: string;
  address: string;
  email: string;
  phone: string;
  jurisdiction: Jurisdiction;
  ministry: string;
  publicAuthority: string;
  pioName: string;
  bpl: boolean;
  /** 2. About the issue */
  issue: string;
  referenceNumber: string;
  relevantDates: string;
  office: string;
  officials: string;
  /** 3 + 4. Records and questions */
  records: string[];
  questions: string[];
  /** 5. Time period */
  periodFrom: string;
  periodTo: string;
  /** 6. Supporting documents */
  attachments: string[];
  /** 7. Preferred format */
  formats: string[];
}

export const emptyPrepared: PreparedDraft = {
  name: "",
  address: "",
  email: "",
  phone: "",
  jurisdiction: "central",
  ministry: "",
  publicAuthority: "",
  pioName: "",
  bpl: false,
  issue: "",
  referenceNumber: "",
  relevantDates: "",
  office: "",
  officials: "",
  records: [],
  questions: [],
  periodFrom: "",
  periodTo: "",
  attachments: [],
  formats: ["pdf"],
};

const STORAGE_KEY = "rti-online:prepared";

export function loadPrepared(): PreparedDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return { ...emptyPrepared, ...(JSON.parse(raw) as Partial<PreparedDraft>) };
  } catch {
    return null;
  }
}

export function savePrepared(draft: PreparedDraft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* ignore */
  }
}

export function clearPrepared() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Every numbered "Information Requested" line, records first then custom questions. */
export function requestLines(d: PreparedDraft): string[] {
  const fromRecords = d.records
    .map((id) => recordTypes.find((r) => r.id === id)?.line)
    .filter((l): l is string => Boolean(l));
  const custom = d.questions.map((q) => q.trim()).filter(Boolean);
  return [...fromRecords, ...custom];
}

function prettyDate(iso: string) {
  if (!iso) return "";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return iso;
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export function periodSentence(d: PreparedDraft): string {
  if (d.periodFrom && d.periodTo)
    return `From ${prettyDate(d.periodFrom)} to ${prettyDate(d.periodTo)}`;
  if (d.periodFrom) return `From ${prettyDate(d.periodFrom)} onwards`;
  if (d.periodTo) return `Up to ${prettyDate(d.periodTo)}`;
  return "";
}

export function formatSentence(d: PreparedDraft): string {
  const chosen = d.formats
    .map((id) => formatOptions.find((f) => f.id === id)?.line)
    .filter((l): l is string => Boolean(l));
  if (!chosen.length) return "";
  return `Kindly provide the requested information as ${chosen.join(", ")}.`;
}

/** The "Information sought" body that goes into the RTI form's text field. */
export function assembleBody(d: PreparedDraft): string {
  const parts: string[] = [];
  const context: string[] = [];
  if (d.issue.trim()) context.push(d.issue.trim());
  if (d.referenceNumber.trim())
    context.push(`Reference / application number: ${d.referenceNumber.trim()}.`);
  if (d.relevantDates.trim()) context.push(`Relevant dates: ${d.relevantDates.trim()}.`);
  if (d.office.trim()) context.push(`Office concerned: ${d.office.trim()}.`);
  if (d.officials.trim()) context.push(`Officials concerned: ${d.officials.trim()}.`);
  if (context.length) parts.push(context.join(" "));

  const lines = requestLines(d);
  if (lines.length) {
    parts.push(
      ["Information requested:", ...lines.map((l, i) => `${i + 1}. ${l}`)].join("\n"),
    );
  }
  const period = periodSentence(d);
  if (period) parts.push(`Relevant period: ${period.replace(/^From/, "from")}.`);
  const fmt = formatSentence(d);
  if (fmt) parts.push(fmt);
  return parts.join("\n\n");
}

/** The full application in the standard To / Subject / … layout. */
export function assembleApplication(d: PreparedDraft): string {
  const lines = requestLines(d);
  const today = new Date().toLocaleDateString("en-GB");
  const out: string[] = [];
  out.push("To,");
  out.push(d.pioName ? `Public Information Officer — ${d.pioName}` : "Public Information Officer (PIO)");
  out.push(d.publicAuthority || d.ministry || "[Name of Public Authority]");
  out.push("");
  out.push("Subject: Application under the Right to Information Act, 2005");
  out.push("");
  out.push("Applicant:");
  out.push(d.name || "[Full Name]");
  out.push(d.address || "[Address]");
  out.push([d.email, d.phone].filter(Boolean).join(" · ") || "[Email / Phone]");
  out.push("");
  if (d.issue.trim() || d.referenceNumber.trim() || d.relevantDates.trim() || d.office.trim() || d.officials.trim()) {
    out.push("Background:");
    if (d.issue.trim()) out.push(d.issue.trim());
    if (d.referenceNumber.trim()) out.push(`Reference / application number: ${d.referenceNumber.trim()}`);
    if (d.relevantDates.trim()) out.push(`Relevant dates: ${d.relevantDates.trim()}`);
    if (d.office.trim()) out.push(`Office concerned: ${d.office.trim()}`);
    if (d.officials.trim()) out.push(`Officials concerned: ${d.officials.trim()}`);
    out.push("");
  }
  out.push("Information Requested:");
  if (lines.length) lines.forEach((l, i) => out.push(`${i + 1}. ${l}`));
  else out.push("1. [Specific information / record]");
  out.push("");
  out.push("Relevant Period:");
  out.push(periodSentence(d) || "[Date range]");
  out.push("");
  out.push("Preferred Format:");
  out.push(
    d.formats.length
      ? d.formats.map((id) => formatOptions.find((f) => f.id === id)?.label ?? id).join(", ")
      : "[PDF / electronic / certified copies]",
  );
  out.push("");
  out.push("Application Fee:");
  out.push(
    d.bpl
      ? "Nil — applicant is below the poverty line; a copy of the BPL certificate is enclosed."
      : d.jurisdiction === "central"
        ? "₹10 as prescribed under the RTI Rules, 2012."
        : "As prescribed under the applicable State RTI Rules.",
  );
  if (d.attachments.length) {
    out.push("");
    out.push("Enclosures:");
    d.attachments.forEach((a, i) => out.push(`${i + 1}. ${a}`));
  }
  out.push("");
  out.push(`Date: ${today}`);
  out.push("");
  out.push("Signature:");
  out.push(d.name || "[Name]");
  return out.join("\n");
}

export type ChecklistProgress = { id: string; label: string; done: boolean };

export function progress(d: PreparedDraft): ChecklistProgress[] {
  return [
    { id: "basic", label: "Basic information", done: Boolean(d.name && d.address && d.publicAuthority) },
    { id: "issue", label: "About the issue", done: d.issue.trim().length > 20 },
    { id: "records", label: "Records to request", done: requestLines(d).length > 0 },
    { id: "framing", label: "Question framing", done: requestLines(d).length > 0 && findWeakPhrases(d).length === 0 },
    { id: "period", label: "Time period", done: Boolean(d.periodFrom || d.periodTo) },
    { id: "support", label: "Supporting documents", done: true },
    { id: "format", label: "Preferred format", done: d.formats.length > 0 },
    { id: "final", label: "Final application", done: requestLines(d).length > 0 && Boolean(d.name && d.publicAuthority) },
  ];
}

export function completeness(d: PreparedDraft): number {
  const items = progress(d);
  return Math.round((items.filter((i) => i.done).length / items.length) * 100);
}

export interface WeakFlag {
  text: string;
  phrase: string;
  hint: string;
}

/** Flags opinion-seeking phrasing in the user's own lines. */
export function findWeakPhrases(d: PreparedDraft): WeakFlag[] {
  const candidates = [d.issue, ...d.questions];
  const flags: WeakFlag[] = [];
  for (const text of candidates) {
    const lower = text.toLowerCase();
    for (const phrase of weakPhrases) {
      if (!lower.includes(phrase)) continue;
      const hint =
        rewriteHints.find((h) => phrase.includes(h.match))?.hint ??
        "Rephrase this as a request for an existing record, document or data.";
      flags.push({ text: text.trim(), phrase, hint });
      break;
    }
  }
  return flags;
}

export function downloadText(filename: string, content: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
