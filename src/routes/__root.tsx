import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { I18nProvider } from "@/lib/i18n";
import { ScrollToTop } from "@/components/ScrollToTop";
import logoUrl from "@/assets/agentos247-logo.png";
import faviconUrl from "@/assets/favicon.png";
import appleTouchIconUrl from "@/assets/apple-touch-icon.png";

const SHARE_DESCRIPTION =
  "Your Agent Operating System. Enterprise-grade secured AI agent operating system in your own private dedicated server, ready to work for you. No technical setup. No system configuration.";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AgentOS 24/7 — AI Expert / Assistant Live in Seconds" },
      { name: "description", content: SHARE_DESCRIPTION },
      { name: "author", content: "AgentOS 24/7" },
      { property: "og:title", content: "AgentOS 24/7 — AI Expert / Assistant Live in Seconds" },
      { property: "og:description", content: SHARE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:image", content: logoUrl },
      { property: "og:image:alt", content: "AgentOS 24/7" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "AgentOS 24/7 — AI Expert / Assistant Live in Seconds" },
      { name: "twitter:description", content: SHARE_DESCRIPTION },
      { name: "twitter:image", content: logoUrl },
    ],
    links: [
      {
        rel: "icon",
        href: faviconUrl,
        type: "image/png",
      },
      {
        rel: "icon",
        href: faviconUrl,
        type: "image/png",
      },
      {
        rel: "apple-touch-icon",
        href: appleTouchIconUrl,
        sizes: "180x180",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <Outlet />
        <ScrollToTop />
      </I18nProvider>
    </QueryClientProvider>
  );
}
