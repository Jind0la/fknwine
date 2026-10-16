# Technical SEO — fknwine.com

**Technical SEO score: 82 / 100**

Audited: 2026-10-17 · Scope: 19 URLs (see `../urls.txt`) · Method: crawl snapshots (`../crawl/*.json`), live HTTP probes (curl, no third-party paid APIs), and read-only source review at `/Users/nimar/Workspace/projects/19-fknwine`.

The site is in strong technical shape. It is a fully static Astro build on Cloudflare Pages with **zero page JavaScript** (only a single async beehiiv attribution script), correct canonicalization, clean single-hop redirects, valid security-adjacent headers, proper 404 semantics, and a complete XML sitemap. The score is held back from the 90s by two concrete gaps — a **missing HSTS header** and **no long-lived caching on content-hashed static assets** — plus a handful of low-severity polish items.

---

## What works

- **Canonicalization is correct on all 19 pages.** Every page emits `<link rel="canonical">` = `https://fknwine.com/<path>/` — correct scheme, correct apex host, correct trailing slash. `og:url` matches canonical on every page. Generated from a single source of truth (`astro.config.mjs` `site` → `Astro.site`, `src/layouts/Layout.astro:16-23`).
- **Redirects are clean and single-hop.**
  - `http://fknwine.com/` → `301` → `https://fknwine.com/`
  - `https://www.fknwine.com/` → `301` → `https://fknwine.com/`
  - `http://www.fknwine.com/` → **1 hop** → `https://fknwine.com/` (`num_redirects:1`)
  - `/about` (no slash) → `308` → `/about/`
  - Legacy German URLs hand-mapped in `public/_redirects` (`/impressum/`→`/imprint/`, `/datenschutz/`→`/privacy/`, `/bestaetigt/`→`/subscribed/`, `/artikel/*`→`/`), all `301`.
- **Sitemap is complete and valid.** `robots.txt` declares `Sitemap: https://fknwine.com/sitemap-0.xml`; `sitemap-0.xml` lists exactly the 19 live URLs and nothing stale. A `sitemap-index.xml` wrapper also resolves (`200`, points to `sitemap-0.xml`).
- **Indexability is clean.** No `<meta name="robots">` and no `X-Robots-Tag` on any audited page — everything is indexable by design. `robots.txt` allows all search engines (`User-agent: * / Allow: /`), with `Content-Signal: search=yes,ai-train=no,use=reference`.
- **Security-adjacent headers present:** `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin` on every response; HTTPS/HTTP2 with a valid cert (Google Trust Services WE1, `notAfter Dec 12 2026`); Brotli compression (`content-encoding: br`).
- **404 handling is correct.** Unknown paths return a real `404` status with a branded page, e.g. `https://fknwine.com/this-page-should-not-exist-xyz/` → `HTTP/2 404`, `<title>404 — Page not found — FKN Wine</title>`. Nested unknowns behave the same (`/wine-clubs/does-not-exist/` → `404`).
- **Core-Web-Vitals fundamentals are excellent.** Static pre-rendered HTML, no client framework/JS bundle, one small render-blocking stylesheet (`_astro/Layout.U-e5WnxP.css`, 13.6 KB before compression), self-hosted variable fonts (`@fontsource`) with no third-party font requests, TTFB ≈ 0.11 s (`time_starttransfer:0.115s`), and **no `<img>` elements anywhere** so there is no image-driven LCP or CLS risk.
- **Metadata hygiene:** every page has a unique `<title>` and unique `<meta name="description">`; `<html lang="en">`; per-page Open Graph + Twitter cards with an existing 1200×630 `og-default.png`.

---

## Findings

### 1. HSTS header missing
- **Severity:** Medium
- **Evidence:** `curl -sSI https://fknwine.com/` returns `x-content-type-options: nosniff` and `referrer-policy: strict-origin-when-cross-origin`, but **no** `strict-transport-security` header (grep count `0`). No `public/_headers` file exists in the repo, so only Cloudflare defaults are applied.
- **Recommendation:** Add `public/_headers` (Cloudflare Pages) sending `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` on `/*`, then submit to hstspreload.org once verified. This enforces HTTPS for repeat visitors and protects against SSL-strip before the redirect completes.

### 2. Content-hashed static assets are not cached long-term
- **Severity:** Medium
- **Evidence:** The fingerprinted stylesheet and fonts serve `cache-control: public, max-age=0, must-revalidate` — e.g. `curl -sSI https://fknwine.com/_astro/Layout.U-e5WnxP.css` and `.../inter-latin-wght-normal.Dx4kXJAl.woff2` both return `max-age=0, must-revalidate`. Filenames are content-hashed (`Layout.U-e5WnxP.css`), so a revalidation round-trip on every page view is wasted work.
- **Recommendation:** In `public/_headers`, set `_astro/*` to `Cache-Control: public, max-age=31536000, immutable`. Keep `max-age=0, must-revalidate` on HTML only. This measurably improves repeat-view performance (no per-navigation revalidation of CSS/fonts).

### 3. Thank-you page `/subscribed/` is indexable and in the sitemap
- **Severity:** Low
- **Evidence:** `sitemap-0.xml` contains `<url><loc>https://fknwine.com/subscribed/</loc></url>`; the page returns `200` and has no `robots` meta. Its `<meta name="description">` is just `"You're on the FKN Wine Deal Sheet."` and the H1 is `"You're in."` — thin, no search value, reached only after a newsletter signup.
- **Recommendation:** Add `<meta name="robots" content="noindex, follow">` to `src/pages/subscribed.astro` and exclude `/subscribed/` from the sitemap (e.g. `@astrojs/sitemap` `filter`). Removes a thin page from the index without losing link equity.

### 4. Sitemap has no `<lastmod>` values
- **Severity:** Low
- **Evidence:** Every `<url>` entry in `sitemap-0.xml` contains only `<loc>` — no `<lastmod>`. Review pages carry real freshness data (`checked 2026-10-16` in titles/body) that is not exposed to crawlers.
- **Recommendation:** Emit `<lastmod>` per URL (Astro `sitemap({ lastmod: new Date() })` or per-content `updated` frontmatter). Helps Bing/Google schedule recrawls of a deals site where freshness matters.

### 5. Homepage skips a heading level (H1 → H3)
- **Severity:** Low
- **Evidence:** The homepage renders `<h1>…</h1>` then jumps straight to three `<h3>` trust badges (`<h3>We check the fine print</h3>`, `<h3>We don't fake reviews</h3>`, `<h3>We'll tell you to skip it</h3>`) before the first `<h2>Live deals</h2>`. Other pages are clean (e.g. `/wine-clubs/firstleaf/` = 1×h1 followed only by h2s).
- **Recommendation:** Promote the three trust badges to `<h2>` (or demote to non-heading `<p>`), so the homepage outline is H1 → H2 → H3.

### 6. No RSS autodiscovery link
- **Severity:** Low
- **Evidence:** `https://fknwine.com/rss.xml` returns `200 application/xml` and is listed in `llms.txt`, but no page `<head>` contains `<link rel="alternate" type="application/rss+xml" …>` (grep returned empty).
- **Recommendation:** Add the `<link rel="alternate" type="application/rss+xml" title="FKN Wine" href="https://fknwine.com/rss.xml">` tag in `Layout.astro` `<head>`.

### 7. Over-length titles and meta descriptions on long pages
- **Severity:** Low
- **Evidence:** Titles exceed ~60 chars on `/guides/how-to-cancel-a-wine-club/` (74), `/guides/wine-club-price-per-bottle/` (65) and `/wine-clubs/california-wine-club/` (63) — the `— FKN Wine` suffix pushes them over. Meta descriptions exceed 160 chars on 6 pages, worst `/wine-clubs/wine-access/` (272) and `/wine-clubs/gold-medal-wine-club/` (242). All are present and unique (no duplicates, none missing).
- **Recommendation:** Trim descriptions to ≤155–160 chars and titles to ≤60 (shorten the visible title; the brand suffix is what tips them over). Snippet truncation only, not an indexation problem.

### 8. Two sitemap URLs, `/sitemap.xml` returns 404
- **Severity:** Info
- **Evidence:** `robots.txt` declares the sitemap as `sitemap-0.xml`; a `sitemap-index.xml` also exists. The conventional `https://fknwine.com/sitemap.xml` returns `404` (`curl -w '%{http_code}'` → `404 text/html`).
- **Recommendation:** Optional. All real sitemap URLs resolve and one is declared, so crawlers will find it. If desired, point the `robots.txt` `Sitemap:` line at the `sitemap-index.xml` (the standard discovery target) rather than `sitemap-0.xml`.

### 9. `robots.txt` blocks AI crawlers (recorded decision, not a bug)
- **Severity:** Info
- **Evidence:** Beyond the Cloudflare-managed block, the site's own `public/robots.txt` disallows `GPTBot`, `CCBot`, `Claude-Web`, `anthropic-ai`, `Google-Extended`, `cohere-ai`, `PerplexityBot`, `Amazonbot`, `FacebookBot`, `Omgilibot`, `Omgili`, `YouBot` (`Disallow: /`), while a second `User-agent: *` block `Allow: /` keeps conventional search engines (Googlebot, Bingbot) crawling. `Content-Signal: search=yes,ai-train=no,use=reference` restates this.
- **Recommendation:** None — this is a deliberate publisher policy. Recorded as a decision. Note the trade-off: it also removes the site from AI-answer surfaces (ChatGPT/Perplexity-style citations), which is the trade the owner chose.

---

## Category summary

| Category | Status | Notes |
|---|---|---|
| Crawlability (robots, sitemaps, noindex) | **Pass** | Valid robots.txt, complete sitemap, nothing noindexed by mistake |
| Indexability (canonicals, duplicates) | **Pass** | All canonicals correct; titles/descriptions unique |
| Security (HTTPS, headers) | **Partial** | HTTPS, nosniff, Referrer-Policy OK; **HSTS missing** |
| URL structure & redirects | **Pass** | Single-hop 301/308, www/http→apex, legacy DE redirects |
| Mobile | **Pass** | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` on all pages |
| Core Web Vitals (potential) | **Pass\*** | No JS, one small CSS file, Brotli, TTFB ~0.11 s, no images. \*Gap: hashed assets not immutably cached |
| Structured data (detection) | **Pass** | Valid JSON-LD (`Organization` + `WebSite`) on every page; page-level `Article`/`Review` handled by the schema role |
| JavaScript rendering | **Pass** | Fully server-rendered static HTML; no CSR dependency |
| IndexNow protocol | **Not checked** | No key file observed; out of scope here |

---

## Limitations

- **No field Core Web Vitals data.** LCP/INP/CLS were assessed only from source and HTTP evidence. No CrUX/PageSpeed field data was available (paid APIs out of scope), so real-user INP/LCP numbers are unverified — the architectural signals are strongly favourable but not measured.
- **No Google Search Console / index coverage.** Indexability was verified from headers, robots meta, canonicals and the sitemap — not from actual index status, crawl stats, or manual actions.
- **Single-snapshot crawl.** One crawl per URL (2026-10-17). Dynamic or drift behaviour was not observed.
- **No mobile rendering / Lighthouse run.** Mobile-friendliness judged from viewport meta, CSS and no-JS architecture, not from a device-emulated render or touch-target analysis.
- **Structured-data validation limited to detection.** Only the presence of a valid JSON-LD block (`Organization`+`WebSite`) was confirmed; Rich Results eligibility of page-level `Article`/`Review` markup belongs to the schema role.
- **No `IndexNow` submission state checked** (no key file observed) and no log-file or server-config access, so header origins (Cloudflare vs `_headers`) are inferred from the absence of a `public/_headers` file.
