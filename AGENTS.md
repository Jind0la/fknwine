# AGENTS.md — FKN Wine

## Projekt-Betrieb (verbindlich)

- **War Room:** `docs/WAR_ROOM.md` — vor der Arbeit lesen, nach der Arbeit
  eigenen Teil aktualisieren. Unter ~150 Zeilen halten (Arbeitsgedächtnis,
  kein Session-Protokoll).
- **Zwischenstands-Pflicht:** bei Tasks >5 Tool-Calls mindestens ein
  Zwischenstand im War Room, bevor das Endergebnis gemeldet wird.
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

FKN Wine ist ein autonomer Affiliate-Wein-Blog. Zielgruppe: Deutsche die Wein trinken ohne Snob-Getue.
Voice: direkt, anti-elitär, "F*ck Nice Wine". Kein Sommelier-Jargon.

## Tech Stack

- Astro 7 (SSG), Tailwind CSS 4 (Vite Plugin)
- Deployed auf Cloudflare Pages via GitHub (Jind0la/fknwine)
- Neubrutalist Design: Space Grotesk + Inter, Dark Mode (#0a0a0a / #c41e3a / #ffd23f)

## Artikel-Schreiben

Articles sind `.astro`-Dateien unter `src/pages/artikel/`. Template:

1. Frontmatter: title, date, description, tags
2. Inhalt: `<p>` für Fließtext, `<h2>`/`<h3>` für Struktur, `<blockquote>` für Einschübe
3. Wein-Empfehlungen immer mit: Name, Preis, Store, direkter Link
4. CTA-Buttons: `class="brutal-btn"` mit Link zum Produkt
5. Footer: Outro mit Teaser für nächsten Artikel

**Voice-Regeln:**
- Kein "man könnte", kein "es bietet sich an" → direkte Empfehlungen
- Preise nennen, Stores nennen, konkret sein
- "Geil" statt "hervorragend", "scheiße" statt "weniger gelungen"
- Kein Passiv, kein Konjunktiv

## Design-System

- `var(--color-primary)` = Rot (#c41e3a) — Akzente, Borders, Shadows
- `var(--color-cta)` = Gelb (#ffd23f) — Buttons, Call-to-Action
- `.brutal-card` = Bordered Box mit Shadow (Artikel-Karten)
- `.brutal-btn` = CTA Button mit Hover-Shift
- `.wrapper` = max-width 1100px Container

## Deployment

```bash
npm run build    # → dist/
git push origin main  # → Cloudflare Pages auto-deploy
```

Kein Wrangler-Token nötig — Cloudflare Pages connected zu GitHub.
