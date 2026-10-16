# War Room — FKN Wine

> Arbeits-Log des Projekts. Versioniert in Git, gepflegt von Hermes (Orchestratorin).
> Grundsatz: **Der Raum ist Teil der Team-Intelligenz** — Fehlschläge und Entscheidungen
> sind so wertvoll wie Erfolge. **Verdichtungs-Regel:** unter ~150 Zeilen halten;
> am Session-Ende abgeschlossene Tasks entfernen, Einträge >2 Wochen kürzen.

## Aktueller Stand

- `2026-10-16` — **Content-Welle 3: 3 neue Club-Reviews + 2 Data-Guides (Branch `feat/content-wave-3`, Preview offen).**
  **Neu:** *Naked Wines* ($40/Monat in eigenes Wein-Wallet, bis 60 % Angel-Preis, Kündigung nur per Telefon/Mail — kein Self-Service),
  *Gold Medal Wine Club* (3 Stufen ab $49/Sendung, Versand extra, „cancel anytime" erst **nach** der ersten Sendung; läuft über Awin 59079),
  *Wine Access* (Discovery ~$25/Flasche, Connoisseurs ~$75, Collector's $250–400 — gleicher Preis, ein Klick Unterschied).
  **Guides:** „How to actually cancel a wine club" (Kündigungs-Ladder über 6 Clubs) + „The real price per bottle: six wine clubs in one table".
  Alle Zahlen am 16.10. an den Merchant-Seiten gelesen; keine Tasting-Claims, „Checked"-Datum überall.
  **Root-Fix:** die neuen 4-Spalten-Tabellen schoben die Seite auf 390 px in den Horizontal-Overflow →
  rehype-Plugin `src/lib/rehype-table-wrap.mjs` wrappt jede Markdown-Tabelle in einen Scroll-Container
  (braucht `@astrojs/markdown-remark` — Astro 7 installiert es nicht mehr per Default). Verifiziert: Build grün,
  20 Seiten; auf allen neuen Seiten 390 px `docScrollWidth == 390` und Tabellen scrollen **im** Wrapper statt die Seite zu schieben.
  Clubs-Index-„Queue"-Text angepasst (Naked Wines + Wine Access waren dort angekündigt → jetzt live).
- `2026-10-16` — **Awin: Bewerbung APPROVED (Minuten nach Absenden!) + erste Programm-Bewerbungen raus.** Publisher **FKN Wine, ID 3126259** aktiv (Congrats-Mail 22:23). **Beworben:** Gold Medal Wine Club (59079), ONEHOPE Wine (39702), Parcelle Wine (94853) — alle „Bewerbung offen/sent"; Personal Wine (39786) öffnet kein Modal (später erneut). **Profil 100%:** Avatar = ✱-Marke (upload via Klick aufs Profilbild), Adresse auf „Mauritiusstraße" korrigiert (gespeichert). **Nimar-Part offen: Telefonnummer** (Kontaktdetails-Feld ist leer). **Awin-Eigenheiten:** Validation-Mail mit Template-Bug („on the %s platform") und Aktivierungslink → „Ungültiger Aktivierungscode" (E-Mail-Validierung fehlgeschlagen, Konto aber voll nutzbar; ggf. Support-Ticket). Merchant 59079 = **Gold Medal Wine Club**, NICHT CWC (alte Notiz korrigiert). CWC-Affiliate läuft NICHT über Awin-US (Suche findet ihn nicht).
- `2026-10-16` — **X-Cadence gestartet + Awin-Bewerbung bis Step 4/4 gefahren („Lets go").** **X:** 2 Posts live — Malbec-Takeover (mit Link) + CWC-Fine-Print (Text) mit Link als Reply. **Lehre: Standalone-Link-Posts → 403 „not permitted" bei jungem Account; Links als Reply auf den eigenen Post posten (funktioniert zuverlässig).** **Awin:** Publisher-Bewerbung gefüllt bis **Verification** — Company „FKN Wine" (info@fknwine.com, Tax Residency Germany; Passwort → `~/.hermes/secrets/awin-password.txt`), Primary Region **US**, Promotional Type **Editorial Content** (primary), Space `https://fknwine.com` + Beschreibung, Sektor **Wine, Spirits & Tobacco**, Adresse Bochum. **Nimar-Part offen:** Telefonnummer + 18+/T&C-Häkchen + „Join Our Network" (Tab offen in Comet) + ggf. **$1–5 refundable** Karten-Verifizierung. Review 24–48 h. Details: Awin nutzt Angular-Material-UI (IDs statt names; Checkboxen per DOM-`.click()` erreichbar, Accordions brauchen echte CDP-Klicks).
- `2026-10-16` — **Newsletter-Issue #01 gebaut (Draft) + Test-Mail zugestellt.** „Issue #1: A $10 Malbec and the fine print we actually read" (+ Subtitle/Preview „Real deals, verified terms, zero sommelier theater."): Intro, WTSO-Achaval-Takeover (12 Fl. / $120, bis 18.10.), Legón RdD $17.99 (94 pts), Kalifornien-Club-Kleingedrucktes (Signature + $40–80 Reship), Wochenliste (Winc/Firstleaf/HAUNT20), „checked 16.10."-Hinweis + Affiliate-Disclosure. **Test-Mail an info@fknwine.com** (Forward → Gmail-Kopie) — Betreff `[TEST] Issue #1 …`, in Gmail angekommen ✓; Desktop+Mobile-Render geprüft. **Draft-Link:** `https://fknwine.beehiiv.com/p/issue-1-a-10-malbec-and-the-fine-print-we-actually-read?draft=true`. **Nicht publiziert** — Issue #01 soll rausgehen, wenn die ersten echten Abos da sind. **Branding (Nimar-Vorgabe 16.10.):** Byline = **„FKN Wine"** (Guest-Author; Nimar-Autor entfernt; Avatar = eigene ✱-Marke: schwarzer Kreis + weißes Asterisk aus dem Logo — Text-Logo wäre bei 24px unlesbar, Default-Kreis war beehiivs grauer Platzhalter), Body-Signatur + Welcome-Mail-Signatur = „— FKN Wine" (Welcome neu publiziert); Test-Mails v2 (19:33 UTC) + v3 mit Avatar (19:41 UTC) zugestellt ✓. **Impressum/Privacy/Terms behalten den Operator-Namen** (Pflicht — bleibt). **Composer-Lehren** (Skill `beehiiv-newsletter`): Titel+Subtitle sind **Textareas** (nur via native Setter setzen — blindes execCommand-Tippen verkorkste den Titel); Subject im Email-Step erbt vom Titel; „Send test email" im Preview-Chevron-Panel; Byline über Element-Toolbar → „Authors"; Guest-Author via `/guest_authors`.
- `2026-10-16` — **Welcome-Mail geschrieben, publiziert, E2E getestet → Newsletter-Flow komplett.** Subject „You're in - we read the fine print.", Body: (1) Welcome, (2) was drin ist — Deals, Kleingedrucktes, eine Flasche; „roughly weekly, never daily", (3) Links auf /deals/ + /wine-clubs/, (4) Drink well. — Nimar. Footer-Adresse (Mauritiusstr. 4a, Bochum) gesetzt; Welcome-Toggle **AN**. **E2E-Beweis:** Anmeldung über fknwine.beehiiv.com → 6-stelliger Login-Code (Turnstile + Code = beehiivs Signup-Schutz) → Subscriber #2 (`nimarny+fknwelcome@gmail.com`) → **Welcome-Mail zugestellt** (von `fknwine@mail.beehiiv.com`, 18:49 UTC, per Gmail-API verifiziert; Betreff + Body korrekt). **Offen: erste echte Ausgabe** (Stoff liegt: CWC-Review, Deals). Technik-Lehren → Skill `beehiiv-newsletter` (tiptap: `elementFromPoint` + `execCommand('insertText')` statt `Input.insertText`; Links per Range + `execCommand('createLink')`; Publish per JS-Click; Subject/Preview-Text im Details-Tab).
- `2026-10-16` — **Merge nach main + LIVE (nach Nimar-Go).** CWC-Review + beehiiv-Newsletter-Embed sind live: `/wine-clubs/california-wine-club/` 200, Clubs-Index zeigt 3 Clubs, Newsletter-Embed (Loader + Form-ID) auf der Startseite, Sitemap enthält die neue URL. Merge-Commit `436f115`; Feature-Branch `feat/content-wave-2` gelöscht. Skill **`beehiiv-newsletter`** gesichert (Builder-CDP-Techniken, Suppression-Cookie, KYC-Fakt, FKN-Stylingwerte).
- `2026-10-16` — **Newsletter ist live verdrahtet (beehiiv).** Konto (info@fknwine.com), Publication „FKN Wine" (Logo + Thumbnail drin); Handle **fknwine.beehiiv.com**, Sender **fknwine@mail.beehiiv.com** (Custom Domain = Paid → später). Embed-Formular (ID `35163977-6b86-4c93-bcfb-af796f96929c`): Header aus, **Styling komplett ans Site-Design angepasst** — Feld dunkel (#0A0A0A) mit 3px-Cream-Rahmen (#FFFDF5), Text/Placeholder Inter; Button #FFD23F, Space Grotesk bold, schwarze Schrift. (Builder-Technik: Sub-Tabs Base/Fields/Button reagieren nur auf echte CDP-Mouse-Events auf die Tile-Icons; Fonts über Suchfeld+Liste; Werte per native-Setter. **Gelernt:** Loader unterdrückt das Formular für bereits-angemeldete Besucher — Cookie `bhv_<publicationId>_subscribed` — Feature, kein Bug; **beehiiv-API-Key erfordert Stripe-Identity-KYC**, Publication-ID frei.) Site: `NEWSLETTER`-Config + Embed (`NewsletterForm.astro`) + Attribution (`Layout.astro`) auf Branch `feat/content-wave-2` (Preview-Pane offen). **E2E getestet:** Submit über die Site → 1 aktiver Subscriber (info@fknwine.com als Test). Trial 14 Tage Pro (ohne KK) → danach Free (bis 2.500 Abos). **WineExpress: gestorben** (Impact-Marketplace-Gate) — CWC via Awin bleibt der Weg.
- `2026-10-16` — **Content-Welle gestartet (bewusst nicht erst Montag).** Erster Baustein: **California-Wine-Club-Review** auf Branch `feat/content-wave-2` (Build grün, 15 Seiten; Preview-Pane offen; Merchant `cawineclub` in `merchants.ts` + Schema). Programm-Recherche: **CWC läuft über Awin** (Merchant 59079), **WineExpress über Impact-Direktlink** (campaign-promo-signup — trotz Marketplace-Sperre nutzbar; Bewerbung vorbereitet, Nimar-Part: Passwort + Handynr.). **beehiiv**: Free-Plan reicht (0 $, 2.500 Abos) — Signup-Formular vorbefüllt (info@fknwine.com), Nimar-Part: Passwort + Terms; danach übernimmt Era (Verify, Setting, Formular-Verdrahtung). Content-Kadenz: Richtwert 2–4 Site-Stücke + 3–5 X-Posts pro Woche, Preview-Gate bleibt.
- `2026-10-16` — **Affiliate-Ablehnungen: FlexOffers + Impact declined (Site zu jung/klein).**
  FlexOffers: Application + Traffic Source declined (19:18 CEST) — nur Textbaustein („does not meet
  our current needs or is in conflict with a policy"), KEIN konkreter Grund. Impact: Marketplace-Zugriff
  declined (19:34) — Mail verlinkt nur den Partner-Vertrag; Dashboard: „qualifizieren sich derzeit
  nicht"; Konto bleibt nutzbar via Direkt-Brand-Links + Einladungen. **Root-Cause-Annahme:** Site
  1 Tag nach EN-Relaunch, ~0 Traffic (10 Besuche/30 T.), ~13 Seiten — beide Netze gaten auf Substanz.
  **Maßnahmen:** Anfrage an support@flexoffers.com (spezifischer Grund + Reconsideration-Kriterien) ✓;
  Impact-Ticket **#897752** (Compliance/Marketplace Approval; Antwort 5–7 Werktage) ✓ — versehentlich
  2 Tickets, Duplikat **#897753** per Reply auf merge/close beantragt ✓. **Nächster Hebel:** Content
  + Traffic (2–4 Wochen), dann Re-Apply; Awin + Skimlinks/Sovrn + Direkt-Programme als Alternativen.
- `2026-10-16` — **FlexOffers-Registrierung abgeschickt** (Konto 1565967, Username info@fknwine.com;
  Traffic Source „Website – FKN Wine" + Beschreibung angelegt; Site per **DNS-TXT** verifiziert,
  Token bleibt drin). Review 2–5 Werktage → dann Programmanträge (Firstleaf/Winc) im Dashboard;
  **Impact + Awin** stehen noch aus. Falle: MUI-Inputs brauchen echtes CDP-Tippen (Input.insertText),
  sonst bleibt der Save-Button disabled. Bestätigungs-Mails kamen bei info@ an (Era liest mit).
- `2026-10-16` — **Mail gelöst + Senden live:** info@/hey@ → nimarm@me.com + Gmail-Kopie (CF-Worker
  `fkn-mail-router`); Senden als info@/hey@ via Resend (`~/.hermes/scripts/fkn_send.py`). **Affiliate-
  vs-Sponsoring-Entscheid: Sequenz** (Affiliate sofort; Sponsoring ab ~1–2k engaged Subs; Newsletter
  = Brücke) — Details KB §11. Konto-Runde: FlexOffers ✓ → Impact → Awin als Nächstes.
- `2026-10-16` — **Nach dem Live-Gang selbständig weiter: X-Relaunch, Winc-Review, OG-Bild, Analytics-Fund.**
  X: 19 Alt-Tweets (DE) gelöscht, 3 EN-Posts live (Ankündigung, WTSO-Achaval-Deal, Anti-Snob-Take);
  Bio/Website-Feld **erledigt** (OAuth2 konnte den Profile-Endpoint nicht — Nimar hat's im Browser eingetragen, verifiziert).
  **Cloudflare Web Analytics läuft bereits** für fknwine.com (cookieless; „kein Analytics"-Befund war falsch →
  Privacy-Seite präzisiert). Neu live: **Winc-Review** (`/wine-clubs/winc/`, inkl. „Bright Cellars ist in Winc
  aufgegangen" + $100-Intro-Deal) und **neues EN-OG-Bild** (`og-default.png` über echten Browser gerendert).
  Neuer Cron **FKN Deals-Refresh** (Mo 10:00, deliver local): prüft die Deals wöchentlich am Merchant und
  aktualisiert `deals.ts` nur bei grünem Build — Content-Ops direkt auf main (kein Preview-Gate; Nimar-Veto offen).
- `2026-10-16` — **EN-Relaunch gebaut (Branch `feat/en-relaunch`) — Preview offen.**
  Auf Nimars Go („alles selbständig machen"): neue EN-Struktur (Home / Deals / Wine Clubs /
  Guides / Legal), Content-Collections (`clubs`, `guides`), Merchant-Registry
  `src/data/merchants.ts` (ein Affiliate-Swap-Point), Deal-Feed, Firstleaf-Review + Guide
  „How to test a wine club without getting burned", `_redirects` für Alt-URLs, DE-Artikel raus
  (Git-History). Verifiziert: Build grün, Desktop + Mobile ohne Overflow. Newsletter-Formular
  bewusst unverkabelt (sagt es ehrlich). Gary-Vee-Check → Copy-Feinschliff.
  **Live seit 16.10. nachmittags:** Merge `7a4b39a..ff2b215` (FF) → Deploy durch;
  Live-Checks grün (neue Seiten 200; Alt-URLs 301: `/artikel/*`→`/`, `/impressum/`→
  `/imprint/`, `/datenschutz/`→`/privacy/`); GSC-Sitemap `sitemap-index.xml`
  eingereicht. Index-Wächter (`gsc_index_watch.py`) + Nachzug-Cron `92efc5307dea`
  auf die neuen URLs umgestellt.
- `2026-10-16` — **Monetarisierungs-Konzept steht — Go erteilt, Umsetzung läuft.**
  Auftrag: „Geld mit Domain + Accounts verdienen", Markt frei wählbar. Recherche
  (Markt, Affiliate-Ökonomie, X-Realität) → **EN/US-Pivot**: „Deals + Data + Voice".
  Zahlen: US-Weinmarkt >$115 Mrd.; Wein-Clubs $20–50/Signup, Shops 4–12 %,
  **Amazon-Alkohol 0 %**; X zahlt selbst fast nichts (Original Content Rewards:
  500 verif. Follower + 500k verif. Impressions/90 T.; Mini-Payouts). Altstand:
  kein Geld-Pfad (0 Affiliate-Links), kein Analytics, kein Publikum, X tot (1 Follower).
  Doc: KB `prj-fknwine-monetarisierung` (+ `prj-fknwine` aktualisiert).
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
  verstummt selbst; **löschen, wenn alles beantragt ist** — nach Relaunch nur noch
  begrenzt sinnvoll, Alt-URLs gehen per `_redirects` auf `/`). Details: KB `prj-fknwine`.
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
- `2026-10-14` — **Projekt aus dem Archiv geholt und wieder verankert.** Repo `Jind0la/fknwine` (public) geklont nach `~/Workspace/projects/19-fknwine`, Desktop-Projekt `fknwine` (p_881c6f4f) + KB-Notiz `prj-fknwine` + dieser War Room.

## Laufende Tasks

| Task | Wer | Status | Nächster Schritt |
|---|---|---|---|
| Affiliate-Konten | Era | **FKN Wine, ID 3126259 aktiv** — Bewerbungen raus: Gold Medal (59079), ONEHOPE (39702), Parcelle (94853); Personal Wine offen | Telefon bei Awin nachtragen (Nimar); Personal Wine erneut; Antworten der Merchant-Programme abwarten; CWC-Affiliate über deren Website prüfen |
| EN-Relaunch | Era | **Live (16.10.)** | Content-Welle 3 (3 Clubs + 2 Guides) auf `feat/content-wave-3` → Preview-Blick, dann Merge |
| Newsletter-Plattform | Era | **Flow live + E2E getestet** (beehiiv: Embed, Welcome-Mail, Footer) | Erste Ausgabe schreiben; Cadence aufsetzen |
| Index-Stand | Era | Wächter + Nachzug auf neue URLs umgestellt | Sitemap eingereicht; Cron `92efc5307dea` meldet selbst, wenn alle 9 neuen URLs beantragt sind → dann löschen |

## Entscheidungen

- **EN-Pivot entschieden (Nimars Go, 16.10.):** Deals + Data + Voice auf EN/US;
  Konzept KB `prj-fknwine-monetarisierung`. Ablauf: Branch → Live-Preview → Merge
  (kein Merge ohne Preview-Blick). X Premium bewusst aufgeschoben („erst wenn nötig").
- **Mail-Footer-Adresse bleibt vorerst die Bochum-Anschrift** (Nimar-Entscheid, 16.10.):
  Pflichtfeld in kommerziellen Mails (CAN-SPAM + beehiiv); steht ohnehin schon öffentlich
  im Impressum der Website. Wechsel auf Postfach/US-Virtual-Mailbox erst, wenn die Marke
  Umsätze macht (dann ggf. zusammen mit einer LLC).
- **Look bleibt, Inhalt neu:** Neubrutalist-Optik behalten (Wiedererkennung);
  DE-Artikel ersetzt (Git-History), Struktur + Texte EN. Keine Fake-Reviews —
  „Checked"-Daten überall.
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
- [x] Newsletter-Wiring live (beehiiv Embed + Welcome-Mail, 16.10. getestet). Analytics
      läuft real über Cloudflare Web Analytics — `ANALYTICS.provider` im Code bleibt `null`.
- [ ] GSC steht, aber **kein Analytics** → Traffic-/Kanalzahlen fehlen (Fix: Launch-Schritt).
- [ ] og-default.png zeigt noch den DE-Stand — neues EN-OG-Bild als Design-Task offen.

## Nächste Schritte

- [ ] **Affiliate-Pfad (nach den Ablehnungen):** Support-Antworten abwarten (FlexOffers-Mail,
      Impact #897752) → genannten Grund fixen; parallel Content + Traffic aufbauen
      (Welle 2: mehr Clubs, Coupons, „best under $15"); dann Re-Apply FlexOffers/Impact + Awin;
      Skimlinks/Sovrn & Direkt-Programme als gated-freie Alternativen prüfen. Newsletter
      (beehiiv) verkabeln; X-Cadence läuft an (ohne Follow-Churn).
- [ ] Index-Stand beobachten: neue URLs in GSC (`~/.hermes/scripts/gsc.py inspect
      <property> <url>`); Wächter-Cron `a8a57aadcd03` (Mo 09:00) meldet Änderungen.
- [ ] **Cron `92efc5307dea` (GSC-Nachzug, jetzt auf neue URLs) meldet selbst, wenn
      alle beantragt sind → dann löschen.**
- [ ] og-default.png: EN-Version erstellen (Design-Task).
- [ ] Optional: Domain-Property `sc-domain:fknwine.com` (nur DNS-TXT nötig).
