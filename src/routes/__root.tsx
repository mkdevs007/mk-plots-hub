import { useEffect } from "react";
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

  const isChunkLoadError = 
    error?.message?.includes("Failed to fetch dynamically imported module") ||
    error?.message?.includes("Importing a module script failed") ||
    error?.message?.includes("dynamic import");

  useEffect(() => {
    if (isChunkLoadError) {
      const lastReload = sessionStorage.getItem("last-chunk-reload");
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem("last-chunk-reload", now.toString());
        window.location.reload();
      }
    }
  }, [isChunkLoadError]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground font-display">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>

        {isDev && (
          <div className="mt-6 p-5 rounded-xl border border-destructive/20 bg-destructive/5 text-left font-mono text-xs overflow-auto max-h-64 shadow-md">
            <div className="text-destructive font-bold mb-2">Dev Mode Error Details:</div>
            <div className="text-foreground/90 font-semibold">{error?.name}: {error?.message}</div>
            {error?.stack && (
              <pre className="mt-3 text-[10px] text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 cursor-pointer"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent cursor-pointer"
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
      {
        title:
          "MK Builders & Developers — True, Trusted, Transparent | Premium Plots & Layouts in Karnataka",
      },
      {
        name: "description",
        content:
          "RERA-approved residential, commercial, farm land & industrial plots across Bangalore, Mysore, Hubli & Tumkur. Own your future, plot by plot.",
      },
      { name: "author", content: "MK Builders & Developers" },
      { name: "google-site-verification", content: "4oZEtZ8YGN8zvxHntshVLmjGzm5wE8det1VEyuim4s8" },
      {
        property: "og:title",
        content: "MK Builders & Developers — Premium Plots & Layouts in Karnataka",
      },
      { property: "og:description", content: "RERA-approved plots across Karnataka." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "MK Builders & Developers" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-QZVRQEXYG9",
        async: true,
      },
      {
        children: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-QZVRQEXYG9');`,
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Tanker&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Anek+Kannada:wght@400;500;600&display=swap",
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
      <Outlet />
    </QueryClientProvider>
  );
}
