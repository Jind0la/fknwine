# War Room — FKN Wine

> Arbeits-Log des Projekts, Git-versioniert, gepflegt von Hermes (Orchestratorin).
> **Verdichtungs-Regel:** unter ~150 Zeilen; am Session-Ende abgeschlossene Tasks entfernen,
> Einträge >2 Wochen kürzen.

## Kernbefund (17.10.2026)

**Kein Traffic — Ursache ist die Indexierung, nicht der Content.** GSC: **0 Klicks / 0 Impressionen** über
7/28/90 Tage. Index **1 von 19 Seiten** (`/about/`, URL-Inspection: `PASS`, „Submitted and indexed", Crawl
15.10. 08:56); 16 URLs „Google unbekannt"; **Startseite weiter `Duplicate, Google chose different canonical`** →
`pages.dev`-Konflikt NICHT behoben. Cloudflare Web Analytics: 60 Aufrufe/90 T, davon **30 am 16.10. als
`ChromeHeadless` = eigene Audit-Toolchain**, Rest Mobil-Emulation bzw. Nimar; **100 % „(direkt)", kein externer
Verweis**; die 10 US-Besuche Juli–September. Kanäle X (**1 Follower**) und Newsletter (**2 Testabos**) bei null.
**Wirtschaftlich:** 0 Traffic = 0 Affiliate-Umsatz; die FlexOffers/Impact-Ablehnungen sind Symptom, keine
Content-Frage. Reihenfolge: **indexiert werden → Geldseiten (6 Club-Reviews + Preis-Guide) → Tracking live
(Awin frei).** *Ehrlichkeit:* indexiert ≠ gerankt; Belegbasis der Fenstersummen schwankt, den Tageszeilen traue ich mehr.

## Infrastruktur (Stand 17.10.2026)

- **Traffic-&-Index-Wächter:** Cron `37a37f5866c4` (täglich 09:45, no_agent → Telegram). Montags Wochenreport,
  sonst nur bei Ereignis (neu indexierte URL / erster externer Referrer / erster Nicht-DE-Besuch); leerer stdout
  = still. `~/.hermes/scripts/fknwine_traffic_watch.{sh,py}`, State `~/.hermes/state/fknwine_traffic_state.json`.
  Zweimal echt gegen die APIs getestet.
- **Cloudflare-Leser:** `~/.hermes/scripts/fknwine-gsc/cf_traffic.py` (`verify|summary|pages|referrers|countries|devices`),
  Token read-only in `~/.hermes/secrets/cloudflare-token` (600). **Lehre: GraphQL braucht den `site_tag` aus der
  API, NICHT den Beacon-`site_token` aus dem HTML** — sonst „keine Daten" und es sieht wie „kein Traffic" aus.
  `/user/tokens/verify` antwortet bei konto-eigenen Tokens 401 (kein Defekt).
- **GSC:** Property per FILE verifiziert, `public/google35b2017bd84955fa.html` — **nie löschen**. Der
  automatisierte Nachzug hat **nie einen Erfolg verzeichnet** (State 0× „beantragt", alle Läufe „Kontingent
  überschritten") und die Meldung verkaufte das als Fortschritt; Text in `run_pending.py` korrigiert. Das GSC-UI
  zeigt aber „Indexierung beantragen · Noch einmal beantragen" (eingeloggt, kein Kontingent-Banner) → Anfragen
  gingen früher durch; „nie beantragt" wäre eine Überkorrektur. **Entscheidend ist das Ergebnis:** 18/19 URLs
  „unbekannt", Startseite seit 16.10. 10:40 geführt und weiter Duplikat mit `googleCanonical = pages.dev`.
  **„Request Indexing" hat bei uns bislang keine Indexierung erzeugt** — kein Hebel, auf den wir planen; Job von
  täglich auf **wöchentlich** reduziert. **Sitemap am 17.10. neu eingereicht** (Google arbeitete noch mit 33 statt 19 URLs).
- **KI-Zugang:** Such-/Antwort-Agenten erlaubt (`ai-input=yes`), Training gesperrt (`ai-train=no`). Cloudflares
  AI-Panel (Zone → Security) ist die **Autorität** (Search/Agent Allow, Training Disallow, Bot Preference Sync AN);
  Edge-Gegenprobe: PerplexityBot/OAI-SearchBot 200, GPTBot 403. `robots.txt` widerspricht dem nicht mehr
  (Google-Extended-Allow entfernt, `2796038`). **Nach jeder Panel-Änderung die Live-`robots.txt` neu parsen —
  die Cloud-Liste ist nicht im Repo.**
- **Live gemergt & verifiziert:** `21304a4` Content-Welle 3 · `766dee6` SEO-Welle 1 (`_headers` HSTS, `/subscribed/`
  noindex, Schema-`@graph`+`BreadcrumbList`, interne Links Reviews↔Guides, Verdicts entschieden, Meta ≤155,
  Touch-Ziele ≥44 px, Tabellen-Scrollregion) · `e24c8f4` AI-Optimierung (`<time datetime>`, meta robots, `llms.txt`) ·
  `4b3cfc0` Methodenseite. Details in den Commits.
- **Deal-Refresh:** Cron Mo 10:00 (local) prüft Deals am Merchant, schreibt `deals.ts` nur bei grünem Build.
- **X-Wachstumssystem (17.10.):** Cron `638ebb99dfae` (täglich 15:00 = 9:00 ET) postet aus
  `~/.hermes/state/fkn_x_queue.json` (`fkn_x_post.py`); Cron `2ec20ee15e3d` (täglich 14:30) liefert **fertige
  Antwort-Entwürfe** per Telegram — **Link erste Zeile**, dann Fertigtext, **zweite Zeile PFLICHT = Account-Hinweis**
  (`fkn_x_digest_prompt.txt`); Lern-Loop: Cron `bbbc8f7c7549` (täglich 23:00) schreibt Schnappschüsse nach
  `~/.hermes/state/fkn_x_perf.jsonl`, Cron `1679e224fb1e` (Mo 15:00) liefert die Wochen-Auswertung (`fkn_x_perf.py`);
  Skills `x-growth`, `xurl`. Der Loop funktioniert nur, weil Antworten eigene Posts des Markenkontos sind.
  **Fehler, der nicht wiederkommen darf:** die ersten 3 Antworten gingen aus Nimars **privatem** Konto raus, weil die
  Lieferung nur Link + Text enthielt — seitdem steht der Account-Switch in jeder Lieferung, Skill `x-growth` trägt
  „immer nennen, welches Konto antwortet". **Harte Grenze (live):** die X-API erlaubt **keine** Antwort/kein Quote auf
  fremde Posts (403 „you are mentioned or are the author") — **X-Politik gegen LLM-Spam, keine Tarifstufe** (Upgrade
  hilft nicht); `post`/`like`/`repost`/`follow` gehen. Antworten nur von Hand; Browser-Automatisierung wäre
  regelwidrig (Ban) und ist ausgeschlossen. Erster echter Post live (`Firstleaf: 'no fees' vs. $25 restocking fee`,
  id `2111382787760554074`, per Read-back verifiziert).
- **Domain/Deploy:** `site` in `astro.config.mjs` = **einzige** Domain-Quelle, Canonical mit Trailing Slash;
  `always_use_https` + www→Apex 301 (Zone `51e9dc8462690929e186758bf3a0916a`); Deploy via Pages-GitHub-Integration.

## Assets & Kanäle

- **Repo** `Jind0la/fknwine` → `~/Workspace/projects/19-fknwine`, Desktop-Projekt `fknwine` (p_881c6f4f), KB `prj-fknwine`.
- **Awin:** Publisher **FKN Wine, ID 3126259** aktiv, Profil 100 % (Avatar ✱, Mauritiusstraße). Beworben: Gold Medal
  (**59079**), ONEHOPE (**39702**), Parcelle (**94853**); Personal Wine 39786 öffnet kein Modal. Eigenheiten:
  Aktivierungs-Mail mit Template-Bug (Konto nutzbar); CWC läuft NICHT über Awin-US. Ablehnungen: FlexOffers
  (Textbaustein), Impact (Ticket **#897752**, Gate). **Telefon-Falle (17.10., live):** Awin hat **zwei** Seiten mit
  denselben zwei Feldern — `/user/settings/details/…` (Benutzerdetails) und `/awin/affiliate/3126259/settings/contact`
  (Kontaktdetails); gegengleich ausgefüllt: Benutzerdetails `telephone` ✓ / `mobile` leer, **Kontaktdetails `mobile` ✓ /
  `telephone` LEER**. **Kontaktdetails ist die Sicht, die Merchants sehen** → dort muss es stehen. Dort ebenfalls leer
  (für Netzwerk-Freigaben wertvoll, „kein Publikum" war Ablehnungsgrund): `twitterUsername` (→ FKNWine), `blogUrl`,
  `facebookPage`, `address1`/Apartment, IM-Felder (optional). Speichern nur mit Passwort im Feld `password`.
- **Mail:** info@/hey@fknwine.com → nimarm@me.com + Gmail-Kopie (CF-Worker `fkn-mail-router`); senden als info@/hey@
  via Resend (`~/.hermes/scripts/fkn_send.py`).
- **Newsletter:** beehiiv live, Welcome-Flow E2E getestet, Issue #01 als Draft („A $10 Malbec and the fine print we
  actually read"). Byline/Signatur = „FKN Wine" (✱-Avatar), Legal-Seiten behalten den Operator-Namen, Footer Bochum.
  Composer-/CDP-Lehren im Skill `beehiiv-newsletter`.
- **X:** @FKNWine, id `2074768137501675520`, schreib-verifiziert; Stand 17.10.: **1 Follower**, 46 Following, 7 Posts,
  0 Medien. **Lehren:** (1) Standalone-Link-Posts → 403 bei jungem Account, Link als Reply auf den eigenen Post;
  (2) Antworten/Quotes auf fremde Posts API-generell gesperrt → Antwort-Wachstum braucht eine Menschenhand;
  (3) drei „große" Wein-Accounts sind tot (@WineSpectator 14 Mon., @WineandSpirits 2,5 J, @drvino 3,6 J) — vor dem
  Antworten Post-Alter messen; (4) lebendig/stündlich: @WineEnthusiast (217k), @WineFolly, @winewankers, @vinography,
  @VinePair; (5) Reichweite ohne Themenbezug ist wertlos (@TastingTable 1 Mio postet Burger, für Wein Null);
  (6) alte Posts liefen im deutschen Tageslicht (2–5 Uhr US) — deshalb der 15:00-Cron. Aufruf immer `xurl -u FKNWine …`.
- **Content-Stand:** 6 Club-Reviews, 3 Guides, Methodenseite, 19 URLs. E-E-A-T-Lücke geschlossen durch **eigenes
  Nachlesen** der Clubs (Hilfe-Center + AGB); gefundene Widersprüche (Firstleaf $25 vs. „no fees", Winc „$9 may apply"
  vs. „Free shipping always", Guthaben-Verfall, 3-Tage-Frist, Wine Access als Ausnahme) stehen in den Reviews und auf
  `/how-we-test/` — **nicht hier duplizieren.** **Wir haben die Clubs nicht gekauft — steht so auf jeder Seite.**

## Laufende Tasks

| Task | Wer | Status | Nächster Schritt |
|---|---|---|---|
| Indexierung | Era/Google | **1/19 indexiert**, Startseite Duplikat | Wächter + Nachzug laufen lassen; `pages.dev`-Entdopplung nur über Canonical + Re-Crawl |
| Affiliate-Konten | Era | Awin aktiv, 3 Bewerbungen offen | Awin-Telefon nachtragen (Nimar); Antworten; Skimlinks/Sovrn prüfen; Re-Apply nach Traffic |
| Content-Kadenz | Era | 6 Clubs, 3 Guides live | Welle 4: Wine Insiders, WSJ Wine, Plonk |
| Newsletter | Era | Flow live; Issue #01 Draft | Publizieren, sobald echte Abos da sind |
| Monetarisierung | Era | Konzept steht (EN/US, „Deals + Data + Voice") | Tracking-Links live → `AFFILIATE_LIVE=true` (FTC-Disclosure) |

## Entscheidungen

- **EN-Pivot (Nimars Go):** Deals + Data + Voice auf EN/US. Ablauf Branch → Live-Preview → Merge (**kein Merge ohne
  Preview-Blick**); X Premium bewusst aufgeschoben.
- **KI-Zugang (17.10., dreht frühere Sperre um):** KI darf lesen und suchen (`ai-input=yes`), nur Training zu (`ai-train=no`).
- **Kein Cloudflare-Schreib-Token** — bewusst nur Leserechte für Analytics. **Amazon zahlt 0 % auf Alkohol** — nie als
  Einnahme planen.
- **Keine Tasting-Behauptungen:** Meinung als Meinung markiert, jede Zahl mit „Checked"-Datum.
- **Look bleibt, Inhalt neu:** Neubrutalist-Optik behalten; Footer-Adresse vorerst Bochum.

## Fehlschläge & Korrekturen (Lehren)

- **Eigener Fehler: Host-Redirect per Pages-Function zerlegte die Live-Seite** (~4 Min Ausfall, per `git revert`
  zurück). Host-Redirects nie aus einer Pages-Function ableiten; grünes Preview beweist hostabhängiges
  Produktionsverhalten nicht.
- **Erste Mobile-Overflow-Diagnose war ein Messfehler:** headless `--window-size` setzt das Layout-Viewport nicht —
  erst `Emulation.setDeviceMetricsOverride` + `docScrollWidth` zeigte die Wahrheit.
- **Eigener Bug in der AI-Welle:** `Date.parse("Oct 16, 2026")` + `toISOString()` schob das Datum in Berlin auf den
  15. zurück (UTC). Jetzt lokale Datumskomponenten.
- **Fremdberichte und eigene Meldungen sind Selbstauskünfte:** Audit-Rollen behaupteten „Startseite hat 3 H1" (hat 1)
  und „`og-default.png` noch DE" (ist EN); der eigene Wächter meldete den eigenen Domain-Referrer als „ersten
  externen Besuch" und „keine Indexierung" direkt über „1/19". **Regel: Kernbefunde und jede Ausgabe gegen die echten
  Zahlen prüfen, nie gegen die Erwartung.**

## Known Limitations

- [ ] **Deploy hängt an der Pages-GitHub-Integration** — kein Wrangler-Token; Verifikation nur per Live-Check nach dem Push.
- [ ] `fknwine.pages.dev` liefert weiter 200 → Entdopplung nur über Canonical + Re-Crawl (Pages-Function-Weg verboten).
- [ ] Startseite ist für Google ein Duplikat mit fremdem Canonical → blockiert den Einstieg in den Index.
- [ ] Ohne Suchtraffic sind Traffic-Zahlen Kleinstgröße und von Eigenverkehr kaum zu trennen.

## Nächste Schritte

- [ ] **Indexierung beobachten** (Wächter meldet selbst); Startseiten-Duplikat im Auge behalten — echtes Ranking erst,
      wenn die Startseite auf `fknwine.com` steht.
- [ ] **Awin-Telefonnummer** nachtragen (Nimar) → Merchants freischalten. Affiliate-Antworten (FlexOffers,
      Impact #897752) → genannten Grund fixen, dann Re-Apply.
- [ ] Content-Welle 4 (Wine Insiders, WSJ Wine, Plonk) — **erst nach Index-Fortschritt**.
