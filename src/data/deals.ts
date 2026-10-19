// Deal-Feed (Stand 19.10.2026 — jede Zeile am Merchant geprüft).
// Ab Content-Welle 2: Befüllung/Refresh per Cron aus Deal-Quellen-Scannern.

export interface Deal {
  id: string;
  merchantId: 'firstleaf' | 'wtso' | 'winecom' | 'winc';
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
    id: 'wtso-palazzo-brunello-2020',
    merchantId: 'wtso',
    merchantLabel: 'WTSO',
    title: 'Palazzo Brunello di Montalcino 2020 — $26.99',
    detail:
      'Sangiovese from Montalcino, 64% off the $75 comparable price. 92 points from four critics (Wine Spectator among them). Free shipping on orders $60+, so three bottles clear it; a $2.99 handling fee per order may apply.',
    price: '$26.99',
    compareAt: '$75 comparable',
    badge: '64% OFF',
    expires: 'While it lasts',
    checked: 'Oct 19, 2026',
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
    checked: 'Oct 19, 2026',
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
    checked: 'Oct 19, 2026',
    category: 'club',
  },
  {
    id: 'winc-100-off-intro',
    merchantId: 'winc',
    merchantLabel: 'Winc',
    title: 'Winc: $100 off over your first 4 orders',
    detail:
      'The current intro offer for new members — spread across four shipments, on top of the always-on 20% member discount and free shipping. Packs available without a membership if you want to taste first.',
    price: '$100 off',
    badge: 'INTRO OFFER',
    checked: 'Oct 19, 2026',
    category: 'club',
  },
];
