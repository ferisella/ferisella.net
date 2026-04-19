import { defineCollection, z } from 'astro:content';

const releases = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    year: z.number(),
    note_es: z.string().optional(),
    note_en: z.string().optional(),
    tag_es: z.string().optional(),
    tag_en: z.string().optional(),
  }),
});

const collaborators = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    role_es: z.string(),
    role_en: z.string(),
  }),
});

const highlights = defineCollection({
  type: 'data',
  schema: z.object({
    items: z.array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        link: z.string().optional(),
      })
    ),
  }),
});

export const collections = { releases, collaborators, highlights };
