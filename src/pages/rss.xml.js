import rss from '@astrojs/rss';
import { articles } from '../data/articles';

export async function GET(context) {
  return rss({
    title: 'FKN Wine',
    description: 'Ehrliche Wein-Empfehlungen ohne Snob-Getue. Supermarkt-Weine blind verkostet, direkt empfohlen.',
    site: context.site,
    items: articles.map((article) => ({
      title: article.title,
      description: article.description || article.excerpt,
      link: `/artikel/${article.slug}/`,
      pubDate: new Date(article.date),
      categories: article.tags,
    })),
    customData: `<language>de</language>`,
  });
}
