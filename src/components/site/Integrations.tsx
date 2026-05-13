import { SectionLabel } from "./SectionLabel";
import { useT } from "@/lib/i18n";

const local = (slug: string) => `/integrations/${slug}.svg`;

type Tool = { name: string; src: string };

const row1: Tool[] = [
  { name: "WhatsApp", src: local("whatsapp") },
  { name: "Telegram", src: local("telegram") },
  { name: "Discord", src: local("discord") },
  { name: "Slack", src: local("slack") },
  { name: "Signal", src: local("signal") },
  { name: "Teams", src: local("microsoft-teams") },
  { name: "Matrix", src: local("matrix") },
  { name: "OpenAI", src: local("openai") },
  { name: "Anthropic", src: local("claude") },
  { name: "Google", src: local("google") },
  { name: "Mistral", src: local("mistralai") },
  { name: "DeepSeek", src: local("deepseek") },
  { name: "Perplexity", src: local("perplexity") },
];
const row2: Tool[] = [
  { name: "Notion", src: local("notion") },
  { name: "Gmail", src: local("gmail") },
  { name: "Calendar", src: local("googlecalendar") },
  { name: "Drive", src: local("googledrive") },
  { name: "Trello", src: local("trello") },
  { name: "Obsidian", src: local("obsidian") },
  { name: "GitHub", src: local("github") },
  { name: "1Password", src: local("1password") },
  { name: "Spotify", src: local("spotify") },
  { name: "Stripe", src: local("stripe") },
  { name: "HubSpot", src: local("hubspot") },
  { name: "Salesforce", src: local("salesforce") },
];
const row3: Tool[] = [
  { name: "Zapier", src: local("zapier") },
  { name: "n8n", src: local("n8n") },
  { name: "Linux", src: local("linux") },
  { name: "macOS", src: local("apple") },
  { name: "Windows", src: local("windows") },
  { name: "Microsoft", src: local("microsoft") },
  { name: "WhatsApp", src: local("whatsapp") },
  { name: "Telegram", src: local("telegram") },
  { name: "OpenAI", src: local("openai") },
  { name: "Google", src: local("google") },
  { name: "Notion", src: local("notion") },
  { name: "GitHub", src: local("github") },
];

const Pill = ({ t }: { t: Tool }) => (
  <div className="shrink-0 flex items-center gap-2.5 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold">
    <img
      src={t.src}
      alt={`${t.name} logo`}
      className="h-5 w-5 object-contain"
      loading="eager"
    />
    <span>{t.name}</span>
  </div>
);

const Marquee = ({ items, direction }: { items: Tool[]; direction: "left" | "right" }) => (
  <div className="overflow-hidden mask-fade">
    <div
      className={`flex gap-3 w-max ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
    >
      {[...items, ...items].map((t, i) => (
        <Pill key={`${t.name}-${i}`} t={t} />
      ))}
    </div>
  </div>
);

export function Integrations() {
  const { t } = useT();
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionLabel>{t("Integrations")}</SectionLabel>
        <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl">
          {t("50+ integrations out of the box.")}
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {t("Chat providers, AI models, productivity tools, smart home, and more — all working together.")}
        </p>
        <div className="mt-12 space-y-3">
          <Marquee items={row1} direction="left" />
          <Marquee items={row2} direction="right" />
          <Marquee items={row3} direction="left" />
        </div>
      </div>
    </section>
  );
}
