import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// "work" entries live in src/content/work/*.md
// Each file's `id` is derived from its filename, e.g. studio-os.md -> "studio-os",
// which becomes the URL at /work/studio-os.
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(160),
      role: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      url: z.url().optional(),
      repo: z.url().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

// Peer-reviewed papers, one Markdown file each. Unlike `work` these are not
// projects with a repo or a live URL, so the schema carries bibliographic
// fields instead of the project ones: `venue` is the journal or conference,
// and `kind` lets the page group them without parsing the venue string.
//
// `summary` is not capped at 160 chars the way `work.summary` is: the one-line
// cap exists because WorkRow truncates it with CSS, and these render as full
// sentences in a list that is not truncated.
const publications = defineCollection({
  loader: glob({ base: './src/content/publications', pattern: '**/*.md' }),
  schema: () =>
    z.object({
      title: z.string(),
      venue: z.string(),
      kind: z.enum(['journal', 'conference']),
      date: z.coerce.date(),
      summary: z.string(),
      authors: z.string().optional(),
      doi: z.string().optional(),
      url: z.url().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { work, publications };