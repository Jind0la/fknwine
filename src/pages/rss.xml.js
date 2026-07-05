import rss from '@astrojs/rss';

const articles = [
  {
    title: 'Wein für den Grillabend — 7 Flaschen die jeder Mannschaftstrinker feiert',
    description: 'Grillen ohne guten Wein ist wie Bratwurst ohne Senf. Die 7 besten Grill-Weine aus dem Supermarkt — alle unter €10.',
    slug: 'wein-fuer-grillabend',
    date: '2026-07-07',
    tags: ['Food-Pairing', 'Rotwein', 'Sommer'],
  },
  {
    title: 'Die 10 besten Weine unter €10 im Supermarkt',
    description: '47 Supermarkt-Weine getestet. Hier sind die einzigen 10 die du kaufen solltest — null Gelaber, null Punkte-Skala.',
    slug: 'beste-weine-unter-10-euro-supermarkt',
    date: '2026-07-06',
    tags: ['Supermarkt', 'Rotwein', 'Weißwein'],
  },
  {
    title: 'Rosé-Guide — Welcher schmeckt und welcher ist überteuerte Zuckerpampe',
    description: '12 Supermarkt-Rosés blind getestet. Die 6 besten — und die 4 die du NIEMALS kaufen solltest.',
    slug: 'rose-guide-supermarkt',
    date: '2026-07-08',
    tags: ['Rosé', 'Supermarkt', 'Sommer'],
  },
  {
    title: 'Aldi vs. Lidl vs. Edeka — wo kaufst du den besten Wein?',
    description: 'Discounter-Wein kann scheiße sein. Kann aber auch geil sein. Hier ist welcher Supermarkt für welchen Wein-Typ am besten funktioniert.',
    slug: 'aldi-lidl-edeka-wein-vergleich',
    date: '2026-07-04',
    tags: ['Discounter', 'Vergleich'],
  },
  {
    title: '8 Weine die du NIEMALS kaufen solltest — und was du stattdessen trinkst',
    description: 'Jeder Supermarkt hat Wein-Fallen. 8 Fehlkäufe die du stehen lässt — plus die Alternativen die besser schmecken.',
    slug: 'weine-die-du-niemals-kaufen-solltest',
    date: '2026-07-09',
    tags: ['Supermarkt', 'Anti-Liste', 'Sparen'],
  },
  {
    title: '6 Wein-Mythen an die du glaubst — die komplett falsch sind',
    description: 'Teuer = besser? Schraubverschluss = billig? Rosé = nur für Frauen? Die größten Wein-Lügen — zerstört.',
    slug: 'wein-mythen-die-falsch-sind',
    date: '2026-07-10',
    tags: ['Mythen', 'Einsteiger', 'Guide'],
  },
  {
    title: 'Wein für Pizza — 5 Flaschen die besser sind als dein Standard-Chianti',
    description: 'Chianti zur Pizza ist langweilig. Wir haben fünf Alternativen die deine TK-Salami aufs nächste Level bringen.',
    slug: 'wein-fuer-pizza',
    date: '2026-06-28',
    tags: ['Food-Pairing', 'Rotwein'],
  },
];

export async function GET() {
  return rss({
    title: 'FKN Wine',
    description: 'Ehrliche Wein-Empfehlungen ohne Snob-Getue. Supermarkt-Weine blind verkostet, direkt empfohlen.',
    site: 'https://fknwine.pages.dev',
    items: articles.map((article) => ({
      title: article.title,
      description: article.description,
      link: `/artikel/${article.slug}/`,
      pubDate: new Date(article.date),
      categories: article.tags,
    })),
    customData: `<language>de</language>`,
  });
}
