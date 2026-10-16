# Sitemap & Information Architecture — fknwine.com

**Score: 80 / 100**
**Audited:** 2026-10-17 · Source: live XML (`sitemap-index.xml`, `sitemap-0.xml`, `robots.txt`, `llms.txt`) + 19-page crawl + read-only source (`astro.config.mjs`, `src/pages/**`, `public/robots.txt`).

## What works

- **Full sitemap↔crawl parity.** `sitemap-0.xml` contains exactly 19 URLs; the crawl contains exactly the same 19. Nothing indexable is missing from the sitemap.
- **Every sitemap URL returns HTTP 200 directly** — no 404s, no redirects, no trailing-slash variants polluting the sitemap.
- **Clean, valid XML.** `sitemap-index.xml` is a well-formed `<sitemapindex>` pointing at one child `sitemap-0.xml` (valid `<urlset>`, 19 `<loc>`). Well under the 50k-URL / 50MB caps.
- **No deprecated tags** — no `priority` or `changefreq` anywhere (Google ignores both).
- **No doorway/penalty risk** — no location pages, no programmatic "best X for Y" set. 6 club reviews + 3 guides, all substantive.
- **URL structure is good.** Lowercase, hyphenated, descriptive, shallow (max depth 2: `/wine-clubs/firstleaf/`). Consistent trailing slashes on all 19 URLs; the non-slash form 308-redirects to the slash form (verified `/about`, `/deals`, `/wine-clubs/firstleaf`).
- **Global reachability.** Nav + footer on every page link to `/`, `/about/`, `/deals/`, `/disclosure/`, `/guides/`, `/imprint/`, `/privacy/`, `/terms/`, `/wine-clubs/`. Hubs link to children (`/wine-clubs/` → all 6 reviews; `/guides/` → all 3 guides) and children link back to the hub ("← All club reviews"). No page is unreachable via internal links **except** `/subscribed/` (see F1).
- **`/404` is correctly excluded** from the sitemap (Astro default), and unknown URLs genuinely return 404.
- **`llms.txt` and `/rss.xml` both exist and return 200**; `llms.txt` lists the key pages + links the sitemap.

## Findings

### F1 — `/subscribed/` is a thin utility page that is indexable AND in the sitemap AND orphaned
- **Severity: Medium**
- **Evidence:** `sitemap-0.xml` includes `https://fknwine.com/subscribed/`. Live HTML has **no `robots`/`noindex` meta** and a self-canonical; source `src/layouts/Layout.astro` emits no robots meta at all (no noindex mechanism exists in the codebase). Link-graph analysis of all 19 pages shows **zero internal links point to `/subscribed/`** — it is a pure orphan reachable only via the sitemap. It is a post-newsletter-signup confirmation ("You're in.") — a classic thank-you page.
- **Recommendation:** Add `noindex` to the confirmation page (e.g. a `noindex` prop in `Layout.astro`) and exclude it from the sitemap via the `@astrojs/sitemap` `filter` option (e.g. `filter: (page) => !page.includes('/subscribed/')`). A thin confirmation page should not be in a sitemap, and indexing it dilutes quality signals.

### F2 — No `lastmod` on any URL
- **Severity: Medium**
- **Evidence:** Every `<url>` in `sitemap-0.xml` contains only `<loc>`; no `<lastmod>` element exists. `astro.config.mjs` uses the bare `sitemap()` integration, which omits lastmod unless supplied.
- **Recommendation:** Emit real `<lastmod>` values (W3C datetime). The site already tracks `lastChecked`/`dateModified` per review (used in the Article schema) — feed those into the sitemap so Google can prioritise recrawl of updated reviews. Do **not** use a build-time timestamp for all URLs (that is a false freshness signal); use per-page meaningful dates.

### F3 — robots.txt AI-crawler block contradicts the site's own AI-facing assets
- **Severity: Medium**
- **Evidence:** `robots.txt` publishes a Content-Signal `search=yes, ai-train=no, use=reference` (i.e. AI *input/reference* allowed, training denied) and the site ships `/llms.txt` explicitly inviting LLM consumption. Yet the same file `Disallow: /` for **PerplexityBot, GPTBot, ClaudeBot/Claude-Web, anthropic-ai, Amazonbot, FacebookBot, cohere-ai** — the very agents that perform AI *search/reference*, not just training. Blocking them prevents the AI-answer citations that `llms.txt` and `use=reference` are designed to earn.
- **Recommendation:** Decide intent. If AI search/reference is wanted (as `llms.txt` + `use=reference` imply), allow the answer/search agents (at least PerplexityBot, GPTBot, ClaudeBot, Claude-Web, OAI-SearchBot) and restrict only training via `Google-Extended`, `CCBot`, `ai-train=no`. If the block is deliberate, remove `llms.txt` and set `use=no`, so the two assets stop contradicting each other.

### F4 — robots.txt advertises the child sitemap, not the index
- **Severity: Low**
- **Evidence:** `Sitemap: https://fknwine.com/sitemap-0.xml` (the child urlset). `sitemap-index.xml` exists and is the canonical entry point. `sitemap_discovery.py` confirms only `sitemap-0.xml` is *declared*; the index is discovered only by common-path probing.
- **Recommendation:** Point the `Sitemap:` directive at `https://fknwine.com/sitemap-index.xml` so the index is the declared entry point. (With a single child the index is optional; keeping it is fine — just reference it consistently.)

### F5 — Duplicate AI-crawler directives in robots.txt (Cloudflare-managed + origin both applied)
- **Severity: Low**
- **Evidence:** The live `robots.txt` contains two stacked blocks: a "Cloudflare Managed" block (with the Content-Signal preamble) **and** the origin `public/robots.txt` appended after it. `GPTBot, CCBot, Claude-Web, anthropic-ai, Google-Extended, cohere-ai, Amazonbot` are each declared twice; there are two `User-agent: *` groups. `public/robots.txt` in the repo is only the 42-line custom version — Cloudflare is injecting the extra managed block at the edge.
- **Recommendation:** Not harmful (identical directives), but consolidate: rely on one source (Cloudflare managed) or turn the managed injection off, so there is a single, readable robots.txt. Verify which block wins for any conflicting rule before trimming.

### F6 — No lateral (sibling / related) internal linking between reviews and guides
- **Severity: Low**
- **Evidence:** Link graph shows the 6 club reviews do not link to one another, and the 3 guides link only to the hub, not to sibling guides or to the relevant club reviews. `/deals/` links to zero club-review pages despite featuring merchants that have reviews (e.g. Firstleaf) — only nav links are present.
- **Recommendation:** Add "related" modules: on each review link 2–3 sibling reviews and the relevant guide (e.g. Naked Wines → "how to cancel a wine club"); on `/deals/` link each featured merchant to its review page. This deepens topical clustering and spreads internal PageRank across the money pages.

### F7 — No breadcrumb markup
- **Severity: Low**
- **Evidence:** Only `Article`/`Organization`/`WebSite` JSON-LD is emitted; no `BreadcrumbList` schema on the nested pages. Club pages do carry a visual "← All club reviews" back-link.
- **Recommendation:** Add `BreadcrumbList` JSON-LD to `/wine-clubs/<slug>/` and `/guides/<slug>/` to reinforce the hub→child hierarchy in SERPs.

### F8 — `/404` returns HTTP 200 when requested directly
- **Severity: Low (informational, not a sitemap defect)**
- **Evidence:** `curl -I https://fknwine.com/404` → `200`; arbitrary unknown URLs (e.g. `/nonexistent-page-xyz/`) correctly return `404`. The sitemap correctly omits `/404`.
- **Recommendation:** Optional — the static 404 page is served with a 200 at its literal path. Harmless since it is not linked or in the sitemap; no action required unless a soft-404 report appears in Search Console.

## Limitations

- **Crawl was URL-list based**, not a full recursive spider: reachability is judged from the provided 19-page crawl plus direct fetches. A page linked only from a page outside this set, or from JS-injected anchors, could have been missed — though the site is static Astro with server-rendered `<a>` tags, so this risk is low.
- **`lastmod` "accuracy" could not be verified against real edit dates** because no `lastmod` is present. The per-review `lastChecked` values in the content collection were not individually diffed against git history.
- **Search Console data was unavailable**, so I could not confirm actual Google indexing status, soft-404 reports, or whether `/subscribed/` is currently indexed — F1 is based on on-page signals (no noindex + in sitemap) only.
- **Cloudflare edge behaviour** (which robots.txt block is authoritative, any edge redirects) was inferred from the served file, not from the Cloudflare dashboard.
- **No paid APIs used**; no external backlink or ranking data considered (out of scope for sitemap/IA).
