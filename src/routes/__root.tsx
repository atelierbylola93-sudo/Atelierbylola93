import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { getBusinessHoursPublic, getCataloguePublic } from "../lib/availability.functions";
import type { JourOuverture } from "../lib/opening-hours";
import type { PrestationBase } from "../lib/catalogue";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette page n’existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          La page n’a pas pu se charger
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Une erreur est survenue. Réessayez ou revenez à l’accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Retour à l’accueil
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
      { title: "L'Atelier by Lola | Head Spa Japonais & Institut de Beauté au Pré-Saint-Gervais" },
      { name: "description", content: "Découvrez L'Atelier by Lola au Pré-Saint-Gervais (93). Head Spa japonais, soins du visage signature, Browlift, lissages, blanchiment dentaire et épilation longue durée IPL dans un boudoir luxueux." },
      { name: "author", content: "L'Atelier by Lola" },
      { property: "og:title", content: "L'Atelier by Lola | Head Spa Japonais & Institut de Beauté au Pré-Saint-Gervais" },
      { property: "og:description", content: "Découvrez L'Atelier by Lola au Pré-Saint-Gervais (93). Head Spa japonais, soins du visage signature, Browlift, lissages, blanchiment dentaire et épilation longue durée IPL dans un boudoir luxueux." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@latelierbylola" },
      { name: "twitter:title", content: "L'Atelier by Lola | Head Spa Japonais & Institut de Beauté au Pré-Saint-Gervais" },
      { name: "twitter:description", content: "Découvrez L'Atelier by Lola au Pré-Saint-Gervais (93). Head Spa japonais, soins du visage signature, Browlift, lissages, blanchiment dentaire et épilation longue durée IPL dans un boudoir luxueux." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=1200" },
      { name: "twitter:image", content: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=1200" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
      },
    ],
  }),
  // Les horaires sont chargés une fois pour toute l'application : le pied de
  // page, le bloc contact et les données structurées y puisent. Un échec ne
  // doit jamais empêcher le site de s'afficher — on rend alors une liste vide
  // et chaque composant retombe sur son texte de repli.
  loader: async (): Promise<{ hours: JourOuverture[]; catalogue: PrestationBase[] }> => {
    // Les deux lectures sont indépendantes : un catalogue indisponible ne doit
    // pas priver le site de ses horaires, et inversement. Chacune retombe sur
    // une liste vide, que les composants savent interpréter.
    const [hours, catalogue] = await Promise.all([
      getBusinessHoursPublic()
        .then((r) => r.hours as JourOuverture[])
        .catch((error) => {
          console.error('[horaires] lecture impossible', error);
          return [] as JourOuverture[];
        }),
      getCataloguePublic()
        .then((r) => r.catalogue as PrestationBase[])
        .catch((error) => {
          console.error('[catalogue] lecture impossible', error);
          return [] as PrestationBase[];
        }),
    ]);
    return { hours, catalogue };
  },
  staleTime: 5 * 60 * 1000,
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only">Aller au contenu</a>
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
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
