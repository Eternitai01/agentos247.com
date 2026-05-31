import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, Loader2 } from "lucide-react";
import { useT } from "@/lib/i18n";

const PLANS = [
  { id: "starter", name: "Starter", monthly: 107, channel: "Telegram", description: "Good for starting" },
  { id: "pro", name: "Pro", monthly: 181, channel: "Telegram + WhatsApp", description: "Best for growing businesses" },
  { id: "business", name: "Business", monthly: 367, channel: "Telegram + WhatsApp", description: "Full power" },
] as const;

const BILLING = [
  { id: "1m", label: "1 month", save: "save 50%", mult: 0.5 },
  { id: "12m", label: "12 months", save: "save 64%", mult: 0.36 },
  { id: "24m", label: "24 months", save: "save 73%", mult: 0.27 },
] as const;

export type BYOKPlanId = typeof PLANS[number]["id"];
export type BYOKBillingId = typeof BILLING[number]["id"];

const GUARDIAN_PRICE = 19;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPlan?: BYOKPlanId;
  initialBilling?: BYOKBillingId;
};

export function BYOKCheckoutDialog({
  open,
  onOpenChange,
  initialPlan = "pro",
  initialBilling = "1m",
}: Props) {
  const { t } = useT();
  const [billing, setBilling] = useState<BYOKBillingId>(initialBilling);
  const [plan, setPlan] = useState<BYOKPlanId>(initialPlan);
  const [guardian, setGuardian] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [telegramId, setTelegramId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setBilling(initialBilling);
      setPlan(initialPlan);
      setLoading(false);
    }
  }, [open, initialBilling, initialPlan]);

  const mult = BILLING.find((b) => b.id === billing)?.mult ?? 1;
  const selectedPlan = PLANS.find((p) => p.id === plan)!;
  const planPrice = Math.round(selectedPlan.monthly * mult);
  const total = useMemo(() => planPrice + (guardian ? GUARDIAN_PRICE : 0), [planPrice, guardian]);

  const handleCheckout = useCallback(async () => {
    if (loading) return;
    if (!email || !agreed) return;
    setLoading(true);
    try {
      const billingInfo = BILLING.find((b) => b.id === billing)!;
      const months = billingInfo.id === "1m" ? 1 : billingInfo.id === "12m" ? 12 : 24;

      const res = await fetch("/api/agentos247/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          plan: plan,
          type: "byok",
          duration: months,
          channel: "telegram",
          api_key: apiKey.trim() || undefined,
          agent_name: agentName.trim() || undefined,
          dante: guardian,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `API error ${res.status}`);
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL in response");
      }
    } catch (err) {
      console.error("[Checkout Error]", err);
      alert(err instanceof Error ? err.message : "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, email, agreed, billing, plan, guardian, agentName, apiKey]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[96vh] overflow-hidden bg-background border-border p-0 gap-0">
        {/* Header */}
        <div className="bg-background rounded-t-lg px-5 pt-3 pb-3 border-b border-border">
          <DialogHeader className="space-y-1 text-center items-center">
            <div className="flex items-center justify-center gap-2">
              <div className="text-[11px] font-extrabold tracking-tight">
                AgentOS<span className="text-accent-blue">24/7</span>
                <span className="ml-1 text-[8px] font-bold text-muted-foreground tracking-widest">BYOK</span>
              </div>
              <span className="inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                {t(selectedPlan.name)}
              </span>
            </div>
            <DialogTitle asChild>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-base font-bold align-top">€</span>
                <span className="text-3xl font-extrabold tracking-tight leading-none">{planPrice}</span>
                <span className="text-xs text-muted-foreground">/mo</span>
                <span className="ml-2 text-[11px] text-muted-foreground">{t(selectedPlan.description)}</span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {BILLING.map((b) => (
              <button
                key={b.id}
                onClick={() => setBilling(b.id)}
                className={`rounded-md px-2 py-1.5 text-[11px] font-semibold border transition-colors ${
                  billing === b.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-surface text-foreground/70 hover:text-foreground"
                }`}
              >
                <div>{t(b.label)}</div>
                <div className="text-[9px] opacity-70 font-medium">{t(b.save)}</div>
              </button>
            ))}
          </div>

          <div className="mt-1.5 grid grid-cols-3 gap-1.5">
            {PLANS.map((p) => {
              const price = Math.round(p.monthly * mult);
              const selected = plan === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlan(p.id)}
                  className={`rounded-md px-2 py-2 text-center border transition-colors ${
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-surface text-foreground/70 hover:text-foreground"
                  }`}
                >
                  <div className="text-xs font-bold">{t(p.name)}</div>
                  <div className="text-[10px] opacity-80">€{price}/mo</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-3 space-y-2 overflow-y-auto">
          <button
            onClick={() => setGuardian((g) => !g)}
            className="w-full flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5 text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className={`relative h-5 w-9 rounded-full transition-colors ${guardian ? "bg-primary" : "bg-muted"}`}>
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                    guardian ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
              <div>
                <div className="text-xs font-bold">{t("Add Dante Guardian")}</div>
                <div className="text-[10px] text-muted-foreground">{t("24/7 agent monitoring + alerts +€")}{GUARDIAN_PRICE}/mo</div>
              </div>
            </div>
          </button>

          <div className="text-[11px] font-semibold text-emerald-500">
            ✅ {t("Includes")} {t(selectedPlan.channel)}
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{t("Agent Name (optional)")}</label>
            <input
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="e.g. Alex, Maya, Jordan"
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{t("Agent Gender")}</label>
            <div className="mt-1 grid grid-cols-2 gap-1.5">
              {(["male", "female"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`rounded-md py-1.5 text-xs font-semibold border transition-colors capitalize ${
                    gender === g
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-surface text-foreground/70"
                  }`}
                >
                  {t(g)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              {t("Your Telegram ID")} <span className="font-normal normal-case">{t("(optional — to receive a welcome message)")}</span>
            </label>
            <input
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value.replace(/\D/g, ""))}
              placeholder="Numbers only (e.g. 490130544)"
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              <a className="text-accent-blue" href="https://t.me/chatid_echo_bot" target="_blank" rel="noreferrer">@chatid_echo_bot</a> {t("— open it in Telegram, it replies with your ID instantly")}
            </p>
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{t("Anthropic API Key")}</label>
            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              {t("Get at")} <a className="text-accent-blue" href="https://console.anthropic.com" target="_blank" rel="noreferrer">console.anthropic.com</a>
            </p>
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{t("Email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-center text-sm pt-1">
            <span className="text-muted-foreground">{t("Total:")}&nbsp;</span>
            <span className="font-extrabold">€{total}/mo</span>
          </div>

          <label className="flex items-start gap-2 text-[11px] text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 accent-primary cursor-pointer"
            />
            <span>
              {t("I agree to the")}{" "}
              <a href="https://agentos247.com/terms/" target="_blank" rel="noreferrer" className="text-accent-blue underline">{t("Terms of Service")}</a>{" "}
              {t("and")}{" "}
              <a href="https://agentos247.com/privacy/" target="_blank" rel="noreferrer" className="text-accent-blue underline">{t("Privacy Policy")}</a>
            </span>
          </label>

          <button
            disabled={!email || !agreed || loading}
            onClick={handleCheckout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> {t("Processing...")}</>
            ) : (
              <>{t("Continue to payment")} <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}