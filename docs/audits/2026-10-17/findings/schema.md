# Structured Data / Schema Audit — https://fknwine.com

**Scope:** 19 pages (home, about, deals hub, wine-clubs hub + 6 club reviews, guides hub + 3 guides, disclosure, imprint, privacy, terms, subscribed).
**Method:** All JSON-LD extracted from the captured HTML of every page and parsed; the plugin's own `hooks/validate-schema.py` run against each captured file; the plugin's `scripts/parse_html.py` run under a clean venv to confirm the parsed `schema` node on each page; `scripts/schema_generate.py` / `metadata_template.py` --help reviewed for the recommended templates. Source `src/layouts/Layout.astro`, `src/pages/wine-clubs/[slug].astro`, `src/pages/guides/[slug].astro`, `src/pages/about.astro` and the three hub index pages read (read-only, nothing modified).

**Format baseline:** JSON-LD only, server-rendered (Astro static). No Microdata, no RDFa anywhere (verified by scanning for `itemscope` / RDFa `vocab`). Every page emits exactly **one** `<script type="application/ld+json">` containing a JSON **array** of 2–3 nodes. All blocks parse as valid JSON; the plugin's `validate-schema.py` returned clean (exit 0, no errors, no warnings) for all 19 pages — no placeholders, no deprecated/retired types (no HowTo / SpecialAnnouncement / FAQPage).

**Score: 72 / 100**

---

## Detection — schema type matrix

| Page type | URL | Nodes emitted |
|---|---|---|
| Home | `/` | Organization, WebSite |
| About | `/about/` | Organization, WebSite, **AboutPage** |
| Deals hub | `/deals/` | Organization, WebSite |
| Wine-clubs hub | `/wine-clubs/` | Organization, WebSite |
| Club review ×6 | `/wine-clubs/<slug>/` | Organization, WebSite, **Article** |
| Guides hub | `/guides/` | Organization, WebSite |
| Guide ×3 | `/guides/<slug>/` | Organization, WebSite, **Article** |
| Legal/utility ×5 | `/disclosure/ /imprint/ /privacy/ /terms/ /subscribed/` | Organization, WebSite |

No `Product`, `Review`, `Offer`, `ItemList`, `CollectionPage`, `BreadcrumbList`, `WebPage`, `Person`, `QAPage` or `FAQPage` anywhere.

---

## What works

- Valid, parseable JSON-LD on all 19 pages; server-rendered (not client-injected), so crawlers see it without JS.
- Correct `@context: "https://schema.org"` (https, not http) in every node.
- All `url` values are absolute and match the page canonical (`14-…california-wine-club` → `https://fknwine.com/wine-clubs/california-wine-club/`).
- Article emitted on **all 9** review + guide pages with `headline`, `description`, `url`, `datePublished`, `dateModified`, `inLanguage`, `author`, `publisher`.
- Dates are valid ISO 8601 (`"2026-10-16"`) and consistent with the visible "Checked/Updated" dates.
- Headlines are within Google's ~110-char guide (longest 63 chars); none are placeholder or templated duplicates.
- `AboutPage` + `mainEntity` Organization on `/about/` is a correct, deliberate pattern.
- No deprecated/retired rich-result types present; no invalid JSON; no duplicate `<script>` blocks.

---

## Findings

### F1 — Organization `logo` is an SVG favicon (not a valid logo image) — **High**
**Evidence** (every page, from `Layout.astro` baseSchema):
```json
{"@context":"https://schema.org","@type":"Organization","name":"FKN Wine",
 "url":"https://fknwine.com","logo":"https://fknwine.com/favicon.svg",
 "description":"Wine deals and honest buying guides. ...","foundingDate":"2026"}
```
**Why it matters:** Google's logo guidance requires a **raster** image (PNG/JPG/GIF) supplied either as a URL or, preferably, an `ImageObject` with `width`/`height`, minimum 112×112 px. An `.svg` favicon is not an eligible logo source for the Knowledge-Panel / logo treatment.
**Recommendation:** ship a raster logo (e.g. `/logo.png`, ≥112×112) and emit:
```json
"logo": {"@type":"ImageObject","url":"https://fknwine.com/logo.png","width":512,"height":512}
```

### F2 — Organization missing `sameAs` to the X account (+ no entity `@id`) — **High**
**Evidence:** Organization node above has **no `sameAs`**, although the site links to `https://x.com/FKNWine` in the nav, footer and `/about/`. There is also no `@id` on any node.
**Why it matters:** `sameAs` is the standard entity-linking signal (Google Knowledge Graph / AI grounding). The brand's only off-site identity (@FKNWine) is invisible to the graph.
**Recommendation:**
```json
"@id":"https://fknwine.com/#organization",
"sameAs":["https://x.com/FKNWine"]
```
(Add the matching `@id` on the WebSite/Article nodes so they consolidate into one entity.)

### F3 — Article nodes have no `image` — **High**
**Evidence** (all 9 review/guide Articles) — key set is exactly:
`['@context','@type','author','dateModified','datePublished','description','headline','inLanguage','publisher','url']`
i.e. **no `image`**, no `mainEntityOfPage`.
**Why it matters:** `image` is a recommended property for the article rich result and required for Top-Stories/AMP treatment. The site has `/og-default.png` (1200×630) plus per-review cards, so the asset exists.
**Recommendation:** add
```json
"image":{"@type":"ImageObject","url":"https://fknwine.com/og-default.png","width":1200,"height":630}
```
or a per-page review image.

### F4 — `publisher` has no `logo` — **Medium**
**Evidence:**
```json
"publisher":{"@type":"Organization","name":"FKN Wine","url":"https://fknwine.com"}
```
**Why it matters:** Google recommends `publisher.logo` (ImageObject, ≤600×60) for Article rich results.
**Recommendation:** reference the publisher Organization by `@id` and give that node a proper `logo` (see F1), instead of repeating an inline stub.

### F5 — Hub pages carry no `CollectionPage` / `ItemList` — **Medium**
**Evidence** — `/deals/`, `/wine-clubs/`, `/guides/` emit only:
```json
[{"@type":"Organization",...},{"@type":"WebSite",...}]
```
Each hub is a genuine collection page listing child items (clubs/guides/deals) that are rendered as links in the markup.
**Why it matters:** an `ItemList`/`CollectionPage` makes the hub→child relationship explicit for search and for AI answer engines, and is the natural place to declare the ranked list.
**Recommendation** (example for `/wine-clubs/`):
```json
{"@context":"https://schema.org","@type":"CollectionPage",
 "url":"https://fknwine.com/wine-clubs/","name":"Wine Clubs, Judged",
 "isPartOf":{"@id":"https://fknwine.com/#website"},
 "mainEntity":{"@type":"ItemList","numberOfItems":6,"itemListElement":[
   {"@type":"ListItem","position":1,"url":"https://fknwine.com/wine-clubs/firstleaf/","name":"Firstleaf"}]}}
```

### F6 — No `BreadcrumbList` on any page — **Medium**
**Evidence:** absent site-wide; there is a clear hierarchy (`/` → `/guides/` → `/guides/<slug>/`), and reviews already render a visible "← All club reviews" back-link.
**Why it matters:** Breadcrumb rich results are still supported by Google and improve SERP URL presentation; they also reinforce hierarchy for AI grounding.
**Recommendation:** add a 2–3 level `BreadcrumbList` on all child pages.

### F7 — No `@id` / `@graph`; Organization duplicated 3× per article page — **Medium**
**Evidence** — a review page emits the Organization **three times** (standalone node, plus inline `author`, plus inline `publisher`) and WebSite a second time, all with no `@id`:
```json
[{"@type":"Organization","name":"FKN Wine",...},
 {"@type":"WebSite",...},
 {"@type":"Article",...,"author":{"@type":"Organization","name":"FKN Wine","url":"https://fknwine.com"},
  "publisher":{"@type":"Organization","name":"FKN Wine","url":"https://fknwine.com"}}]
```
**Why it matters:** unlinked duplicate nodes can be treated as distinct entities; a single `@graph` with `@id` references is the cleaner, Google-recommended shape.
**Recommendation:** move to one `@graph` array with `@id`-linked nodes (`#organization`, `#website`, `#webpage`, `#article`) and reference them via `author`/`publisher`/`isPartOf`.

### F8 — `dateModified` always equals `datePublished` — **Low / Info**
**Evidence:** on every Article `"datePublished" === "dateModified"`, both driven by the single frontmatter field (`lastChecked` for clubs, `updated` for guides).
**Why it matters:** not an error, but it means the graph can't express "significantly updated on a later date", which is a small freshness signal. Fine until the first real revision.
**Recommendation:** keep as-is until content is revised, then let `dateModified` diverge.

### F9 — WebSite has no `potentialAction` / SearchAction — **Info (do NOT add)**
**Evidence:** WebSite node = `{name, url, description, inLanguage}` only.
**Assessment:** the checklist flags the absence, but the site has **no internal search**, and Google retired the sitelinks-search-box rich result. Adding a SearchAction would describe a feature that does not exist. **Recommendation: leave it out.**

### F10 — No FAQPage anywhere — **Info (correct as-is)**
**Evidence:** absent on all pages.
**Assessment:** correct. Google retired FAQ rich results for all sites (May 2026); adding FAQPage would give no SERP benefit. If genuinely user-submitted Q&A is ever added, use **QAPage**, not FAQPage.

### F11 — Product / Review markup: optional, and only without ratings — **Low**
**Evidence:** club reviews carry genuine editorial data — `verdict` (`worth-it|depends|skip`), `verdictLabel`, pros/cons, and merchant facts (price, per bottle, commitment, cancel terms). None of it is currently marked up beyond the generic Article.
**Assessment:** a `Review` node (or `Product` with a `review`) could legitimately describe FKN Wine's **own** editorial verdict — `author` = FKN Wine, `reviewBody` = the summary, `itemReviewed` = the club as a `Service`/`Product`. **But** the brand explicitly forbids fake review markup, and there is **no numeric rating** (the verdict is categorical), so:
- **Do not** add `reviewRating`/`aggregateRating` with invented numbers.
- **Do not** add `Offer`/`availability`/`price` for the merchant's products (the site does not sell).
- If added, keep it to `Review` + `author` + `reviewBody` + `itemReviewed`, no rating.
Also note: `Article` is acceptable for these pages; switching the two review templates to `Review` (or keeping Article) is a judgment call, not a defect.

### F12 — Organization/WebSite injected on non-indexable utility pages — **Info**
**Evidence:** `/subscribed/`, `/privacy/`, `/terms/`, `/imprint/`, `/disclosure/` all emit the Organization+WebSite pair.
**Assessment:** harmless; only a note that markup is being added to pages that add nothing to the entity graph.

### F13 — `foundingDate: "2026"` year-only — **Info**
**Evidence:** `"foundingDate":"2026"`. Valid ISO 8601 (year) and accepted in practice by schema.org consumers; a full `YYYY-MM-DD` would be stricter.

---

## Recommended consolidated graph (drop-in shape)

Replace the array-of-stubs in `Layout.astro` with a single `@graph`, and let child pages append their node referencing `@id`:

```json
{"@context":"https://schema.org","@graph":[
 {"@type":"Organization","@id":"https://fknwine.com/#organization","name":"FKN Wine",
  "url":"https://fknwine.com","sameAs":["https://x.com/FKNWine"],
  "logo":{"@type":"ImageObject","url":"https://fknwine.com/logo.png","width":512,"height":512}},
 {"@type":"WebSite","@id":"https://fknwine.com/#website","name":"FKN Wine",
  "url":"https://fknwine.com","inLanguage":"en",
  "publisher":{"@id":"https://fknwine.com/#organization"}}
]}
```
Article nodes then use `"publisher":{"@id":"...#organization"}`, `"isPartOf":{"@id":"...#website"}`,
plus `image` and `mainEntityOfPage`.

Priority order: **F1 → F2 → F3** (High), then **F4 → F5 → F6 → F7** (Medium), the rest as follow-ups.

---

## Limitations

- Audit is based on the **captured HTML snapshots** in `fknwine-audit/crawl/` (files are raw HTML despite the `.json` extension); the live site was not re-fetched, so any change since capture is not reflected.
- No external validators (Google Rich Results Test API, Schema.org validator, Search Console "Enhancements" report) were callable from this environment; validation used the plugin's `hooks/validate-schema.py` plus manual/programmatic JSON parsing. Rich-result **eligibility** is inferred from Google's documented property rules, not from a live Google test.
- Google's own rich-result rendering was not observed, so "no SERP feature" statements for FAQPage/HowTo rely on the documented deprecations, not a live SERP.
- `scripts/parse_html.py` required a clean venv (`bs4`+`requests`) because the ambient `PYTHONPATH` pointed at an incompatible Python-3.14 site-packages; results shown are from that clean run.
- Whether `Article` should become `Review`/`Product` is a branding/compliance decision (FKN Wine's "no fake reviews" rule) — flagged as optional, not implemented.
