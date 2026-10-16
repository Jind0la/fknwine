# Agentic-Browsing Readiness — fknwine.com

**Score: 88 / 100**
**Assessed:** 2026-10-16 · **Target:** https://fknwine.com/ (plus /deals/, /wine-clubs/, /wine-clubs/naked-wines/)
**Lighthouse Agentic Browsing:** **3/3** mobile and **3/3** desktop (Lighthouse 13.5.0, Chromium 155, local run — see Limitations)
**Agent-UX heuristic (`agent_ux_check.py`):** **100/100** on every page tested
**P0 failures:** 0 hard fails; 1 warn (robots access policy) + 1 agent-UX warn (link text)

One sentence: the site is a model server-rendered, accessible static surface — the only real
agent-facing defects are an accidental block of an AI *search* crawler (PerplexityBot) and
outbound deal links that all read "Get this deal →".

---

## What works

- **Server-rendered DOM (P0 pass).** For /deals/ and /wine-clubs/ the raw HTML text is
  byte-for-byte equivalent to the headless-rendered DOM: 369 / 572 words in both, text
  similarity **1.000** (raw vs rendered). No JS shell, no hydration dependency. `agentic_check`
  `server-rendered` → pass (506 words without JS, no shell marker).
- **Accessibility tree / landmarks.** Well-formed tree, labelled links, no unnamed interactive
  nodes. `agent-accessibility-tree` passes all 33 axe rules (Lighthouse, weight 1). Landmarks:
  `banner`, `navigation`, `main` (×1), `article`, `contentinfo`; 5–14 semantic landmarks per page.
  0 real `<button>`s, 0 `div[onclick]` widgets, 0 inputs without labels/aria.
- **CLS (P0 pass).** `cumulative-layout-shift` = **0.000417** (Lighthouse, weight 1) — far under 0.1.
- **Discovery files.** `robots.txt` reachable (HTTP 200, 45 groups); `llms.txt` present (HTTP 200,
  text/plain, 1020 bytes) and **passes the Lighthouse llms.txt rules** (weight 1). `sitemap-0.xml`
  present and referenced from robots.txt and llms.txt. Unknown URLs return a **real 404**
  (`/hermes-seo-404-probe-…` → 404, no catch-all 200).
- **Wine-clubs page link text.** Review cards carry descriptive accessible names
  (verdict + price + brand + club), and heading order is clean (`h1` → `h2` per club) — unlike
  the deals page (see finding 3).
- **Graceful no-JS newsletter fallback.** The beehiiv form is client-side, but the homepage keeps a
  `<noscript>` link to `https://fknwine.beehiiv.com/subscribe`, so a JS-less agent is not stranded.

---

## Findings

### 1. PerplexityBot (an AI *search* crawler) is disallowed at root — P0 (warn)
- **Evidence:** `robots.txt` contains `User-agent: PerplexityBot` / `Disallow: /` (in the site's own
  "AI Crawlers (2026)" block). `agentic_check` `robots-ai-groups` → **warn**,
  `search_crawlers_blocked_at_root: ["PerplexityBot"]`. Every other AI **search** token
  (OAI-SearchBot, Claude-SearchBot, Perplexity-User, Google-Agent) resolves to the `*` group and
  is allowed.
- **Impact:** PerplexityBot `honours` robots.txt, so the site is removed from Perplexity's index
  and answers — a search-visibility loss, not just a training question.
- **Recommendation:** Decide intent. If AI-search visibility is wanted, move PerplexityBot out of
  the Disallow block (keep training bots blocked). Training crawlers blocked here:
  GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended.

### 2. Content-Signal declared once, outside the named groups — P1 (warn)
- **Evidence:** one line `Content-Signal: search=yes,ai-train=no,use=reference` sits in the
  `User-agent: *` group. `agentic_check` `content-signal` → **warn**,
  `named_groups_without_signal: [GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot]`.
  Per RFC 9309 a crawler reads only its own group, and no normative text says Content-Signal
  escapes that.
- **Recommendation:** repeat the `Content-Signal:` line inside every named group so the training
  policy is unambiguous. (Content-Signal is a Cloudflare/IETF **draft — as of 2026-09-23**;
  Google says it does not act on it.)

### 3. Outbound deal links are not self-describing — P0 (agent-UX warn)
- **Evidence:** on /deals/ all five merchant buttons share the identical accessible name
  `Get this deal →` (rendered a11y tree shows `GET THIS DEAL →` ×5), pointing at wtso.com (×2),
  wine.com, firstleaf.com, winc.com. The merchant name (`<span class="deal-merchant">WTSO</span>`)
  and price exist in the card but are **not** part of the link's name.
- **Impact:** an agent (or a screen reader) enumerating links out of context sees five identical
  "Get this deal →" targets and cannot tell which merchant each leads to. This is the classic
  "read more" link-text failure.
- **Recommendation:** make the link name carry the target, e.g. `Get the WTSO deal` /
  `Get the Wine.com deal` — either in the visible text or via `aria-label` on the anchor.
  (Wine-clubs links already do this correctly.)

### 4. Prices and deal dates are not machine-readable — P2/P3
- **Evidence:** facts appear **only as unstructured visible text**, e.g.
  `$120 · 12 bottles` and `Checked Oct 16, 2026 · Ends Oct 18, 2026`. The page has **0 `<time>`
  elements, 0 microdata (`itemprop`), 0 date-bearing data attributes**, and the only JSON-LD is
  `Organization` + `WebSite` (block_count 1, types `["Organization","WebSite"]`). No `Offer`,
  `Product` or `ItemList` markup.
- **Impact:** agents must scrape prose to recover price, validity window and merchant — feasible
  but lossy and brittle for a deals page whose whole value is comparable, time-boxed offers.
- **Recommendation:** emit an `ItemList` of `Offer` (or `Product`+`Offer`) with `name`,
  `price`, `priceCurrency`, `availability`, `url` (the affiliate outbound URL) and `validThrough`
  (from the "Ends …" text). Optionally mark the dates with `<time datetime="…">`.

### 5. Newsletter form is not agent-usable (client-side beehiiv) — P1
- **Evidence:** the embed is `<script async src="https://subscribe-forms.beehiiv.com/v3/loader.js"
  data-beehiiv-form="…">`; the page carries **0 `<form>`, 0 `<input>`, 0 `<iframe>`** in both raw
  and rendered DOM, and the rendered a11y tree contains **no `textbox`/`form` node**. Only a
  `<noscript>` fallback link exists.
- **Impact:** an agent cannot see or fill the signup control in the DOM; it must fall back to the
  external beehiiv page. Acceptable for a newsletter, but it is not an agent-completable action.
- **Recommendation:** keep the noscript fallback (already present); optionally add a plain
  semantic `<form>` that POSTs to the beehiiv endpoint so the action is discoverable and fillable.

### 6. Optional discovery layer absent (opportunity, not a defect) — Info
- **Evidence:** no Markdown delivery (no `.md` sibling — `/index.md` → 404 — and no
  `Vary: Accept`; `markdown-delivery` → info), no `ai-catalog.json` (`/.well-known/ai-catalog.json`
  → 404, N/A), no WebMCP (`webmcp-tools` info, 0 registerTool call sites; `webmcp-entry-point` N/A),
  no A2A agent card / API catalog / OAuth metadata / UCP (all N/A).
- **Recommendation:** none required. The core surface is already agent-friendly; adding Markdown or
  a catalog is optional and should only be done with a clear use case.

---

## Access policy

- **Training:** blocked — GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended (+ Amazonbot,
  Bytespider, Diffbot and the Cloudflare managed list) `Disallow: /`; `Content-Signal ai-train=no`.
- **Search:** **mixed** — OAI-SearchBot, Claude-SearchBot allowed; **PerplexityBot blocked**
  (finding 1). `Content-Signal search=yes` declared.
- **User-triggered agents:** allowed — no user-agent tokens blocked at root; ChatGPT-User,
  Claude-User, Perplexity-User, Google-Agent all resolve to the permissive `*` group.

## Standards status (as of the check date 2026-09-23)

- Content-Signal: Cloudflare Content Signals Policy (CC0) + IETF **draft** — a preference, not
  enforcement; Google states it does not act on it.
- WebMCP, `ai-catalog.json` (ARD), Web Bot Auth: **drafts/proposals**. Their absence here is
  N/A-informative, not a defect.
- llms.txt: **community spec**; Lighthouse checks it, Google Search ignores it.
- Lighthouse Agentic Browsing ran as Lighthouse **13.5.0**; the `webmcp-*` and `ard-schema` audits
  are N/A (no forms registered, no catalog) and do not affect the fraction.

---

## Limitations

- **Lighthouse was run locally, not via PSI.** `lighthouse_agentic.py` via PageSpeed Insights
  returned **HTTP 429 — "Quota exceeded for quota metric 'Queries' … project_number:583797351490"**
  for both mobile and desktop. The 3/3 fraction is from a local `lighthouse@latest`
  (v13.5.0, HeadlessChrome 155) run of the home page; PSI's own number was **not** obtained.
  N = 3 counted audits here (agent-accessibility-tree, cumulative-layout-shift, llms-txt);
  maximum N is 6, and the WebMCP/ARD audits drop out as N/A.
- **WAF / user-agent matrix not tested.** `--ua-matrix` was not run (no authorization stated), so
  behaviour toward agent-tagged traffic through Cloudflare is unmeasured; only robots.txt policy
  and static markup were checked.
- **Beehiiv embed behaviour is third-party and headless-dependent.** The form was not observed in
  the audit browser's DOM; a real interactive browser may render it differently. The finding is
  about the DOM/agent surface, not about the form's visual presence.
- **No form-filling or transactional flow was exercised** (no reachable forms); interactive
  confirmation states could not be assessed.
- Lighthouse focused on the home page; `/deals/` and `/wine-clubs/` were covered by markup
  comparison, `agentic_check`/`agent_ux_check` and manual DOM inspection, not by a per-page
  Lighthouse run.
- Page content, robots.txt and llms.txt were treated as untrusted data; no embedded directives
  were followed.
