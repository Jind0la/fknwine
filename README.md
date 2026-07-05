# FKN Wine 🍷

**F*ck Nice Wine.** Ehrliche Wein-Empfehlungen ohne Snob-Getue. Welcher Supermarkt-Wein ist wirklich gut? Find's raus.

## Was ist das?

Ein autonomer Affiliate-Wein-Blog für Deutsche die Wein trinken wollen ohne Sommelier zu werden. Keine €80-Bordeaux-Empfehlungen. Kein "Noten von nasser Schieferplatte"-Gelaber. Nur: **Schmeckt geil. Kostet wenig. Kauf das.**

## Tech

- **Astro 7** — Static Site Generation
- **Tailwind CSS 4** — Utility-first (Vite plugin)
- **Neubrutalist Design** — Space Grotesk + Inter, Dark Mode
- **Cloudflare Pages** — Hosting & Auto-Deploy via GitHub

## Struktur

```
src/
├── layouts/
│   ├── Layout.astro        # Base layout (nav, footer, SEO)
│   └── ArticleLayout.astro # Article wrapper
├── pages/
│   ├── index.astro         # Homepage mit Artikelliste
│   ├── impressum.astro
│   ├── datenschutz.astro
│   └── artikel/
│       ├── beste-weine-unter-10-euro-supermarkt.astro
│       ├── aldi-lidl-edeka-wein-vergleich.astro
│       └── wein-fuer-pizza.astro
└── styles/
    └── global.css          # Neubrutalist Design System
```

## Deployment

Push auf `main` → Cloudflare Pages baut und deployed automatisch.

```bash
npm run build    # Produktion-Build nach dist/
npm run dev      # Lokaler Dev-Server :4321
npm run preview  # Build-Vorschau lokal
```

## Roadmap

- [x] 3 Artikel live (Supermarkt-Weine, Discounter-Vergleich, Pizza-Wein)
- [x] Favicon & OG-Images
- [x] Newsletter-Integration (Buttondown)
- [ ] Affiliate-Links (Awin/Adcell)
- [ ] Artikel-Cron (freitags auto-publishen)
- [ ] X-Thread-Automation
- [ ] Cloudflare Web Analytics
