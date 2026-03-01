import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    date: z.date(),
    readTime: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    author: z.string().default('Editorial InSpotGO BR'),
  }),
});

export const collections = { posts };
