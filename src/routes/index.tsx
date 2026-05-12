import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SectionLabel } from "@/components/site/SectionLabel";
import { AgentCheckoutDialog, type BillingId, type PlanId } from "@/components/site/AgentCheckoutDialog";
import { Integrations } from "@/components/site/Integrations";
import {
  Check, Shield, Lock, X, ArrowRight, MessageCircle, Phone,
  Briefcase, TrendingUp, DollarSign, Dumbbell, Apple, GraduationCap,
  Trophy, FlaskConical, Crown, Megaphone, Target, Users, Scale,
  ClipboardList, Rocket, Brain, Heart, Stethoscope, Leaf, Code2,
  Palette, Camera, Music, BookOpen, PenTool, Languages, Globe,
  Plane, Home as HomeIcon, Car, ShoppingBag, Utensils, Coffee, Baby, Dog,
  HandHeart, Sparkles, Lightbulb, Zap, Star, Mic, Video, Film,
  Newspaper, Mail, Calendar, FileText, FolderKanban, BarChart3,
  PieChart, Calculator, Receipt, Building2, Factory, Truck,
  Hammer, Wrench, HardHat, Anchor, Compass, Map, Mountain,
  Bike, Waves, Tent, Gamepad2, Puzzle, Drama, Theater,
  Library, School, Microscope, Atom, Telescope, Bug, Cpu,
  Server, Database, Cloud, Smartphone, Wifi, Bot, Search,
} from "lucide-react";
import { useState } from "react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "AgentOS 24/7 — AI Expert / Assistant Live in Seconds" },
      {
        name: "description",
        content:
          "Your Agent Operating System. Enterprise-grade secured AI agent operating system in your own private dedicated server, ready to work for you. No technical setup. No system configuration.",
      },
    ],
  }),
});

const PLANS = [
  {
    name: "Basic",
    tag: null,
    monthly: 180,
    discounted: 90,
    description: "For getting started with AI agents.",
    features: [
      "500 conversations/month",
      "Telegram agent",
      "80+ professional roles",
      "Persistent memory & knowledge base",
      "AI agent initiation guide",
      "Constant OpenClaw updates & improvements",
      "24/7 technical support",
    ],
  },
  {
    name: "Plus",
    tag: "Most Popular",
    monthly: 219,
    discounted: 109,
    description: "Everything in Basic, plus more reach.",
    features: [
      "800 conversations/month",
      "Everything in Basic, plus:",
      "Dedicated WhatsApp number",
      "Priority email + chat support",
    ],
    highlight: true,
  },
  {
    name: "Elite",
    tag: "Premium",
    monthly: 552,
    discounted: 276,
    description: "Voice calls and personal monitoring.",
    features: [
      "1500 conversations/month",
      "Everything in Plus, plus:",
      "Voice calls included",
      "Dante Guardian personal monitoring",
    ],
  },
];

function Hero() {
  const { t } = useT();
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <SectionLabel>
            {t("Instant Agent")} ·{" "}
            <span className="animate-heartbeat text-accent-blue">{t("Launch Now")}</span>
          </SectionLabel>
          <h1 className="display-hero mt-6 text-[clamp(3rem,7vw,6.5rem)]">
            {t("AI Expert / Assistant")}{" "}
            <span className="text-accent-blue">{t("Live in seconds")}</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
            <span className="block font-bold text-foreground">{t("Agent Operating System")}</span>
            {t("Your Agent Operating System. Enterprise-grade secured AI agent operating system in your own private dedicated server, ready to work for you. No technical setup. No system configuration.")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-5 py-3 text-sm font-semibold hover:bg-foreground/90 transition-colors"
            >
              {t("Get your agent")} <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center rounded-md border border-border bg-background px-5 py-3 text-sm font-semibold hover:bg-muted transition-colors"
            >
              {t("How it works")}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span>{t("Available on")}</span>
            <span className="inline-flex items-center gap-2 font-medium text-foreground">
              <MessageCircle className="h-4 w-4 text-accent-blue" /> {t("Telegram")}
            </span>
            <span className="inline-flex items-center gap-2 font-medium text-foreground">
              <Phone className="h-4 w-4 text-accent-blue" /> {t("WhatsApp")}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4" /> {t("Private server")}</span>
            <span className="inline-flex items-center gap-2"><Lock className="h-4 w-4" /> {t("Your data stays yours")}</span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}

function HeroCard() {
  const { t } = useT();
  return (
    <div className="rounded-2xl border border-border bg-surface p-8 shadow-[0_30px_80px_-40px_rgba(20,40,90,0.25)]">
      <div className="text-sm font-semibold">{t("Your agent, your rules")}</div>
      <p className="text-xs text-muted-foreground mt-1">
        {t("Spin up a dedicated, private AI agent in minutes.")}
      </p>
      <div className="mt-6 space-y-3">
        {[
          "Choose a role — sales, ops, research, support…",
          "Pick your channel: Telegram or WhatsApp",
          "Pay and chat — your agent is live in seconds",
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground text-background text-xs font-bold">
              {i + 1}
            </span>
            <span className="text-sm">{t(s)}</span>
          </div>
        ))}
      </div>
      <a
        href="#pricing"
        className="mt-6 flex items-center justify-center gap-2 rounded-md bg-accent-blue/100 text-white px-4 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
        style={{ background: "oklch(0.55 0.24 260)" }}
      >
        {t("Launch my agent")} <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function HowItWorks() {
  const { t } = useT();
  const steps = [
    { n: "01", t: "Choose your role", d: "From 80+ professional roles — sales, support, research, ops, finance, and more." },
    { n: "02", t: "Pick your channel", d: "Telegram or WhatsApp. Your agent shows up where your team already chats." },
    { n: "03", t: "Pay & go live", d: "Your dedicated AI agent is ready to work for you in seconds — not weeks." },
  ];
  return (
    <section id="how" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionLabel>{t("How it works")}</SectionLabel>
        <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl">
          {t("From zero to a working agent in")} <span className="text-accent-blue">{t("under a minute")}</span>.
        </h2>
        <div className="mt-14 grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.n} className="border-t border-foreground pt-6">
              <div className="text-sm font-mono text-muted-foreground">{s.n}</div>
              <div className="mt-3 text-xl font-bold">{t(s.t)}</div>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{t(s.d)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Roles() {
  const { t } = useT();
  const roles: { icon: any; name: string; desc: string }[] = [
    { icon: Briefcase, name: "Executive Assistant", desc: "Manages your schedule, drafts messages, keeps you organized." },
    { icon: TrendingUp, name: "Business Advisor", desc: "Strategy, pricing, marketing, honest feedback." },
    { icon: DollarSign, name: "Financial Coach", desc: "Budgets, savings, investment guidance." },
    { icon: Dumbbell, name: "Personal Trainer", desc: "Workouts, progress tracking, motivation." },
    { icon: Apple, name: "Nutritionist", desc: "Meal plans, dietary advice, healthy habits." },
    { icon: GraduationCap, name: "Personal Tutor", desc: "Any subject, any level, at your pace." },
    { icon: Trophy, name: "Sports Coach", desc: "Training plans, performance analysis, game strategy." },
    { icon: FlaskConical, name: "Science Expert", desc: "Astronomy, biology, physics — explained simply." },
    { icon: Crown, name: "CEO Advisor", desc: "Executive strategy, board decisions, company vision." },
    { icon: Megaphone, name: "Marketing Strategist", desc: "Campaigns, branding, growth marketing." },
    { icon: Target, name: "Sales Coach", desc: "Sales techniques, pipeline management, closing deals." },
    { icon: Users, name: "HR Consultant", desc: "Hiring, team culture, workplace policies." },
    { icon: Scale, name: "Legal Advisor", desc: "Contracts, compliance, plain-English legal guidance." },
    { icon: ClipboardList, name: "Project Manager", desc: "Plans, timelines, stakeholder updates." },
    { icon: Rocket, name: "Startup Mentor", desc: "Fundraising, product-market fit, founder coaching." },
    { icon: Brain, name: "Therapist Companion", desc: "Reflective listening, journaling prompts, mindfulness." },
    { icon: Heart, name: "Relationship Coach", desc: "Communication, conflict resolution, dating advice." },
    { icon: Stethoscope, name: "Health Companion", desc: "Symptom triage, lifestyle tips, wellness habits." },
    { icon: Leaf, name: "Wellness Guide", desc: "Meditation, breathwork, stress management." },
    { icon: Code2, name: "Software Engineer", desc: "Code reviews, debugging, architecture advice." },
    { icon: Palette, name: "Designer", desc: "Brand, UI, color and typography feedback." },
    { icon: Camera, name: "Photography Coach", desc: "Composition, lighting, post-processing tips." },
    { icon: Music, name: "Music Tutor", desc: "Theory, practice plans, instrument lessons." },
    { icon: BookOpen, name: "Writing Coach", desc: "Essays, blogs, structure and tone." },
    { icon: PenTool, name: "Copywriter", desc: "Headlines, ads, landing pages that convert." },
    { icon: Languages, name: "Language Teacher", desc: "Conversation practice in 30+ languages." },
    { icon: Globe, name: "Travel Planner", desc: "Itineraries, bookings, local tips." },
    { icon: Plane, name: "Frequent Flyer", desc: "Miles, status runs, award bookings." },
    { icon: HomeIcon, name: "Real Estate Advisor", desc: "Buying, selling, market analysis." },
    { icon: Car, name: "Auto Expert", desc: "Buying, maintenance, troubleshooting." },
    { icon: ShoppingBag, name: "Personal Shopper", desc: "Style, gifts, price comparisons." },
    { icon: Utensils, name: "Chef", desc: "Recipes, meal prep, technique help." },
    { icon: Coffee, name: "Barista", desc: "Brew methods, beans, latte art tips." },
    { icon: Baby, name: "Parenting Coach", desc: "Sleep, feeding, milestones, behavior." },
    { icon: Dog, name: "Pet Care Advisor", desc: "Training, nutrition, health basics." },
    { icon: HandHeart, name: "Volunteer Coordinator", desc: "Outreach, scheduling, community impact." },
    { icon: Sparkles, name: "Creative Director", desc: "Concepts, mood boards, art direction." },
    { icon: Lightbulb, name: "Innovation Coach", desc: "Ideation, brainstorming, prototyping." },
    { icon: Zap, name: "Productivity Coach", desc: "Habits, focus systems, weekly reviews." },
    { icon: Star, name: "Career Coach", desc: "Resumes, interviews, salary negotiation." },
    { icon: Mic, name: "Public Speaking Coach", desc: "Speeches, delivery, stage presence." },
    { icon: Video, name: "YouTube Strategist", desc: "Hooks, scripts, thumbnails, growth." },
    { icon: Film, name: "Filmmaker", desc: "Story, shot lists, edit notes." },
    { icon: Newspaper, name: "Journalist", desc: "Story angles, interviews, fact-checking." },
    { icon: Mail, name: "Email Manager", desc: "Inbox triage, replies, follow-ups." },
    { icon: Calendar, name: "Scheduler", desc: "Meeting coordination, time blocking." },
    { icon: FileText, name: "Document Drafter", desc: "Reports, memos, polished proposals." },
    { icon: FolderKanban, name: "Operations Lead", desc: "Process design, SOPs, workflow audits." },
    { icon: BarChart3, name: "Data Analyst", desc: "Dashboards, insights, SQL help." },
    { icon: PieChart, name: "Market Researcher", desc: "Surveys, segmentation, competitive scans." },
    { icon: Calculator, name: "Accountant", desc: "Bookkeeping, expenses, tax prep." },
    { icon: Receipt, name: "Tax Advisor", desc: "Deductions, filings, planning strategies." },
    { icon: Building2, name: "Property Manager", desc: "Tenants, maintenance, rent collection." },
    { icon: Factory, name: "Manufacturing Lead", desc: "Production planning, QA, supply chain." },
    { icon: Truck, name: "Logistics Coordinator", desc: "Shipping, routes, fleet operations." },
    { icon: Hammer, name: "Contractor Helper", desc: "Estimates, scheduling, client comms." },
    { icon: Wrench, name: "Handyman Advisor", desc: "Repairs, tools, DIY walkthroughs." },
    { icon: HardHat, name: "Construction Planner", desc: "Permits, timelines, safety checks." },
    { icon: Anchor, name: "Boating Expert", desc: "Navigation, maintenance, safety." },
    { icon: Compass, name: "Adventure Guide", desc: "Hiking, camping, route planning." },
    { icon: Map, name: "Local Guide", desc: "Hidden gems, restaurants, neighborhoods." },
    { icon: Mountain, name: "Climbing Coach", desc: "Technique, training plans, gear advice." },
    { icon: Bike, name: "Cycling Coach", desc: "Training plans, nutrition, race prep." },
    { icon: Waves, name: "Swim Coach", desc: "Stroke technique, sets, race tactics." },
    { icon: Tent, name: "Camping Expert", desc: "Gear lists, sites, wilderness skills." },
    { icon: Gamepad2, name: "Gaming Coach", desc: "Strategy, mechanics, ranked climbs." },
    { icon: Puzzle, name: "Puzzle Master", desc: "Logic, riddles, brain teasers." },
    { icon: Drama, name: "Acting Coach", desc: "Auditions, scene work, character study." },
    { icon: Theater, name: "Storyteller", desc: "Plot, character arcs, world building." },
    { icon: Library, name: "Researcher", desc: "Sources, summaries, literature reviews." },
    { icon: School, name: "Study Buddy", desc: "Notes, flashcards, exam prep." },
    { icon: Microscope, name: "Lab Assistant", desc: "Protocols, data, analysis support." },
    { icon: Atom, name: "Physics Tutor", desc: "Concepts, problem sets, intuition." },
    { icon: Telescope, name: "Astronomy Guide", desc: "Stargazing plans, equipment, night sky." },
    { icon: Bug, name: "QA Engineer", desc: "Test plans, bug repros, regression suites." },
    { icon: Cpu, name: "Hardware Engineer", desc: "Circuits, embedded systems, firmware." },
    { icon: Server, name: "DevOps Engineer", desc: "CI/CD, infrastructure, observability." },
    { icon: Database, name: "Database Architect", desc: "Schema, indexing, query tuning." },
    { icon: Cloud, name: "Cloud Architect", desc: "AWS/GCP/Azure design and cost control." },
    { icon: Smartphone, name: "Mobile Developer", desc: "iOS, Android, React Native guidance." },
    { icon: Wifi, name: "Network Engineer", desc: "Routing, security, troubleshooting." },
    { icon: Bot, name: "AI Engineer", desc: "Prompt design, fine-tuning, evaluation." },
  ];
  const [query, setQuery] = useState("");
  const [openRole, setOpenRole] = useState<string | null>(null);
  const filtered = roles.filter(
    (r) => r.name.toLowerCase().includes(query.toLowerCase()) ||
           r.desc.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <section id="roles" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <SectionLabel>{t("Roles")}</SectionLabel>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
            {t("What kind of agent do you need?")}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            {t("Your agent is pre-trained for your specialty. Secure protocols built into every role.")}
          </p>
        </div>
        <div className="mt-10 max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Search roles...")}
            className="w-full rounded-full border border-border bg-background pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
          />
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.name}
                onClick={() => setOpenRole(r.name)}
                className="text-left rounded-2xl border border-border bg-background p-6 hover:border-foreground/40 transition-colors"
              >
                <Icon className="h-7 w-7 text-accent-blue" />
                <h3 className="mt-4 text-lg font-bold">{t(r.name)}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(r.desc)}</p>
              </button>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">{t("No roles match")} "{query}".</p>
        )}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {roles.length} {t("roles ready · Request a custom role anytime")}
        </p>
        <AgentCheckoutDialog
          role={openRole}
          open={openRole !== null}
          onOpenChange={(o) => !o && setOpenRole(null)}
        />
      </div>
    </section>
  );
}

function Pricing() {
  const { t } = useT();
  const [billing, setBilling] = useState<"1m" | "12m" | "24m">("12m");
  const multiplier = billing === "1m" ? 1 : billing === "12m" ? 0.5 : 0.36;
  const [checkoutPlan, setCheckoutPlan] = useState<PlanId | null>(null);
  const billingMap: Record<typeof billing, BillingId> = {
    "1m": "monthly",
    "12m": "annual",
    "24m": "2y",
  };

  return (
    <section id="pricing" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-center text-center">
          <SectionLabel>{t("Pricing")}</SectionLabel>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
            {t("Simple,")} <span className="text-accent-blue">{t("Transparent")}</span> {t("Pricing ")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("Choose your plan")}</p>

          <div className="mt-8 inline-flex rounded-xl border border-border bg-surface p-1">
            {[
              { id: "1m", label: "1 month", save: "Save 50%" },
              { id: "12m", label: "12 months", save: "Save 64%" },
              { id: "24m", label: "24 months", save: "Save 73%" },
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
          {PLANS.map((p) => {
            const price = Math.round(p.monthly * multiplier);
            return (
              <div
                key={p.name}
                className={`relative rounded-2xl p-8 border transition-all flex flex-col ${
                  p.highlight
                    ? "border-foreground bg-background shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]"
                    : "border-border bg-background hover:border-foreground/40"
                }`}
              >
                {p.tag && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      p.highlight ? "bg-foreground text-background" : "bg-muted text-foreground"
                    }`}>
                      {t(p.tag)} {p.highlight && "⭐"}
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-extrabold">{p.name}</h3>
                <div className="mt-2 text-sm text-muted-foreground">{t(p.description)}</div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight">€{price}</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                </div>
                {billing !== "1m" && (
                  <div className="mt-1 text-sm text-muted-foreground line-through">
                    €{p.monthly}/mo
                  </div>
                )}
                <ul className="mt-6 space-y-3 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check className="h-4 w-4 mt-0.5 text-accent-blue shrink-0" />
                      <span>{t(f)}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setCheckoutPlan(p.name.toLowerCase() as PlanId)}
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
        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t("Monthly conversation allocation resets each billing cycle. Unused conversations don't roll over.")}
        </p>
        <AgentCheckoutDialog
          role={null}
          open={checkoutPlan !== null}
          onOpenChange={(o) => !o && setCheckoutPlan(null)}
          initialPlan={checkoutPlan ?? "plus"}
          initialBilling={billingMap[billing]}
        />
      </div>
    </section>
  );
}

function Privacy() {
  const { t } = useT();
  return (
    <section id="privacy" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 grid lg:grid-cols-2 gap-12">
        <div>
          <SectionLabel>{t("Privacy")}</SectionLabel>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
            {t("Your data stays")} <span className="text-accent-blue">{t("yours")}</span>.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg leading-relaxed">
            {t("Every agent runs on a private dedicated server you control. No data sharing. No training on your conversations. Take everything with you.")}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 self-center">
          {[
            { icon: Shield, t: "Private server", d: "Dedicated infrastructure for every agent." },
            { icon: Lock, t: "Encrypted at rest", d: "All memory and knowledge fully encrypted." },
            { icon: Check, t: "GDPR ready", d: "Full data export and deletion controls." },
            { icon: X, t: "No lock-in", d: "Export your data instantly, anytime." },
          ].map((b) => (
            <div key={b.t} className="rounded-xl border border-border bg-surface p-5">
              <b.icon className="h-5 w-5 text-accent-blue" />
              <div className="mt-3 font-bold">{t(b.t)}</div>
              <div className="mt-1 text-sm text-muted-foreground">{t(b.d)}</div>
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
    { q: "How fast can I get an agent live?", a: "Under a minute after payment. The agent appears directly in your Telegram or WhatsApp." },
    { q: "Where does my agent run?", a: "On a private dedicated server provisioned just for you — never shared." },
    { q: "Can I customize the role?", a: "Yes. Pick from 80+ presets, or build your own from a system prompt and knowledge base." },
    { q: "What about voice calls?", a: "The Elite plan includes voice. Other plans are text only on Telegram or WhatsApp." },
  ];
  return (
    <section id="faq" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <SectionLabel>{t("FAQ")}</SectionLabel>
        <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
          {t("Questions, answered.")}
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
          {t("Your AI agent.")} <span className="text-accent-blue">{t("Live in seconds")}.</span>
        </h2>
        <div className="mt-10 flex justify-center gap-3">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-6 py-3.5 text-sm font-semibold hover:bg-foreground/90 transition-colors"
          >
            {t("Get your agent")} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Pricing />
        <Integrations />
        <HowItWorks />
        <Roles />
        <Privacy />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
