# L'Atelier by Lola

Site web officiel et plateforme de réservation de **L'Atelier by Lola**, institut de beauté et bien-être haut de gamme situé au Pré-Saint-Gervais (93).

- **Domaine de production** : `https://latelierbylola.fr`
- **Spécialités** : Head Spa japonais thermal, Soins du visage signature, Coiffure & Lissages experts, Beauté du regard (Browlift, rehaussement), Épilation longue durée IPL, Blanchiment dentaire esthétique, Soins corps aux algues.

---

## 🛠️ Stack Technique

- **Framework Full-Stack** : [TanStack React Start](https://tanstack.com/start) avec [Nitro](https://nitro.build/) & [TanStack Router](https://tanstack.com/router)
- **Rendu** : **SSR (Server-Side Rendering)** pour un référencement optimal par Googlebot
- **UI & Styles** : [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), Radix UI Primitives, Lucide Icons, Framer Motion
- **Base de données & Auth** : [Supabase](https://supabase.com/) (gestion des créneaux, réservations, horaires d'ouverture)
- **Validation** : Zod & React Hook Form
- **Hébergement cible** : [Vercel](https://vercel.com/) (Output API v3 serverless)

---

## 🚀 Démarrage Local

### Prérequis
- **Node.js** : 20.x ou 24.x (recommandé v24.x)
- **npm** : v10+

### Installation
```bash
npm install
```

### Développement
Lancer le serveur de développement local :
```bash
npm run dev
```
L'application est accessible sur `http://localhost:3000`.

### Scripts Disponibles
- `npm run dev` : Lance le serveur Vite en mode développement avec HMR.
- `npm run build` : Compile l'application pour la production (client + serveur SSR Nitro).
- `npm run typecheck` : Vérifie les types TypeScript (`tsc --noEmit`).
- `npm run lint` : Analyse le code avec ESLint.
- `npm run preview` : Prévisualise le build de production localement.

---

## ☁️ Déploiement sur Vercel

### 1. Variables d'Environnement
Dans votre tableau de bord **Vercel** (`Settings > Environment Variables`), configurez les clés suivantes :

| Variable | Description | Exemple |
|---|---|---|
| `VITE_SITE_URL` | URL publique de production | `https://latelierbylola.fr` |
| `VITE_SUPABASE_URL` | URL de votre instance Supabase | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clé publique anonyme Supabase | `sb_publishable_...` |
| `SUPABASE_URL` | URL Supabase (côté serveur) | `https://xxxx.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | Clé Supabase (côté serveur) | `sb_publishable_...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé secrète d'administration Supabase | `eyJh...` |

### 2. Paramètres de Build Vercel
- **Framework Preset** : `TanStack Start` (ou `Other`)
- **Build Command** : `npm run build`
- **Output Directory** : Sélection automatique par Vercel (détecte `.vercel/output` ou `.output`)
- **Node.js Version** : `24.x` ou `20.x`

---

## 🔍 Référencement & SEO Googlebot

Le site est optimisé pour les moteurs de recherche :
- **Server-Side Rendering (SSR)** : le HTML complet avec balises sémantiques et métadonnées est immédiatement accessible aux robots d'indexation sans nécessiter l'exécution de JavaScript côté client.
- **Métadonnées dynamiques** : `title`, `description`, balises OpenGraph et Twitter Cards uniques pour chaque prestation.
- **Données structurées JSON-LD** : Schema `BeautySalon` avec géolocalisation, horaires et avis.
- **Sitemap & Robots** : `public/sitemap.xml` indexe l'ensemble des pages de services avec priorités et fréquences, et `public/robots.txt` autorise les robots tout en protégeant les interfaces d'administration (`/admin`, `/login`).
