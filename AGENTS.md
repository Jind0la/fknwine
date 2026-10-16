# AGENTS.md — FKN Wine

## Projekt-Betrieb (verbindlich)

- **War Room:** `docs/WAR_ROOM.md` — vor der Arbeit lesen, nach der Arbeit
  eigenen Teil aktualisieren. Unter ~150 Zeilen halten (Arbeitsgedächtnis,
  kein Session-Protokoll).
- **Zwischenstands-Pflicht:** bei Tasks >5 Tool-Calls mindestens ein
  Zwischenstand im War Room, bevor das Endergebnis gemeldet wird.
- **Öffentliche Änderungen:** Feature-Branch → lokal bauen → Live-Preview
  (Hermes-Pane / `npm run preview`) → erst nach Blick mergen (Nimar-Regel:
  „Ohne Vorschau merge ich garnichts").
- Projektordner: `~/Workspace/projects/19-fknwine` (Desktop-Projekt `fknwine`).

### Domain-Regel (Root-Cause-Fix 2026-10-14)

- Die Live-Domain ist **https://fknwine.com**. Die einzig erlaubte Quelle ist
  `site` in `astro.config.mjs` → alles andere leitet daraus ab
  (`Astro.site`, Canonical per Default aus `Astro.url.pathname`).
- **Nie `pages.dev` oder eine Domain hartcodieren** — genau das hat Canonical,
  og:url, JSON-LD, Sitemap und RSS auf die Preview-Domain gedreht.
- Canonicals brauchen den **Trailing Slash**: Cloudflare Pages leitet `/x`
  per 308 auf `/x/` um.

## Projekt-Kontext

FKN Wine ist eine englischsprachige, anti-snob Wein-Medienmarke (US-first):
**Deals + Data + Voice**. Ziel: Leser finden ehrliche Wein-Deals und
Kaufentscheidungen (Wein-Clubs, Shops) — Monetarisierung über Affiliate
(Clubs $20–50/Signup, Shops 4–12 %), später Newsletter-Sponsoring.
Voice: direkt, respektlos, konkret. Kein Sommelier-Jargon.
**Nie Fake-Reviews, nie erfundene Verkostungen — Meinung wird als Meinung
markiert.** Konzept: KB `~/Workspace/notes/50-projects/projects/prj-fknwine-monetarisierung.md`.

## Monetarisierungs-Regeln

- Ausgehende Shop-Links NUR über `outUrl()` aus `src/data/merchants.ts`
  (ein Swap-Point für Affiliate-Templates, sobald Konten stehen).
- **Amazon zahlt 0 % auf Alkohol** — nie als Einnahme planen (Zubehör 3–4 %).
- `AFFILIATE_LIVE` in `src/config.ts` auf `true`, sobald Tracking-Links live
  sind (schaltet die Footer-Disclosure). FTC-Disclosure: `/disclosure/`.
- Preise/Angebote immer am Merchant prüfen und mit Datum („Checked …") versehen.

## Tech Stack

- Astro 7 (SSG), Tailwind CSS 4 (Vite Plugin), Content Collections
- Deployed auf Cloudflare Pages via GitHub (Jind0la/fknwine)
- Neubrutalist Design: Space Grotesk + Inter, Dark Mode (#0a0a0a / #c41e3a / #ffd23f)

## Content-System

- **Club-Reviews:** `src/content/clubs/*.md` (Frontmatter: name, verdict,
  priceFrom, perBottle, commitment, cancelTerms, shipsTo, pros, cons,
  lastChecked) → `/wine-clubs/<id>/`. Prinzip: „Wir lesen das Kleingedruckte."
  Keine Tasting-Claims; was wir nicht geprüft haben, steht als solches drin.
- **Guides:** `src/content/guides/*.md` (title, description, category, updated)
  → `/guides/<id>/`.
- **Deals:** `src/data/deals.ts` (strukturiert, später Cron-Refresh) → `/deals/`.
  Jeder Deal: `checked`-Datum, ggf. `expires`/`code`, ehrliche Einordnung.
- **Voice-Regeln (EN):** konkret statt vage („$44.95 for 6 bottles", nie
  „great value"); Preise + Terme nennen; Meinung als Meinung; keine
  Werbe-Sprache; Anti-Snob-Haltung. X: `@FKNWine` frei nutzbar (Skill `xurl`),
  Cadence organisch ohne Follow-Churn (Alt-Fehler Juli 2026: de-indexiert).

## Design-System

- `var(--color-primary)` = Rot (#c41e3a) — Akzente, Borders, Shadows
- `var(--color-cta)` = Gelb (#ffd23f) — Buttons, Call-to-Action
- `.brutal-card` = Bordered Box mit Shadow · `.brutal-btn` = CTA mit Hover-Shift
- `.wrapper` = max-width 1100px Container · `.article-content` = Fließtext-Styles

## Deployment

```bash
npm run build         # → dist/
git push origin main  # → Cloudflare Pages auto-deploy
```

Kein Wrangler-Token nötig — Cloudflare Pages ist mit GitHub verbunden.
