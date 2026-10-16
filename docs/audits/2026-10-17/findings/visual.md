# Visual / Mobile / Above-the-Fold Audit — fknwine.com

**Score: 78 / 100**

Reviewed with headless Chromium (Playwright) at the audit-required viewports:
desktop **1440×900** and mobile **390×844** (DSF 1). Screenshots were captured
with scroll position pinned at `scrollY = 0` for the above-the-fold ("fold")
shots. All screenshots referenced below were actually rendered in this session.

## Screenshots produced

`/Users/nimar/.hermes/cache/scratch/fknwine-audit/screenshots/` — 12 fold + 12 full-page images:

| Page | Files |
|---|---|
| Home `/` | `home__desktop__fold.png`, `home__desktop__full.png`, `home__mobile__fold.png`, `home__mobile__full.png` |
| `/deals/` | `deals__desktop__fold.png`, `deals__desktop__full.png`, `deals__mobile__fold.png`, `deals__mobile__full.png` |
| `/wine-clubs/` | `wine-clubs__desktop__fold.png`, `wine-clubs__desktop__full.png`, `wine-clubs__mobile__fold.png`, `wine-clubs__mobile__full.png` |
| `/wine-clubs/naked-wines/` | `naked-wines__desktop__fold.png`, `naked-wines__desktop__full.png`, `naked-wines__mobile__fold.png`, `naked-wines__mobile__full.png` |
| `/guides/wine-club-price-per-bottle/` | `price-per-bottle__desktop__fold.png`, `price-per-bottle__desktop__full.png`, `price-per-bottle__mobile__fold.png`, `price-per-bottle__mobile__full.png` |
| `/about/` | `about__desktop__fold.png`, `about__desktop__full.png`, `about__mobile__fold.png`, `about__mobile__full.png` |

Supporting data: per-page computed-style JSON in `../metrics/` (text/contrast, tap targets, tables, overflow).

## What works

- **Above-the-fold value proposition is strong on both viewports.** `home__desktop__fold.png` and `home__mobile__fold.png` show the eyebrow badge ("NO SNOBS. NO BULLSHIT. NO FAKE REVIEWS."), the three-line display H1 in the brand red/off-white, a plain-language subhead, and **two CTAs — "SEE TODAY'S DEALS" (yellow fill) and "WINE CLUBS, JUDGED" (yellow outline) — fully visible without scrolling** on 1440×900 *and* 390×844. On mobile both buttons sit above ~700px.
- **Heading legibility is excellent.** Display headings render 40–80px in Space Grotesk with hard offset shadows; no clipping or overlap on any captured page.
- **Contrast is clean — no body-text pair falls below 4.5:1.** Measured pairs: off-white `#fffdf5` on `#0a0a0a` = **19.4:1**; yellow `#ffd23f` on `#0a0a0a` = **13.7:1**; near-black on yellow = **13.7:1**; white on the red badge `#c41e3a` = **5.8:1**; 70%-alpha footer/nav text composites to ≈`#b6b4ae` ≈ **9.6:1**.
- **No page-level horizontal overflow anywhere.** `documentElement.scrollWidth == viewport width` on all 12 captures. The only wide child (the 4-column table) is correctly wrapped in an `overflow-x:auto` container.
- **Facts / pros / cons boxes read as intended.** `naked-wines__desktop__fold.png` and `naked-wines__mobile__full.png` show the "THE FACTS" box with yellow label column + value column, and the green-bordered "WORTH IT BECAUSE" / red-bordered "BUT KNOW THIS" pair — consistent thick borders and offset shadows, no overlap, no clipping.
- **The 3-column table on `/wine-clubs/naked-wines/` fits without scroll** on mobile (342px inside a 342px wrapper) — contrast and wrapping are fine.
- **Narrow tables / cards, newsletter box ("THE DEAL SHEET") and footer all render correctly** on mobile (`home__mobile__full.png`, `wine-clubs__mobile__full.png`).
- **Desktop table presentation is excellent** — `price-per-bottle__desktop__fold.png` shows the full 4-column table above the fold with yellow header emphasis.

## Findings

### 1. Tap targets are systematically below the 44px minimum — HIGH
- **Evidence:** `home__mobile__fold.png` (390×844) — the nav row "DEALS WINE CLUBS GUIDES ABOUT ✕" sits in a ~20px-tall band; `naked-wines__mobile__full.png` and `deals__mobile__full.png` — footer links render at 20px tall. Measured from `metrics/*__mobile.json`: nav links `44×20`, `85×20`, `51×20`, `47×20`; footer links `38×20`–`68×20`; the "GET THIS DEAL →" CTAs are `143×41` (just under 44); the brand link `117×36`. On `/deals/` **17 of 17** tappables are under 44px tall; on home **16 of 21**.
- **Recommendation:** give nav links and footer links vertical padding to reach ≥44×44 (or add an invisible expanded hit area via padding/`::after`), and lift the primary CTA buttons from 41px to ≥44px tall. Interleave ≥8px spacing between adjacent nav items.

### 2. Bare text "X" used as the X/Twitter icon in the top nav — HIGH
- **Evidence:** `home__mobile__fold.png` and `home__desktop__fold.png` — the last nav item renders as a lone glyph "✕"-looking **"X"** immediately after "ABOUT", visually indistinguishable from a *close/dismiss* button. DOM confirms it is a plain text anchor:
  `<a href="https://x.com/FKNWine" class="nav-link" title="FKN Wine on X">X</a>` — no SVG, `9×20`px measured.
- **Recommendation:** replace with a real X/Twitter brand SVG at a consistent 24×24 grid in `currentColor` (per the workspace "no Unicode/text as icon" rule) and give it a ≥44px hit area; optionally move it to the footer only.

### 3. Wide 4-column table is clipped on mobile with no scroll affordance — MEDIUM
- **Evidence:** `price-per-bottle__mobile__full.png` (region ~y 640–1400) — the table is **447px wide in a ~342px visible wrapper**, so the 4th column ("NOTES" / "Club price per shipment") is cut mid-column at the right edge with only a sliver visible. `metrics/price-per-bottle__mobile.json` confirms `overflowsViewport: true`, parent `.table-scroll { overflow-x: auto }`, and lists 10 overflowing descendants. There is **no scrollbar, edge shadow, fade, or "swipe" hint** anywhere in the image, so a first-time user has no cue that the table scrolls. The 4-line header "WHAT YOU ACTUALLY PAY PER BOTTLE" also wraps heavily and the first column ("The California Wine Club") wraps to 4 lines, making rows tall and hard to scan.
- **Recommendation:** add a visible affordance — right-edge gradient fade or a "scroll →" hint plus `scrollbar` styling — and consider a mobile-specific layout (shorten column headers, reduce to 3 columns) so the key "price per bottle" number does not require horizontal scrolling.

### 4. Many UI labels render below the 14px floor — MEDIUM
- **Evidence:** `metrics/*` — nav links and footer links **13.6px**; deal/club badges (`WTSO`, `DATA`) **12px**; the "WINERY TAKEOVER" pill and club eyebrow labels **11.2px**; meta lines ("Checked 2026-10-16", "Updated 2026-10-16") **12.8px**; the homepage eyebrow "NO SNOBS…" **12px**. Visible in `deals__mobile__fold.png` (WTSO/WINERY TAKEOVER chips) and `wine-clubs__mobile__full.png` ("DEPENDS HOW YOU DRINK" 11.2px). `/wine-clubs/` mobile has **46** text elements under 14px; `/deals/` mobile has **25**.
- **Recommendation:** raise body/meta/badge text to ≥14px on mobile (16px for anything long-form). 11.2px pill text is below any comfortable reading size on a 390px screen.

### 5. Brand red on dark background is 3.39:1 — passes only the large-text threshold — LOW
- **Evidence:** measured `#c41e3a` on `#0a0a0a` = **3.39:1**. Used on: `home__desktop__fold.png` / `home__mobile__fold.png` ("WINE", 80/40px), `about__desktop__fold.png` / `about__mobile__fold.png` ("Wine.", 48/32px), and a 24px brand period. All current uses are display-size, so they clear WCAG AA large-text (≥3.0:1) — but the margin is thin at 32px (`about__mobile`).
- **Recommendation:** treat the red as display-only; never apply it to sub-24px text or thin strokes. If a brighter red is acceptable, a slightly lighter tone (e.g. ~`#d92b47`) would reach 4.5:1 on `#0a0a0a`.

### 6. `/about/` has no above-the-fold CTA — LOW
- **Evidence:** `about__desktop__fold.png` — the fold is entirely H1 + "THE RULES WE PLAY BY" body copy; a yellow-bordered box begins only at the very bottom edge (partially cut). No action is offered until the user scrolls.
- **Recommendation:** surface a secondary CTA (e.g. "See today's deals") in or beside the About intro so the page is not a dead end above the fold.

### 7. Stray leading whitespace in the pros list — LOW (cosmetic)
- **Evidence:** `naked-wines__mobile__full.png` (~y 1050) — the first item under "WORTH IT BECAUSE" starts with an extra indent (`"  The $40 a month lands…"`), so its first line is indented further than the following items.
- **Recommendation:** trim the leading space in the list markup/CMS field.

## Limitations

- Captured and judged **only** the six URLs listed above. `/disclosure/`, `/privacy/`, `/terms/`, `/imprint/`, `/subscribed/`, `/guides/` (index), and the remaining four club pages (`firstleaf`, `winc`, `gold-medal-wine-club`, `california-wine-club`, `wine-access`) were **not rendered** — no visual conclusion is drawn about them.
- Images were captured **headless, JS-executed, after `networkidle` + a scroll-to-bottom-and-back pass**. Hover/focus states, active animations, and reduced-motion variants are not represented.
- Screenshots were taken at `deviceScaleFactor = 1`; on a real 2×/3× phone some hairline offset shadows may look thinner than shown here.
- Contrast was computed from **computed styles** (own `color` vs nearest opaque ancestor `background-color`), not from sampled pixels. Text sitting over gradients, images, or semi-transparent overlays would be mis-scored — none were observed on these six pages, but treat exact ratios as computed estimates.
- Horizontal-scroll behaviour of the mobile table was **inferred** from DOM metrics (`scrollWidth` vs wrapper width, `overflow-x: auto`); I did not perform an actual touch-swipe interaction, so the scroll is functional-by-inference, not verified by gesture.
- No real-device (iOS Safari / Android Chrome) rendering was performed; `100vh`/address-bar behaviour and font-fallback differences were not observed.
