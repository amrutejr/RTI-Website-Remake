import { useEffect, useRef, useState } from "react";
import { ArrowUp, RotateCcw, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

import maya from "@/assets/maya-mascot.png";
import {
  MAYA_ASK_OPENING,
  MAYA_FILE_OPENING,
  MAYA_GREETING,
  answerFaq,
  emptySlots,
  fileFromSlots,
  newId,
  nextFileReply,
  type FileSlots,
  type FileStep,
  type MayaMessage,
  type MayaMode,
} from "@/lib/maya";
import { askMaya } from "@/lib/maya-server";

export function openMaya(mode?: Exclude<MayaMode, "idle">) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("maya:open", { detail: { mode } }));
}

function bubble(role: MayaMessage["role"], text: string, extra: Partial<MayaMessage> = {}): MayaMessage {
  return { id: newId(), role, text, ...extra };
}

function greetingExtra(mode: MayaMode): Partial<MayaMessage> {
  if (mode === "idle") return { chips: ["File an RTI", "Ask a doubt"] };
  if (mode === "ask")
    return { chips: ["What is the fee?", "Can I file for a State department?", "How do I track status?"] };
  return {};
}

export function MayaChat({
  initialMode = "idle",
  compact = false,
}: {
  initialMode?: MayaMode;
  compact?: boolean;
}) {
  const [mode, setMode] = useState<MayaMode>(initialMode);
  const [step, setStep] = useState<FileStep>("issue");
  const [slots, setSlots] = useState<FileSlots>(emptySlots);
  const [messages, setMessages] = useState<MayaMessage[]>(() => [
    bubble(
      "maya",
      initialMode === "file" ? MAYA_FILE_OPENING : initialMode === "ask" ? MAYA_ASK_OPENING : MAYA_GREETING,
      greetingExtra(initialMode),
    ),
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const reset = (next: MayaMode) => {
    setMode(next);
    setStep("issue");
    setSlots(emptySlots);
    setInput("");
    setMessages([
      bubble(
        "maya",
        next === "file" ? MAYA_FILE_OPENING : next === "ask" ? MAYA_ASK_OPENING : MAYA_GREETING,
        greetingExtra(next),
      ),
    ]);
  };

  const speak = (userText: string) => {
    const text = userText.trim();
    if (!text || busy) return;

    const history = messages.map((m) => ({
      role: m.role,
      text: m.text,
    }));
    setMessages((m) => [...m, bubble("user", text)]);
    setInput("");
    setBusy(true);

    void (async () => {
      try {
        const turn = await askMaya({
          data: { mode, slots, history, userText: text },
        });
        const extras: Partial<MayaMessage> = {
          ...(turn.chips ? { chips: turn.chips } : {}),
          ...(turn.draftPreview && !turn.readyToFile ? { draftPreview: turn.draftPreview } : {}),
        };
        if (turn.readyToFile) {
          const { registration } = fileFromSlots(turn.slots);
          setMessages((m) => [
            ...m,
            bubble("maya", `${turn.reply}\n\nRegistration number: ${registration}.`, {
              ...extras,
              registration,
            }),
          ]);
        } else {
          setMessages((m) => [...m, bubble("maya", turn.reply, extras)]);
        }
        setMode(turn.mode);
        setSlots(turn.slots);
      } catch {
        scriptedReply(text);
        return;
      } finally {
        setBusy(false);
      }
    })();
  };

  const scriptedReply = (text: string) => {
    const lower = text.toLowerCase();

    if (mode === "idle" || /file an rti|file (an? )?rti|help me file/i.test(lower)) {
      if (mode === "idle" && /ask|doubt|faq|question|help me understand/i.test(lower) && !/file/i.test(lower)) {
        setMode("ask");
        const ans = answerFaq(text);
        setMessages((m) => [
          ...m,
          bubble("maya", /ask a doubt|ask a question/.test(lower) ? MAYA_ASK_OPENING : ans.text, {
            chips: ["File an RTI", "What is the fee?", "How long for a reply?"],
          }),
        ]);
        return;
      }
      if (mode === "idle" && (/file/.test(lower) || lower === "file an rti")) {
        setMode("file");
        setMessages((m) => [...m, bubble("maya", MAYA_FILE_OPENING)]);
        return;
      }
    }

    if (mode === "ask" || (mode === "idle" && !/file/.test(lower))) {
      if (/file an rti|help me file/.test(lower)) {
        setMode("file");
        setStep("issue");
        setSlots(emptySlots);
        setMessages((m) => [...m, bubble("maya", MAYA_FILE_OPENING)]);
        return;
      }
      setMode("ask");
      const ans = answerFaq(text);
      setMessages((m) => [
        ...m,
        bubble("maya", ans.text, {
          chips: ans.matched ? ["File an RTI", "Ask another question"] : ["File an RTI", "What is the fee?"],
        }),
      ]);
      return;
    }

    const result = nextFileReply(step, slots, text);
    if (result.reply === "FILING") {
      const { registration } = fileFromSlots(result.slots);
      setSlots(result.slots);
      setMessages((m) => [
        ...m,
        bubble(
          "maya",
          `Filed. Your registration number is ${registration}. Keep it — you will need it to track the request. A confirmation would be emailed to ${result.slots.email} on the live portal.`,
          { registration },
        ),
      ]);
      return;
    }

    setStep(result.step);
    setSlots(result.slots);
    setMessages((m) => [
      ...m,
      bubble("maya", result.reply, {
        ...(result.chips ? { chips: result.chips } : {}),
        ...(result.draftPreview ? { draftPreview: result.draftPreview } : {}),
      }),
    ]);
  };

  return (
    <div className={`flex h-full min-h-0 flex-col ${compact ? "" : ""}`}>
      <div ref={scrollerRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "maya" && (
              <img
                src={maya}
                alt=""
                className="mt-0.5 h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-border"
              />
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-br-md bg-ink text-ink-foreground"
                  : "rounded-bl-md bg-secondary text-foreground"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {msg.draftPreview && (
                <pre className="mt-3 max-h-48 overflow-auto rounded-md border border-border bg-card p-3 font-sans text-xs leading-relaxed text-muted-foreground">
                  {msg.draftPreview}
                </pre>
              )}
              {msg.registration && (
                <Link
                  to="/track"
                  search={{ rn: msg.registration }}
                  className="mt-3 inline-flex text-xs font-medium text-saffron hover:underline"
                >
                  Track {msg.registration}
                </Link>
              )}
              {msg.chips && msg.chips.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {msg.chips.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => speak(c)}
                      className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground hover:border-saffron hover:bg-accent"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <img src={maya} alt="" className="h-6 w-6 rounded-full object-cover" />
            Maya is typing…
          </div>
        )}
      </div>

      <form
        className="border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          speak(input);
        }}
      >
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-border text-muted-foreground hover:bg-secondary"
            onClick={() => reset(initialMode)}
            aria-label="Start over"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <label className="sr-only" htmlFor="maya-input">
            Message Maya
          </label>
          <textarea
            id="maya-input"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                speak(input);
              }
            }}
            placeholder={mode === "file" ? "Tell Maya what you need…" : "Ask Maya…"}
            className="min-h-11 max-h-28 flex-1 resize-none rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="btn-base btn-saffron !h-11 !w-11 !p-0"
            aria-label="Send"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Sparkles className="h-3 w-3 text-saffron" aria-hidden />
          Maya uses Gemini. Nothing is sent to a real public authority.
        </p>
      </form>
    </div>
  );
}
