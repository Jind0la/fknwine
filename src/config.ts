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

// Newsletter: beehiiv (Embed-Formular "Website – fknwine.com").
// Der Loader rendert das Formular inline an der Stelle des Script-Tags
// (siehe components/NewsletterForm.astro). Attribution forwarded UTMs.
export const NEWSLETTER = {
  provider: 'beehiiv',
  formId: '35163977-6b86-4c93-bcfb-af796f96929c',
  loaderSrc: 'https://subscribe-forms.beehiiv.com/v3/loader.js',
  attributionSrc: 'https://subscribe-forms.beehiiv.com/attribution.js',
  subscribePage: 'https://fknwine.beehiiv.com/subscribe',
} as const;

// Analytics: bewusst noch nichts eingebaut (cookieless geplant, z.B. Cloudflare Web Analytics).
export const ANALYTICS: { provider: string | null; token: string | null } = {
  provider: null,
  token: null,
};

// Wird auf true gestellt, sobald die ersten Tracking-Links live sind —
// steuert Disclosure-Hinweise im Footer.
export const AFFILIATE_LIVE = false;
