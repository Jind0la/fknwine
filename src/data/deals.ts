// Deal-Feed (Stand 19.10.2026 — jede Zeile am Merchant geprüft).
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
  {
    id: 'makerwine-advent-presale',
    merchantId: 'makerwine',
    path: '/products/canned-wine-advent-calendar/',
    merchantLabel: 'Maker Wine',
    title: 'Maker Wine: 12 Days of Canned Wine — $125 instead of $139',
    detail:
      'Presale on the 12-can advent calendar: 12 cans at 250 ml each (⅓ of a bottle), all from female and minority-led wineries, dry with 0 g sugar. Ships early November — the presale price is the only discount, it goes back to $139 afterwards. Free shipping starts at 12 cans, so the box clears the threshold on its own.',
    price: '$125 · 12 cans',
    compareAt: '$139 after the presale',
    badge: 'PRESALE',
    expires: 'Ships early November',
    checked: 'Oct 23, 2026',
    category: 'shop',
  },
];
