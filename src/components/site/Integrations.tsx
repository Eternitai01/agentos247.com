import { SectionLabel } from "./SectionLabel";
import { useT } from "@/lib/i18n";

const si = (slug: string, color: string) => `https://cdn.simpleicons.org/${slug}/${color}`;
const svgl = (slug: string) => `https://svgl.app/library/${slug}.svg`;
type Tool = { name: string; src: string };

const row1: Tool[] = [
  { name: "WhatsApp", src: si("whatsapp", "25D366") },
  { name: "Telegram", src: si("telegram", "26A5E4") },
  { name: "Discord", src: si("discord", "5865F2") },
  { name: "Slack", src: svgl("slack") },
  { name: "Signal", src: si("signal", "3A76F0") },
  { name: "Teams", src: svgl("microsoft-teams") },
  { name: "Matrix", src: si("matrix", "000000") },
  { name: "OpenAI", src: svgl("openai") },
  { name: "Anthropic", src: si("claude", "D97757") },
  { name: "Google", src: si("google", "4285F4") },
  { name: "Mistral", src: si("mistralai", "FA520F") },
  { name: "DeepSeek", src: svgl("deepseek") },
  { name: "Perplexity", src: si("perplexity", "20B8CD") },
];
const row2: Tool[] = [
  { name: "Notion", src: svgl("notion") },
  { name: "Gmail", src: si("gmail", "EA4335") },
  { name: "Calendar", src: si("googlecalendar", "4285F4") },
  { name: "Drive", src: si("googledrive", "4285F4") },
  { name: "Trello", src: si("trello", "0052CC") },
  { name: "Obsidian", src: si("obsidian", "7C3AED") },
  { name: "GitHub", src: si("github", "181717") },
  { name: "1Password", src: si("1password", "0094F5") },
  { name: "Spotify", src: si("spotify", "1DB954") },
  { name: "Stripe", src: si("stripe", "635BFF") },
  { name: "HubSpot", src: si("hubspot", "FF7A59") },
  { name: "Salesforce", src: svgl("salesforce") },
];
const row3: Tool[] = [
  { name: "Zapier", src: si("zapier", "FF4F00") },
  { name: "n8n", src: si("n8n", "EA4B71") },
  { name: "Linux", src: si("linux", "FCC624") },
  { name: "macOS", src: si("apple", "000000") },
  { name: "Windows", src: svgl("windows") },
  { name: "Microsoft", src: svgl("microsoft") },
  { name: "WhatsApp", src: si("whatsapp", "25D366") },
  { name: "Telegram", src: si("telegram", "26A5E4") },
  { name: "OpenAI", src: svgl("openai") },
  { name: "Google", src: si("google", "4285F4") },
  { name: "Notion", src: svgl("notion") },
  { name: "GitHub", src: si("github", "181717") },
];

const Pill = ({ t }: { t: Tool }) => (
  <div className="shrink-0 flex items-center gap-2.5 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold">
    <img
      src={t.src}
      alt={`${t.name} logo`}
      className="h-5 w-5 object-contain"
      loading="lazy"
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
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
