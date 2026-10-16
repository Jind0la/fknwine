# FKN Wine — Full SEO Audit

**Site:** https://fknwine.com · **Date:** 2026-10-17 · **Pages crawled:** 19 (whole sitemap)
**Method:** `hermes-seo` plugin (community port of claude-seo, MIT) — 10 specialist role audits run in
parallel over a full-site crawl, plus hand verification of the central claims against live HTTP responses.
**Health score: 80/100**

## Executive summary

The site is technically clean and unusually honest — server-rendered, zero framework JS, LCP under half a
second, no contrast or overflow failures, and a disclosure discipline most publishers don't have. It is not
losing points for doing anything wrong; it is losing points for being **small and unconnected**. Two
structural problems account for most of the gap:

1. **The internal link graph is two dead-end islands.** All 9 club/guide spokes have zero contextual
   out-links. Guides never link to the club reviews they tabulate; the deals page routes straight to
   merchants and never to a review. Every editorial page is a terminus.
2. **The search intent isn't fully served yet.** There is no ranked "best wine clubs" page, all six reviews
   opened with a hedged "Depends…" verdict, and there is no named author or tested experience behind the
   reviews.

Credibility note: the role audits are self-reports. I re-verified the load-bearing claims myself. One was
wrong (a claim that the homepage has three H1s — it has one) and is excluded below.

## Scores by category

| Category | Score | Weight |
|---|---|---|
| Technical SEO | 82 | 22% |
| Content quality / E-E-A-T | 80 | 23% |
| On-page / SXO | 75 | 20% |
| Schema / structured data | 72 | 10% |
| Performance (lab) | 93 | 10% |
| AI search / agentic | 78 | 10% |
| Sitemap / IA | 80 | — |
| Topic cluster / internal links | 65 | — |
| Visual / mobile | 78 | — |

## Top findings

### Critical / High
- **Dead-end islands (Cluster).** `/wine-clubs/` → 6 reviews and `/guides/` → 3 guides is the entire
  structure. `/deals/` links out to firstleaf.com, winc.com, wine.com and wtso.com while linking to zero
  club reviews. `/subscribed/` is a true orphan. → *Fixed in wave 1: reviews ↔ guides meshed, deals page
  now links all six reviews.*
- **No HSTS, hashed assets revalidate every visit (Technical).** Verified by hand: `/_astro/*.css` and the
  fonts return `cache-control: public, max-age=0, must-revalidate`. → *Fixed: `public/_headers`.*
- **Schema is entity-blind (Schema).** Organization had no `sameAs` and no `@id`, its logo was an SVG
  favicon (Google wants a raster ≥112×112), Article had no `image`, and the Organization was emitted three
  times per article page without a graph. → *Fixed: `@graph` with `@id`, `sameAs`, `logo-512.png`,
  `Article.image`, `BreadcrumbList`.*
- **Hedged verdicts (SXO).** All six reviews opened with "Depends…" — the first scanned element read as a
  non-answer on an "is X worth it" query. → *Fixed: decisive verdicts.*
- **No agent-usable link names (Agentic).** Five outbound deal links were all named "Get this deal →". →
  *Fixed: "Get this deal at WTSO →".*
- **Undersized tap targets + bare-text "X" nav icon (Visual).** Nav links 20px tall, CTAs 41px, the X link
  9×20px. → *Fixed: ≥44px header/button targets, real SVG icon.*
- **No named author, no tested experience (Content/E-E-A-T).** `/about/` names nobody; every review fact is
  the club's own claim re-quoted, and five pages say "we have NOT tested". → *Open (needs a decision +
  work, see Action plan).*
- **PerplexityBot blocked (GEO/Agentic).** It is a *search* crawler; blocking it removes the site from
  Perplexity answers while `llms.txt` invites LLMs and the Content-Signal says `search=yes`. → *Open:
  deliberate owner policy — ask Nimar.*

### Medium
- `/subscribed/` indexable and orphaned → *fixed (noindex + sitemap filter; 19 → 18 URLs).*
- `robots.txt` declared the child sitemap → *fixed (`sitemap-index.xml`).*
- Meta descriptions up to 272 chars, titles up to 74 → *fixed (clamp ≤155 in Layout, titles ≤52).*
- No sitemap `<lastmod>`; no `CollectionPage`/`ItemList` on the hubs → open.
- Thin hubs: `/guides/` is 196 words → open.
- Wide table clipped on mobile with no scroll affordance → *fixed (focusable scroll region + visible
  scrollbar + edge marker).*
- `llms.txt` described 7 pages and 1 of 6 reviews → *fixed (all 19 pages described).*
- Fonts not preloaded; one render-blocking stylesheet; no field CWV data (PSI rate-limited, no CrUX key) →
  open.

### Low / Info
- Homepage heading sequence, RSS autodiscovery (now added), `dateModified` always equals `datePublished`,
  no on-site search, gift-buyer persona unserved, `CONTENT_ROADMAP.md` still describes the old German blog.

## What works (do not break these)
- All 19 canonicals = `https://fknwine.com/<path>/`, single-hop redirects, real 404s, nosniff + referrer
  policy on every response, valid cert.
- LCP 0.42 s cold-throttled, CLS 0.00, 75 KB page weight, 0 `<img>` tags, `font-display: swap` everywhere.
- Raw HTML identical to the rendered DOM — the whole site is readable with JS off.
- Lighthouse Agentic Browsing 3/3 (local run); agent-accessibility-tree passes all 33 axe rules.
- No contrast failures; zero horizontal overflow at 390px and 1440px.
- The `checked <date>` pattern, hard sourced numbers and honest "we haven't tested" caveats are a genuine
  trust moat and a citability asset.

## Limitations of this audit
- No field Core Web Vitals: PageSpeed Insights returned HTTP 429 (quota) and no CrUX API key is configured.
  The 93 is a lab synthesis, not a Lighthouse score.
- No ranking, search-volume, backlink or index-coverage data (all paid APIs excluded by design).
- Lighthouse ran on the homepage only; `/deals/` and `/wine-clubs/` were covered by markup and
  accessibility checks instead.
- Role findings are self-reports; central claims were hand-verified, the rest is attributed evidence, not
  independently reproduced.
