// Deal-Feed (Stand 26.10.2026 — jede Zeile am Merchant geprüft).
// Ab Content-Welle 2: Befüllung/Refresh per Cron aus Deal-Quellen-Scannern.

import type { MerchantId } from './merchants';

export interface Deal {
  id: string;
  /** Muss ein Key aus merchants.ts sein — sonst gibt es keinen Tracking-Link. */
  merchantId: MerchantId;
  /**
   * Optionaler Pfad beim Merchant (z. B. '/products/xyz/'), damit der Klick auf
   * der Produktseite landet und nicht auf der Startseite. Wird durch outUrl()
   * mit dem Tracking-Template verpackt.
   */
  path?: string;
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
    path: '/wine-search?terms=palazzo',
    merchantLabel: 'WTSO',
    title: 'Palazzo Brunello di Montalcino 2020 — $26.99',
    detail:
      'Sangiovese from Montalcino, 64% off the $75 comparable price. 92 points from four critics (Wine Spectator among them). Free shipping on orders $60+, so three bottles clear it; a $2.99 handling fee per order may apply.',
    price: '$26.99',
    compareAt: '$75 comparable',
    badge: '64% OFF',
    expires: 'While it lasts',
    checked: 'Oct 26, 2026',
    category: 'shop',
  },
  {
    id: 'winecom-haunt20',
    merchantId: 'winecom',
    merchantLabel: 'Wine.com',
    title: 'Wine.com: $20 off orders of $200+',
    detail:
      '$200 minimum before shipping and tax, and bottles whose price ends in 7 do not count toward it. New customers, one-time use. No Ohio, no select Champagne brands, spirits, Riedel glassware, 187 ml splits or 1.5 L+ bottles. Order must be placed by 10/31.',
    price: '−$20',
    code: 'HAUNT20',
    expires: 'Oct 31, 2026',
    checked: 'Oct 26, 2026',
    category: 'code',
  },
  {
    id: 'firstleaf-first-box',
    merchantId: 'firstleaf',
    merchantLabel: 'Firstleaf',
    title: 'Firstleaf: first 6 bottles for $44.95',
    detail:
      '$7.50 a bottle to test if a personalized club beats your supermarket run. New members also get one extra bottle in the box — that part runs through 10/31. After the first six, $99 per shipment (~$16.50 a bottle), no commitment, cancel anytime.',
    price: '$44.95 · 6 bottles',
    badge: 'INTRO OFFER',
    expires: 'Oct 31, 2026',
    checked: 'Oct 26, 2026',
    category: 'club',
  },
  {
    id: 'winc-100-off-intro',
    merchantId: 'winc',
    merchantLabel: 'Winc',
    title: 'Winc: $100 off over your first 4 orders',
    detail:
      'Code WINC100 takes $100 total off your first four deliveries — $25 off each shipment, on top of the always-on 20% member discount and free shipping. Packs available without a membership if you want to taste first.',
    price: '$100 off',
    badge: 'INTRO OFFER',
    code: 'WINC100',
    checked: 'Oct 26, 2026',
    category: 'club',
  },
  {
    id: 'makerwine-advent-presale',
    merchantId: 'makerwine',
    path: '/products/canned-wine-advent-calendar/',
    merchantLabel: 'Maker Wine',
    title: 'Maker Wine: 12 Days of Canned Wine — $125 instead of $139',
    detail:
      'Presale on the 12-can advent calendar: 12 cans at 250 ml each (⅓ of a bottle), all from female and minority-led wineries, dry with 0 g sugar. Ships Nov 6. The presale price is the only discount — the calendar is excluded from other sales, promotions and codes — and it goes back to $139 afterwards. Free shipping starts at 12 cans, so the box clears the threshold on its own.',
    price: '$125 · 12 cans',
    compareAt: '$139 after the presale',
    badge: 'PRESALE',
    expires: 'Ships Nov 6, 2026',
    checked: 'Oct 26, 2026',
    category: 'shop',
  },
];
