import { createServerFn } from "@tanstack/react-start";

import { faqGroups } from "@/content/faq";
import {
  emptySlots,
  resolveDraftPreview,
  slotsReady,
  type FileSlots,
  type MayaMode,
} from "@/lib/maya";
import { authoritiesByMinistry, ministries } from "@/lib/rti-filing";

export type MayaTurn = {
  mode: MayaMode;
  slots: FileSlots;
  reply: string;
  chips?: string[];
  draftPreview?: string;
  readyToFile: boolean;
};

type ChatTurn = { role: "maya" | "user"; text: string };

const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

function faqDigest() {
  return faqGroups
    .flatMap((g) => g.items.map((i) => `Q: ${i.q}\nA: ${i.a.join(" ")}`))
    .join("\n\n");
}

function systemPrompt() {
  return `You are Maya, a warm, clear assistant on the Government of India RTI Online portal (a design concept). You help Indian citizens file RTI requests and answer doubts.

Rules:
- Speak plain English, short paragraphs, no jargon unless you explain it.
- This portal is ONLY for Central Government public authorities. State governments including NCT of Delhi are out of scope; warn if asked.
- Application fee is ₹10; first appeals are free; BPL applicants are exempt with a certificate.
- Ask for records (file notings, orders, dates), not opinions or “why”.
- Never claim a real public authority received the filing. This is a design concept; filings stay in the browser.
- Helpdesk: 011-24010690/691, helprtionline-dopt[at]nic[dot]in.
- When filing, collect: issue, records/dates, Central ministry (from the list), name, email, 10-digit mobile, address, state, 6-digit PIN, BPL yes/no. Then show a draft and wait for explicit confirmation before readyToFile=true.
- Do not set draftPreview until slots.issue or slots.records has real text. Never leave a numbered point blank (no "1." with nothing after it).
- Ministries you may assign: ${ministries.join("; ")}.
- Default publicAuthority to the first CPIO of that ministry if the user does not name one.

Official FAQ (prefer these facts):
${faqDigest()}

Respond with JSON only:
{
  "reply": "what Maya says to the citizen",
  "chips": ["optional short reply buttons"],
  "mode": "idle" | "ask" | "file",
  "slots": {
    "issue": "",
    "records": "",
    "period": "",
    "ministry": "",
    "publicAuthority": "",
    "name": "",
    "email": "",
    "mobile": "",
    "address": "",
    "state": "",
    "pincode": "",
    "bpl": false
  },
  "readyToFile": false,
  "draftPreview": "optional RTI body when reviewing"
}
Merge new facts into slots. Set readyToFile true only after the citizen clearly confirms they want to file and slots are complete. Limit chips to 6.`;
}

function parseJson(raw: string): Record<string, unknown> | null {
  const trimmed = raw.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function mergeSlots(base: FileSlots, patch: unknown): FileSlots {
  if (!patch || typeof patch !== "object") return base;
  const p = patch as Record<string, unknown>;
  const next = { ...base };
  for (const key of Object.keys(emptySlots) as (keyof FileSlots)[]) {
    const v = p[key];
    if (key === "bpl") {
      if (typeof v === "boolean") next.bpl = v;
      continue;
    }
    if (typeof v === "string" && v.trim()) next[key] = v.trim();
  }
  if (next.ministry && !next.publicAuthority) {
    next.publicAuthority =
      authoritiesByMinistry[next.ministry]?.[0] ??
      "Central Public Information Officer (main office)";
  }
  if (next.mobile) next.mobile = next.mobile.replace(/\D/g, "").slice(-10);
  if (next.pincode) next.pincode = next.pincode.replace(/\D/g, "").slice(0, 6);
  return next;
}

async function generate(apiKey: string, prompt: string, history: ChatTurn[]) {
  const contents = [
    ...history.slice(-16).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
    { role: "user", parts: [{ text: prompt }] },
  ];

  let lastError = "Gemini returned no text.";
  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt() }] },
        contents,
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      }),
    });
    const body = (await res.json()) as {
      error?: { message?: string };
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    if (!res.ok) {
      lastError = body.error?.message || `Gemini ${model} failed (${res.status}).`;
      continue;
    }
    const text = body.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
    if (text) return text;
  }
  throw new Error(lastError);
}

export const askMaya = createServerFn({ method: "POST" })
  .validator((data: { mode: MayaMode; slots: FileSlots; history: ChatTurn[]; userText: string }) => data)
  .handler(async ({ data }): Promise<MayaTurn> => {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set.");
    }

    const prompt = [
      `Current mode: ${data.mode}.`,
      `Known filing slots: ${JSON.stringify(data.slots)}.`,
      `Citizen just said: ${data.userText}`,
    ].join("\n");

    const raw = await generate(apiKey, prompt, data.history);
    const parsed = parseJson(raw);
    const slots = mergeSlots(data.slots, parsed?.["slots"]);
    const mode =
      parsed?.["mode"] === "file" || parsed?.["mode"] === "ask" || parsed?.["mode"] === "idle"
        ? (parsed["mode"] as MayaMode)
        : data.mode === "idle"
          ? "ask"
          : data.mode;
    const reply =
      typeof parsed?.["reply"] === "string" && parsed["reply"].trim()
        ? parsed["reply"].trim()
        : raw.slice(0, 1200);
    const chips = Array.isArray(parsed?.["chips"])
      ? (parsed["chips"] as unknown[]).filter((c): c is string => typeof c === "string").slice(0, 6)
      : undefined;
    const readyToFile = parsed?.["readyToFile"] === true && slotsReady(slots);
    const draftPreview = resolveDraftPreview(parsed?.["draftPreview"], slots, readyToFile);

    return {
      mode,
      slots,
      reply,
      ...(chips && chips.length ? { chips } : {}),
      ...(draftPreview ? { draftPreview } : {}),
      readyToFile,
    };
  });
