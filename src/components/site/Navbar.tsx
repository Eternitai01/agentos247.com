import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { Logo } from "./Logo";
import { useT } from "@/lib/i18n";

type NavLink =
  | { label: string; kind: "hash"; hash: string }
  | { label: string; kind: "route"; to: "/" | "/byok" }
  | { label: string; kind: "external"; href: string };

const baseLinks: NavLink[] = [
  { label: "Home", kind: "route", to: "/" },
  { label: "How It Works", kind: "hash", hash: "how" },
  { label: "Roles", kind: "hash", hash: "roles" },
  { label: "Pricing", kind: "hash", hash: "pricing" },
  { label: "Privacy", kind: "hash", hash: "privacy" },
  { label: "FAQ", kind: "hash", hash: "faq" },
  { label: "Sports", kind: "external", href: "https://sports.agentos247.com" },
  { label: "BYOK", kind: "route", to: "/byok" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useT();
  const links = baseLinks;
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-6 h-32 md:h-36 flex items-center justify-between">
        <Logo />

        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {links.map((l) => {
            const cls = "text-foreground/80 hover:text-foreground transition-colors";
            if (l.kind === "route") {
              return (
                <Link
                  key={l.label}
                  to={l.to}
                  className={cls}
                  activeOptions={{ exact: true }}
                  activeProps={{ className: "text-foreground font-bold" }}
                >
                  {t(l.label)}
                </Link>
              );
            }
            if (l.kind === "hash") {
              return (
                <Link key={l.label} to="/" hash={l.hash} className={cls}>
                  {t(l.label)}
                </Link>
              );
            }
            return (
              <a key={l.label} href={l.href} className={cls}>
                {t(l.label)}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-foreground/80 hover:text-foreground"
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4" /> {lang === "en" ? "EN" : "ES"}
          </button>
          <Link
            to="/"
            hash="pricing"
            className="hidden sm:inline-flex items-center rounded-md bg-foreground text-background px-4 py-2 text-sm font-semibold hover:bg-foreground/90 transition-colors"
          >
            {t("Get Started")}
          </Link>
          <button
            className="lg:hidden p-2 -mr-2"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border">
          <div className="px-6 py-4 flex flex-col gap-4 text-sm font-medium">
            {links.map((l) => {
              if (l.kind === "route") {
                return (
                  <Link key={l.label} to={l.to} onClick={() => setOpen(false)}>
                    {t(l.label)}
                  </Link>
                );
              }
              if (l.kind === "hash") {
                return (
                  <Link key={l.label} to="/" hash={l.hash} onClick={() => setOpen(false)}>
                    {t(l.label)}
                  </Link>
                );
              }
              return (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                >
                  {t(l.label)}
                </a>
              );
            })}
            <button
              onClick={() => {
                setLang(lang === "en" ? "es" : "en");
              }}
              className="inline-flex items-center gap-1.5 text-sm text-foreground/80"
            >
              <Globe className="h-4 w-4" /> {lang === "en" ? "EN" : "ES"}
            </button>
            <Link
              to="/"
              hash="pricing"
              onClick={() => setOpen(false)}
              className="inline-flex w-fit items-center rounded-md bg-foreground text-background px-4 py-2 text-sm font-semibold"
            >
              {t("Get Started")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
