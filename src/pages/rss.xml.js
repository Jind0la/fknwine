import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config';

export async function GET(context) {
  const guides = await getCollection('guides');
  const clubs = await getCollection('clubs');

  const items = [
    ...guides.map((g) => ({
      title: g.data.title,
      description: g.data.description,
      link: `/guides/${g.id}/`,
      pubDate: new Date(g.data.updated),
    })),
    ...clubs.map((c) => ({
      title: `${c.data.name} — wine club review`,
      description: c.data.summary,
      link: `/wine-clubs/${c.id}/`,
      pubDate: new Date(c.data.lastChecked),
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'FKN Wine',
    description: SITE.description,
    site: context.site ?? 'https://fknwine.com',
    items,
  });
}
