# War Room — FKN Wine

> Arbeits-Log des Projekts. Versioniert in Git, gepflegt von Hermes (Orchestratorin).
> Grundsatz: **Der Raum ist Teil der Team-Intelligenz** — Fehlschläge und Entscheidungen
> sind so wertvoll wie Erfolge. **Verdichtungs-Regel:** unter ~150 Zeilen halten;
> am Session-Ende abgeschlossene Tasks entfernen, Einträge >2 Wochen kürzen.

## Aktueller Stand

- `2026-10-16` — **Monetarisierungs-Analyse läuft (Nimar-Auftrag: „Geld mit Domain + Accounts verdienen", Markt frei wählbar).**
  Befund: kein Geld-Pfad (keine Affiliate-Links, kein Analytics, 0 indexiert), X praktisch tot
  (1 Follower, 248 Impressions all time), DE-Supermarkt-Nische monetarisiert kaum (Aldi/Lidl
  haben kein Affiliate-Programm) + schrumpfender Markt. **Recherche-These: EN/US-Pivot** —
  US-Weinmarkt ~$115 Mrd. (2025), Wein-Clubs zahlen $20–50/Signup, Online-Shops 4–12 %,
  Amazon zahlt für Alkohol 0 %. X-Monetarisierung 2026 geprüft (Original Content Rewards:
  hohe Hürden, Mini-Payouts → keine Einnahme-Säule). **Nächster Schritt:** Konzept-Doc in KB,
  dann Entscheidungsvorlage für Nimar.
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
- `2026-10-16` — **„Indexierung beantragen" gefahren: 10 von 14 URLs, dann machte
  Google das Tageskontingent zu.** Direkt im Comet-Browser per CDP (Port 9222):
  Suchfeld füllen → Enter → Prüfung abwarten → Button per echtem Maus-Event
  (`Input.dispatchMouseEvent`) klicken → Live-Test. **Beantragt (10):** Startseite,
  `/artikel/`, `beste-weine-unter-10-euro-supermarkt`, `beste-weissweine-unter-10-euro`,
  `rose-guide-supermarkt`, `sekt-prosecco-supermarkt-test`,
  `wein-fehler-die-deinen-wein-ruinieren`, `wein-fuer-grillabend`, `wein-fuer-pasta`,
  `wein-fuer-pizza`. **Offen (4, Kontingent):** `wein-mythen-die-falsch-sind`,
  `weine-die-du-niemals-kaufen-solltest`, `aldi-lidl-edeka-wein-vergleich`, `impressum`.
  Nachzug: `~/.hermes/scripts/fknwine-gsc/` (State
  `~/.hermes/state/fknwine_gsc_requests.json`, Cron `92efc5307dea` täglich 09:30,
  `no_agent`) legt sich selbst still, wenn alles beantragt ist. **Lehren:**
  (1) `element.click()` per JS zündet in der GSC-App nicht — echte Mouse-Events;
  (2) der Flow startet intern immer erst einen Live-Test (bis ~4 Min);
  (3) Comets AX-Baum liefert 0 Elemente → nur CDP führt zum Ziel;
  (4) Tageskontingent real und klein (~10/Tag) → wichtigste URLs zuerst.
- `2026-10-16` — **Index-Check: 0 indexiert; Bremsklotz gefunden.** URL-Inspection
  (14 URLs): 0 indexiert, 1 „Duplikat", 4 „Gecrawlt – zurzeit nicht indexiert"
  (Crawls 15.10. 09:56–10:53 CEST, also nach dem Canonical-Fix), 5 „Gefunden –
  zurzeit nicht indexiert", 4 unbekannt. Sitemap-Report: 33 eingereicht / 0 indexiert.
  Bei den gecrawlten Artikeln steht `googleCanonical` = `userCanonical` =
  fknwine.com-URL → Fix greift. Befund: Startseite ist **Duplikat mit
  `googleCanonical = fknwine.pages.dev/`**, weil drei Hosts dieselbe Seite
  auslieferten (pages.dev 200, www 200, http → 301 auf pages.dev). Solange Google
  pages.dev als Original wertet, bleibt die Custom Domain draußen. Host-Fix seither
  live (s.o.), Urteil per Re-Crawl abwarten.
- `2026-10-16` — **Eigener Fehler: Host-Redirect per Pages-Function zerlegte die
  Live-Seite (≈4 Min Ausfall), sauber zurückgerollt.** `functions/_middleware.js`
  sollte pages.dev + www per 301 auf fknwine.com konsolidieren (Logik vorher mit
  Node gegen 8 Fälle getestet, Preview grün). In Produktion **Redirect-Loop auf
  fknwine.com selbst** (`curl -L`: 50 Redirects), weil Pages Functions bei einer
  Custom Domain `context.request.url` weiterhin mit `pages.dev`-Host sieht. Rollback
  per `git revert` (`df1a627`; erster Versuch scheiterte am ungültigen Flag `-q`),
  Live-Verifikation: alle 10 geprüften URLs wieder 200, Canonical intakt.
  **Lehren:** (1) Host-basierte Redirects nie aus einer Pages-Function ableiten;
  (2) öffentlich erst ausrollen, wenn ein Zonen-Feature testbar ist — Logik-Test +
  grünes Preview beweisen hostabhängiges Produktionsverhalten nicht; (3) `git revert`
  kennt kein `-q`.
- `2026-10-15` — **Canonical-Drift behoben und live.** Root Cause:
  `site: 'https://fknwine.pages.dev'` in `astro.config.mjs` **plus** 19 hartcodierte
  `pages.dev`-Stellen → Canonical, `og:url`, JSON-LD, Sitemap und RSS zeigten auf die
  Preview-Domain. Fix: eine Quelle (`site` → `Astro.site`), Canonical aus
  `Astro.url.pathname` mit Trailing Slash (Pages leitet `/x` → `/x/` per 308),
  `robots.txt`/`llms.txt` auf fknwine.com. Verifiziert: Build grün (33 Seiten),
  0 Treffer `pages.dev` in `dist/`, 33 Canonicals auf fknwine.com; Merge
  `58d5cc9..6b6b904` (FF) + Live-curl. Erste Version war noch falsch (Canonical ohne
  Trailing Slash) → `canonicalPath`-Helper in `Layout.astro` + `ArticleLayout.astro`,
  explizite Canonical-Props entfernt, JSON-LD-URLs ergänzt. **DNS-Befund:** Zone bei
  Cloudflare (`lady/terry.ns.cloudflare.com`), Mail über Cloudflare Email Routing,
  Registrar nur IONOS → GSC-DNS-TXT über Cloudflare möglich.
- `2026-10-15` — **Google Search Console aufgesetzt, Property verifiziert.** Login
  per OAuth-Code von Nimar gelöst (Scopes `webmasters` + `siteverification`;
  Vault-Prompt geht über Telegram nicht, Automations-Browser ist headless). Beide
  APIs im Cloud-Projekt `1064311637568` waren deaktiviert → von Nimar aktiviert.
  **Lehre:** die „API ist aktiv"-Prüfung per unauthentifiziertem Request war ein
  Fehlschluss — 401 sagt nichts über den API-Status. Property `https://fknwine.com/`
  per FILE verifiziert (Owner `nimarny@googlemail.com`); `public/google35b2017bd84955fa.html`
  liegt im Repo — **nie löschen** (Property-Bestätigung). Sitemap eingereicht (0 Fehler).
  **Cloudflare-Eigenheit:** Pages strippt `.html` + 308 auf die endungslose URL; GSC ok.
- `2026-10-14` — **Projekt aus dem Archiv geholt und wieder verankert.** Es gab
  keinen Projektordner, keine KB-Notiz, keinen Memory-Eintrag — die Site lief seit
  Juli unbemerkt. Repo `Jind0la/fknwine` (public) nach
  `~/Workspace/projects/19-fknwine` geklont, Desktop-Projekt `fknwine` (p_881c6f4f)
  + KB-Notiz `prj-fknwine` + dieser War Room angelegt.
- `2026-07-16` (Nimar/IONOS) — Whois-Privacy-Anfrage zu fknwine.com („Business
  opportunities"), **nie beantwortet**; liegt als HTML in `~/Downloads/`.

## Laufende Tasks

| Task | Wer | Status | Nächster Schritt |
|---|---|---|---|
| Indexierung der 11 Artikel nachhalten | Era | **Wächter läuft** | Cron `a8a57aadcd03` (Mo 09:00, no_agent) prüft wöchentlich, meldet nur bei Änderung; Rest per `~/.hermes/scripts/gsc.py inspect` |
| Newsletter-Kanal | offen | Formular zeigt auf `buttondown.com/nimar` | Buttondown-Account auf fknwine umziehen oder Ziel bestätigen |

## Entscheidungen

- **Kein Redesign, kein Umbau.** Auftrag war Betrieb, nicht Look. Neubrutalist-Optik
  und die 11 Artikel bleiben, wie sie sind.
- **Eine Domain-Quelle statt 19 Hardcodes** (`astro.config.mjs site` → `Astro.site`,
  Canonical aus der ausgelieferten URL). Domain-Wechsel kostet danach eine Zeile.
- **Canonical mit Trailing Slash**, weil Cloudflare Pages ohne Slash per 308
  weiterleitet — ein Canonical auf eine weiterleitende URL ist ein Selbsttor.
- **AI-Crawler bleiben gesperrt** (`robots.txt`: GPTBot, CCBot, Claude-Web,
  PerplexityBot …). Widerspruch: `llms.txt` lädt genau diese ein — bewusst nicht
  eigenmächtig geändert (Entscheidung Nimar).

## Fehlschläge & Korrekturen

- **Projekt-Wissen war verloren** (kein Eintrag trotz live-Site, X-Account, 12 Commits) →
  korrigiert durch War Room, KB-Note `prj-fknwine`, Desktop-Projekt.
- **Host-Redirect per Pages Function → Redirect-Schleife** und **erste Canonical-Version
  ohne Trailing Slash** — Details + Lehren in „Aktueller Stand".

## Known Limitations (Gap-Liste)

- [ ] **Deploy hängt an Cloudflare Pages GitHub-Integration** — kein Wrangler-Token
      auf der Maschine, Deployment nicht per CLI prüfbar. Verifikation nur über den
      Live-Check nach dem Push.
- [x] **Drei Hosts lieferten dieselbe Seite** — erledigt 16.10. in der Zone
      (`www` + `http` same-host auf Apex, 1 Hop). **Rest offen:** `fknwine.pages.dev`
      liefert weiterhin 200 — der `*.pages.dev`-Alias gehört zu Cloudflares
      Pages-Zone, ein Redirect daraus ist nicht setzbar. Solange Google pages.dev
      als kanonisch wählt, bleibt die Startseite „Duplikat". Entdopplung über das
      Canonical-Tag (`https://fknwine.com/`) + Re-Crawl, kein Function-Workaround.
- [ ] Newsletter-Formular postet an `buttondown.com/nimar` (nicht fknwine) —
      Marken-Bruch, im Datenschutz aber als Buttondown benannt. Ungeklärt.
- [ ] GSC steht (Property + Sitemap), aber **kein Analytics** → Traffic- und
      Kanalzahlen fehlen, Wirkung einzelner Artikel nicht messbar.
- [ ] Artikel-Preise/Bestände Stand Juli 2026 (Affiliate-Phase nie gestartet).

## Nächste Schritte

- [ ] Index-Stand nachhalten: Startseite + 11 Artikel — in ~1 Woche erneut prüfen,
      dann Google-Urteil lesen (`~/.hermes/scripts/gsc.py inspect <property> <url>`).
- [ ] Re-Crawl-Urteil lesen, sobald Google neu gecrawlt hat: der „Duplikat"-Befund
      stammt aus dem Crawl vom 15.10. **vor** dem Host-Fix; ein neuer Crawl sollte
      `fknwine.com` als kanonisch lesen.
- [ ] **Cron `92efc5307dea` (GSC-Nachzug) löschen, sobald alle 14 URLs beantragt sind.**
- [ ] Optional: Domain-Property `sc-domain:fknwine.com` anlegen (deckt www + http +
      Subdomains) — braucht nur einen DNS-TXT-Record; Zone-Zugang da (TXT via API,
      Token via `gsc.py token`).
- [ ] X-Zugang @FKNWine steht → Redaktionsplan reaktivieren (`data/x-posts.md` +
      `data/CONTENT_ROADMAP.md` sind die Vorlage) (Era + Nimar).
- [ ] Newsletter-Ziel (`buttondown.com/nimar` vs. fknwine) entscheiden (Nimar).
