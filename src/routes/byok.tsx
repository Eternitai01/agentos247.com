import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Integrations } from "@/components/site/Integrations";
import {
  Check, ArrowRight, ShieldCheck, KeyRound, Server, Zap,
  Rocket, Plug, Bot, Lock, Activity, RefreshCw, Terminal, FileCheck,
  Briefcase, Headphones, Heart, GraduationCap, Home as HomeIcon, UserCog,
} from "lucide-react";
import { useState } from "react";
import { BYOKCheckoutDialog, type BYOKPlanId, type BYOKBillingId } from "@/components/site/BYOKCheckoutDialog";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/byok")({
  component: BYOK,
  head: () => ({
    meta: [
      { title: "BYOK — Bring Your Own Keys · AgentOS 24/7" },
      {
        name: "description",
        content:
          "Enterprise-grade AI automation on your own infrastructure. Private, secure, fully under your control. Bring your own AI keys — no API markup, no vendor lock-in.",
      },
    ],
  }),
});

const BYOK_PLANS = [
  {
    name: "Starter",
    monthly: 107,
    description: "Good for starting",
    features: [
      "Telegram channel",
      "500 conversations/month",
      "12 conversations/day",
      "Cutting-edge conversational AI",
      "Dedicated server (2 vCPU, 4 GB RAM)",
    ],
  },
  {
    name: "Pro",
    monthly: 181,
    description: "Best for growing businesses",
    highlight: true,
    features: [
      "Telegram + WhatsApp channel",
      "800 conversations/month",
      "18 conversations/day",
      "Cutting-edge conversational AI",
      "Dedicated server (4 vCPU, 8 GB RAM)",
      "Basic integrations",
    ],
  },
  {
    name: "Business",
    monthly: 367,
    description: "Full power",
    features: [
      "Telegram + WhatsApp channel",
      "1500 conversations/month",
      "35 conversations/day",
      "Premium conversational AI model",
      "Dedicated server (8 vCPU, 16 GB RAM)",
      "Full integrations",
      "Dante Guardian included",
    ],
  },
];

function Hero() {
  const { t } = useT();
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-20 grid lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-8">
          <SectionLabel>{t("Deploy AI Agents in Minutes · BYOK")}</SectionLabel>
          <h1 className="display-hero mt-6 text-[clamp(3rem,7vw,6.5rem)]">
            {t("Bring Your Own Keys.")}{" "}
            <span className="text-accent-blue">{t("Keep your LLM control.")}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {t("Enterprise-grade AI automation — private, secure, and fully under your control. No vendor lock-in, no API markup. Bring Your Own Keys (BYOK).")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-5 py-3 text-sm font-semibold hover:bg-foreground/90 transition-colors"
            >
              {t("Launch your agent")} <ArrowRight className="h-4 w-4" />
            </a>
            <span className="text-sm text-muted-foreground self-center">
              <span className="animate-heartbeat text-accent-blue font-semibold">{t("Live in seconds")}</span> {t("on Telegram or WhatsApp.")}
            </span>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="text-sm font-bold">{t("Is it your first agent? Nice!")}</div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t("Once your agent is launched, your new agent is programmed to help you throughout the process with a beginner's guide.")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Why() {
  const { t } = useT();
  const items = [
    { icon: KeyRound, t: "Bring your own keys", d: "Use your OpenAI, Anthropic, Google, Mistral, DeepSeek, Kimi, Perplexity keys directly. We never markup tokens." },
    { icon: Server, t: "Dedicated infrastructure", d: "A private server, provisioned just for you. No noisy neighbors." },
    { icon: ShieldCheck, t: "Enterprise security", d: "Encrypted memory, GDPR-ready exports, full deletion controls." },
    { icon: Zap, t: "Live in seconds", d: "From plan selection to working agent in seconds." },
  ];
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionLabel>{t("Why BYOK")}</SectionLabel>
        <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl">
          {t("Your AI. Your keys. Your")} <span className="text-accent-blue">{t("infrastructure")}</span>.
        </h2>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((i) => (
            <div key={i.t} className="rounded-2xl border border-border bg-background p-6">
              <i.icon className="h-6 w-6 text-accent-blue" />
              <div className="mt-4 text-lg font-bold">{t(i.t)}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(i.d)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const { t } = useT();
  const [billing, setBilling] = useState<"1m" | "12m" | "24m">("1m");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<BYOKPlanId>("pro");
  const multiplier = billing === "1m" ? 0.5 : billing === "12m" ? 0.36 : 0.27;
  const saveLabel = billing === "1m" ? "50%" : billing === "12m" ? "64%" : "73%";

  return (
    <section id="pricing" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-center text-center">
          <SectionLabel>{t("Pricing")}</SectionLabel>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
            {t("Select your")} <span className="text-accent-blue">{t("plan")}</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            {t("All plans include a dedicated server, managed updates, and enterprise-grade security.")}
          </p>

          <div className="mt-8 inline-flex rounded-xl border border-border bg-surface p-1">
            {[
              { id: "1m", label: "1 month", save: "save 50%" },
              { id: "12m", label: "12 months", save: "save 64%" },
              { id: "24m", label: "24 months", save: "save 73%" },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => setBilling(b.id as typeof billing)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  billing === b.id
                    ? "bg-foreground text-background shadow"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                <span>{t(b.label)}</span>
                <span className="ml-2 text-[0.7rem] opacity-70">{t(b.save)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {BYOK_PLANS.map((p) => {
            const price = Math.round(p.monthly * multiplier);
            const save = p.monthly - price;
            const planId: BYOKPlanId =
              p.name === "Starter" ? "starter" : p.name === "Pro" ? "pro" : "business";
            return (
              <div
                key={p.name}
                className={`relative rounded-2xl p-8 border transition-all flex flex-col ${
                  p.highlight
                    ? "border-foreground bg-background shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]"
                    : "border-border bg-background hover:border-foreground/40"
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-foreground text-background">
                      {t("Most Popular")} ⭐
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-extrabold">{t(p.name)}</h3>
                <div className="mt-2 text-sm text-muted-foreground">{t(p.description)}</div>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-sm text-muted-foreground line-through">€{p.monthly}/mo</span>
                  <span className="text-5xl font-extrabold tracking-tight">€{price}</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                </div>
                <div className="mt-1 text-sm font-semibold text-accent-blue">
                  {t("Save €")}{save}/mo ({saveLabel})
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check className="h-4 w-4 mt-0.5 text-accent-blue shrink-0" />
                      <span>{t(f)}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setCheckoutPlan(planId);
                    setCheckoutOpen(true);
                  }}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold transition-colors ${
                    p.highlight
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "border border-border bg-background hover:bg-muted"
                  }`}
                >
                  {t("Get your agent")} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <BYOKCheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        initialPlan={checkoutPlan}
        initialBilling={billing as BYOKBillingId}
      />
    </section>
  );
}

function HowItWorks() {
  const { t } = useT();
  const steps = [
    { n: "01", icon: Rocket, t: "Deploy", k: "Instant Deployment", d: "Spin up a private dedicated server in 2–3 minutes. No DevOps required." },
    { n: "02", icon: Plug, t: "Connect", k: "Multi-Channel", d: "Connect Telegram, WhatsApp, Slack, Gmail — all from one dashboard." },
    { n: "03", icon: Bot, t: "Automate", k: "Powerful Skills", d: "Research, coding, content generation, email triage — AI that works for you." },
  ];
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionLabel>{t("How It Works")}</SectionLabel>
        <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl">
          {t("Three steps to")} <span className="text-accent-blue">{t("AI automation")}</span>.
        </h2>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-surface p-8">
              <div className="text-sm font-bold text-muted-foreground tracking-widest">{s.n}</div>
              <s.icon className="mt-4 h-7 w-7 text-accent-blue" />
              <div className="mt-4 text-2xl font-extrabold">{t(s.t)}</div>
              <div className="mt-1 text-sm font-semibold text-foreground/80">{t(s.k)}</div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t(s.d)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const { t } = useT();
  const roles = [
    { icon: UserCog, t: "Personal Assistant", d: "Manages your schedule, answers messages, takes notes — available 24/7." },
    { icon: Briefcase, t: "Chief of Staff", d: "Runs daily briefings, prioritises tasks, keeps projects on track." },
    { icon: Headphones, t: "Customer Support", d: "Answers FAQs, handles complaints, escalates complex cases." },
    { icon: Heart, t: "Health Coach", d: "Creates meal plans, tracks progress, sends daily check-ins." },
    { icon: Activity, t: "Sales Rep", d: "Qualifies leads, sends follow-ups, books demos while you sleep." },
    { icon: GraduationCap, t: "Tutor", d: "Guides students through lessons and tracks learning progress." },
    { icon: HomeIcon, t: "Real Estate Agent", d: "Responds to enquiries, qualifies buyers, schedules viewings." },
    { icon: FileCheck, t: "HR & Onboarding", d: "Welcomes new hires, answers policy questions, collects documents." },
  ];
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionLabel>{t("Use Cases")}</SectionLabel>
        <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl">
          {t("What kind of agent will")} <span className="text-accent-blue">{t("you build?")}</span>
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((r) => (
            <div key={r.t} className="rounded-2xl border border-border bg-background p-6">
              <r.icon className="h-6 w-6 text-accent-blue" />
              <div className="mt-4 font-bold">{t(r.t)}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(r.d)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Security() {
  const { t } = useT();
  const items = [
    { t: "TLS 1.3", d: "End-to-end encrypted communications" },
    { t: "AES-256", d: "Enterprise-grade data encryption at rest" },
    { t: "UFW Firewall", d: "Network-level access control" },
    { t: "Fail2Ban", d: "Automated intrusion prevention" },
    { t: "Audit Logging", d: "Complete activity tracking" },
    { t: "Auto Updates", d: "Continuous security patching" },
    { t: "SSH Hardening", d: "Secure remote access only" },
    { t: "GDPR Ready", d: "Full data export and deletion controls" },
  ];
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionLabel>{t("Security")}</SectionLabel>
        <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl">
          {t("Enterprise-grade security built into")} <span className="text-accent-blue">{t("every instance")}</span>.
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((i) => (
            <div key={i.t} className="rounded-2xl border border-border bg-surface p-6">
              <Lock className="h-5 w-5 text-accent-blue" />
              <div className="mt-3 font-bold">{t(i.t)}</div>
              <div className="mt-1 text-sm text-muted-foreground">{t(i.d)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const { t } = useT();
  const faqs = [
    { q: "Do I need technical skills?", a: "No. Pick a plan, enter your API key, and your agent is live in minutes. The agent itself walks you through the rest." },
    { q: "What AI models are supported?", a: "OpenAI, Anthropic, Google, Mistral, DeepSeek, Perplexity — bring your own key from any major provider." },
    { q: "Is my data private?", a: "Yes. Every agent runs on a dedicated server you control. We never train on your conversations." },
    { q: "What is Dante Guardian?", a: "A 24/7 monitoring layer that watches your agent's health and alerts you to anomalies. Included with Business, +€19/mo on other plans." },
    { q: "Can I switch plans later?", a: "Yes. Upgrade or downgrade anytime — your agent and memory are preserved." },
  ];
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <SectionLabel>{t("FAQ")}</SectionLabel>
        <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
          {t("Frequently asked questions")}
        </h2>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold list-none">
                {t(f.q)}
                <span className="text-2xl text-muted-foreground group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground leading-relaxed">{t(f.a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const { t } = useT();
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h2 className="display-hero text-[clamp(2.5rem,6vw,5rem)] max-w-4xl mx-auto">
          {t("Ready to launch?")} <span className="text-accent-blue">{t("Get started today.")}</span>
        </h2>
        <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
          {t("Spin up a private, dedicated AI agent on your own infrastructure in minutes.")}
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-6 py-3.5 text-sm font-semibold hover:bg-foreground/90 transition-colors"
          >
            {t("Launch your agent")} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function BYOK() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Pricing />
        <Integrations />
        <HowItWorks />
        <UseCases />
        <Security />
        <Why />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
