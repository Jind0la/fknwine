# War Room — FKN Wine

> Arbeits-Log des Projekts. Versioniert in Git, gepflegt von Hermes (Orchestratorin).
> Grundsatz: **Der Raum ist Teil der Team-Intelligenz.** Fehlschläge und
> Entscheidungen sind genauso wertvoll wie Erfolge.
>
> **Verdichtungs-Regel:** Datei unter ~150 Zeilen halten. Am Ende jeder Session
> abgeschlossene Tasks entfernen, alte Einträge (>2 Wochen) kürzen.

## Aktueller Stand

- `2026-10-15` (Era) — **Canonical-Fix ist live.** `fix/canonical-domain` per
  Fast-Forward nach `main` gemergt (`58d5cc9..6b6b904`) und gepusht; Cloudflare
  Pages hat ~45 s später gebaut. Live verifiziert per curl auf `/`, `/artikel/`,
  `/artikel/wein-fuer-pasta/`, `/impressum/`: Canonical und `og:url` stehen auf
  `https://fknwine.com/…` mit Trailing Slash; `robots.txt` zeigt
  `Sitemap: https://fknwine.com/sitemap-0.xml`, Sitemap listet 33 URLs.
  **Neuer Befund DNS:** Nameserver sind `lady/terry.ns.cloudflare.com`, Mail
  läuft über Cloudflare Email Routing (`route1-3.mx.cloudflare.net`,
  SPF `_spf.mx.cloudflare.net`) — Registrar bleibt IONOS SE, die *Zone* liegt
  aber bei Cloudflare. Damit ist ein DNS-TXT-Record für die GSC-Domain-Property
  über Cloudflare möglich (nicht über IONOS).
- `2026-10-15` (Era) — **Google Search Console ist aufgesetzt und die Property
  verifiziert.** Ablauf: (1) Der Login-Blocker wurde per OAuth-Code von Nimar
  gelöst (Vault-Prompt geht über Telegram nicht, Automations-Browser ist
  headless); dafür die Scopes `webmasters` + `siteverification` in der
  google-workspace-OAuth-Liste ergänzt. (2) Beide APIs waren im Cloud-Projekt
  `1064311637568` **deaktiviert** → von Nimar aktiviert. Achtung Lehre: meine
  erste „API ist aktiv"-Prüfung per unauthentifiziertem Request war ein
  Fehlschluss — 401 sagt nichts über den API-Status. (3) Property
  `https://fknwine.com/` angelegt und per FILE-Methode verifiziert
  (Owner: `nimarny@googlemail.com`); Datei `public/google35b2017bd84955fa.html`
  liegt im Repo — **nie löschen**, sonst verliert die Property die Bestätigung.
  (4) Sitemap `https://fknwine.com/sitemap-0.xml` eingereicht (isPending,
  0 Fehler). (5) Index-Stand-Erhebung: Startseite „Gecrawlt – zurzeit nicht
  indexiert" (letzter Crawl 06.05.2026, `googleCanonical` = fknwine.com ✓),
  2 Artikel „Gefunden – zurzeit nicht indexiert", 9 Artikel dem Index
  unbekannt — genau der Schaden, den die Canonical-Drift angerichtet hat.
  **Cloudflare-Eigenheit:** Pages strippt `.html` und leitet per 308 auf die
  endungslose URL um; Google folgt dem und akzeptiert die Verifikation.
- `2026-10-14` (Era) — **Projekt aus dem Archiv geholt und wieder ankerbar gemacht.**
  Kontext: Bis heute gab es **keinen** Projektordner, keine KB-Notiz und keinen
  Memory-Eintrag zu fknwine.com — die Site lief unbemerkt weiter. Nimar fragte an,
  Era hat live verifiziert und das Projekt aufgesetzt: Repo `Jind0la/fknwine`
  (public) nach `~/Workspace/projects/19-fknwine` geklont, Desktop-Projekt
  `fknwine` (p_881c6f4f) angelegt, Aufguss der beiden SEO-Befunde (Canonical-Drift)
  und dieses War Room.
- `2026-10-14` (Era) — **Canonical-Drift behoben (Branch `fix/canonical-domain`).**
  Root Cause: `site: 'https://fknwine.pages.dev'` in `astro.config.mjs` **plus**
  19 hartcodierte `pages.dev`-Stellen in Layouts/Pages/robots/llms/feed → Canonical,
  og:url, JSON-LD, Sitemap und RSS zeigten alle auf die Pages.dev-Preview-Domain.
  Google wurde damit gesagt: „die echte Version ist pages.dev" — die Custom Domain
  hätte sich selbst aus dem Index gedrückt.
  Fix: eine Quelle (`site` → `Astro.site`), Canonical per Default aus
  `Astro.url.pathname` abgeleitet (mit Trailing Slash, weil Cloudflare Pages
  `/x` → `/x/` per 308 umleitet), `robots.txt`/`llms.txt` auf fknwine.com,
  `llms.txt` zusätzlich auf alle 11 Artikel + Impressum-Link vervollständigt.
  Verifiziert: Build grün (33 Seiten), **0 Treffer** `pages.dev` in `dist/`,
  alle 33 Canonicals auf `fknwine.com` mit Trailing Slash, Sitemap/RSS/JSON-LD
  konsistent, lokal 200er auf /, /artikel/, /impressum/, /rss.xml, /sitemap-0.xml.
- `2026-07-16` (Nimar/IONOS) — Whois-Privacy-Anfrage zu fknwine.com
  („Business opportunities", `designing.solutions@genaidesign.info`), **nie
  beantwortet**. Liegt als HTML in `~/Downloads/`.

## Laufende Tasks

| Task | Wer | Status | Nächster Schritt |
|---|---|---|---|
| ~~Canonical-Fix deployen~~ | Era | **erledigt 15.10.** | live verifiziert auf fknwine.com |
| X-Reaktivierung @FKNWine | Era | Recon läuft | Zugang klären: kein OAuth-Token für @FKNWine vorhanden (xurl hat nur @NMoradbakhti) |
| ~~GSC-Property für fknwine.com~~ | Era | **erledigt 15.10.** | Property verifiziert, Sitemap eingereicht |
| Indexierung der 11 Artikel nachhalten | Era | **Wächter läuft** | Cron `a8a57aadcd03` (Mo 09:00, no_agent) prüft wöchentlich und meldet nur bei Änderung; Rest per `~/.hermes/scripts/gsc.py inspect`. „Indexierung beantragen" ist UI-only (Nimar) |
| Newsletter-Kanal | offen | Formular zeigt auf `buttondown.com/nimar` | Buttondown-Account auf fknwine umziehen oder Ziel bestätigen |

## Entscheidungen

- **Kein Redesign, kein Umbau.** Der Auftrag war Betrieb, nicht Look. Die
  Neubrutalist-Optik und die 11 Artikel bleiben, wie sie sind.
- **Eine Domain-Quelle statt 19 Hardcodes** (`astro.config.mjs site` →
  `Astro.site`, Canonical aus der ausgelieferten URL). Domain-Wechsel
  (z. B. www, Subdomain) kostet danach genau eine Zeile.
- **Canonical mit Trailing Slash**, weil Cloudflare Pages ohne Slash mit 308
  weiterleitet — ein Canonical auf eine weiterleitende URL ist ein Selbsttor.
- **AI-Crawler bleiben gesperrt** (`robots.txt`: GPTBot, CCBot, Claude-Web,
  PerplexityBot …). Auffällig: `llms.txt` lädt genau diese Crawler ein —
  Widerspruch, aber bewusst nicht eigenmächtig geändert (Entscheidung Nimar).

## Fehlschläge & Korrekturen

- **Projekt-Wissen war verloren.** Es gab keinerlei Projekt-Eintrag, obwohl die
  Site live ist, ein X-Account existiert und 12 Commits Arbeit drinstecken.
  Korrektur: dieses War Room, KB-Note `prj-fknwine`, Desktop-Projekt `fknwine`.
- **Erste Canonical-Version war noch nicht korrekt**: Canonical ohne Trailing
  Slash (`/artikel/wein-fuer-pasta`), die Live-URL aber mit. Nachgezogen:
  `canonicalPath`-Helper in `Layout.astro` + `ArticleLayout.astro`, explizite
  Canonical-Props in `about`/`artikel` entfernt, JSON-LD-URLs ergänzt.

## Known Limitations (Gap-Liste)

- [ ] **Deploy hängt an Cloudflare Pages GitHub-Integration** — kein Wrangler-Token
      auf der Maschine, Deployment nicht aus der CLI heraus prüfbar. Verifikation
      läuft nur über den Live-Check nach dem Push.
- [ ] `pages.dev`-Hostname bleibt parallel erreichbar (kein 301 auf fknwine.com).
      Canonical regelt das für Google, ein Host-Redirect wäre trotzdem sauber.
- [ ] X: **kein Zugang zu @FKNWine** über die vorhandenen Credentials
      (`~/.xurl/auth.yml` kennt nur `NMoradbakhti`). Posten als FKN Wine ist
      damit aktuell nicht automatisierbar — Zugang muss von Nimar kommen.
- [ ] Newsletter-Formular postet an `buttondown.com/nimar` (nicht fknwine) —
      Marken-Bruch, im Datenschutz aber als Buttondown benannt. Ungeklärt.
- [ ] GSC steht (Property + Sitemap), aber **kein Analytics** → Traffic- und
      Kanalzahlen fehlen weiterhin; Wirkung einzelner Artikel nicht messbar.
- [ ] Artikel-Preise/Bestände sind Stand Juli 2026 (Affiliate-Phase nie gestartet).

## Nächste Schritte

- [x] Merge `fix/canonical-domain` → `main` + Live-Verifikation der Canonicals
      auf fknwine.com (erledigt 15.10.).
- [x] Google Search Console: Property `https://fknwine.com/` verifiziert,
      Sitemap eingereicht (erledigt 15.10.).
- [ ] Index-Stand nachhalten: Startseite + 11 Artikel (Stand 15.10.: 0
      indexiert, 1 gecrawlt-nicht-indexiert, 2 gefunden-nicht-indexiert,
      9 unbekannt) — in ~1 Woche erneut prüfen, dann Google-Urteil lesen
      (`~/.hermes/scripts/gsc.py inspect <property> <url>`).
- [ ] Optional: Domain-Property `sc-domain:fknwine.com` anlegen (deckt www +
      http + Subdomains) — braucht einen DNS-TXT-Record in der
      Cloudflare-Zone (Zugang fehlt noch).
- [ ] X-Zugang @FKNWine klären, dann Redaktionsplan reaktivieren
      (`data/x-posts.md` + `data/CONTENT_ROADMAP.md` sind die Vorlage) (Era + Nimar).
- [ ] Newsletter-Ziel (`buttondown.com/nimar` vs. fknwine) entscheiden (Nimar).
