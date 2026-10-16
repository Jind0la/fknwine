// FKN Wine — zentrale Konfiguration
// Eine Quelle für Werte, die sich beim Launch ändern können.

export const SITE = {
  name: 'FKN Wine',
  tagline: 'F*ck Nice Wine',
  description:
    'Great wine doesn\'t have to cost $40. We hunt the deals, read the fine print, and tell you what\'s actually worth your money — no sommelier act, no fake reviews.',
  x: 'https://x.com/FKNWine',
  email: 'info@fknwine.com',
} as const;

// Newsletter: Endpoint wird beim Launch gesetzt (Provider-Wiring-Schritt).
// Solange null, zeigt das Formular ehrlich an, dass die Liste noch nicht offen ist.
export const NEWSLETTER_ENDPOINT: string | null = null;

// Analytics: bewusst noch nichts eingebaut (cookieless geplant, z.B. Cloudflare Web Analytics).
export const ANALYTICS: { provider: string | null; token: string | null } = {
  provider: null,
  token: null,
};

// Wird auf true gestellt, sobald die ersten Tracking-Links live sind —
// steuert Disclosure-Hinweise im Footer.
export const AFFILIATE_LIVE = false;
