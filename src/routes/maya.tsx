import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { MayaChat } from "@/components/maya-chat";
import maya from "@/assets/maya-mascot.png";

export const Route = createFileRoute("/maya")({
  head: () => ({
    meta: [
      { title: "File an RTI using AI — Maya" },
      {
        name: "description",
        content:
          "File an RTI application by talking to Maya. She asks follow-up questions, drafts a records-based request and registers it on this portal.",
      },
      { property: "og:title", content: "File an RTI using AI — Maya" },
    ],
    links: [{ rel: "canonical", href: "/maya" }],
  }),
  component: MayaPage,
});

function MayaPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main id="main" tabIndex={-1}>
        <PageHero
          eyebrow="File an RTI using AI"
          title="Tell Maya what you need to know"
          lede="Maya asks the follow-ups a good RTI needs — the right public authority, the records, the dates — then drafts the application and files it on this portal."
        />

        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_280px] md:py-16">
          <div className="surface-card flex h-[min(40rem,70dvh)] min-h-[28rem] flex-col overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <img
                src={maya}
                alt="Maya, RTI Online assistant"
                className="h-12 w-12 rounded-full object-cover ring-2 ring-saffron/40"
              />
              <div>
                <h2 className="text-xl leading-tight">Maya</h2>
                <p className="text-xs text-muted-foreground">Guides the filing, one question at a time</p>
              </div>
            </div>
            <MayaChat initialMode="file" />
          </div>

          <aside className="space-y-5">
            <div className="surface-card p-6">
              <p className="text-eyebrow text-saffron">How she files</p>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li>1. You describe the problem in plain words.</li>
                <li>2. Maya asks which records and which Central ministry.</li>
                <li>3. She collects your name, email, mobile and address.</li>
                <li>4. You review the draft. She files it and gives a registration number.</li>
              </ol>
            </div>
            <div className="rounded-lg border-l-2 border-saffron bg-secondary p-5 text-sm leading-relaxed">
              Central authorities only. A request meant for a State public authority is returned without a refund. Maya will warn you if the department sounds State.
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
