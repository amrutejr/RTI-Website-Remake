import { faqGroups } from "@/content/faq";
import {
  authoritiesByMinistry,
  buildFiling,
  emptyDraft,
  indianStates,
  makeRegistrationNumber,
  ministries,
  saveFiling,
  type FilingDraft,
} from "@/lib/rti-filing";

export type MayaMode = "idle" | "ask" | "file";

export type FileStep =
  | "issue"
  | "followup"
  | "ministry"
  | "identity"
  | "address"
  | "bpl"
  | "review";

export type MayaMessage = {
  id: string;
  role: "maya" | "user";
  text: string;
  chips?: string[];
  draftPreview?: string;
  registration?: string;
};

export type FileSlots = {
  issue: string;
  records: string;
  period: string;
  ministry: string;
  publicAuthority: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  state: string;
  pincode: string;
  bpl: boolean;
};

export const emptySlots: FileSlots = {
  issue: "",
  records: "",
  period: "",
  ministry: "",
  publicAuthority: "",
  name: "",
  email: "",
  mobile: "",
  address: "",
  state: "",
  pincode: "",
  bpl: false,
};

const MINISTRY_HINTS: { keys: string[]; ministry: string }[] = [
  {
    keys: ["railway", "train", "platform", "station", "irctc"],
    ministry: "Ministry of Railways (Railway Board)",
  },
  {
    keys: ["income tax", "gst", "customs", "revenue", "itr"],
    ministry: "Ministry of Finance — Department of Revenue",
  },
  {
    keys: ["visa", "passport", "foreigner", "citizenship", "police", "home affairs"],
    ministry: "Ministry of Home Affairs",
  },
  {
    keys: ["school", "college", "university", "ugc", "education", "scholarship"],
    ministry: "Ministry of Education — Department of Higher Education",
  },
  {
    keys: ["hospital", "aiims", "health", "medicine", "vaccine"],
    ministry: "Ministry of Health and Family Welfare",
  },
  {
    keys: ["pension", "dopt", "personnel", "cvc", "cic"],
    ministry: "Ministry of Personnel, Public Grievances and Pensions",
  },
  {
    keys: ["highway", "nhai", "road", "transport"],
    ministry: "Ministry of Road Transport and Highways",
  },
  {
    keys: ["petrol", "diesel", "ongc", "oil", "gas", "lpg"],
    ministry: "Ministry of Petroleum and Natural Gas",
  },
];

const WEAK = ["why did", "why was", "why have", "explain why", "what is the reason they"];
const STATE_HINTS = [
  "state government",
  "state dept",
  "nct delhi",
  "delhi government",
  "mcd",
  "bmc",
  "municipal",
];

export function inferMinistry(text: string): string | null {
  const lower = text.toLowerCase();
  for (const { keys, ministry } of MINISTRY_HINTS) {
    if (keys.some((k) => lower.includes(k))) return ministry;
  }
  for (const m of ministries) {
    if (lower.includes(m.toLowerCase())) return m;
  }
  return null;
}

export function looksVague(text: string) {
  const t = text.trim();
  if (t.length < 40) return true;
  const lower = t.toLowerCase();
  return WEAK.some((w) => lower.includes(w)) && !/\d{4}/.test(t);
}

export function looksState(text: string) {
  return STATE_HINTS.some((s) => text.toLowerCase().includes(s));
}

function tokens(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

export function answerFaq(question: string): { text: string; matched: boolean } {
  const qTokens = tokens(question);
  if (!qTokens.length) {
    return {
      text: "Ask me anything about filing, fees, appeals or status. For example: “Can I file for a State department?” or “How much is the fee?”",
      matched: false,
    };
  }

  let best = { score: 0, q: "", a: "" };
  for (const group of faqGroups) {
    for (const item of group.items) {
      const hay = tokens(`${item.q} ${item.a.join(" ")}`);
      const overlap = qTokens.filter((t) => hay.includes(t)).length;
      const titleHit = tokens(item.q).filter((t) => qTokens.includes(t)).length * 2;
      const score = overlap + titleHit;
      if (score > best.score) best = { score, q: item.q, a: item.a.join("\n\n") };
    }
  }

  if (best.score >= 3) {
    return {
      text: `${best.a}\n\nThat is the official position on “${best.q}” If you want, I can also file an RTI for you.`,
      matched: true,
    };
  }

  return {
    text: "I could not match that to a published FAQ. This portal is only for Central Government public authorities; State departments (including NCT of Delhi) have their own portals. For help using this site, call 011-24010690 / 691 or email helprtionline-dopt[at]nic[dot]in.\n\nWould you like me to file an RTI instead?",
    matched: false,
  };
}

function extractEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";
}

function extractMobile(text: string) {
  const m = text.replace(/\s/g, "").match(/(?:\+91)?([6-9]\d{9})/);
  return m?.[1] ?? "";
}

function extractPincode(text: string) {
  return text.match(/\b(\d{6})\b/)?.[1] ?? "";
}

function extractState(text: string) {
  const lower = text.toLowerCase();
  return indianStates.find((s) => lower.includes(s.toLowerCase())) ?? "";
}

export function assembleRtiText(slots: FileSlots) {
  const lines: string[] = [];
  lines.push("Please provide the following information under the RTI Act, 2005:");
  lines.push("");
  lines.push(`1. ${slots.records || slots.issue}`);
  if (slots.period) lines.push(`2. Kindly confine the reply to the period: ${slots.period}.`);
  lines.push(
    `${slots.period ? "3" : "2"}. Certified copies or electronic copies of the relevant records, file notings and orders, if any.`,
  );
  lines.push("");
  lines.push(
    "This is a request for existing records, not for opinions or justifications. I am a citizen of India.",
  );
  return lines.join("\n").slice(0, 3000);
}

export function subjectLine(slots: FileSlots) {
  const raw = slots.records || slots.issue;
  return raw.split(/[.\n]/)[0]?.trim().slice(0, 90) || "Application under the RTI Act, 2005";
}

export function slotsReady(s: FileSlots) {
  return Boolean(
    s.issue.trim() &&
      s.ministry &&
      s.publicAuthority &&
      s.name.trim().length >= 3 &&
      s.email.includes("@") &&
      s.mobile.length === 10 &&
      s.address.trim() &&
      s.pincode.length === 6,
  );
}

export function fileFromSlots(slots: FileSlots) {
  const draft: FilingDraft = {
    ...emptyDraft,
    email: slots.email,
    mobile: slots.mobile,
    emailVerified: true,
    mobileVerified: true,
    ministry: slots.ministry,
    publicAuthority: slots.publicAuthority,
    name: slots.name,
    address: slots.address,
    state: slots.state,
    pincode: slots.pincode,
    citizen: "Indian",
    bpl: slots.bpl,
    subject: subjectLine(slots),
    text: assembleRtiText(slots),
    paymentMode: slots.bpl ? "" : "upi",
  };
  const registration = makeRegistrationNumber();
  const filing = buildFiling(draft, registration);
  saveFiling(filing);
  return { registration, draft };
}

export function nextFileReply(
  step: FileStep,
  slots: FileSlots,
  userText: string,
): { step: FileStep; slots: FileSlots; reply: string; chips?: string[]; draftPreview?: string } {
  const text = userText.trim();
  const lower = text.toLowerCase();

  if (step === "issue") {
    const ministry = inferMinistry(text);
    const next: FileSlots = {
      ...slots,
      issue: text,
      ministry: ministry ?? slots.ministry,
    };
    if (looksState(text)) {
      return {
        step: "followup",
        slots: next,
        reply: "This portal only covers Central ministries and public authorities. Requests for State governments — including NCT of Delhi — are returned without a refund. Tell me the Central ministry or department that holds the record, and any dates or file numbers you have.",
      };
    }
    if (looksVague(text) || !ministry) {
      return {
        step: "followup",
        slots: next,
        reply: ministry
          ? `That sounds like ${ministry}. To make the request precise, tell me the dates or period, and which records you want — for example file notings, orders, inspection reports or a list of beneficiaries. Avoid asking “why”; ask for the reasons recorded on file.`
          : "I have that. Two follow-ups so I can write a request the CPIO cannot brush aside: which Central ministry or department holds this, and what exact records do you want (with dates if you have them)?",
        ...(ministry ? {} : { chips: ministries.slice(0, 6) }),
      };
    }
    return {
      step: "ministry",
      slots: next,
      reply: `I would file this with ${ministry}. Confirm that public authority, or pick a different ministry.`,
      chips: [ministry, ...ministries.filter((m) => m !== ministry).slice(0, 4)],
    };
  }

  if (step === "followup") {
    const ministry = inferMinistry(text) ?? slots.ministry;
    const next: FileSlots = {
      ...slots,
      records: text,
      period: /\d{4}/.test(text) ? text : slots.period,
      ministry: ministry || slots.ministry,
    };
    if (!next.ministry) {
      return {
        step: "ministry",
        slots: next,
        reply: "Which Central ministry or department should receive this?",
        chips: ministries.slice(0, 8),
      };
    }
    const authorities = authoritiesByMinistry[next.ministry] ?? [
      "Central Public Information Officer (main office)",
    ];
    return {
      step: "identity",
      slots: { ...next, publicAuthority: authorities[0] ?? next.publicAuthority },
      reply: `Good. I’ll send it to ${next.ministry} — ${authorities[0]}. Now your details, as they should appear on the reply: full name, email and 10-digit mobile, in one message.`,
    };
  }

  if (step === "ministry") {
    const ministry =
      ministries.find((m) => m.toLowerCase() === lower || lower.includes(m.toLowerCase())) ??
      inferMinistry(text) ??
      slots.ministry;
    if (!ministry) {
      return {
        step: "ministry",
        slots,
        reply: "Please pick a Central ministry from the list.",
        chips: ministries,
      };
    }
    const authorities = authoritiesByMinistry[ministry] ?? [
      "Central Public Information Officer (main office)",
    ];
    return {
      step: "identity",
      slots: { ...slots, ministry, publicAuthority: authorities[0] ?? "" },
      reply: `Noted — ${ministry}. Your full name, email and 10-digit mobile, please.`,
    };
  }

  if (step === "identity") {
    const name =
      text
        .split(/[,\n]/)[0]
        ?.replace(/email.*$/i, "")
        .replace(/\d{10}/, "")
        .replace(extractEmail(text), "")
        .trim() || text.split(/\s+/).slice(0, 3).join(" ");
    const email = extractEmail(text);
    const mobile = extractMobile(text);
    if (!email || mobile.length !== 10 || name.length < 3) {
      return {
        step: "identity",
        slots,
        reply: "I need all three in one go: your full name, an email address, and a 10-digit Indian mobile number.",
      };
    }
    return {
      step: "address",
      slots: { ...slots, name, email, mobile },
      reply: "Postal address, State or UT, and 6-digit PIN — so the reply can be posted if needed.",
      chips: indianStates.slice(0, 6),
    };
  }

  if (step === "address") {
    const pincode = extractPincode(text);
    const state = extractState(text);
    const address = text.replace(pincode, "").trim();
    if (!pincode || pincode.length !== 6) {
      return {
        step: "address",
        slots,
        reply: "Please include a 6-digit PIN code with the address.",
      };
    }
    return {
      step: "bpl",
      slots: { ...slots, address: address || text, state: state || "Delhi", pincode },
      reply: "Are you below the poverty line? BPL applicants pay no fee if they can produce the certificate. Everyone else pays ₹10.",
      chips: ["No, I will pay ₹10", "Yes, I am BPL"],
    };
  }

  if (step === "bpl") {
    const bpl = /\byes\b|bpl/i.test(lower) && !/no,?\s*i will pay/i.test(lower);
    const next = { ...slots, bpl };
    const preview = assembleRtiText(next);
    return {
      step: "review",
      slots: next,
      reply: `Here is the request I will file with ${next.ministry}. This is a design concept — it stays in this browser and does not reach a real public authority.\n\nFee: ${bpl ? "₹0 (BPL)" : "₹10"}.\nApplicant: ${next.name}.\n\nShall I file it?`,
      chips: ["Yes, file this RTI", "Change the ministry", "Start over"],
      draftPreview: preview,
    };
  }

  if (step === "review") {
    if (/start over|restart|reset/i.test(lower)) {
      return {
        step: "issue",
        slots: emptySlots,
        reply: "Starting fresh. In your own words, what information do you need from the government?",
      };
    }
    if (/change.*ministry|different ministry/i.test(lower)) {
      return {
        step: "ministry",
        slots,
        reply: "Which ministry should receive it?",
        chips: ministries,
      };
    }
    if (!/\byes\b|file|confirm|go ahead|submit/i.test(lower)) {
      return {
        step: "review",
        slots,
        reply: "Say “Yes, file this RTI” to submit, or tell me what to change.",
        chips: ["Yes, file this RTI", "Start over"],
        draftPreview: assembleRtiText(slots),
      };
    }
    return {
      step: "review",
      slots,
      reply: "FILING",
    };
  }

  return {
    step,
    slots,
    reply: "Tell me a little more so I can help.",
  };
}

export function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const MAYA_GREETING =
  "Namaste — I’m Maya. I can file an RTI with you, or clear a doubt about this portal. What would you like to do?";

export const MAYA_FILE_OPENING =
  "Let’s write a request the CPIO has to answer. Tell me, in plain words, what information you need — as if you were explaining it to a friend.";

export const MAYA_ASK_OPENING =
  "Ask me anything about filing, fees, first appeals, status or this portal. I’ll answer from the official FAQ.";
