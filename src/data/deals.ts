// Deal-Feed (Stand 09.11.2026 — jede Zeile am Merchant geprüft).
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
    checked: 'Nov 9, 2026',
    category: 'shop',
  },
  {
    id: 'winecom-feast20',
    merchantId: 'winecom',
    merchantLabel: 'Wine.com',
    title: 'Wine.com: $20 off orders of $150+',
    detail:
      'New customers only: $150 minimum excluding shipping and tax, and bottles whose price ends in 7 do not count toward it. One code per order, one-time use per customer, no other promo codes on top. No Ohio; excludes corporate orders, gift certificates, StewardShip fees, select Champagne brands, spirits, Riedel glassware, fine and rare wine, 187 ml splits, Picked subscriptions and 1.5 L+ bottles. Order must be placed by 11/26/2026, and $40 off $300+ (FEAST40) or $75 off $500+ (FEAST75) works on the same terms.',
    price: '−$20',
    code: 'FEAST20',
    expires: 'Nov 26, 2026',
    checked: 'Nov 9, 2026',
    category: 'code',
  },
  {
    id: 'firstleaf-first-box',
    merchantId: 'firstleaf',
    merchantLabel: 'Firstleaf',
    title: 'Firstleaf: first 6 bottles for $44.95',
    detail:
      '$7.50 a bottle to test if a personalized club beats your supermarket run — the first box of six is $44.95 with free shipping, then $16.50 a bottle on the Classic plan. No subscription fees, deliveries every 2 to 12 weeks, and a 100% satisfaction guarantee: a bottle you don\'t like gets replaced in your next club order. The welcome offer currently reads 50% off your first box.',
    price: '$44.95 · 6 bottles',
    badge: 'INTRO OFFER',
    checked: 'Nov 9, 2026',
    category: 'club',
  },
  {
    id: 'winc-100-off-intro',
    merchantId: 'winc',
    merchantLabel: 'Winc',
    title: 'Winc: $100 off over your first 4 orders',
    detail:
      'Code WINC100 takes $100 total off your first four deliveries — $25 off each shipment, on top of the 20% member discount that applies automatically to every order, plus free shipping for members. Packs are available without a membership if you want to taste first.',
    price: '$100 off',
    badge: 'INTRO OFFER',
    code: 'WINC100',
    checked: 'Nov 9, 2026',
    category: 'club',
  },
];
