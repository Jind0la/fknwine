# War Room — FKN Wine

> Arbeits-Log des Projekts. Versioniert in Git, gepflegt von Hermes (Orchestratorin).
> Grundsatz: **Der Raum ist Teil der Team-Intelligenz** — Fehlschläge und Entscheidungen
> sind so wertvoll wie Erfolge. **Verdichtungs-Regel:** unter ~150 Zeilen halten;
> am Session-Ende abgeschlossene Tasks entfernen, Einträge >2 Wochen kürzen.

## Aktueller Stand

- `2026-10-16` — **Monetarisierungs-Konzept steht — Entscheidungsvorlage für Nimar.**
  Auftrag: „Geld mit Domain + Accounts verdienen", Markt frei wählbar. Recherche
  (Markt, Affiliate-Ökonomie, X-Realität) → **Empfehlung EN/US-Pivot**: „Deals + Data +
  Voice" auf fknwine.com. Zahlen: US-Weinmarkt >$115 Mrd.; Wein-Clubs $20–50/Signup,
  Shops 4–12 %, **Amazon-Alkohol 0 %**; X zahlt selbst fast nichts (Original Content
  Rewards: 500 verif. Follower + 500k verif. Impressions/90 T.; Mini-Payouts). Altstand:
  kein Geld-Pfad (0 Affiliate-Links), kein Analytics, kein Publikum, X tot (1 Follower).
  Doc: KB `prj-fknwine-monetarisierung` (+ `prj-fknwine` aktualisiert). **Nichts umgebaut —
  wartet auf Go; Preview-Pflicht bleibt.**
- `2026-10-16` — **Host-Konsolidierung live (Cloudflare-Zone, nicht Repo).**
  `always_use_https: on` + Redirect Rule `www.fknwine.com` → `https://fknwine.com`
  (301, Pfad+Query, 1 Hop). Verifiziert per curl: http-Apex 301 same-host, www
  http+https → Apex, Apex https 200, Sitemap nur `https://fknwine.com`. Zone
  `fknwine.com` (`51e9dc8462690929e186758bf3a0916a`), Account `Nimarm@me.com`
  (`ab7100d2d421801bb797f15c4c953208`). Der frühere `http→pages.dev`-Redirect kam aus
  Pages' Edge-Verhalten (Zone: `always_use_https: off`, leeres Ruleset, Page Rules leer).
  **Lehre:** `http.scheme` ist in dieser Ruleset-Phase kein gültiges Feld (API 20127),
  der ganze Ruleset-PUT fällt durch — Scheme-Upgrade über `always_use_https`.
- `2026-10-16` — **X-Zugang @FKNWine steht und ist schreib-verifiziert.** Konto seit
  08.07.2026 (id `2074768137501675520`, 19 Posts), war nicht in `~/.xurl` (nur
  App-only-Bearer + OAuth2 für @NMoradbakhti). Fix: `xurl auth oauth2 FKNWine
  --app my-app` (Browser, Callback localhost:8080), App hat alle Write-Scopes.
  Verifiziert: `xurl -u FKNWine /2/users/me` → @FKNWine; post `2111057054030839850`
  → delete → „Could not find post"; kein 402/Billing-Blocker. **Lehren:** Aufruf
  `xurl -u FKNWine …`; `xurl -i` gibt es nicht; Buffer-Problem → Output per `> /tmp/…log`.
- `2026-10-16` — **„Indexierung beantragen" gefahren: 10 von 14 URLs, dann machte Google das Tageskontingent zu.**
  Per Comet/CDP (echte Mouse-Events nötig; Kontingent real ~10/Tag; Flow startet intern
  erst einen Live-Test bis ~4 Min). Offen (4): wein-mythen, weine-die-du-niemals,
  aldi-lidl-edeka, impressum → Nachzug: `~/.hermes/scripts/fknwine-gsc/` (State
  `~/.hermes/state/fknwine_gsc_requests.json`, Cron `92efc5307dea` täglich 09:30,
  verstummt selbst; **löschen, wenn alles beantragt ist**). Details: KB `prj-fknwine`.
- `2026-10-16` — **Index-Check: 0 indexiert; Bremsklotz gefunden.** URL-Inspection
  (14 URLs): 0 indexiert, 1 „Duplikat", 4 „Gecrawlt – zurzeit nicht indexiert"
  (Crawls 15.10. 09:56–10:53 CEST, also nach dem Canonical-Fix), 5 „Gefunden – zurzeit
  nicht indexiert", 4 unbekannt. Sitemap-Report: 33 eingereicht / 0 indexiert. Bei den
  gecrawlten Artikeln steht `googleCanonical` = `userCanonical` = fknwine.com-URL →
  Fix greift. Befund: Startseite ist **Duplikat mit `googleCanonical = fknwine.pages.dev/`**
  (drei Hosts lieferten dieselbe Seite); Host-Fix seither live, Urteil per Re-Crawl abwarten.
- `2026-10-16` — **Eigener Fehler: Host-Redirect per Pages-Function zerlegte die
  Live-Seite (≈4 Min Ausfall), sauber zurückgerollt.** `functions/_middleware.js`
  sollte pages.dev + www per 301 auf fknwine.com konsolidieren (Logik vorher mit
  Node gegen 8 Fälle getestet, Preview grün). In Produktion **Redirect-Loop auf
  fknwine.com selbst** (`curl -L`: 50 Redirects), weil Pages Functions bei einer
  Custom Domain `context.request.url` weiterhin mit `pages.dev`-Host sieht. Rollback
  per `git revert` (`df1a627`). **Lehren:** (1) Host-basierte Redirects nie aus einer
  Pages-Function ableiten; (2) Logik-Test + grünes Preview beweisen hostabhängiges
  Produktionsverhalten nicht; (3) `git revert` kennt kein `-q`.
- `2026-10-15` — **Canonical-Drift behoben und live.** Root Cause:
  `site: 'https://fknwine.pages.dev'` in `astro.config.mjs` **plus** 19 hartcodierte
  `pages.dev`-Stellen → Canonical, `og:url`, JSON-LD, Sitemap und RSS zeigten auf die
  Preview-Domain. Fix: eine Quelle (`site` → `Astro.site`), Canonical aus
  `Astro.url.pathname` mit Trailing Slash (Pages leitet `/x` → `/x/` per 308),
  `robots.txt`/`llms.txt` auf fknwine.com. Verifiziert: Build grün (33 Seiten),
  0 Treffer `pages.dev` in `dist/`, 33 Canonicals auf fknwine.com; Merge
  `58d5cc9..6b6b904` (FF) + Live-curl. Erste Version war noch falsch (Canonical ohne
  Trailing Slash) → `canonicalPath`-Helper in `Layout.astro` + `ArticleLayout.astro`.
  **DNS-Befund:** Zone bei Cloudflare, Mail über Cloudflare Email Routing, Registrar IONOS.
- `2026-10-15` — **Google Search Console aufgesetzt, Property verifiziert.** Login
  per OAuth-Code von Nimar (Scopes `webmasters` + `siteverification`). Property
  `https://fknwine.com/` per FILE verifiziert (Owner `nimarny@googlemail.com`);
  `public/google35b2017bd84955fa.html` — **nie löschen**. Sitemap eingereicht (0 Fehler).
- `2026-10-14` — **Projekt aus dem Archiv geholt und wieder verankert.** Repo
  `Jind0la/fknwine` (public) nach `~/Workspace/projects/19-fknwine` geklont,
  Desktop-Projekt `fknwine` (p_881c6f4f) + KB-Notiz `prj-fknwine` + dieser War Room.
- `2026-07-16` (Nimar/IONOS) — Whois-Privacy-Anfrage zu fknwine.com, **nie beantwortet**.

## Laufende Tasks

| Task | Wer | Status | Nächster Schritt |
|---|---|---|---|
| EN-Pivot „Deals + Data + Voice" | Era + Nimar | **Wartet auf Go** | Nach Go: Preview → Live, Affiliate-Konten (Awin/FlexOffers/Impact), X Premium, Content-Welle 1 |
| Index-Stand nachhalten | Era | **Wächter läuft** | Cron `a8a57aadcd03` (Mo 09:00); bei EN-Relaunch nur noch begrenzt relevant |
| Newsletter-Kanal | offen | Alt-Formular zeigt auf `buttondown.com/nimar` | EN-Neustart ersetzt es (eigene Plattform, Konzept §5) |

## Entscheidungen

- **Empfehlung aus der Monetarisierungs-Analyse (16.10., offen):** EN/US-Pivot statt
  DE-Altbestand — Markt war laut Auftrag frei wählbar, Alt-Artikel laut Nimar verzichtbar;
  Konzept in KB `prj-fknwine-monetarisierung`. Bis zum Go gilt: kein Umbau ohne Preview.
- **Kein Redesign, kein Umbau** (alter Auftrag: Betrieb, nicht Look). Neubrutalist-Optik
  und die 11 Artikel bleiben, bis der Pivot entschieden ist.
- **Eine Domain-Quelle statt 19 Hardcodes** (`astro.config.mjs site` → `Astro.site`).
- **Canonical mit Trailing Slash**, weil Cloudflare Pages ohne Slash per 308 umleitet.
- **AI-Crawler bleiben gesperrt** (`robots.txt`), obwohl `llms.txt` sie einlädt — bewusst
  nicht eigenmächtig geändert (Entscheidung Nimar).

## Fehlschläge & Korrekturen

- **Projekt-Wissen war verloren** (kein Eintrag trotz live-Site, X-Account, 12 Commits) →
  korrigiert durch War Room, KB-Note `prj-fknwine`, Desktop-Projekt.
- **Host-Redirect per Pages Function → Redirect-Schleife** und **erste Canonical-Version
  ohne Trailing Slash** — Details + Lehren in „Aktueller Stand".

## Known Limitations (Gap-Liste)

- [ ] **Deploy hängt an Cloudflare Pages GitHub-Integration** — kein Wrangler-Token,
      Deployment nicht per CLI prüfbar. Verifikation nur über Live-Check nach dem Push.
- [x] **Drei Hosts lieferten dieselbe Seite** — erledigt 16.10. in der Zone.
      **Rest offen:** `fknwine.pages.dev` liefert weiterhin 200 (Cloudflares Pages-Zone,
      Redirect nicht setzbar); Entdopplung über Canonical-Tag + Re-Crawl.
- [ ] Newsletter-Formular postet an `buttondown.com/nimar` — Marken-Bruch, ungeklärt
      (wird durch EN-Neustart obsolet, falls Go kommt).
- [ ] GSC steht, aber **kein Analytics** → Traffic-/Kanalzahlen fehlen (Fix im Pivot: §8).
- [ ] Artikel-Preise/Bestände Stand Juli 2026 (Affiliate-Phase nie gestartet).

## Nächste Schritte

- [ ] **Go/No-Go für den EN-Pivot einholen** (Vorlage: KB `prj-fknwine-monetarisierung`;
      Nimar-Aufwand ≈10 Min: Go, Konten-Freigaben, X Premium). Danach Setup-Woche mit Preview.
- [ ] Index-Stand nachhalten: Startseite + 11 Artikel in ~1 Woche erneut prüfen
      (`~/.hermes/scripts/gsc.py inspect <property> <url>`); Re-Crawl-Urteil lesen.
- [ ] **Cron `92efc5307dea` (GSC-Nachzug) löschen, sobald alle 14 URLs beantragt sind.**
- [ ] Optional: Domain-Property `sc-domain:fknwine.com` (nur DNS-TXT nötig).
- [ ] X-Zugang steht → Redaktionsplan **nach Pivot-Go** reaktivieren (Konzept §5/§7:
      Cadence ohne Follow-Churn; `data/x-posts.md` + `data/CONTENT_ROADMAP.md` als Vorlage).
