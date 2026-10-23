// Merchant-Registry — EIN Ort für alle ausgehenden Shop-Links.
// Wenn Affiliate-Konten stehen, wird nur hier die `affiliate`-Vorlage gefüllt;
// sämtliche Links der Site laufen über outUrl() und werden automatisch getrackt.

export interface Merchant {
  name: string;
  url: string;
  /**
   * Affiliate-Link-Template. null = noch kein Programm aktiv.
   * Beispiel später: 'https://track.example.com/click?pid=123&url={url}'
   * {url} wird mit der Ziel-URL (urlencoded) ersetzt.
   */
  affiliate: string | null;
}

export const merchants = {
  firstleaf: { name: 'Firstleaf', url: 'https://www.firstleaf.com/', affiliate: null },
  wtso: { name: 'WTSO', url: 'https://www.wtso.com/', affiliate: null },
  winecom: { name: 'Wine.com', url: 'https://www.wine.com/', affiliate: null },
  winc: { name: 'Winc', url: 'https://www.winc.com/', affiliate: null },
  cawineclub: { name: 'The California Wine Club', url: 'https://cawineclub.com/', affiliate: null },
  nakedwines: { name: 'Naked Wines', url: 'https://www.nakedwines.com/', affiliate: null },
  goldmedal: { name: 'Gold Medal Wine Club', url: 'https://goldmedalwineclub.com/', affiliate: null },
  wineaccess: { name: 'Wine Access', url: 'https://www.wineaccess.com/', affiliate: null },
  // Welle 4 (22.10.2026) — Keys müssen identisch mit merchantId im Content-Schema sein.
  wineinsiders: { name: 'Wine Insiders', url: 'https://wineinsiders.com/', affiliate: null },
  wsjwine: { name: 'WSJ Wine', url: 'https://www.wsjwine.com/', affiliate: null },
  plonkwineclub: { name: 'Plonk Wine Club', url: 'https://www.plonkwineclub.com/', affiliate: null },
  // Awin freigeschaltet (23.10.2026) — 15 % auf alle Sales, 30-Tage-Cookie.
  // {subid} wird pro Seite ersetzt (Default: 'fknwine'), damit wir im Awin-Report sehen, was zieht.
  makerwine: {
    name: 'Maker Wine',
    url: 'https://www.makerwine.com/',
    affiliate:
      'https://www.awin1.com/cread.php?awinmid=131275&awinaffid=3126259&clickref={subid}&ued={url}',
  },
  // Kandidaten für die nächste Welle (Programme laufen – siehe War Room):
  // Gold Medal läuft über Awin (Merchant 59079); WineExpress via Impact-Direktlink; totalwine, vivino …
} satisfies Record<string, Merchant>;

export type MerchantId = keyof typeof merchants;

/** Baut die ausgehende URL für einen Merchant. Einziger Swap-Point für Tracking. */
export function outUrl(id: MerchantId, path = '', subId = 'fknwine'): string {
  const m = merchants[id];
  const target = path ? new URL(path, m.url).href : m.url;
  if (m.affiliate) {
    return m.affiliate
      .replace('{url}', encodeURIComponent(target))
      .replace('{subid}', encodeURIComponent(subId));
  }
  return target;
}
