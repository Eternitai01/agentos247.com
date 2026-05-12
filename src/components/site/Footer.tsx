import { Logo } from "./Logo";
import { useT } from "@/lib/i18n";

export function Footer() {
  const { t } = useT();
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5 flex flex-col gap-3">
          <Logo showTagline size="sm" />
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            {t("Enterprise-grade AI agents on your own infrastructure. Private, secure, and fully under your control.")}
          </p>
        </div>

        <div className="md:col-span-3">
          <div className="text-xs font-bold tracking-widest text-foreground uppercase mb-3">{t("Product")}</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/#pricing" className="hover:text-foreground">{t("Pricing")}</a></li>
            <li><a href="/byok" className="hover:text-foreground">{t("BYOK")}</a></li>
            <li><a href="https://sports.agentos247.com" className="hover:text-foreground">{t("Sports")}</a></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="text-xs font-bold tracking-widest text-foreground uppercase mb-3">{t("Legal")}</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="https://agentos247.com/terms/" target="_blank" rel="noreferrer" className="hover:text-foreground">{t("Terms & Conditions")}</a></li>
            <li><a href="https://agentos247.com/privacy/" target="_blank" rel="noreferrer" className="hover:text-foreground">{t("Privacy Policy")}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} AgentOS 24/7. {t("All rights reserved.")}
        </div>
      </div>
    </footer>
  );
}
