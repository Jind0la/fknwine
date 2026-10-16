# GEO / AI-Search Readiness — fknwine.com

**GEO Readiness Score: 68 / 100**

| Dimension | Weight | Score |
|-----------|--------|-------|
| Citability | 25% | 85 |
| Structural Readability | 20% | 80 |
| Multi-Modal Content | 15% | 55 |
| Authority & Brand Signals | 20% | 45 |
| Technical Accessibility | 20% | 65 |
| **Weighted total** | | **68** |

Audited 2026-10-16. Evidence: `robots.txt`, `llms.txt`, sitemap-0.xml, and the 19 crawled pages in `crawl/`.
Tooling: `hermes seo run agentic_check.py https://fknwine.com/ --json` (server-rendered PASS, robots reachable PASS, 45 robots groups, llms.txt Lighthouse-format PASS, real 404 PASS).

---

## What works

- **The "checked <date>" pattern is a genuine GEO asset.** Review titles literally carry the freshness stamp — `<title>Firstleaf Review — checked 2026-10-16 — FKN Wine</title>` — and every review opens with `Checked 2026-10-16` plus a **"The facts (as of 2026-10-16)"** block. A dated, fact-quoted page is exactly what an AI answer engine will lift.
- **Hard, quotable numbers, sourced from the merchant's own site.** e.g. Firstleaf: *"$44.95 first box (6 bottles) … ~$7.50 intro · ~$16.50 after … $99 per 6-bottle shipment after the intro"*; Naked Wines: *"$40/month into your wine account … up to 60% off Angel-only prices"*; California: *"$49 per shipment … ~$24.50 a bottle at the base tier"*. These are self-contained, liftable answer units.
- **Honest limitation markers** ("we haven't tested the cancel flow", "their words, not ours") build the trust signal answer engines increasingly weight — the opposite of fabricated review content.
- **Server-rendered (no JS required): 506 words in the raw fetch, no SPA shell** — AI fetchers get the full text, not a shell.
- **Baseline structured data on every page:** `Organization` + `WebSite`; reviews add `Article` with `datePublished`, `dateModified`, `author`, `publisher`.
- **`/llms.txt` exists and is well-formed** (agentic_check: "llms.txt follows the Lighthouse rules", PASS), with a one-line summary blockquote and operator identity.
- **`Content-Signal: search=yes,ai-train=no,use=reference`** is declared, and the file frames restrictions as an EU DSM Art. 4 reservation of rights — a coherent legal posture.

---

## Findings

### 1. PerplexityBot is blocked → the site is invisible to Perplexity AI answers — HIGH
**Evidence (robots.txt, "AI Crawlers (2026)" block):**
```
User-agent: PerplexityBot
Disallow: /
```
agentic_check flags it directly: `"search_crawlers_blocked_at_root": ["PerplexityBot"]`.
**Impact:** PerplexityBot is Perplexity's *search/answer* crawler, not a training crawler. Blocking it removes the site from every Perplexity answer surface. This is the single largest GEO loss.
**Recommendation:** Decide explicitly. If Perplexity citation is wanted, remove this block (keeping the training-crawler blocks); cite the same `search=yes` Content-Signal reasoning already used for search. If it is deliberate, record it as a conscious coverage trade-off rather than a gap.

### 2. Brand entity is split between "FKN Wine" and "F*ck Nice Wine" — MEDIUM
**Evidence:** schema/titles/`og:site_name` all use the string **"FKN Wine"** (`"name":"FKN Wine"`), while the homepage hero renders **"F*CK NICE WINE"** and About opens *"F*ck Nice Wine. Buying wine is annoying…"*; Imprint closes *"© 2026 FKN Wine. F*ck Nice Wine."*
**Impact:** AI systems build entities from consistent name strings. The abbreviation "FKN" and the expanded profanity form are not linked, so the brand's entity is ambiguous across surfaces, and the profane form can be filtered by some brand-safety layers.
**Recommendation:** Add `alternateName` to the `Organization` schema (`["F*ck Nice Wine","Fuck Nice Wine"]`) and state the expansion once in `llms.txt` ("FKN Wine (F*ck Nice Wine)"). One canonical short form ("FKN Wine") everywhere; expansion only as `alternateName`.

### 3. No `sameAs` / external entity links on the Organization — MEDIUM
**Evidence:** the `Organization` node is `{"@type":"Organization","name":"FKN Wine","url":"https://fknwine.com","logo":"…","description":"…","foundingDate":"2026"}` — no `sameAs`. Yet the site itself links `https://x.com/FKNWine` and declares `<meta name="twitter:site" content="@FKNWine">`.
**Impact:** The X profile is an unused entity anchor; without `sameAs` there is no machine-readable link connecting the site to its only established external presence. (Brand-mention correlation with AI citations is strongest for YouTube ~0.737, high for Reddit, high for Wikipedia — none present.)
**Recommendation:** Add `sameAs: ["https://x.com/FKNWine"]` to the `Organization` node and to `publisher`/`author`. If/when the brand gets a Reddit or YouTube footprint, add those too. Even a LinkedIn/company page helps.

### 4. Article `author` is the Organization, not a Person — MEDIUM
**Evidence:** Article schema `"author":{"@type":"Organization","name":"FKN Wine","url":"https://fknwine.com"}`; no `<meta name="author">` on any page; imprint names the responsible person (Nimar Moradbakhti) but that identity is not wired into the reviews.
**Impact:** Reviews are E-E-A-T-weighted content (price/fine-print assessment). A named human author, with a same-site bio and `sameAs`, is the standard author-entity signal; an org-only author forfeits it.
**Recommendation:** Attribute reviews to a `Person` author ("Nimar Moradbakhti") with a linked author page, keeping FKN Wine as `publisher`.

### 5. `llms.txt` under-describes the site (7 of 19 pages) — MEDIUM
**Evidence:** `llms.txt ## Pages` lists only Home, All deals, Wine clubs, **Firstleaf review**, Guides, **how-to-test-a-wine-club**, Disclosure. The sitemap contains 19 URLs — the other **5 club reviews** (california-wine-club, gold-medal-wine-club, naked-wines, winc, wine-access), **2 guides** (how-to-cancel-a-wine-club, wine-club-price-per-bottle), About, Imprint, Privacy, Terms are all absent.
**Impact:** An llms.txt that lists one review out of six misrepresents the corpus and steers any agent that trusts it toward a fraction of the content — including the strongest asset, the price-per-bottle comparison table.
**Recommendation:** Complete the Pages list (all reviews and guides), and add the one-line headline/answer for each so an agent can quote-ready it. Regenerate automatically from the sitemap/collections.

### 6. robots.txt blocks training crawlers while `/llms.txt` invites AI consumption — MEDIUM (documented trade-off + internal inconsistency)
**Evidence — blocked (training) groups in robots.txt:** `Amazonbot`, `Applebot-Extended`, `Bytespider`, `CCBot`, `ClaudeBot`, `Diffbot`, `Google-Extended`, `GPTBot`, `omgili`, `anthropic-ai`, `Claude-Web`, `cohere-ai`, `MistralAI-Training`, `meta-externalagent`, `GoogleOther`, `Baiduspider`, `PetalBot`, `KimiBot`, and more — all `Disallow: /`. Meanwhile `/llms.txt` opens *"# FKN Wine — LLMs.txt … > Wine deals and honest buying guides"* and lists pages for LLMs.
**Assessment (trade-off, not a bug):** This is a deliberate, defensible owner position — trade model-training reuse for an allowance of search/grounding (`search=yes, use=reference`). Respect it as intended.
**The factual inconsistency to flag:** robots.txt and llms.txt send opposite signals. Training crawlers are blocked, but "search=yes, use=reference" and the whole llms.txt invite retrieval/grounding; and the Content-Signal line sits only in the `User-agent: *` group, not inside the named AI groups — so a crawler matching a named group (per RFC 9309) never reads it (agentic_check: `named_groups_without_signal` for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot).
**Recommendation:** Keep the training blocks (intended). Repeat `Content-Signal: search=yes,ai-train=no,use=reference` inside each named AI group so the retrieval allowance is unambiguous, and add a one-line note in llms.txt stating the intent ("training blocked, search/grounding permitted") to remove the head-on contradiction.

### 7. Blunt voice / profanity is a low, mostly-acceptable citability risk — LOW
**Evidence:** homepage hero *"No snobs. No bullshit. No fake reviews."*; brand "F*ck Nice Wine"; body copy stays factual (*"$44.95 for 6 bottles is a real number, not a gimmick"*).
**Assessment:** The substance is highly quotable and the voice does not undermine the numbers — this is not a content-quality problem. The residual risk is brand-safety filtering: some answer surfaces and enterprise filters avoid profanity, and the profanity sits in the *brand name* rather than in body copy, which is harder to drop from a citation.
**Recommendation:** No need to change the voice. Keep the profane form out of schema/titles (already true — titles use "FKN Wine"), so the machine-facing string stays clean even when the human-facing hero does not.

---

## Missing AI-era assets
- `Organization.sameAs` and Person `author` (see findings 3–4).
- `llms.txt` completeness (finding 5).
- **Content-Signal not repeated in named groups** (finding 6).
- No markdown content-negotiation variant (agentic_check: P1, `status: info` — no consumer agent is confirmed to request it, so low priority).
- No `ai-catalog.json` / A2A agent card / WebMCP — all `NA` and not applicable to a content/review site.
- No RSL licensing file — the `Content-Signal` reservation covers the same intent here.
- External brand footprint: X only; no Reddit, YouTube, or Wikipedia presence to feed the strongest AI-citation correlations.

---

## Limitations
- **robots.txt group matching is inferred, not executed.** I read the file; I did not spoof every blocked UA to confirm live behavior. The "OAI-SearchBot / Claude-SearchBot are allowed (not named → wildcard `Allow: /`)" conclusion follows RFC 9309 but was not HTTP-verified per UA.
- **`Content-Signal` is a preference, not enforcement** — its real-world effect on AI consumers is unverifiable from here.
- **No live AI-answer testing.** No paid APIs were called; I did not query ChatGPT/Perplexity/Gemini to confirm actual citation status. Mobile/interactive visibility was not tested.
- **Multi-Modal score (55) is partly inferred.** `og:image` resolves to a single generic `og-default.png`; I did not inventory real per-page imagery.
- **Crawl files are raw HTML** (the `crawl/*.json` payloads contain HTML, not the `content/extracted_text/structured_data` object keys named in the brief), so text/schema were parsed directly from the HTML; passage-level scores came from boilerplate-stripped text, not trafilatura output.
- **Brand-mention correlations** (YouTube/Reddit/Wikipedia) are cited from the GEO skill as directional industry heuristics, not measured for this domain.
