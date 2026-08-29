type PuterChat = (
  prompt: string,
  options?: { model?: string },
) => Promise<unknown>;

type PuterClient = { ai: { chat: PuterChat } };

type MarkedText = Text & { __rtiEn?: string; __rtiHi?: string };
type MarkedEl = HTMLElement & {
  __rtiEnPlaceholder?: string;
  __rtiHiPlaceholder?: string;
};

const CACHE_KEY = "rti-translate-cache-hi";
const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "CODE",
  "PRE",
  "KBD",
  "SVG",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION",
]);

const memoryCache = new Map<string, string>();
let cacheLoaded = false;

function loadCache() {
  if (cacheLoaded) return;
  cacheLoaded = true;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, string>;
    for (const [en, hi] of Object.entries(parsed)) {
      if (en && hi) memoryCache.set(en, hi);
    }
  } catch {
    /* ignore */
  }
}

function saveCache() {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(memoryCache)));
  } catch {
    /* ignore */
  }
}

function skipTree(el: Element | null): boolean {
  while (el) {
    if (el.hasAttribute("data-no-translate")) return true;
    if (el.getAttribute("contenteditable") === "true") return true;
    if (SKIP_TAGS.has(el.tagName)) return true;
    el = el.parentElement;
  }
  return false;
}

export function looksTranslatable(text: string): boolean {
  const t = text.trim();
  if (t.length < 3) return false;
  if (!/[A-Za-z]/.test(t)) return false;
  if (/^https?:\/\//i.test(t) || /^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(t)) return false;
  if (/^\+?\d[\d\s-]{6,}$/.test(t)) return false;
  return true;
}

function chatText(reply: unknown): string {
  if (reply == null) return "";
  if (typeof reply === "string") return reply;
  if (typeof reply !== "object") return String(reply);

  const rec = reply as Record<string, unknown>;
  if (typeof rec.message === "string") return rec.message;
  if (rec.message && typeof rec.message === "object") {
    const message = rec.message as Record<string, unknown>;
    const content = message.content;
    if (typeof content === "string") return content;
    if (content && typeof content === "object" && "toString" in content) {
      const asString = String(content);
      if (asString && asString !== "[object Object]") return asString;
    }
    if (Array.isArray(content)) {
      return content
        .map((part) => {
          if (typeof part === "string") return part;
          if (part && typeof part === "object" && "text" in part) {
            return String((part as { text: unknown }).text ?? "");
          }
          return "";
        })
        .join("");
    }
  }
  if (typeof rec.text === "string") return rec.text;
  return "";
}

function parseJsonArray(raw: string): string[] | null {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start < 0 || end < 0) return null;
  try {
    const parsed: unknown = JSON.parse(cleaned.slice(start, end + 1));
    if (!Array.isArray(parsed)) return null;
    return parsed.map((item) => String(item ?? ""));
  } catch {
    return null;
  }
}

function readWindowPuter(): PuterClient | null {
  const existing = (window as Window & { puter?: PuterClient }).puter;
  return existing?.ai?.chat ? existing : null;
}

async function getPuter(): Promise<PuterClient> {
  if (typeof window === "undefined") {
    throw new Error("Translation is only available in the browser.");
  }

  const ready = readWindowPuter();
  if (ready) return ready;

  const deadline = Date.now() + 4000;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const fromCdn = readWindowPuter();
    if (fromCdn) return fromCdn;
  }

  try {
    const mod = (await import("@heyputer/puter.js")) as {
      puter?: PuterClient;
      default?: PuterClient;
    };
    const puter = mod.puter ?? mod.default;
    if (puter?.ai?.chat) return puter;
  } catch {
    /* CDN is the primary loader */
  }

  throw new Error("Puter.js did not load. Refresh and try again.");
}

async function translateBatch(english: string[]): Promise<string[]> {
  if (english.length === 0) return [];

  const puter = await getPuter();
  const prompt = `Translate each English string to Hindi. Keep RTI, CPIO, DoPT, UPI, FAQ, PIN, and similar official abbreviations as-is. Preserve numbers, ₹ amounts, emails, and phone numbers. Return a JSON array of Hindi strings in the same order and length. Output JSON only, no commentary.

${JSON.stringify(english)}`;

  const reply = await puter.ai.chat(prompt, { model: "gpt-5.4-nano" });
  const translated = parseJsonArray(chatText(reply));
  if (!translated || translated.length !== english.length) {
    throw new Error("Could not read the Hindi translation. Please try again.");
  }
  return translated;
}

const CHUNK = 28;

async function fillCache(missing: string[]) {
  for (let i = 0; i < missing.length; i += CHUNK) {
    const slice = missing.slice(i, i + CHUNK);
    const hindi = await translateBatch(slice);
    slice.forEach((en, idx) => {
      const hi = hindi[idx]?.trim();
      if (hi) memoryCache.set(en, hi);
    });
    saveCache();
  }
}

function collectTextNodes(): MarkedText[] {
  const nodes: MarkedText[] = [];
  if (!document.body) return nodes;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || skipTree(parent)) return NodeFilter.FILTER_REJECT;
      const marked = node as MarkedText;
      const original = (marked.__rtiEn ?? node.nodeValue ?? "").trim();
      if (!looksTranslatable(original)) return NodeFilter.FILTER_REJECT;
      if (marked.__rtiHi && node.nodeValue === marked.__rtiHi) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let current = walker.nextNode();
  while (current) {
    nodes.push(current as MarkedText);
    current = walker.nextNode();
  }
  return nodes;
}

function collectPlaceholderEls(): (HTMLInputElement | HTMLTextAreaElement)[] {
  return Array.from(
    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      "input[placeholder], textarea[placeholder]",
    ),
  ).filter((el) => {
    if (skipTree(el)) return false;
    const marked = el as MarkedEl;
    const original = marked.__rtiEnPlaceholder ?? el.getAttribute("placeholder") ?? "";
    if (!looksTranslatable(original)) return false;
    if (marked.__rtiHiPlaceholder && el.getAttribute("placeholder") === marked.__rtiHiPlaceholder) {
      return false;
    }
    return true;
  });
}

function applyHindi() {
  for (const node of collectTextNodes()) {
    const english = node.__rtiEn ?? node.nodeValue ?? "";
    const hi = memoryCache.get(english.trim()) ?? memoryCache.get(english);
    if (!hi) continue;
    node.__rtiEn = english;
    node.__rtiHi = hi;
    node.nodeValue = hi;
  }

  for (const el of collectPlaceholderEls()) {
    const marked = el as MarkedEl;
    const english = marked.__rtiEnPlaceholder ?? el.getAttribute("placeholder") ?? "";
    const hi = memoryCache.get(english.trim()) ?? memoryCache.get(english);
    if (!hi) continue;
    marked.__rtiEnPlaceholder = english;
    marked.__rtiHiPlaceholder = hi;
    el.setAttribute("placeholder", hi);
  }
}

export function restoreEnglish() {
  if (typeof document === "undefined" || !document.body) return;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    const marked = current as MarkedText;
    if (marked.__rtiEn != null) marked.nodeValue = marked.__rtiEn;
    current = walker.nextNode();
  }

  document.querySelectorAll("input, textarea").forEach((el) => {
    const marked = el as MarkedEl;
    if (marked.__rtiEnPlaceholder != null) {
      el.setAttribute("placeholder", marked.__rtiEnPlaceholder);
    }
  });
}

export async function translatePageToHindi() {
  if (typeof document === "undefined") return;
  loadCache();

  const pending = new Set<string>();

  for (const node of collectTextNodes()) {
    const english = node.__rtiEn ?? node.nodeValue ?? "";
    const key = english.trim();
    if (!memoryCache.has(english) && !memoryCache.has(key)) pending.add(english);
  }
  for (const el of collectPlaceholderEls()) {
    const marked = el as MarkedEl;
    const english = marked.__rtiEnPlaceholder ?? el.getAttribute("placeholder") ?? "";
    const key = english.trim();
    if (!memoryCache.has(english) && !memoryCache.has(key)) pending.add(english);
  }

  applyHindi();

  const missing = [...pending].filter((text) => !memoryCache.has(text) && !memoryCache.has(text.trim()));
  if (missing.length === 0) return false;

  await fillCache(missing);
  applyHindi();
  return true;
}
