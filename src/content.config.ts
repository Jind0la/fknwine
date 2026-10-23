import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Wine-Club-Reviews: "Wir lesen das Kleingedruckte" — Preise, Commitment, Kündigung.
const clubs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/clubs' }),
  schema: z.object({
    name: z.string(),
    /** Optionaler <title>. Default ist "<name> review, checked". */
    seoTitle: z.string().optional(),
    verdict: z.enum(['worth-it', 'depends', 'skip']),
    verdictLabel: z.string(),
    summary: z.string(),
    priceFrom: z.string(),
    perBottle: z.string(),
    commitment: z.string(),
    cancelTerms: z.string(),
    shipsTo: z.string(),
    merchantId: z
      .enum([
        'firstleaf',
        'wtso',
        'winecom',
        'winc',
        'cawineclub',
        'nakedwines',
        'goldmedal',
        'wineaccess',
        'wineinsiders',
        'wsjwine',
        'plonkwineclub',
        'makerwine',
      ])
      .optional(),
    lastChecked: z.string(),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    order: z.number().default(100),
  }),
});

// Guides: datenbelegte Kaufhilfen & Erklärstücke. Keine Tasting-Claims.
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string().default('Guide'),
    updated: z.string(),
    order: z.number().default(100),
  }),
});

export const collections = { clubs, guides };
