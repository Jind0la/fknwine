# War Room — FKN Wine

> Arbeits-Log des Projekts. Versioniert in Git, gepflegt von Hermes (Orchestratorin).
> Grundsatz: **Der Raum ist Teil der Team-Intelligenz.** Fehlschläge und
> Entscheidungen sind genauso wertvoll wie Erfolge.
>
> **Verdichtungs-Regel:** Datei unter ~150 Zeilen halten. Am Ende jeder Session
> abgeschlossene Tasks entfernen, alte Einträge (>2 Wochen) kürzen.

## Aktueller Stand

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
| Canonical-Fix deployen | Era | Branch gepusht, Merge offen | Merge nach Nimar-Go → Cloudflare Pages baut `main` automatisch |
| X-Reaktivierung @FKNWine | Era | Recon läuft | Zugang klären: kein OAuth-Token für @FKNWine vorhanden (xurl hat nur @NMoradbakhti) |
| GSC-Property für fknwine.com | offen | nicht geprüft | nach Live-Deploy: Property + Sitemap einreichen |
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
- [ ] Kein Analytics, kein GSC-Nachweis, keine Traffic-Zahlen → Wirkung der
      Deployments ist derzeit nicht messbar.
- [ ] Artikel-Preise/Bestände sind Stand Juli 2026 (Affiliate-Phase nie gestartet).

## Nächste Schritte

- [ ] Merge `fix/canonical-domain` → `main` (Nimar-Go) und Live-Verifikation
      der Canonicals auf fknwine.com (Era).
- [ ] Google Search Console: Property fknwine.com anlegen, Sitemap einreichen,
      Indexierung der Startseite beantragen (Era, nach Deploy).
- [ ] X-Zugang @FKNWine klären, dann Redaktionsplan reaktivieren
      (`data/x-posts.md` + `data/CONTENT_ROADMAP.md` sind die Vorlage) (Era + Nimar).
- [ ] Newsletter-Ziel (`buttondown.com/nimar` vs. fknwine) entscheiden (Nimar).
