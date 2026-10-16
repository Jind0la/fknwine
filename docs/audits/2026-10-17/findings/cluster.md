# FKN Wine — Topic-Cluster & Internal-Link Architecture

**Site:** https://fknwine.com · **Pages crawled:** 19 (all HTML captured, full `<a href>` extraction)
**Method:** parsed every internal `<a href>` from the 19 crawl files; separated the **global nav/footer boilerplate** (the same 9 links on all 19 pages) from **contextual body links**, so degree numbers reflect editorial links, not chrome.
**Date:** 2026-10-17

---

## Internal link graph

Global boilerplate = the 9 links rendered on **every** page: `/`, `/deals/`, `/wine-clubs/`, `/guides/`, `/about/`, `/disclosure/`, `/privacy/`, `/terms/`, `/imprint/`. Because they appear site-wide, those 9 targets have a raw in-degree of 19; the meaningful signal is the **contextual** in/out degree below.

| Page | Contextual out-links | Contextual in-links (who) | Raw in-degree | Role |
|---|---|---|---|---|
| `/` (home) | 4 → /deals/, /wine-clubs/, /wine-clubs/firstleaf/, /about/ | 0 | 19 (nav) | Entry hub |
| `/wine-clubs/` | 6 → all 6 club reviews | 1 (home) | 19 (nav) | **Club hub** |
| `/guides/` | 3 → all 3 guides | 0 | 19 (nav) | **Guide hub** |
| `/deals/` | 0 | 2 (home ×2) | 19 (nav) | Transactional hub, dead end |
| `/about/` | 1 → /disclosure/ | 2 (home, nav) | 19 (nav) | Trust |
| `/disclosure/` | 0 | 3 (about, club reviews) | 19 (nav) | Trust |
| `/wine-clubs/firstleaf/` | 0 | 2 (home, /wine-clubs/) | 2 | Review (spoke) |
| `/wine-clubs/winc/` | 0 | 1 (/wine-clubs/) | 1 | Review (spoke) |
| `/wine-clubs/california-wine-club/` | 0 | 1 (/wine-clubs/) | 1 | Review (spoke) |
| `/wine-clubs/naked-wines/` | 0 | 1 (/wine-clubs/) | 1 | Review (spoke) |
| `/wine-clubs/gold-medal-wine-club/` | 0 | 1 (/wine-clubs/) | 1 | Review (spoke) |
| `/wine-clubs/wine-access/` | 0 | 1 (/wine-clubs/) | 1 | Review (spoke) |
| `/guides/how-to-test-a-wine-club/` | 0 | 1 (/guides/) | 1 | Guide (spoke) |
| `/guides/how-to-cancel-a-wine-club/` | 0 | 1 (/guides/) | 1 | Guide (spoke) |
| `/guides/wine-club-price-per-bottle/` | 0 | 1 (/guides/) | 1 | Guide (spoke / latent pillar) |
| `/privacy/`, `/terms/`, `/imprint/` | 0 | 0 | 19 (nav) | Legal |
| `/subscribed/` | 1 → /deals/ | **0** | **0** | **True orphan** (post-signup, no in-links) |

**Graph shape: a shallow two-level hub-and-spoke with no lateral edges.**
- The only "hub" edges that exist are the two index pages fanning out: `/wine-clubs/` → 6 reviews and `/guides/` → 3 guides.
- **Every spoke is a dead end.** All 9 spoke pages (6 reviews + 3 guides) have **0 contextual out-links** other than a single breadcrumb back to their own index. No spoke links to another spoke, to the other cluster, or to `/deals/`.
- **No page in the site links contextually to `/deals/` except the home page** (and `/subscribed/`). The single most commercially important page is fed by one link.
- **Orphans / near-orphans:** `/subscribed/` is a true orphan (0 in-links). The 3 guides and 5 of 6 reviews are **near-orphans** — one contextual in-link each, from a hub. Only `/wine-clubs/firstleaf/` has 2.
- **Anchor-text quality is weak.** The hub cards wrap an entire card in one `<a>`, so anchors are run-on blobs, e.g. `/wine-clubs/` → firstleaf with anchor `"Depends who you are$44.95 first box (6 bottles)FirstleafPers…"`. No descriptive, keyword-bearing anchor text anywhere.

**Answer to the explicit questions:**
- *Do club reviews link to the guides and back?* **No.** Reviews link only to `/wine-clubs/` and `/disclosure/`; guides link only to `/guides/`. Zero cross-links in either direction, despite the price-per-bottle guide literally tabulating all six clubs.
- *Does the deals page feed the clubs?* **No.** `/deals/` has **0 internal contextual links to any club review**. It links *out* to `firstleaf.com`, `winc.com`, `wine.com`, `wtso.com` directly — sending users and link equity off-site instead of to its own reviews.

---

## Clusters & pillars

Three topical clusters exist in the content, but only two are structurally connected — and neither has a true pillar.

### Cluster 1 — Wine club reviews (commercial investigation)
- **Members:** the 6 reviews (Firstleaf, Winc, The California Wine Club, Naked Wines, Gold Medal Wine Club, Wine Access).
- **Current hub:** `/wine-clubs/` — an index, not a pillar. It lists cards but contains no comparison prose, no criteria, no verdict table.
- **Pillar it should have:** a `/wine-clubs/` **"Best wine clubs, ranked — how we score them"** comparison pillar (2,500–4,000 words) that states the scoring method, ranks the six, and links out to all six reviews with descriptive anchors. The index cards can stay, but the pillar needs comparison content above them.

### Cluster 2 — Wine club mechanics / buyer guides (informational)
- **Members:** `how-to-test-a-wine-club`, `how-to-cancel-a-wine-club`, `wine-club-price-per-bottle`.
- **Current hub:** `/guides/` — again an index, not a pillar.
- **Pillar it should have:** **`wine-club-price-per-bottle` is the natural pillar** — it is the only page with original data (six clubs, one table). It should be promoted to a "Wine club pricing & value: the data" pillar (2,500+ words) that both summarizes the data and links down to the two how-to spokes and across to all six reviews.

### Cluster 3 — Deals (transactional) — *currently pillar-less and cluster-less*
- **Members:** `/deals/` alone.
- **Pillar it needs:** `/deals/` is the pillar; it needs **spokes** (deal-type or club-specific deal articles) and, critically, it must link *inward* to the reviews instead of straight out to merchants.

**Cross-cluster state:** effectively none. Cluster 1 ↔ Cluster 2 ↔ Cluster 3 have **zero** contextual links between them. The architecture is two isolated islands plus an unconnected deals page.

---

## Missing links

Highest-impact editorial links, in priority order. "Anchor" = suggested descriptive anchor text (not the current run-on blobs).

| # | From | To | Anchor |
|---|---|---|---|
| 1 | `/guides/wine-club-price-per-bottle/` | each of the 6 club reviews | e.g. "Firstleaf price per bottle", "Winc cost breakdown" — one link per row of the comparison table |
| 2 | each of the 6 club reviews | `/guides/wine-club-price-per-bottle/` | "how the price per bottle really breaks down" |
| 3 | `/deals/` | relevant club reviews (≥4) | "our Firstleaf review", "our Winc review" — stop sending traffic straight to merchants |
| 4 | `/guides/how-to-cancel-a-wine-club/` | the 6 club reviews | "how to cancel Firstleaf", "how to cancel Winc" (per-club cancellation detail) |
| 5 | `/guides/how-to-test-a-wine-club/` | ≥4 club reviews | "see how Firstleaf scores on these tests" |
| 6 | `/wine-clubs/` | `wine-club-price-per-bottle` | "compare price per bottle across all six clubs" |
| 7 | `/wine-clubs/` | `/guides/how-to-test-a-wine-club/` | "how we test a club before reviewing it" |
| 8 | `/` | the other 5 club reviews | home currently links only Firstleaf — add "all six reviews" or a 3-up review strip |
| 9 | `/` | `/guides/` and the 3 guides | contextual "how to pick / cancel a club" links (today only in nav) |
| 10 | each club review | 1–2 sibling reviews | "compare with Winc", "see Naked Wines instead" (in-conclusion alternatives) |
| 11 | each guide | its 2 sibling guides | "next: how to actually cancel a club" (sequential guide flow) |
| 12 | `/wine-clubs/` and `/guides/` | `/deals/` | "see this month's wine deals" (feed the commercial page) |

**Minimum viable fix:** links 1–4 alone turn the two dead-end clusters into a connected mesh and route the deals page inward.

---

## Content gaps

Ranked by expected value for a wine-deals publisher, with the search intent each serves.

1. **"Cheap wine delivery / wine deals this month"** (transactional) — a recurring, dated deals round-up that anchors Cluster 3 and internally feeds `/deals/` and the reviews. The deals page currently has no supporting article.
2. **"Best wine club for [use case]" hub pages** — gifting, budget/under-$X, red-only, beginners, couples (commercial). Splits one broad term into winnable long-tails and gives the 6 reviews natural inbound links.
3. **"Are wine clubs worth it? / Wine club vs buying at Costco or Trader Joe's"** (informational) — the top-of-funnel question that feeds both review and guide clusters; the site has no comparison against retail.
4. **"Wine club intro offers & promo codes, compared"** (transactional) — every review mentions an intro price but nothing aggregates them; a high-intent capture page.
5. **"Wine club cancellation fees & refunds by club"** (informational) — extends the existing cancel guide with per-club detail and links into each review.
6. **"How much does a wine club cost? / average price per bottle by club"** (informational) — the sibling to the price-per-bottle pillar; targets a distinct query set.
7. **"Wine shipping laws by state / can wine clubs ship to me?"** (informational) — high-volume, evergreen, and it links naturally to every review.
8. **"Wine club gifts under $X / wine gift subscriptions"** (commercial) — Gold Medal and California Wine Club already pitch gifting; nothing ranks for the gift query.
9. **"Best cheap reds / wines under $15 to buy online"** (transactional) — product-level deals content that supports the deals cluster without needing club reviews.
10. **"Wine club reviews: how we test and score"** (informational/trust) — a methodology page (E-E-A-T) that becomes the natural inbound-link target for all 6 reviews and both hubs.

---

## Limitations

- **No SERP/volume data.** Per the no-paid-API constraint, cluster groupings are inferred from the site's own content and URL architecture, **not** from SERP-overlap scores or keyword volumes. Keyword-pair overlap, volume, and difficulty were not measured.
- **19 pages only.** This reflects the crawled set. Any page not in `crawl/` (e.g. paginated, tag, or unlinked URLs) is invisible here; the graph cannot show links *from* uncrawled pages.
- **Boilerplate inferred, not authored.** I classified the 9 links present on all 19 pages as global nav/footer. A few carry contextual intent too (e.g. a club review's "← All club reviews" breadcrumb), so the true "editorial" count for those targets is slightly higher than the table's contextual column.
- **Rendered vs static.** Links were parsed from captured HTML; any client-side-injected links not present in the static markup would be missed.
- **Anchor-text blobs.** Card-level anchors wrap whole cards, so anchor text is not cleanly separable into a keyword phrase; the "missing links" anchors are proposals, not extractions.
- **No conversion/analytics data** was available, so priority ordering is a judgment call, not an outcome-weighted ranking.
