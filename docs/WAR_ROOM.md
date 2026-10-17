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
  Nachzug-Cron `92efc5307dea` (täglich 09:30) zieht die 19 echten URLs nach (~10/Tag = Google-Kontingent);
  `urls.txt` führt die 19 Seiten aus der Sitemap; **Cron löschen, wenn alle beantragt sind.**
- **KI-Zugang:** Such-/Antwort-Agenten erlaubt (`ai-input=yes`), Training gesperrt (`ai-train=no`).
  Cloudflares AI-Panel (Zone → Security) ist die **Autorität** (Search/Agent Allow, Training Disallow,
  Bot Preference Sync AN); Edge-Gegenprobe: PerplexityBot/OAI-SearchBot 200, GPTBot 403. Unsere
  `robots.txt` widerspricht dem nicht mehr (Google-Extended-Allow entfernt, `2796038`). **Nach jeder
  Panel-Änderung die Live-`robots.txt` neu parsen — die Cloud-Liste ist nicht im Repo.**
- **Live gemergt & verifiziert:** `21304a4` Content-Welle 3 (Naked Wines, Gold Medal, Wine Access +
  2 Guides; `rehype-table-wrap.mjs` gegen Mobile-Overflow, braucht `@astrojs/markdown-remark`) ·
  `766dee6` SEO-Welle 1 (`_headers` HSTS+immutable, `/subscribed/` noindex, Schema-`@graph` mit
  `@id`/`sameAs`/`BreadcrumbList`, Netz interne Links Reviews↔Guides, entschiedene Verdicts,
  Meta ≤155/Titel ≤52, Touch-Ziele ≥44 px, Tabellen-Scrollregion) · `e24c8f4` AI-Optimierung
  (`<time datetime>` für jedes Check-Datum, meta robots, `llms.txt` Key-Facts) ·
  `4b3cfc0` Methodenseite `/how-we-test/`.
- **Deal-Refresh:** Cron Mo 10:00 (local) prüft Deals am Merchant, schreibt `deals.ts` nur bei grünem Build.
- **X-Wachstumssystem (17.10. aufgebaut):** Cron `638ebb99dfae` (täglich 15:00 = 9:00 ET) postet einen
  Eintrag aus der Warteschlange `~/.hermes/state/fkn_x_queue.json` (`fkn_x_post.py`); Cron `9aca2d324c03`
  (täglich 14:30) findet über `fkn_x_opportunities.py` frische Posts lebender Wein-Konten und liefert
  **fertige Antwort-Entwürfe** per Telegram. Skill `x-growth` (+ `xurl` um die API-Grenze ergänzt).
  **Harte Grenze, live geprüft:** Die X-API erlaubt **keine** Antwort/kein Quote auf fremde Posts
  (403 „you are mentioned or are the author", Free-Tier) — `reply` schlägt fehl, `post`/`like`/`repost`/
  `follow` gehen. **Antworten sind nur von Hand möglich**; Browser-Automatisierung wäre regelwidrig
  (Ban-Risiko) und ist deshalb ausgeschlossen. Erster echter Post live (`Firstleaf: 'no fees' vs.
  $25 restocking fee`, id `2111382787760554074`, per Read-back verifiziert).
- **Domain/Deploy:** `site` in `astro.config.mjs` ist die **einzige** Domain-Quelle, Canonical mit
  Trailing Slash (Pages 308 `/x`→`/x/`); `always_use_https` + www→Apex 301 in der Zone
  `51e9dc8462690929e186758bf3a0916a`; Deploy über die Pages-GitHub-Integration (kein Wrangler-Token).

## Assets & Kanäle

- **Repo** `Jind0la/fknwine` → `~/Workspace/projects/19-fknwine`, Desktop-Projekt `fknwine` (p_881c6f4f), KB `prj-fknwine`.
- **Awin:** Publisher **FKN Wine, ID 3126259** aktiv, Profil 100 % (Avatar ✱, Mauritiusstraße).
  Beworben: Gold Medal (**59079**), ONEHOPE (**39702**), Parcelle (**94853**); Personal Wine 39786 öffnet kein Modal.
  **Offen: Telefonnummer nachtragen (Nimar).** Eigenheiten: Aktivierungs-Mail mit Template-Bug (Konto dennoch nutzbar);
  CWC läuft NICHT über Awin-US. Ablehnungen: FlexOffers (Textbaustein), Impact (Ticket **#897752**, Gate).
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
- **Content-Stand:** 6 Club-Reviews, 3 Guides, Methodenseite, 19 URLs. E-E-A-T-Lücke geschlossen, indem
  die Clubs **selbst nachgelesen** wurden (Hilfe-Center + AGB) — gefundene Widersprüche: Firstleaf „no fees"
  vs. **$25 Restocking Fee**, Winc „Free Shipping always" vs. AGB **„$9 may apply"**, Firstleaf-Guthaben
  **verfällt bei Kündigung**, Winc **3-Tage-Frist** + Auto-Abrechner Insider Access ($59.95/Monat);
  Wine Access als Ausnahme (keine Restocking-Gebühr, 35-Staaten-Liste, Cut-off 1 Werktag).
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
- **Audit-Rollen sind Selbstauskünfte:** „Startseite hat 3 H1" war falsch (sie hat 1); die Behauptung
  „`og-default.png` noch DE-Stand" ebenfalls. Kernbefunde immer selbst nachprüfen.
- **Wächter-Fehlalarm (eigener):** eigener Domain-Referrer galt als „externer Besuch" → `OUR_HOSTS`-Filter;
  und eine Schlusszeile behauptete „keine Indexierung", während oben „1/19" stand. Ausgaben gegen die
  eigenen Zahlen prüfen, nicht gegen die Erwartung.

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
