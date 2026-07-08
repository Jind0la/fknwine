// Shared article definitions for FKN Wine
// Single source of truth — used by index, RSS, and tag pages

export interface Article {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  tags: string[];
  image: string;
}

export const articles: Article[] = [
  {
    title: 'Supermarkt-Sekt & Prosecco: Welcher prickelt und welcher ist süße Plörre?',
    slug: 'sekt-prosecco-supermarkt-test',
    date: '2026-07-09',
    excerpt: '6 Sekte und Proseccos aus dem Supermarkt die wirklich schmecken — plus die 3 Kategorien die du NIEMALS kaufen solltest. Vom €2,99-Sekt bis zum DOCG-Prosecco.',
    tags: ['Guide', 'Supermarkt', 'Sommer', 'Sparen', 'Einsteiger'],
    image: '/artikel-sekt-prosecco.jpg',
  },
  {
    title: 'Die 8 besten Weißweine unter €10 im Supermarkt',
    slug: 'beste-weissweine-unter-10-euro',
    date: '2026-07-11',
    excerpt: '8 Weißweine unter €10 von Lidl, Aldi, Rewe und Edeka. Vom €4,99-Riesling bis zum Statement-Greco — FKN-verifiziert.',
    tags: ['Weißwein', 'Supermarkt', 'Bestenliste', 'Sommer', 'Guide', 'Einsteiger'],
    image: '/artikel-weisswein-special.jpg',
  },
  {
    title: 'Wein für den Grillabend — 7 Flaschen die jeder Mannschaftstrinker feiert',
    slug: 'wein-fuer-grillabend',
    date: '2026-07-07',
    excerpt: 'Grillen ohne guten Wein ist wie Bratwurst ohne Senf. Die 7 besten Grill-Weine aus dem Supermarkt — alle unter €10.',
    tags: ['Food-Pairing', 'Rotwein', 'Rosé', 'Sommer'],
    image: '/artikel-grillen.jpg',
  },
  {
    title: 'Die 10 besten Weine unter €10 im Supermarkt',
    slug: 'beste-weine-unter-10-euro-supermarkt',
    date: '2026-07-06',
    excerpt: 'Wir haben 47 Supermarkt-Weine getestet. Hier sind die einzigen 10 die du kaufen solltest — null Gelaber, null Punkte-Skala.',
    tags: ['Supermarkt', 'Rotwein', 'Weißwein', 'Bestenliste'],
    image: '/artikel-supermarkt.jpg',
  },
  {
    title: 'Rosé-Guide — Welcher schmeckt und welcher ist überteuerte Zuckerpampe',
    slug: 'rose-guide-supermarkt',
    date: '2026-07-08',
    excerpt: '12 Supermarkt-Rosés blind getestet. Die 6 besten — und die 4 die du NIEMALS kaufen solltest.',
    tags: ['Rosé', 'Supermarkt', 'Sommer', 'Guide'],
    image: '/artikel-rose.jpg',
  },
  {
    title: 'Aldi vs. Lidl vs. Edeka — wo kaufst du den besten Wein?',
    slug: 'aldi-lidl-edeka-wein-vergleich',
    date: '2026-07-04',
    excerpt: 'Discounter-Wein kann scheiße sein. Kann aber auch geil sein. Hier ist welcher Supermarkt für welchen Wein-Typ am besten funktioniert.',
    tags: ['Discounter', 'Vergleich', 'Supermarkt'],
    image: '/artikel-discounter.jpg',
  },
  {
    title: '8 Weine die du NIEMALS kaufen solltest — und was du stattdessen trinkst',
    slug: 'weine-die-du-niemals-kaufen-solltest',
    date: '2026-07-09',
    excerpt: 'Jeder Supermarkt hat Wein-Fallen. 8 Fehlkäufe die du stehen lässt — plus die Alternativen die besser schmecken.',
    tags: ['Supermarkt', 'Guide', 'Anti-Liste', 'Sparen'],
    image: '/artikel-niemals.jpg',
  },
  {
    title: '6 Wein-Mythen an die du glaubst — die komplett falsch sind',
    slug: 'wein-mythen-die-falsch-sind',
    date: '2026-07-10',
    excerpt: 'Teuer = besser? Schraubverschluss = billig? Rosé = nur für Frauen? Die größten Wein-Lügen — zerstört.',
    tags: ['Guide', 'Mythen', 'Einsteiger'],
    image: '/artikel-mythen-neo.jpg',
  },
  {
    title: 'Wein für Pizza — 5 Flaschen die besser sind als dein Standard-Chianti',
    slug: 'wein-fuer-pizza',
    date: '2026-06-28',
    excerpt: 'Chianti zur Pizza ist langweilig. Wir haben fünf Alternativen die deine TK-Salami aufs nächste Level bringen.',
    tags: ['Food-Pairing', 'Rotwein', 'Pizza'],
    image: '/artikel-pizza.jpg',
  },
];

/** All unique tags, sorted alphabetically */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const a of articles) {
    for (const t of a.tags) tagSet.add(t);
  }
  return [...tagSet].sort();
}

/** Articles that have a specific tag */
export function getArticlesByTag(tag: string): Article[] {
  return articles.filter((a) => a.tags.includes(tag));
}

/** Tag display metadata */
export const tagMeta: Record<string, { emoji: string; description: string }> = {
  'Food-Pairing': { emoji: '🍷', description: 'Welcher Wein zu welchem Essen? Keine Regeln — nur was schmeckt.' },
  'Rotwein': { emoji: '🍇', description: 'Rotwein aus dem Supermarkt — kein Bordeaux-Elitismus, nur Geschmack.' },
  'Sommer': { emoji: '☀️', description: 'Die besten Sommer-Weine: leicht, kalt, direkt aus dem Kühlschrank.' },
  'Supermarkt': { emoji: '🛒', description: 'Aldi, Lidl, Edeka — wir testen sie alle. Der beste Supermarkt-Wein pro Kategorie.' },
  'Weißwein': { emoji: '🥂', description: 'Weißwein ohne Schnickschnack. Vom trockenen Riesling bis zum Grill-Begleiter.' },
  'Rosé': { emoji: '🌸', description: 'Rosé ist nicht nur für Frauen. Die besten trockenen Rosés unter €10.' },
  'Discounter': { emoji: '💰', description: 'Discounter-Wein: Aldi vs. Lidl. Wer hat die bessere Flasche für weniger Geld?' },
  'Vergleich': { emoji: '⚖️', description: 'Head-to-Head-Vergleiche. Kein Laber-Podcast — direkte Kaufempfehlungen.' },
  'Guide': { emoji: '📖', description: 'Guides ohne Geschwafel. Wein-Wissen in 5 Minuten, kein Sommelier-Kurs.' },
  'Anti-Liste': { emoji: '🚫', description: 'Wein-Fallen im Supermarkt. Diese Flaschen lässt du stehen.' },
  'Sparen': { emoji: '💸', description: 'Geiler Wein muss nicht teuer sein. Die besten Flaschen unter €5 und €10.' },
  'Mythen': { emoji: '💥', description: 'Wein-Mythen zerstört. Schraubverschluss = billig? Quatsch.' },
  'Einsteiger': { emoji: '🎯', description: 'Neu bei Wein? Kein Problem. Diese Artikel sind dein Startpunkt.' },
  'Pizza': { emoji: '🍕', description: 'Wein zur Pizza — weil Chianti nicht die einzige Option ist.' },
  'Bestenliste': { emoji: '🏆', description: 'Bestenlisten ohne Punkte-Skala. Nur: Kauf das, nicht das.' },
};
