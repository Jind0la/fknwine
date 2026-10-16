// Deal-Feed (erste Fuhre, Stand 16.10.2026 — jede Zeile am Merchant geprüft).
// Ab Content-Welle 2: Befüllung/Refresh per Cron aus Deal-Quellen-Scannern.

export interface Deal {
  id: string;
  merchantId: 'firstleaf' | 'wtso' | 'winecom';
  merchantLabel: string;
  title: string;
  detail: string;
  price: string;
  compareAt?: string;
  badge?: string;
  code?: string;
  expires?: string;
  checked: string;
  category: 'club' | 'shop' | 'code';
}

export const deals: Deal[] = [
  {
    id: 'wtso-achaval-ferrer-takeover',
    merchantId: 'wtso',
    merchantLabel: 'WTSO',
    title: 'Achaval Ferrer Winery Takeover — 12 bottles for $120',
    detail:
      'Mendoza legend, build your own case. Free shipping included. $10 a bottle for wine that normally starts around $20+.',
    price: '$120 · 12 bottles',
    badge: 'WINERY TAKEOVER',
    expires: 'Oct 18, 2026',
    checked: 'Oct 16, 2026',
    category: 'shop',
  },
  {
    id: 'wtso-legon-ribera-del-duero',
    merchantId: 'wtso',
    merchantLabel: 'WTSO',
    title: 'Legón Ribera del Duero "Premium" 2018 — 94 pts',
    detail:
      'Wine Enthusiast 94 pts, 67% off the $55 comparable price. Flash deal — valid on 4+ bottles, free shipping at 4+. Gone when it\'s gone.',
    price: '$17.99',
    compareAt: '$55 comparable',
    badge: '67% OFF',
    expires: 'While it lasts',
    checked: 'Oct 16, 2026',
    category: 'shop',
  },
  {
    id: 'winecom-haunt20',
    merchantId: 'winecom',
    merchantLabel: 'Wine.com',
    title: 'Wine.com: $20 off orders of $200+',
    detail:
      'New customers, one-time use. Some exclusions (no Ohio; certain brands/large formats). Order must be placed by 10/31.',
    price: '−$20',
    code: 'HAUNT20',
    expires: 'Oct 31, 2026',
    checked: 'Oct 16, 2026',
    category: 'code',
  },
  {
    id: 'firstleaf-first-box',
    merchantId: 'firstleaf',
    merchantLabel: 'Firstleaf',
    title: 'Firstleaf: first 6 bottles for $44.95',
    detail:
      '$7.50 a bottle to test if a personalized club beats your supermarket run. After that $99 per shipment (~$16.50 a bottle). No commitment — cancel anytime.',
    price: '$44.95 · 6 bottles',
    badge: 'INTRO OFFER',
    checked: 'Oct 16, 2026',
    category: 'club',
  },
];
