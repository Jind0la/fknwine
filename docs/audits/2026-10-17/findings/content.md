# FKN Wine — Content Quality & E-E-A-T Audit

**Site:** https://fknwine.com (English, US-first wine deals + wine-club review publisher)
**Scope:** 19 live URLs (crawled HTML in `crawl/`, repo markdown in `src/content/`)
**Method:** local text extraction + `hermes seo run content_quality.py / content_verify.py / metadata_template.py / content_humanize.py`. No paid APIs used (`nlp_analyze.py` deliberately skipped — it calls the paid Google NL API).
**Evidence dir:** `/Users/nimar/.hermes/cache/scratch/fknwine-audit/` (`pages.json`, `text/*.txt`, `metadata.json`)

---

## Content-quality score: **80 / 100**

A genuinely well-written, unusually transparent review site whose editorial voice and trust signals are its strength. It is held back by a very small content footprint (9 editorial pages), no named author, no first-hand experience signals, thin hub pages, and a near-total absence of contextual internal linking between the pieces that exist.

**E-E-A-T breakdown (internal model, not Google's):**

| Factor | Weight | Score | One-line read |
|--------|--------|-------|---------------|
| Trustworthiness | 30% | 88 | Disclosure, imprint, dated checks, honest-uncertainty notes — excellent |
| Experience | 20% | 45 | Explicitly paperwork-only; declares what it has *not* tested |
| Expertise | 25% | 55 | Clear, competent writing, but no named author, credentials or method page |
| Authoritativeness | 25% | 50 | New domain (2026), no external citations/press, no author entity |

**AI citation readiness: good (7/10)** — hard numbers, dated tables and quotable one-liners. Weak on entity structure (no Person author, no FAQ/Review schema, no summary panels).

---

## What works

- **Voice is genuinely human and specific.** `content_quality.py` returns `ai_pattern_score: 0`, `filler_score: 0`, no flags on all 12 content pages. `content_humanize.py` proposes **0 changes** on the Naked Wines review. Numbers are concrete ("$44.95 for 6 bottles", "~$16.50 a bottle"), never "great value".
- **Trust signals are best-in-class for the niche.** Dedicated `/disclosure/` naming FTC endorsement guidelines, an Impressum naming the responsible person (Nimar Moradbakhti, Bochum, Germany), `/privacy/`, `/terms/`, 21+ framing, and a "what we checked / what we didn't check" block on every club review.
- **Dated freshness discipline.** Every deal, review and guide carries a `checked 2026-10-16` / `Updated 2026-10-16` stamp (13–19 of 19 pages). `Article` JSON-LD carries matching `datePublished`/`dateModified`.
- **Unique, non-templated metadata.** `metadata_template.py` → `site_risk: low`, `templated_ratio: 0.0`, no shared CTA phrases. Descriptions are written sentences, not title echoes.
- **Honest-uncertainty is handled explicitly and consistently**, which is the brand's differentiator and a real E-E-A-T asset (see finding #2 for the one caveat).

---

## Findings

### 1. No named author, no credentials, no "how we test" page — **High** (Expertise)
**Evidence:** `/about/` ends with only *"A tiny independent operation from Bochum, Germany — obsessed with wine value, allergic to snobbery."* No individual is named on any editorial page; the only named person is on `/imprint/` (legal owner). All `Article` JSON-LD uses `author: {@type: Organization, name: "FKN Wine"}` — no `Person`, no `sameAs`, no bio. There is no `/editorial-policy/` or `/how-we-test/` page.
**Recommendation:** Add a named author (or a clearly identified editorial entity) with a short bio stating *what* qualifies them to read wine-club fine print — even "we've cancelled these memberships with our own cards" beats no source. Point `Article.author` at it. Add a lightweight `/how-we-review-wine-clubs/` method page and link it site-wide; it is the single highest-leverage E-E-A-T fix for a money/alcohol (YMYL-adjacent) review site.

### 2. Review pages carry no first-hand experience signals — **High** (Experience)
**Evidence:** The positioning is honest but thin on hands-on proof. `/guides/how-to-cancel-a-wine-club/`: *"we have not run these cancellation flows ourselves yet — the 'how' columns are the clubs' own published terms."* The phrase "we haven't tested"/"we have NOT tested" appears on **5 pages**; Naked Wines review: *"we did not taste these wines, and we have not tested the cancellation flow."* Every fact is the club's own claim re-quoted.
**SEO risk — worth stating plainly:** Google's product-review guidance rewards *first-hand* evidence (use, testing, measurement), and a page built entirely on re-quoting a merchant's own marketing reads as second-hand to both raters and the Reviews system. The honesty is ethically correct and should stay — but it currently means the reviews have **no** Experience anchor at all.
**Recommendation:** Keep the honesty framing, but manufacture first-hand evidence cheaply: actually join and cancel **one** club, screenshot each step, time it, and write it up as the tested reference. Cross-link that from every review. A single tested flow converts "we read the paperwork" into "we read it *and* did it", without violating the no-fake-reviews rule.

### 3. Thin hub pages and short pages — **Medium**
**Evidence (word counts):** `/guides/` **196 words** — flagged `thin-content`; `/deals/` **369**; `/about/` **376**; homepage **506** (just over the 500 homepage floor); `/privacy/` 338, `/terms/` 364, `/imprint/` 179. The six club reviews (666–1,052 words) and three guides (586–692) are the only substantial pages.
**Recommendation:** The guides hub is the weakest page on a site that needs it to rank: add a short intro paragraph of original framing plus per-guide context (2–3 sentences each) rather than one-line card teasers. `/deals/` is a list, which is legitimate for its type, but needs a real "how this page works / how we verify" block above the fold (it exists but is thin). Legal pages are correctly short.

### 4. Almost no contextual internal linking between related pages — **Medium**
**Evidence:** Link-graph from the crawl — the three guides each receive **1** internal link (only from `/guides/`); each club review receives **1** (only from `/wine-clubs/`), except Firstleaf (2, also from home). Club reviews link **only** to the nav and the `/wine-clubs/` index — they never link to the price-per-bottle guide, the cancel guide, or sibling reviews, despite covering the same facts. The guides never link to the club reviews they analyse. `/deals/` links to no review or guide.
**Recommendation:** Add in-body contextual links: from each club review to `/guides/wine-club-price-per-bottle/` and `/guides/how-to-cancel-a-wine-club/`; from each guide to the relevant reviews; from `/deals/` to the club behind each offer. This is pure upside — it distributes authority to the already-thin hubs and gives Google the topical cluster it currently can't see.

### 5. Review pages share one rigid section template; sentences are reused verbatim across pages — **Medium**
**Evidence:** All six club reviews use the identical H2 set — `The facts (as of 2026-10-16)` · `Worth it because` · `But know this` · `The math (the only part that matters)` · `The fine print we read` · `Who it's for` (7 pages share "The fine print we read", "Worth it because", "checked 2026-10-16"). Boilerplate repeats across pages: "we haven't tested"/"we have NOT tested" (5 pages), "~$16.50 a bottle" (6 pages), "cancel anytime" (13 pages).
**Recommendation:** The template is good UX and the *substance* differs per page, so this is not fatal — but it is exactly the "repetitive structure across pages" marker the QRG lists for AI-era content. Vary heading phrasing per club (e.g. club-specific H2s), and trim the repeated closing boilerplate so each review's unique angle leads. Ensure the reused disclaimer sentence is varied, not copy-pasted.

### 6. Multiple `<h1>` tags on home and about; home H1 is not title-aligned — **Medium**
**Evidence:** Parsed headings show **3 H1s on `/`** (`F*CK`, `NICE`, `WINE` — a wordmark split across tags) and **2 H1s on `/about/`** (`F*ck Nice`, `Wine.`). Every other page has exactly one H1. The home H1 renders as "F*ck Nice Wine" while the title is *"Wine Deals, Judged Honestly — FKN Wine"*, so the primary heading carries no topical keyword.
**Recommendation:** Wrap the wordmark in a single element styled (not marked up) as three lines — one `<h1>` per page. Consider adding a visually-hidden or secondary topical heading (e.g. "Wine deals and wine-club reviews, judged honestly") so the H1/title pair reinforces the same topic.

### 7. Content breadth gap — only 9 editorial pages, missing page types a ranking competitor has — **Medium**
**Evidence:** Live editorial set = 3 guides + 6 club reviews + hub pages. The `/wine-clubs/` page itself concedes the gap: *"More clubs are in the queue (Wine Insiders, WSJ Wine, Plonk). We publish when the paperwork is done, not before."* No "best of / roundup" comparison page, no retailer hubs (Wine.com, WTSO, Total Wine), no price-band pages ("wine under $15"), no shipping-**by-state** guide (a natural high-intent topic they already touch in every review), no glossary/FAQ, no news/deals-freshness stream, no team/author pages.
**Recommendation:** Prioritise by intent overlap, not volume: (a) a "best wine clubs" master comparison (the table in `wine-club-price-per-bottle` is the seed), (b) state-shipping guide, (c) the clubs already promised in the queue, (d) a price-per-bottle calculator or filterable deals table. Each new page should link to ≥2 existing pages — which the repo's own `CONTENT_ROADMAP.md` already mandates but the live site doesn't yet do.

### 8. Metadata: brand suffix leaks into description bodies — **Low**
**Evidence:** `metadata_template.py` flags `brand-suffix-in-description` on `/about/`, `/disclosure/`, `/privacy/`, `/subscribed/` (e.g. "What FKN Wine is and how we work…"). Site-level `site_risk: low`, `templated_ratio: 0.0` — metadata is otherwise unique and written.
**Recommendation:** Drop "FKN Wine" from those four description bodies; the title already carries the brand. Minor SERP-character win, and it removes the last generation-artefact flags.

### 9. Review schema is `Article`, not `Review` — **Low**
**Evidence:** Club reviews emit `Article` (+ Organization/WebSite) only; no `Review`/`Product`/`itemReviewed`, no `ReviewAction`, no `FAQPage` anywhere. `author` is the Organization.
**Recommendation:** Don't invent star ratings (that would break the brand rule). But `Article` + `about`/`mentions` pointing at the club `Product`/`Organization`, plus a `Person` author, would improve entity clarity and AI citation readiness without fabricating any tasting or score.

### 10. In-repo content roadmap no longer matches the live site — **Info**
**Evidence:** `CONTENT_ROADMAP.md` describes a **German** supermarket-wine blog ("bester weißwein unter 10 euro", "Aldi vs. Lidl", "Glühwein-Special", "7 Artikel live") that bears no relation to the live English wine-club content set. `AGENTS.md` describes the current English concept correctly.
**Recommendation:** Archive or rewrite the roadmap against the English US-first strategy so it can't misdirect future content work. Not a live-site issue.

---

## Limitations

- **No live crawl was possible from this task** — all analysis ran against the pre-captured HTML in `crawl/` (dated 2026-10-16 per page stamps) and the read-only markdown in `src/content/`. Whatever changed on the site after capture is not reflected.
- **External/off-page authority was not assessed** — no backlink profile, domain age, brand mentions, or press citations were collected (no paid APIs), so the Authoritativeness score rests only on on-page signals.
- **E-E-A-T weights are the skill's internal model, not Google's** — Google publishes no numeric weights and says only that "trust is most important". Treat the factor scores as relative, not absolute.
- **`nlp_analyze.py` was intentionally not run** (it calls the paid Google Cloud Natural Language API), and **`content_verify.py` is low-signal here** — its regex claim-detector found 0 claims on 18/19 pages and 1 uncited claim on Wine Access, so it neither confirms nor clears citation gaps. The dated source-notes in the reviews (which name each merchant's own site) are the real citation signal and were assessed manually.
- **Readability was judged qualitatively** (short sentences, plain vocabulary, tables) rather than with a validated formula; no Flesch-Kincaid-equivalent run was performed.
- **Keyword rankings and actual SERP positions were not checked** — topic focus was assessed only from on-page titles/H1s/body, not against search demand.
