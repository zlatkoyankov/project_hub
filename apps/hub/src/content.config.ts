import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// Blog posts: src/content/blog/en/<slug>.md and src/content/blog/bg/<slug>.md
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(110),
    description: z.string().min(50).max(170),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    lang: z.enum(['en', 'bg']),
    tags: z.array(z.string()).default([]),
    /** Key of TOOLS in src/lib/site.ts: shows a "try the tool" card. */
    tool: z.enum(['letterwell', 'wordle-solver', 'energy-cost-calculator', 'concrete-calculator', 'tile-calculator', 'paint-calculator', 'gravel-calculator', 'mulch-calculator', 'square-footage-calculator', 'laminate-flooring-calculator', 'drywall-calculator', 'tile-adhesive-grout-calculator', 'crossword-solver']).optional(),
    /** Collection id of the same post in the other language, e.g. "bg/dumi-ot-bukvi". */
    translation: z.string().optional(),
    draft: z.boolean().default(false),
  }),
})

export const collections = { blog }
