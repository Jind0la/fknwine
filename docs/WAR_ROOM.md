# War Room — FKN Wine

> Arbeits-Log des Projekts. Versioniert in Git, gepflegt von Hermes (Orchestratorin).
> Grundsatz: **Der Raum ist Teil der Team-Intelligenz** — Fehlschläge und Entscheidungen
> sind so wertvoll wie Erfolge. **Verdichtungs-Regel:** unter ~150 Zeilen halten;
> am Session-Ende abgeschlossene Tasks entfernen, Einträge >2 Wochen kürzen.

## Aktueller Stand

- `2026-10-17` — **Auf KI-Suche geöffnet + dafür optimiert (Nimar: „KI soll die Seite lesen und suchen können —
  sie soll sogar auch dafür optimiert sein").** Merge `e24c8f4` → live, per echtem Abruf verifiziert:
  - **Robots-Politik gedreht:** `PerplexityBot`, `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`,
    `Claude-User`, `Google-Extended`, `Applebot`, `DuckAssistBot` → `Allow: /`; Trainings-Korpora
    (`GPTBot`, `ClaudeBot`, `CCBot`, `Bytespider`, …) bleiben gesperrt. `Content-Signal` jetzt pro Gruppe:
    **`ai-input=yes, ai-train=no`** (Inhalte dürfen in Antworten fließen, nicht in Modellgewichte).
    **Abruf-Test mit den echten User-Agents: alle vier Such-Agenten → HTTP 200 / 14.912 Bytes;
    GPTBot → HTTP 403** (Cloudflares Block greift am Edge, nicht nur als Bitte).
  - **Optimiert:** `meta robots` `index, follow, max-snippet:-1, max-image-preview:large` (fehlte komplett);
    `<time datetime>` für **jedes** Check-/Update-Datum auf Clubs, Guides und Deals (Daten waren nur
    Fließtext — Maschinen konnten sie nicht lesen); `llms.txt` mit zitierfähigem „Key facts"-Block +
    expliziter Zugangs-Erklärung. Ohne JS bleiben 4.172 Zeichen Text je Seite lesbar (inkl. Preistabelle
    und Datum) — KI-Antwortsysteme bekommen den Inhalt vollständig.
  - **Lehre (eigener Bug, in der Verifikation gefunden):** `Date.parse("Oct 16, 2026")` + `toISOString()`
    schob das Datum in Berlin auf den **15.** zurück (UTC-Konvertierung) — im `<time datetime>` hätte das
    jedem Crawler den falschen Tag gezeigt. Jetzt aus lokalen Datums-Komponenten formatiert; der Parser-Check
    (`datetime` ↔ sichtbarer Text) ist Teil der Verifikation.
  - **Offen:** Cloudflare schreibt einen eigenen „AI Crawl Control"-Block über unsere `robots.txt`. Für die
    Such-Agenten ist das irrelevant (Cloud nennt sie nicht, unser Allow gilt eindeutig). Für `Google-Extended`
    widersprechen sich beide (Cloud: Disallow, wir: Allow) — nach RFC 9309 gewinnt die weniger restriktive
    Regel, garantiert ist das aber nicht. **Sauberer Weg: Clouds Block abschalten, dann ist `robots.txt`
    die einzige Autorität — dafür braucht es einen Cloudflare-Zonen-API-Token (keiner hinterlegt).**
- `2026-10-17` — **SEO-Audit-Fixes Welle 1 gemergt + live (`4b490a7`), an der Live-Seite verifiziert:**
  HSTS aktiv (`max-age=31536000; includeSubDomains`), gehashte `/_astro/*`-Assets `immutable`,
  Sitemap 19 → 18 URLs (kein `/subscribed/` mehr), `/subscribed/` `noindex`. Details im Eintrag unten.
- `2026-10-17` — **E-E-A-T-Lücke geschlossen: Methoden-Seite + erstmals echte Erst-Hand-Funde (`/how-we-test/`).**
  Die Lücke aus dem Audit war „kein Autor, keine eigene Erfahrung". Statt Erfahrung zu behaupten, habe ich
  die Clubs **selbst nachgelesen** — Landingpage, **Hilfe-Center und AGB** — und die Widersprüche gefunden:
  Firstleaf wirbt mit „no fees" und hat laut Hilfe-Center eine **$25 restocking fee**; Winc wirbt mit
  „Free Shipping always", die AGB sagen **„A shipping charge of $9 may apply"**; Firstleafs Gutschrift
  **verfällt bei Kündigung** („credits expire when a membership is cancelled"); Winc hat eine
  **3-Tage-Frist** für Skip/Cancel plus den Auto-Abrechner *Insider Access* ($59.95/Monat); Wine Access
  ist die Ausnahme — **keine Restocking-Gebühr, kein Rückgabe-Limit**, aber Cut-off „one full business day"
  und eine konkrete 35-Staaten-Liste. **Neu:** `/how-we-test/` (Methode, 8-Punkte-Checkliste, was wir
  nicht tun, Korrektur-Policy), verlinkt von jedem Review, beiden Guides, About und Footer; 3 Reviews
  inhaltlich korrigiert/erweitert (Firstleaf-Planmatrix mit 4 Stufen inkl. „plus shipping", Winc-AGB,
  Wine Access-AGB). **Ehrlich bleibt:** wir haben die Clubs **nicht gekauft** — steht so auf jeder Seite.
  Ausdrücklich als Markenentscheidung dokumentiert, dass wir unter „FKN Wine" statt unter einem
  Personen-Byline schreiben (die Haftung steht im Impressum).
- `2026-10-16` — **Content-Welle 3 gemergt + live (`21304a4`).** 3 neue Club-Reviews (Naked Wines,
  Gold Medal Wine Club, Wine Access) + 2 Guides (Kündigungs-Ladder, Preis/Flasche-Vergleich);
  Zahlen an den Merchant-Seiten gelesen, keine Tasting-Claims. **Root-Fix:** breite Markdown-Tabellen
  schoben die Seite auf 390 px in den Overflow → `src/lib/rehype-table-wrap.mjs` wrappt sie in einen
  Scroll-Container (braucht `@astrojs/markdown-remark`). Deploy verifiziert (Sitemap 14 → 19 URLs).
- `2026-10-16` — **SEO-Plugin `hermes-seo` installiert (45 Skills; Community-Port von claude-seo, MIT, via X-Post @tonysimons).**
  Quelle `github.com/yuzushi-dev/hermes-seo` → Kopie nach `~/.hermes/plugins/hermes-seo`,
  `hermes plugins enable` + Runtime-Setup (`hermes seo setup`: eigenes venv **plus** Playwright/Chromium) →
  `hermes seo doctor` = ready. Skills namespaced (`hermes-seo:<skill>`, Router `hermes-seo:seo`),
  Runtime-CLI `hermes seo run <script> --json`, Hook `validate-schema.py` läuft nach File-Writes.
  **Voll-Audit fknwine.com gestartet:** 10 Rollen parallel (technical, content, schema, sitemap,
  performance, visual, geo, agentic, sxo, cluster); Evidenz = `~/.hermes/cache/scratch/fknwine-audit/`
  (`crawl/` 19 Seiten als JSON, `findings/*.md`). Gesperrt bleiben Google-API/OAuth-Routen und alle Paidanbieter.
  **Ergebnis: SEO-Health 80/100** (Technical 82, Content 80, On-Page 75, Schema 72, Performance 93,
  Visual 78, AI/Agentic 78, Sitemap/IA 80, Cluster 65). Report + Action-Plan: `audit-data.json`,
  `FULL-AUDIT-REPORT.md` im Audit-Ordner. **Wichtig: die Rollen sind Selbstauskünfte** — ich habe die
  Kernbefunde selbst nachgeprüft; eine Behauptung war falsch („Startseite hat 3 H1" → sie hat **1**).
  Ebenfalls korrigiert: `og-default.png` ist **EN** (die alte Notiz „noch DE-Stand" war falsch).
- `2026-10-17` — **SEO-Audit-Fixes Welle 1 auf `fix/seo-audit-wave1` (Preview offen, Merge offen).**
  Umgesetzt und im Build verifiziert: (1) `public/_headers` → **HSTS** + `immutable` für `/_astro/*`
  (vorher revalidierte jeder Besuch CSS und Fonts); (2) `/subscribed/` bekommt `noindex` und fliegt per
  Sitemap-Filter raus (Sitemap 19 → 18); (3) **Schema-@graph** mit `@id`, `sameAs: x.com/FKNWine`,
  Raster-Logo (`logo-512.png` statt SVG-Favicon), `Article.image`, `BreadcrumbList`, Autor/Publisher als
  `@id`-Referenz; (4) `robots.txt` → `Sitemap: sitemap-index.xml`; (5) **interne Verlinkung gemesht** —
  Club-Reviews ↔ Guides, Deals-Seite → alle 6 Reviews (die 9 Spokes waren Sackgassen);
  (6) **Verdicts entschieden** statt „Depends …" auf allen 6 Reviews; (7) Meta-Beschreibungen ≤155 Zeichen
  (ein Clamp-Helper im Layout) und Titel ≤52; (8) Deal-Links heißen jetzt „Get this deal at WTSO →"
  (Agenten konnten 5 identische Linknamen nicht unterscheiden); (9) Nav-X ist ein SVG-Icon, alle
  Header-/Button-Touch-Ziele ≥44 px, Tabellen sind fokussierbar + scrollen sichtbar; (10) `llms.txt` auf
  den echten Stand gebracht (19 statt 7 Seiten).
  **Offen für Nimar (bewusste Entscheidung, nicht eigenmächtig geändert):** `robots.txt` blockt
  PerplexityBot — das ist ein **Such**-Crawler, die Seite fehlt damit in Perplexity-Antworten, obwohl
  `llms.txt` KI-Systeme einlädt und Content-Signal `search=yes` sagt.
- `2026-10-16` — **Awin: Bewerbung APPROVED + erste Programm-Bewerbungen raus.** Publisher **FKN Wine, ID 3126259** aktiv.
  **Beworben:** Gold Medal Wine Club (59079), ONEHOPE Wine (39702), Parcelle Wine (94853); Personal Wine (39786) öffnet kein Modal.
  **Profil 100 %** (Avatar ✱-Marke, Adresse Mauritiusstraße); **Nimar-Part offen: Telefonnummer**. Awin-Eigenheiten:
  Validation-Mail mit Template-Bug und „Ungültiger Aktivierungscode" (Konto trotzdem voll nutzbar);
  Merchant 59079 = **Gold Medal** (nicht CWC — alte Notiz korrigiert); CWC-Affiliate läuft NICHT über Awin-US.
- `2026-10-16` — **X-Cadence gestartet + Awin-Bewerbung bis Step 4/4.** X: 2 Posts live (Malbec-Takeover, CWC-Fine-Print).
  **Lehre: Standalone-Link-Posts → 403 „not permitted" bei jungem Account; Links als Reply auf den eigenen Post posten.**
  Awin: Firma „FKN Wine", Tax Residency Germany (Passwort → `~/.hermes/secrets/awin-password.txt`), Region US,
  Type **Editorial Content**, Sektor Wine/Spirits. Review 24–48 h. Angular-Material-UI: IDs statt names; Checkboxen per DOM-`.click()`,
  Accordions brauchen echte CDP-Klicks.
- `2026-10-16` — **Newsletter komplett (beehiiv) + Issue #01 als Draft.** Welcome-Mail publiziert + E2E getestet
  (Anmeldung → 6-stelliger Code → Subscriber → Welcome-Mail zugestellt, per Gmail-API verifiziert); Issue #01
  („A $10 Malbec and the fine print we actually read") fertig als Draft, geht raus, sobald echte Abos da sind.
  **Branding:** Byline + Signatur = **„FKN Wine"** (Guest-Author, ✱-Avatar); Legal-Seiten behalten den Operator-Namen (Pflicht).
  Footer-Adresse Bochum. Embed-Formular gestylt. Composer-/CDP-Lehren im Skill `beehiiv-newsletter`.
- `2026-10-16` — **Affiliate-Ablehnungen: FlexOffers + Impact declined (Site zu jung/klein).** FlexOffers: nur Textbaustein
  ohne Grund; Impact: Marketplace-Gate (Konto bleibt für Direkt-Brand-Links nutzbar). **Root-Cause:** 1 Tag nach Relaunch,
  ~0 Traffic, ~13 Seiten → beide gaten auf Substanz. Maßnahmen: FlexOffers-Support-Anfrage ✓, Impact-Ticket **#897752** ✓
  (Duplikat #897753 gemeldet). **Hebel:** Content + Traffic aufbauen (2–4 Wochen), dann Re-Apply; Awin + Skimlinks/Sovrn + Direktprogramme als Alternative.
- `2026-10-16` — **Mail gelöst + Senden live.** info@/hey@ → nimarm@me.com + Gmail-Kopie (CF-Worker `fkn-mail-router`);
  Senden als info@/hey@ via Resend (`~/.hermes/scripts/fkn_send.py`). **Entscheid Sequenz:** Affiliate sofort,
  Sponsoring erst ab ~1–2k engaged Subs (Newsletter = Brücke) — KB §11.
- `2026-10-16` — **Nach dem Live-Gang selbständig weiter.** X: 19 DE-Alt-Tweets gelöscht, 3 EN-Posts, Bio/Website-Feld ✔.
  Neu live: **Winc-Review** (+ „Bright Cellars ist in Winc aufgegangen") und **EN-OG-Bild**. Cron **FKN Deals-Refresh**
  (Mo 10:00, local): prüft Deals am Merchant, schreibt `deals.ts` nur bei grünem Build (Content-Ops direkt auf main).
- `2026-10-16` — **EN-Relaunch live (Merge `7a4b39a..ff2b215`).** Struktur Home/Deals/Wine Clubs/Guides/Legal,
  Collections `clubs` + `guides`, Merchant-Registry als **ein Affiliate-Swap-Point**, Deal-Feed, `_redirects` für Alt-URLs
  (`/artikel/*`→`/`, `/impressum/`→`/imprint/`, `/datenschutz/`→`/privacy/`), DE-Artikel raus (bleiben in der Git-History).
- `2026-10-16` — **Monetarisierungs-Konzept steht (Nimars Go).** EN/US-Pivot „Deals + Data + Voice". Zahlen: US-Weinmarkt
  >$115 Mrd.; Clubs $20–50/Signup, Shops 4–12 %; **Amazon-Alkohol 0 %**; X zahlt selbst fast nichts. Altstand: kein Geld-Pfad,
  kein Analytics, kein Publikum. Doc: KB `prj-fknwine-monetarisierung`.
- `2026-10-16` — **Host-Konsolidierung live (Cloudflare-Zone).** `always_use_https: on` + Redirect Rule www → Apex
  (301, Pfad+Query, 1 Hop); Zone `51e9dc8462690929e186758bf3a0916a`. **Lehre:** `http.scheme` ist in dieser Ruleset-Phase
  kein gültiges Feld (API 20127) — Scheme-Upgrade über `always_use_https`.
- `2026-10-16` — **X-Zugang @FKNWine steht und ist schreib-verifiziert** (id `2074768137501675520`).
  Fix: `xurl auth oauth2 FKNWine --app my-app`. **Lehren:** Aufruf `xurl -u FKNWine …`; `xurl -i` gibt es nicht;
  Buffer-Problem → Output per `> /tmp/…log`.
- `2026-10-15/16` — **Indexierung:** „Antrag stellen" gefahren (Google-Kontingent real ~10/Tag), dann Relaunch —
  Url-Inspection zeigte **0 indexiert**; Bremsklotz war die Startseite als Duplikat mit `googleCanonical = pages.dev`
  (drei Hosts lieferten dieselbe Seite) → per Host-Fix behoben, Urteil per Re-Crawl abwarten. Nachzug-Cron
  `92efc5307dea` (täglich 09:30) verstummt selbst → **löschen, wenn alle URLs beantragt sind.** Details KB `prj-fknwine`.
- `2026-10-15` — **Canonical-Drift behoben.** Root Cause: `site: 'https://fknwine.pages.dev'` + 19 Hartcodes →
  Canonical, `og:url`, JSON-LD, Sitemap, RSS zeigten auf die Preview-Domain. Fix: **eine Quelle** (`site` → `Astro.site`),
  Canonical aus `Astro.url.pathname` **mit Trailing Slash** (Pages leitet `/x` → `/x/` per 308). DNS: Zone Cloudflare,
  Mail via Cloudflare Email Routing, Registrar IONOS.
- `2026-10-15` — **GSC aufgesetzt, Property verifiziert** (FILE, Owner `nimarny@googlemail.com`);
  `public/google35b2017bd84955fa.html` — **nie löschen**. Sitemap eingereicht (0 Fehler).
- `2026-10-14` — **Projekt wieder verankert:** Repo `Jind0la/fknwine` → `~/Workspace/projects/19-fknwine`,
  Desktop-Projekt `fknwine` (p_881c6f4f), KB `prj-fknwine`, dieser War Room.

## Laufende Tasks

| Task | Wer | Status | Nächster Schritt |
|---|---|---|---|
| SEO-Voll-Audit | Era | **läuft** (10 Rollen parallel, `hermes-seo`) | Findings aggregieren → Report + Action-Plan; Critical/High fixen (Branch → Preview → Merge) |
| Affiliate-Konten | Era | FKN Wine ID 3126259 aktiv; Bewerbungen Gold Medal / ONEHOPE / Parcelle offen | Telefon bei Awin nachtragen (Nimar); Personal Wine erneut; Antworten abwarten |
| Content-Kadenz | Era | Welle 3 live (6 Clubs, 3 Guides, 19 URLs) | Nächste Clubs (Wine Insiders, WSJ Wine, Plonk); Doku „Wie wir testen" (Substanz für die Netzwerke) |
| Newsletter | Era | Flow live + E2E getestet | Issue #01 publizieren, sobald echte Abos da sind |
| Index-Stand | Era | Wächter + Nachzug auf neue URLs | Cron `92efc5307dea` meldet selbst → dann löschen |

## Entscheidungen

- **EN-Pivot (Nimars Go):** Deals + Data + Voice auf EN/US. Ablauf immer Branch → Live-Preview → Merge
  (kein Merge ohne Preview-Blick). X Premium bewusst aufgeschoben.
- **Mail-Footer-Adresse bleibt Bochum** (Pflichtfeld, steht ohnehin im Impressum); Wechsel erst, wenn die Marke Umsätze macht.
- **Look bleibt, Inhalt neu:** Neubrutalist-Optik behalten; keine Fake-Reviews, „Checked"-Daten überall.
- **Eine Domain-Quelle statt 19 Hardcodes;** Canonical mit Trailing Slash.
- **KI-Zugang (Nimar-Entscheid 17.10.2026, dreht die frühere Sperre um):** „KI soll die Seite lesen und
  suchen können — sie soll sogar auch dafür optimiert sein." → KI-**Suche/Antworten** erlaubt
  (`ai-input=yes`), nur **Training** bleibt gesperrt (`ai-train=no`). Der frühere Widerspruch
  (Sperre in `robots.txt` bei gleichzeitig einladendem `llms.txt`) ist damit aufgelöst.

## Fehlschläge & Korrekturen

- **Projekt-Wissen war verloren** (kein Eintrag trotz Live-Site, X-Account, 12 Commits) → War Room + KB + Desktop-Projekt.
- **Eigener Fehler: Host-Redirect per Pages-Function zerlegte die Live-Seite** (≈4 Min Ausfall, per `git revert` zurückgerollt).
  Lehren: (1) Host-Redirects nie aus einer Pages-Function ableiten; (2) Logik-Test + grünes Preview beweisen hostabhängiges
  Produktionsverhalten nicht. Erste Canonical-Version war zusätzlich ohne Trailing Slash.
- **Erste Mobile-Overflow-Diagnose war ein Messfehler** (headless `--window-size` setzt das Layout-Viewport nicht) —
  erst echtes `Emulation.setDeviceMetricsOverride` + `docScrollWidth` zeigte die Wahrheit: Seite war bei 390 px nie breit,
  die Tabellen *wären* es ohne Wrapper geworden.

## Known Limitations (Gap-Liste)

- [ ] **Deploy hängt an der Cloudflare-Pages-GitHub-Integration** — kein Wrangler-Token; Verifikation nur per Live-Check nach dem Push.
- [ ] `fknwine.pages.dev` liefert weiterhin 200 (Pages-Zone, Redirect nicht setzbar) → Entdopplung nur über Canonical + Re-Crawl.
- [ ] GSC steht, aber **keine Kanalzahlen** im Code (`ANALYTICS.provider = null`); real läuft Cloudflare Web Analytics.
- [ ] `og-default.png` ist noch der DE-Stand (EN-Version als Design-Task offen).

## Nächste Schritte

- [ ] **SEO-Audit abwarten** → Critical/High umsetzen (Branch → Preview → Merge), Report als PDF/HTML an Nimar.
- [ ] **Cloudflare-AI-Crawl-Control abschalten** (braucht einen Zonen-API-Token) → `robots.txt` wird die
      einzige Autorität, der `Google-Extended`-Widerspruch verschwindet.
- [ ] Affiliate-Support-Antworten (FlexOffers, Impact #897752) → genannten Grund fixen, dann Re-Apply; Skimlinks/Sovrn prüfen.
- [ ] Content-Welle 4: Wine Insiders, WSJ Wine, Plonk + Doku „Wie wir testen" (belegt Substanz für die Netzwerke).
- [ ] Index-Stand beobachten (`~/.hermes/scripts/gsc.py inspect`); Cron `92efc5307dea` löschen, wenn alles beantragt ist.
- [ ] og-default.png EN-Version; optional Domain-Property `sc-domain:fknwine.com` (nur DNS-TXT).
