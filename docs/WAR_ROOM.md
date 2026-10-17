# War Room — FKN Wine

> Arbeits-Log des Projekts. Versioniert in Git, gepflegt von Hermes (Orchestratorin).
> Grundsatz: **Der Raum ist Teil der Team-Intelligenz** — Fehlschläge und Entscheidungen
> sind so wertvoll wie Erfolge. **Verdichtungs-Regel:** unter ~150 Zeilen halten;
> am Session-Ende abgeschlossene Tasks entfernen, Einträge >2 Wochen kürzen.

## Kernbefund (17.10.2026)

**Es gibt keinen Traffic — und der Grund ist Indexierung, nicht Content.**
GSC: **0 Klicks / 0 Impressionen** über 7, 28 und 90 Tage. Index: **1 von 19 Seiten** (`/about/`,
per URL-Inspection verifiziert: Verdikt `PASS`, „Submitted and indexed", Crawl 15.10. 08:56);
16 URLs = „Google unbekannt"; **Startseite weiter `Duplicate, Google chose different canonical`** →
der `pages.dev`-Konflikt ist NICHT behoben. Cloudflare Web Analytics: 60 Aufrufe/90 T — davon
**30 am 16.10. als `ChromeHeadless` = unsere eigene Audit-Toolchain**, der Rest Mobil-Emulation bzw.
Nimar; **100 % „(direkt)", kein einziger Verweis von außen**; die 10 US-Besuche liegen zwischen Juli
und September. Kanäle X (**1 Follower**) und Newsletter (**2 Testabos**) ebenfalls bei null.
**Wirtschaftlich:** 0 Traffic = 0 Affiliate-Umsatz; die FlexOffers/Impact-Ablehnungen („kein Traffic,
zu wenig Substanz") sind ein **Symptom dieses Problems**, keine Content-Frage. Reihenfolge daraus:
**indexiert werden → Geldseiten (6 Club-Reviews + Preis-Guide) → Tracking live (Awin ist frei).**
*Ehrlichkeit:* indexiert ≠ gerankt; Belegbasis der Fenstersummen schwankt leicht, den Tageszeilen traue ich mehr.

## Infrastruktur (steht, Stand 17.10.2026)

- **Traffic-&-Index-Wächter:** Cron `37a37f5866c4`, täglich 09:45, no_agent → Telegram.
  Montags immer Wochenreport, sonst **nur bei Ereignis** (neu indexierte URL / erster externer
  Referrer / erster Nicht-DE-Besuch); leerer stdout = still. `~/.hermes/scripts/fknwine_traffic_watch.{sh,py}`,
  State `~/.hermes/state/fknwine_traffic_state.json`. Zweimal echt gegen die APIs getestet.
- **Cloudflare-Leser:** `~/.hermes/scripts/fknwine-gsc/cf_traffic.py` (`verify|summary|pages|referrers|
  countries|devices`), Token read-only in `~/.hermes/secrets/cloudflare-token` (600).
  **Lehre: GraphQL braucht den `site_tag` aus der API, NICHT den Beacon-`site_token` aus dem HTML** —
  mit dem falschen Wert meldet der Leser „keine Daten" und es sieht wie „kein Traffic" aus.
  `/user/tokens/verify` antwortet bei konto-eigenen Tokens 401 (kein Defekt).
- **GSC:** Property per FILE verifiziert, `public/google35b2017bd84955fa.html` — **nie löschen**.
  **Korrektur (17.10., live geprüft) — der „Nachzug" ist kein Hebel, aber auch nicht tot:**
  Der automatisierte Nachzug hat **nie einen Erfolg verzeichnet** (State 0× „beantragt", alle Läufe im
  Protokoll nur „Kontingent überschritten"), und die Meldung („Tageskontingent erreicht — N bleiben für
  morgen") hat das als Fortschritt verkauft; Meldung in `run_pending.py` korrigiert.
  **Gleichzeitig zeigt das GSC-UI „Indexierung beantragen · Noch einmal beantragen"** (Sitzung eingeloggt,
  kein Kontingent-Banner) — Anfragen sind also früher durchgegangen; „nie beantragt" wäre eine
  Überkorrektur. **Das Entscheidende ist das Ergebnis in beiden Fällen:** 18 von 19 URLs sind Google
  „unbekannt", die Startseite wird seit 16.10. 10:40 geführt und weiter als Duplikat mit
  googleCanonical = pages.dev. **„Request Indexing" hat bei uns bislang keine Indexierung erzeugt** —
  deshalb ist es kein Hebel, auf den wir planen. Job von täglich auf **wöchentlich** reduziert
  (täglicher Browser-Lauf für einen belegbar wirkungslosen Knopf).
  **Sitemap am 17.10. neu eingereicht**, weil Google noch mit dem alten Stand arbeitet (33 statt 19 URLs).
- **KI-Zugang:** Such-/Antwort-Agenten erlaubt (`ai-input=yes`), Training gesperrt (`ai-train=no`).
  Cloudflares AI-Panel (Zone → Security) ist die **Autorität** (Search/Agent Allow, Training Disallow,
  Bot Preference Sync AN); Edge-Gegenprobe: PerplexityBot/OAI-SearchBot 200, GPTBot 403. Unsere
  `robots.txt` widerspricht dem nicht mehr (Google-Extended-Allow entfernt, `2796038`). **Nach jeder
  Panel-Änderung die Live-`robots.txt` neu parsen — die Cloud-Liste ist nicht im Repo.**
- **Live gemergt & verifiziert:** `21304a4` Content-Welle 3 · `766dee6` SEO-Welle 1 (`_headers` HSTS,
  `/subscribed/` noindex, Schema-`@graph`+`BreadcrumbList`, interne Links Reviews↔Guides, Verdicts
  entschieden, Meta ≤155, Touch-Ziele ≥44 px, Tabellen-Scrollregion) · `e24c8f4` AI-Optimierung
  (`<time datetime>`, meta robots, `llms.txt`) · `4b3cfc0` Methodenseite. Details stehen in den Commits.
- **Deal-Refresh:** Cron Mo 10:00 (local) prüft Deals am Merchant, schreibt `deals.ts` nur bei grünem Build.
- **X-Wachstumssystem (17.10.):** Cron `638ebb99dfae` (täglich 15:00 = 9:00 ET) postet aus
  `~/.hermes/state/fkn_x_queue.json` (`fkn_x_post.py`); Cron **`2ec20ee15e3d`** (täglich 14:30) liefert
  **fertige Antwort-Entwürfe** per Telegram — **Link als erste Zeile**, dann der Fertigtext, **zweite Zeile
  PFLICHT = Account-Hinweis** (`fkn_x_digest_prompt.txt`); **Lern-Loop:** Cron `bbbc8f7c7549` (täglich 23:00,
  still) schreibt Schnappschüsse nach `~/.hermes/state/fkn_x_perf.jsonl`, Cron `1679e224fb1e` (Mo 15:00)
  liefert die Wochen-Auswertung (`fkn_x_perf.py`). Skills `x-growth`, `xurl`.
  **Der Loop ist nur möglich, weil Antworten eigene Posts des Markenkontos sind** — dadurch messbar.
  **Fehler, der nicht wiederkommen darf:** Die ersten 3 Antworten wurden aus Nimars **privatem** Konto
  abgeschickt, weil die Lieferung nur Link + Text enthielt. Seitdem steht der Account-Switch in jeder
  Lieferung, und der Skill `x-growth` trägt die Regel „immer nennen, welches Konto antwortet".
  **Harte Grenze, live geprüft:** Die X-API erlaubt **keine** Antwort/kein Quote auf fremde Posts
  (403 „you are mentioned or are the author") — **X-Politik gegen LLM-Spam, keine Tarifstufe**
  (offizielle Ankündigung „Addressing LLM-Generated Spam"), ein Upgrade hilft also nicht. `post`/`like`/`repost`/
  `follow` gehen. **Antworten sind nur von Hand möglich**; Browser-Automatisierung wäre regelwidrig
  (Ban-Risiko) und ist deshalb ausgeschlossen. Erster echter Post live (`Firstleaf: 'no fees' vs.
  $25 restocking fee`, id `2111382787760554074`, per Read-back verifiziert).
- **Domain/Deploy:** `site` in `astro.config.mjs` = **einzige** Domain-Quelle, Canonical mit Trailing Slash;
  `always_use_https` + www→Apex 301 (Zone `51e9dc8462690929e186758bf3a0916a`); Deploy via Pages-GitHub-Integration.

## Assets & Kanäle

- **Repo** `Jind0la/fknwine` → `~/Workspace/projects/19-fknwine`, Desktop-Projekt `fknwine` (p_881c6f4f), KB `prj-fknwine`.
- **Awin:** Publisher **FKN Wine, ID 3126259** aktiv, Profil 100 % (Avatar ✱, Mauritiusstraße).
  Beworben: Gold Medal (**59079**), ONEHOPE (**39702**), Parcelle (**94853**); Personal Wine 39786 öffnet kein Modal.
  Eigenheiten: Aktivierungs-Mail mit Template-Bug (Konto dennoch nutzbar); CWC läuft NICHT über Awin-US.
  Ablehnungen: FlexOffers (Textbaustein), Impact (Ticket **#897752**, Gate).
  **Telefon-Falle aufgelöst (17.10., live aus dem Browser gelesen):** Awin hat **zwei** Seiten mit
  **denselben zwei Feldern** — `/user/settings/details/…` (Benutzerdetails) und
  `/awin/affiliate/3126259/settings/contact` (Kontaktdetails). Ausgefüllt war gegengleich:
  Benutzerdetails `telephone` ✓ / `mobile` leer; **Kontaktdetails `mobile` ✓ / `telephone` LEER**.
  Merken: **Kontaktdetails ist die Sicht, die Merchants sehen** → dort muss stehen. Dort ebenfalls leer
  (und für Netzwerk-Freigaben wertvoll, weil „kein Publikum" der Ablehnungsgrund war):
  **`twitterUsername` (→ FKNWine), `blogUrl`, `facebookPage`**, dazu `address1`/Apartment und IM-Felder (optional).
  Speichern nur mit Passwort im Feld `password` („Details aktualisieren").
- **Mail:** info@/hey@fknwine.com → nimarm@me.com + Gmail-Kopie (CF-Worker `fkn-mail-router`); senden als
  info@/hey@ via Resend (`~/.hermes/scripts/fkn_send.py`).
- **Newsletter:** beehiiv live, Welcome-Flow E2E getestet, Issue #01 als Draft („A $10 Malbec and the fine
  print we actually read"). Byline/Signatur = „FKN Wine" (✱-Avatar), Legal-Seiten behalten den Operator-Namen,
  Footer Bochum. Composer-/CDP-Lehren im Skill `beehiiv-newsletter`.
- **X:** @FKNWine, id `2074768137501675520`, schreib-verifiziert. Stand 17.10.: **1 Follower**, 46 Following,
  7 Posts, 0 Medien. **Lehren:** (1) Standalone-Link-Posts → 403 „not permitted" bei jungem Account,
  Link als Reply auf den eigenen Post; (2) **Antworten/Quotes auf fremde Posts sind über die API generell
  gesperrt** (s. Infrastruktur) — Antwort-Wachstum braucht eine Menschenhand; (3) **drei „große" Wein-Accounts
  sind tot** (@WineSpectator 14 Monate, @WineandSpirits 2,5 J, @drvino 3,6 J) — vor dem Antworten immer das
  Post-Alter messen; (4) **lebendig und stündlich aktiv ist @WineEnthusiast (217k)**, dazu @WineFolly,
  @winewankers, @vinography, @VinePair; (5) **Reichweite ohne Themenbezug ist wertlos** — @TastingTable
  (1 Mio) postet Burger, für eine Weinmarke Nullreichweite; (6) bisherige Posts gingen im deutschen
  Tageslicht raus = 2–5 Uhr US-Zeit, deshalb der 15:00-Cron. Aufruf immer `xurl -u FKNWine …`.
- **Content-Stand:** 6 Club-Reviews, 3 Guides, Methodenseite, 19 URLs. E-E-A-T-Lücke geschlossen, indem die
  Clubs **selbst nachgelesen** wurden (Hilfe-Center + AGB); die gefundenen Widersprüche (Firstleaf $25 vs.
  „no fees", Winc „$9 may apply" vs. „Free shipping always", Guthaben-Verfall, 3-Tage-Frist, Wine Access als
  Ausnahme) stehen im Detail in den Reviews und auf `/how-we-test/` — **nicht hier duplizieren.**
  **Wir haben die Clubs nicht gekauft — steht so auf jeder Seite.**

## Laufende Tasks

| Task | Wer | Status | Nächster Schritt |
|---|---|---|---|
| Indexierung | Era/Google | **1/19 indexiert**, Startseite noch Duplikat | Wächter + Nachzug laufen lassen; `pages.dev`-Entdopplung nur über Canonical + Re-Crawl |
| Affiliate-Konten | Era | Awin aktiv, 3 Bewerbungen offen | Awin-Telefon nachtragen (Nimar); Antworten; Skimlinks/Sovrn prüfen; Re-Apply nach Traffic |
| Content-Kadenz | Era | 6 Clubs, 3 Guides live | Welle 4: Wine Insiders, WSJ Wine, Plonk |
| Newsletter | Era | Flow live; Issue #01 Draft | Publizieren, sobald echte Abos da sind |
| Monetarisierung | Era | Konzept steht (EN/US, „Deals + Data + Voice") | Tracking-Links live → `AFFILIATE_LIVE=true` (schaltet FTC-Disclosure) |

## Entscheidungen

- **EN-Pivot (Nimars Go):** Deals + Data + Voice auf EN/US. Ablauf immer Branch → Live-Preview → Merge
  (**kein Merge ohne Preview-Blick**). X Premium bewusst aufgeschoben.
- **KI-Zugang (17.10., dreht die frühere Sperre um):** KI darf lesen und suchen (`ai-input=yes`),
  nur Training bleibt zu (`ai-train=no`).
- **Kein Cloudflare-Schreib-Token** — bewusst nur Leserechte für Analytics; nichts Schreibendes nötig.
- **Keine Tasting-Behauptungen:** Meinung wird als Meinung markiert, jede Zahl mit „Checked"-Datum.
- **Look bleibt, Inhalt neu:** Neubrutalist-Optik behalten. Footer-Adresse bleibt vorerst Bochum.
- **Amazon zahlt 0 % auf Alkohol** — nie als Einnahme planen.

## Fehlschläge & Korrekturen (Lehren)

- **Eigener Fehler: Host-Redirect per Pages-Function zerlegte die Live-Seite** (~4 Min Ausfall, per `git revert`
  zurück). Host-Redirects nie aus einer Pages-Function ableiten; grünes Preview beweist hostabhängiges
  Produktionsverhalten nicht.
- **Erste Mobile-Overflow-Diagnose war ein Messfehler:** headless `--window-size` setzt das Layout-Viewport
  nicht — erst `Emulation.setDeviceMetricsOverride` + `docScrollWidth` zeigte die Wahrheit.
- **Eigener Bug in der AI-Welle:** `Date.parse("Oct 16, 2026")` + `toISOString()` schob das Datum in Berlin
  auf den 15. zurück (UTC) — Maschinen hätten den falschen Tag gelesen. Jetzt lokale Datumskomponenten.
- **Fremdberichte und eigene Meldungen sind Selbstauskünfte.** Die Audit-Rollen behaupteten „Startseite hat
  3 H1" (sie hat 1) und „`og-default.png` noch DE" (ist EN). Und der eigene Wächter meldete den eigenen
  Domain-Referrer als „ersten externen Besuch" und behauptete „keine Indexierung" direkt über „1/19".
  **Regel: Kernbefunde und jede Ausgabe gegen die echten Zahlen prüfen, nie gegen die Erwartung.**

## Known Limitations

- [ ] **Deploy hängt an der Pages-GitHub-Integration** — kein Wrangler-Token; Verifikation nur per Live-Check nach dem Push.
- [ ] `fknwine.pages.dev` liefert weiter 200 → Entdopplung nur über Canonical + Re-Crawl (Pages-Function-Weg ist verboten, s. o.).
- [ ] Startseite ist für Google ein Duplikat mit fremdem Canonical → blockiert den Einstieg in den Index.
- [ ] Ohne Suchtraffic sind Traffic-Zahlen Kleinstgröße und von Eigenverkehr kaum zu trennen.

## Nächste Schritte

- [ ] **Indexierung beobachten** (Wächter meldet selbst); Startseiten-Duplikat im Auge behalten —
      erst wenn die Startseite auf `fknwine.com` steht, kann echtes Ranking beginnen.
- [ ] **Awin-Telefonnummer** nachtragen (Nimar) → Merchants freischalten.
- [ ] Affiliate-Antworten (FlexOffers, Impact #897752) → genannten Grund fixen, dann Re-Apply.
- [ ] Content-Welle 4 (Wine Insiders, WSJ Wine, Plonk) — **erst nach Index-Fortschritt**, sonst schreibt man in einen leeren Raum.
