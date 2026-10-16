# Performance / Core Web Vitals — https://fknwine.com

**Audited:** 2026-10-17 (Europe/Berlin) · Astro 7 static build on Cloudflare Pages
**Method:** lab measurements in headless Chrome 155 (CDP throttling: Slow-4G ≈ 1.6 Mbps / 150 ms RTT + 4× CPU) on `https://fknwine.com/` (homepage) and `https://fknwine.com/wine-clubs/naked-wines/` (club review) via `browser_exec` PerformanceObserver + resource timing; response headers via `curl -sS -D -`.

## Performance score: 93 / 100 (lab)

Deductions are for caching policy (no immutable caching on hashed assets) and minor font/preload polish. All lab Core Web Vitals pass the "good" thresholds with a very large margin. Field data was **not** measurable (see Limitations).

| Metric | Measured (lab, mobile, cold + throttled) | Threshold | Status |
|---|---|---|---|
| LCP — homepage | **0.42 s** (element: `p.hero-sub`, text) | ≤2.5 s | ✅ pass |
| LCP — club review | **0.44 s** (element: `p`, text) | ≤2.5 s | ✅ pass |
| CLS — homepage | **0.00** (throttled) / 0.0141 unthrottled | ≤0.1 | ✅ pass |
| CLS — club review | **0.00** | ≤0.1 | ✅ pass |
| INP | not directly measurable in lab (no interactions); inferred good — 0 long tasks, 0 KB JS framework, DOM 115–174 elements | ≤200 ms | ✅ (inferred) |
| TTFB | 67–180 ms (Cloudflare edge, `cf-ray … -FRA`) | ≤0.8 s | ✅ pass |

## What works

- **Every lab CWV passes with huge headroom.** LCP ≤0.44 s vs a 2.5 s budget; CLS 0. Font/text LCP — no image LCP to optimise.
- **Extremely light page.** Cold throttled mobile: homepage loads in **9 requests / 75.0 KB** total; club review **6 requests / 75.5 KB**. HTML is only 4.3 KB over the wire.
- **Zero in-content images site-wide.** `<img` count is 0 on every crawled page (home, club, deals). No unsized, un-lazy, or wrong-format images exist. `public/og-default.png` (1200×630, 31.7 KB) is referenced **only** in `og:image`/`twitter:image` and is confirmed **never requested by the page** (absent from resource timing on both pages).
- **Fonts are correctly sourced and subset by unicode-range.** `@fontsource-variable/inter` + `space-grotesk` inline 10 `@font-face` rules, but the browser fetches **only the two latin subsets** (`inter-latin-wght-normal.woff2` 48.5 KB, `space-grotesk-latin-wght-normal.woff2` 22.6 KB) — no cyrillic/greek/vietnamese downloads. `font-display: swap` on all faces (10/10).
- **Brotli compression on text assets.** Homepage HTML 17 624 → **4 337 B** (−75 %); `Layout.U-e5WnxP.css` 13 650 → **3 706 B** (−73 %).
- **Third-party scripts are non-blocking and near-zero JS.** beehiiv `loader.js` + `attribution.js` are `async`; Cloudflare beacon is `type="module"`. No JS framework, **no long tasks (>50 ms) recorded**, DOM depth 5.
- **Newsletter embed reserves space** — `.nl-embed { min-height: 120px }` (NewsletterForm.astro), so the injected beehiiv iframe causes no measurable layout shift (CLS 0 on throttled runs).
- **beehiiv loader is homepage-only.** Only `crawl/01-_home.json` contains `beehiiv.com/v3/loader.js`; all other pages carry only the async `attribution.js`.
- **Native lazy behaviour:** `scroll-behavior: smooth` and no below-fold media, so nothing needs `loading="lazy"`.

## Findings

### 1. Hashed assets are not served with long-lived immutable caching — MEDIUM
- **Evidence:** every response, including content-hashed files, is `cache-control: public, max-age=0, must-revalidate`:
  ```
  $ curl -sS -D - -o /dev/null https://fknwine.com/_astro/Layout.U-e5WnxP.css | grep -i cache
  cache-control: public, max-age=0, must-revalidate
  $ curl -sS -D - -o /dev/null https://fknwine.com/_astro/inter-latin-wght-normal.Dx4kXJAl.woff2 | grep -i cache
  cache-control: public, max-age=0, must-revalidate
  ```
  Repeat visits therefore revalidate the CSS and both font files every navigation (observed as `size 300` / 304 round-trips for `Layout.css`, `inter-latin…woff2`, `space-grotesk-latin…woff2` in resource timing). There is **no `public/_headers` file** (`ls public/_headers` → not found), so Cloudflare Pages' default applies.
- **Impact:** adds a revalidation round-trip per site-wide asset on repeat visits. Immutable, content-hashed filenames (`Layout.U-e5WnxP.css`, `inter-latin-wght-normal.Dx4kXJAl.woff2`) are safe to cache forever.
- **Recommendation:** add `public/_headers`:
  ```
  /_astro/*
    Cache-Control: public, max-age=31536000, immutable
  ```

### 2. Fonts are not preloaded; no `fetchpriority` hint — LOW
- **Evidence:** `preload_check.py … --json` → `"preload_hints": 0`, `"lcp_resource_hints": {"preload_lcp_candidate": false, "fetchpriority_high": 0}`, score **50**. Fonts start downloading at ~350 ms (cold throttle) and take **417–553 ms** each.
- **Impact:** because LCP is text with `font-display: swap`, LCP is not blocked, but the swap produces a late FOUT/re-paint of the display headings. With only two latin files it is a single small win.
- **Recommendation:** add to `<head>` in `Layout.astro`:
  ```html
  <link rel="preload" as="font" type="font/woff2" crossorigin
        href="/_astro/inter-latin-wght-normal.Dx4kXJAl.woff2">
  <link rel="preload" as="font" type="font/woff2" crossorigin
        href="/_astro/space-grotesk-latin-wght-normal.BhU9QXUp.woff2">
  ```
  (Astro rewrites the hashed filenames at build; import the font CSS asset paths or use `astro:assets`/a build-time hash lookup so the URLs stay valid.)

### 3. One render-blocking external stylesheet on the critical path — LOW
- **Evidence:** `<link rel="stylesheet" href="/_astro/Layout.U-e5WnxP.css">` in `<head>` (3 706 B br / 13 650 B raw, 170 ms under throttle); component-scoped styles are already inlined (one `<style>` block: 4 574 B home / 2 224 B club).
- **Impact:** the external CSS adds one blocked round-trip before first paint. FCP == LCP == 0.42 s today, so headroom is large, but this is free to remove.
- **Recommendation:** set `build: { inlineStylesheets: 'always' }` in `astro.config.mjs` — the whole CSS payload is <15 KB raw, so inlining removes the extra request with no downside.

### 4. 71 KB of fonts = 94 % of page weight — LOW
- **Evidence:** cold throttled transfer 75.0 KB, of which `inter-latin` 48 556 B + `space-grotesk-latin` 22 588 B.
- **Impact:** the Inter variable file carries the full 100–900 weight axis although the design uses 400 (body) and 700 (headings/nav). Acceptable for a text site, but it is the single largest payload.
- **Recommendation:** subset to the weights/glyphs actually used (e.g. `glyphhanger`/`fonttools` on the variable axis), or load `@fontsource-variable/inter/wght.css` subsets only where needed. Low priority — current weight is already well within budget.

### 5. beehiiv third-party runtime on the homepage — LOW / INFO
- **Evidence:** unthrottled homepage resource timing — `attribution.js` duration **491.8 ms**, `loader.js` 171.6 ms, injected iframe `subscribe-forms.beehiiv.com/v3/forms/351…` start 455 ms / duration 569.8 ms. All `async`; iframe is below the fold and space is reserved.
- **Impact:** no render blocking and CLS 0, but it is the only meaningful third-party main-thread cost and is outside our control.
- **Recommendation:** no action; keep the loader on the homepage only (already the case). If third-party cost grows, consider loading the form on interaction.

### 6. No Speculation Rules / prefetch-prerender — INFO
- **Evidence:** `preload_check.py … --json` → `"speculation_rules": {"inline_blocks": 0, "header_present": false, "actions": []}`, `"prerender_links": 0`.
- **Impact:** next-navigation paint is not prefetched. With 4 top-level nav links this is optional polish only.
- **Recommendation:** optionally add an inline `<script type="speculationrules">` prefetching the four nav destinations.

### 7. Tiny text-shift CLS on unthrottled homepage — INFO
- **Evidence:** unthrottled home CLS **0.0141** — a single shift of 0.0141 at t=335 ms on a text node (`[object Text]`); throttled runs report CLS 0.
- **Impact:** negligible (14 % of the 0.1 budget). Consistent with font-swap text reflow, not with unsized media.
- **Recommendation:** no action; resolved naturally by preloading fonts (Finding 2).

## Limitations

- **No field / CrUX data.** `pagespeed_check.py "https://fknwine.com/" --json` returned `"error": "PSI rate limit exceeded (240 QPM / 25,000 QPD)"` for both mobile and desktop (no PSI API key / quota available), and `lcp_subparts.py … --json` returned `Error: Google API key not configured`. **No CrUX 75th-percentile LCP/INP/CLS, no LCP subparts, and no official Lighthouse version or score were obtainable.** The site also likely has insufficient CrUX traffic. All figures above are therefore **lab** measurements and are not a statement about real-user field performance.
- **No Lighthouse run.** `npx lighthouse` is not installed (fetch blocked) and the PSI API was unavailable, so no Lighthouse performance score/audit list is reported; the 93/100 is my synthesis of the lab CWV, weight, and header evidence above, not a Lighthouse score.
- **INP not measured.** INP requires real user interactions; it is inferred as good from zero long tasks, zero framework JS, and a 115–174-element DOM. Not a substitute for field INP.
- **Single-run lab data.** LCP/CLS are from one cold load per page in headless Chrome 155 with emulated Slow-4G (1.6 Mbps, 150 ms RTT) + 4× CPU throttling; no multiple-run median.
- **Warm-cache caveat.** Some resource `transferSize` values read 300 B because the profile revalidated (304) the CSS and fonts given the `max-age=0, must-revalidate` policy in Finding 1; cold runs used `Network.setCacheDisabled` to force full downloads.
