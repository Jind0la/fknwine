# AGENTS.md — FKN Wine

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
