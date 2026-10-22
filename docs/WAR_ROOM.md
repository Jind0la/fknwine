# War Room — FKN Wine

> Arbeits-Log, Git-versioniert, gepflegt von Hermes (Orchestratorin).
> **Verdichtungs-Regel:** unter ~150 Zeilen. Abgeschlossenes raus, Fremdberichte nie als Quelle.

## Ziel — Wachstumsblock 2 (22.10.2026, Nimars Go)

**Auftrag:** findbare Fläche ohne Backlinks. **Stand:**
① Keyword-Sweep ✓ (64 Keywords, 33 mit Volumen → `docs/keyword-sweep-2026-10-22.json`)
② Vergleichsseiten ✓ (`firstleaf-vs-winc`, `naked-wines-vs-firstleaf`)
③ GEO-Block ✓ (zitierbarer „Short answer" auf allen 6 Reviews, `fadd761`)
④ Sitemap/IndexNow ✓ (**24 URLs**, nach jeder Welle neu gepusht)
⑤ **offen:** Content-Welle 4 · `cheapest` statt `cheap` (KD 19 statt 32) ·
`naked wines cancel` (30/KD 5) + `winc cancel` (10/KD 2) als fokussierte Abschnitte.
**Deckel:** ohne Off-Site ~300–400 Besucher/Monat; „wine club" (12.100/KD 52) unerreichbar.

## Kernbefund (22.10.2026, mit echten Daten)

**Indexierung ist durch:** URL-Inspection (GSC-API) zeigt Startseite, `/wine-clubs/` und
`/wine-clubs/firstleaf/` als **PASS, „Submitted and indexed"**, `googleCanonical = fknwine.com`.
Der Duplikat-/`pages.dev`-Befund vom 17.10. ist **erledigt**. Sitemap kennt **24 URLs**.
**Es fehlt Ranking, nicht Indexierung:** GSC 28 T (24.09.–20.10.) = **12 Impressions / 0 Klicks**, alle
von alten DE-URLs (`/artikel/rose-guide-supermarkt/` Pos 8); die EN-Seiten hatten null Impressionen.
**Backlinks: 2 Links / 2 Referring Domains, Serpstat Domain Rank 8** → Autorität ist der Flaschenhals.
**Marken-/Long-Tail ist der Weg:** `gold medal wine club review` 10/KD **3**, `winc review` 70/**4**,
`california wine club review` 50/**7**, `firstleaf review` 140/**17** (CPC $240), `naked wines reddit`
90/**3**, `naked wines cancel` 30/**5**, `cheapest wine club` 140/**19**, `firstleaf vs winc` 10/**0**.
**Reddit-API gesperrt** (Responsible Builder Policy) — die Reddit-Seite ist über SERP-belegte
Thread-Titel gebaut, **nicht** über gelesene Kommentare.

## Technik (PageSpeed Insights, eigener Key — die verbindliche Zahl)

Mobil **Perf 100** (FCP 1,5 s · **LCP 1,5 s** · CLS 0,005 · TBT 0 ms · 7 Requests) · Desktop **100** (LCP 0,4 s).
*Korrektur-Kette:* „mobil 99/LCP 1,9 s" war ein **ungedrosselter** lokaler Lauf; PSI (Slow-4G) sagte zuerst
**65/5,9 s**. Ursache war **nicht Cloudflare**, sondern der **beehiiv-iframe** (gtm.js 117 KiB, HUMAN/px-cloud
98 KiB, eigene Google-Fonts inkl. PT Serif → 40 statt 7 Requests). **Fix `2f31859`:** Loader per
IntersectionObserver erst bei Sichtbarkeit → **100/1,5 s** nachgemessen. A11y 92 → **100**; SEO 92
(einziger Rest `Content-Signal: Unknown directive`, für Google irrelevant).

## Infrastruktur (Stand 22.10.2026)

- **Discovery:** **IndexNow** live — Key `0014cc2aab413ce45352e0770f2e903b` (`public/<key>.txt`, nicht
  löschen); nach jedem Deploy alle Sitemap-URLs an `api.indexnow.org` + `www.bing.com` (HTTP 200/202).
  **Bing** speist Copilot, ChatGPT-Suche und DuckDuckGo — der einzige Kanal ohne Backlink.
  Cloudflare **Crawler Hints = an** (nur Dashboard; `crawler_hints` ist kein API-Setting).
- **Bing Webmaster API:** Key in `.env` (`BING_WEBMASTER_API_KEY`), Site **verifiziert**, Sitemap geholt,
  21 URLs aktiv eingereicht. `GetQueryStats` leer (Bing kennt die Seite noch nicht).
- **Google:** PageSpeed/CrUX über `GOOGLE_API_KEY` (Projekt `hermes-agent-nimar`); GSC-Leserechte über
  **Treg** (Connection 18871, $0/Call): `url_inspection`, `sitemaps`, `performance`. **Immer
  URL-Inspection statt `site:`-SERP** — die SERP zeigt 301er-Leichen. Property per FILE verifiziert,
  `public/google35b2017bd84955fa.html` **nie löschen**.
- **Cloudflare-Token** `era-fknwine-read-write` in `secrets/cloudflare-token` (`active`): Zone Settings
  Edit · Zone Analytics Read · Cache Purge · **Account Settings Read** (letzteres war der Schlüssel für
  `/accounts`, *nicht* Account Analytics). 53 Zeichen mit Unterstrich = gültiges Format. **Kein DNS-Zugriff.**
- **Traffic-Wächter:** Cron `37a37f5866c4` (täglich 09:45, no_agent → Telegram), Montags Wochenreport,
  sonst nur bei Ereignis; leerer stdout = still. `~/.hermes/scripts/fknwine_traffic_watch.{sh,py}`.
  Verifiziert 22.10.: 7 T **68 Aufrufe/67 Besuche**, 28 T **100/100** — davon **60 % `ChromeHeadless`
  (unsere Audits)**, 20 % echtes Chrome, 10 % mobil, **90 DE / 10 US**, **100 % direkt, null externe
  Referrer**. Der Traffic ist **Eigenverkehr**.
- **Cloudflare-Leser:** `~/.hermes/scripts/fknwine-gsc/cf_traffic.py`
  (`verify|summary|pages|referrers|countries|devices`). **Lehre:** GraphQL braucht den `site_tag` aus der
  API, nicht den Beacon-`site_token` aus dem HTML.
- **Rank-Monitor:** Cron `1144f046b41b` (1. des Monats 9:00 → Telegram), `fkn_rank_check.py`, State
  `~/.hermes/state/fkn_rank.json`. Baseline 22.10.: **0/11 Keywords in Top 30**.
- **KI-Zugang:** Suche/Antworten erlaubt (`ai-input=yes`), Training gesperrt. Cloudflares AI-Panel ist die
  Autorität; nach Panel-Änderungen die Live-`robots.txt` neu parsen (Cloud-Liste ist nicht im Repo).
- **Domain/Deploy:** `site` in `astro.config.mjs` = einzige Domain-Quelle, Canonical mit Trailing Slash;
  `always_use_https` + www→Apex; Deploy über Pages-GitHub-Integration (kein Wrangler-Token).
- **Deal-Refresh:** Cron Mo 10:00, schreibt `deals.ts` nur bei grünem Build.

## Assets & Kanäle

- **Repo** `Jind0la/fknwine` → `~/Workspace/projects/19-fknwine`; Desktop-Projekt `fknwine`; KB `prj-fknwine`.
- **Awin:** Publisher **FKN Wine, ID 3126259**, Profil 100 %. Beworben: Gold Medal (59079), ONEHOPE (39702),
  Parcelle (94853); CWC läuft **nicht** über Awin-US. **Telefon-Falle:** Kontaktdetails
  (`/awin/affiliate/3126259/settings/contact`) ist die Sicht der Merchants — dort fehlt `telephone`;
  ebenfalls leer: `twitterUsername`, `blogUrl`, `facebookPage`. Speichern nur mit `password` im Formular.
  Ablehnungen: FlexOffers, Impact (#897752).
- **Mail:** info@/hey@fknwine.com → nimarm@me.com + Gmail-Kopie (CF-Worker `fkn-mail-router`), senden per
  Resend (`fkn_send.py`).
- **Newsletter:** beehiiv live, Welcome-Flow getestet, Issue #01 Draft („A $10 Malbec…"). Byline „FKN Wine";
  Legal-Seiten behalten den Operator-Namen. Composer-Lehren im Skill `beehiiv-newsletter`.
- **X:** @FKNWine (id `2074768137501675520`). Crons: Post 15:00 (`638ebb99dfae`), Antwort-Entwürfe 14:30
  (`2ec20ee15e3d` — **Account-Hinweis Pflicht in jeder Lieferung**, sonst gehen Antworten aus dem privaten
  Konto raus), Lern-Loop 23:00, Wochen-Auswertung Mo. **Harte Grenze:** X-API erlaubt **keine** Antwort/kein
  Quote auf fremde Posts (Politik, keine Tarifstufe); `post`/`like`/`repost`/`follow` gehen. Antworten nur
  von Hand, keine Browser-Automatisierung. Vor dem Antworten Post-Alter messen — @WineSpectator,
  @WineandSpirits, @drvino sind monatelang tot; lebendig: @WineEnthusiast, @WineFolly, @winewankers, @VinePair.
- **Content:** 6 Club-Reviews, 8 Guides, Methodenseite, **24 URLs**. Widersprüche (Firstleaf $25 vs. „no
  fees", Winc $9 vs. „free shipping always", Guthaben-Verfall, 3-Tage-Frist) stehen in den Reviews und auf
  `/how-we-test/` — **nicht hier duplizieren**. **Wir haben die Clubs nicht gekauft — steht auf jeder Seite.**

## Laufende Tasks

| Task | Status | Nächster Schritt |
|---|---|---|
| Ranking | 0/11 Keywords in Top 30 | Monatsreport 1.11. abwarten |
| Autorität | 2 RD, Domain Rank 8 | Verzeichnisse, Awin-Profil, Newsletter — der einzige echte Wachstumshebel |
| Affiliate | Awin aktiv, 3 Bewerbungen offen | Awin-Kontaktdetails (Nimar), Re-Apply nach Traffic |
| Content | 6 Clubs, 8 Guides | Welle 4: Wine Insiders, WSJ Wine, Plonk |
| Newsletter | Flow live, Issue #01 Draft | publizieren, sobald echte Abos da sind |
| Monetarisierung | Konzept steht | Tracking live → `AFFILIATE_LIVE=true` (FTC-Disclosure) |

## Entscheidungen

- **EN-Pivot** (Nimars Go): Deals + Data + Voice, EN/US. Branch → Live-Preview → Merge (**kein Merge ohne
  Preview-Blick**). X Premium aufgeschoben.
- **KI-Zugang:** lesen/suchen erlaubt, Training gesperrt.
- **Amazon zahlt 0 % auf Alkohol** — nie als Einnahme planen.
- **Keine Tasting-Behauptungen:** Meinung als Meinung, jede Zahl mit „Checked"-Datum.
- **Look bleibt:** Neubrutalist-Optik; Footer-Adresse vorerst Bochum.

## Lehren

- **Fremdberichte und eigene Meldungen sind Selbstauskünfte:** Audit-Rollen behaupteten „3 H1" (war 1) und
  „keine Indexierung" direkt über „1/19". Immer gegen echte Zahlen prüfen, nie gegen die Erwartung.
- **Ungedrosselte Lighthouse-Läufe lügen** — PSI mit Slow-4G ist der Maßstab.
- **Erst Ursache, dann Verdacht:** Cloudflare war unschuldig, das Newsletter-iframe schuldig.
- **Host-Redirect per Pages-Function zerlegte die Live-Seite** (~4 Min Ausfall) — nie wieder.
- **Messfehler:** headless `--window-size` setzt das Layout-Viewport nicht (erst
  `Emulation.setDeviceMetricsOverride` zeigte den Overflow).
- **Zeitzonen-Bug:** `Date.parse` + `toISOString()` schob Daten in Berlin um einen Tag zurück.
- **Cloudflare-Permissions sind feinkörnig:** `/accounts` hängt an Account *Settings*, nicht Analytics.

## Known Limitations

- [ ] Deploy hängt an der Pages-GitHub-Integration — Verifikation nur per Live-Check nach dem Push.
- [ ] Ohne Suchtraffic sind Traffic-Zahlen Kleinstgröße und von Eigenverkehr kaum zu trennen.
- [ ] Reddit-API nicht verfügbar (Policy) → keine echten Kommentar-Zitate.
- [ ] PageSpeed-Key trägt vier ungenutzte API-Scopes (Telemetry, Service Usage, People, Analytics Hub).

## Nächste Schritte

- [ ] `cheapest` statt `cheap` im Preis-Guide (KD 19 statt 32).
- [ ] `naked wines cancel` + `winc cancel` als fokussierte Abschnitte.
- [ ] Content-Welle 4 (Wine Insiders, WSJ Wine, Plonk) — je eine Seite + ~7 Keyword-Chancen.
- [ ] Awin-Kontaktdetails nachtragen (Nimar) → Merchants freischalten.
