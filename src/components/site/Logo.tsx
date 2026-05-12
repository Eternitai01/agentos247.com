import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/agentos247-logo.png";

export function Logo({
  showTagline = false,
  size = "lg",
}: {
  showTagline?: boolean;
  size?: "sm" | "lg";
}) {
  return (
    <Link to="/" className="inline-flex flex-col items-start leading-none group">
      <img
        src={logoUrl}
        alt="AgentOS 24/7"
        className={
          size === "sm"
            ? "h-16 md:h-20 w-auto object-contain -ml-5 md:-ml-6 -mb-3"
            : "h-24 md:h-28 w-auto object-contain"
        }
      />
      {showTagline && (
        <span className="text-[0.65rem] text-muted-foreground tracking-wide mt-0.5">
          Powered by Ai2me
        </span>
      )}
    </Link>
  );
}
