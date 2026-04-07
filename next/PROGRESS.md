# Relactivity refonte — état d'avancement

Plan complet : `~/.claude/plans/declarative-forging-raven.md`

## Décisions validées

- **Stack** : Next.js 16 (App Router) + React 19 + TS strict + Tailwind v4 + shadcn/ui
- **DB** : Postgres via Supabase (free tier), ORM **Drizzle**
- **Auth** : **Supabase Auth** (email/password + Google), RLS Postgres
- **Maps** : on garde Google Maps via `@vis.gl/react-google-maps` (officiel)
- **Calendrier** : on garde FullCalendar 6
- **Multi-user** : trips partagés dès le départ (table `trip_members` + RLS)
- **Pas de migration de données** depuis Firebase — on repart d'une base vide
- **Emplacement** : sous-dossier `next/` du repo actuel ; branche `legacy` figée sur master pré-refonte
- **Hébergement cible** : Vercel + Supabase (free)

## Étapes

| # | Étape | Statut |
|---|---|---|
| 1 | Bootstrap Next.js + tooling (Prettier, Vitest, Playwright) | ✅ |
| 2 | Wire Supabase (env, helpers `@supabase/ssr`, middleware Next) | 🔄 en cours |
| 3 | Drizzle schema + migrations + RLS policies | ⏳ |
| 4 | shadcn/ui init + composants de base | ⏳ |
| 5 | Auth pages signin/signup + layout protégé `(app)` | ⏳ |
| 6 | CRUD Trips (liste, création, détail) | ⏳ |
| 7 | Calendrier `<TripCalendar/>` + Server Actions activities | ⏳ |
| 8 | Carte `<TripMap/>` + Places (POI selection) | ⏳ |
| 9 | Directions API server route + table `routes` | ⏳ |
| 10 | Partage trips (membres, invitations) | ⏳ |
| 11 | Tests Vitest + Playwright e2e | ⏳ |
| 12 | CI GitHub Actions + deploy Vercel | ⏳ |

## État détaillé étape 2 (en cours)

**Fait** :
- `next/.env.local` créé (gitignored) avec :
  - `NEXT_PUBLIC_SUPABASE_URL=https://jwdyipzzrftxqcnsgzzg.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (présente)
  - `SUPABASE_SERVICE_ROLE_KEY` (présente)
- Project ref Supabase : `jwdyipzzrftxqcnsgzzg`

**Manque dans `.env.local`** :
- `DATABASE_URL` (pooler port 6543) — besoin de la **région AWS**
- `DIRECT_URL` (port 5432) — idem
- `GOOGLE_MAPS_API_KEY` — à recopier depuis l'ancien projet legacy

**À faire dans cette étape** :
- Récupérer la région via le MCP Supabase (au redémarrage)
- Remplir `DATABASE_URL` / `DIRECT_URL`
- `pnpm add @supabase/ssr @supabase/supabase-js`
- Créer `src/lib/supabase/{server,client,middleware}.ts`
- Créer `src/middleware.ts` pour rafraîchir la session côté Next

⚠️ **Sécurité** : la `service_role` key et le mot de passe DB ont été collés dans le chat précédent. **À rotater** dans Supabase une fois la mise en place terminée (Settings → API + Settings → Database).

## Reprise après redémarrage

Dire à Claude :
> "On reprend la refonte Relactivity. Lis `~/.claude/plans/declarative-forging-raven.md` et `next/PROGRESS.md`, puis continue à l'étape 2 (Supabase). Le MCP Supabase est maintenant dispo, utilise-le pour récupérer la région et la connection string du projet `jwdyipzzrftxqcnsgzzg`."

## Notes importantes

- Next.js **16** a des **breaking changes** par rapport à Next 15. Cf. `next/AGENTS.md` : toujours consulter `next/node_modules/next/dist/docs/01-app/` avant d'écrire du code Next-spécifique (routes, server actions, middleware, RSC).
- Code legacy à consulter pour porter les features :
  - [src/Core.jsx](../src/Core.jsx) — forme des données trip + activities
  - [src/components/calendar/ActivitiesCalendar.jsx](../src/components/calendar/ActivitiesCalendar.jsx) — config FullCalendar
  - [src/components/space/Carte.jsx](../src/components/space/Carte.jsx) — markers, polylines, coloration jours
  - [src/components/calendar/finder/DirectionFinder.js](../src/components/calendar/finder/DirectionFinder.js) — Directions API
  - [src/components/auth/UserContext.js](../src/components/auth/UserContext.js) — auth Firebase à remplacer
