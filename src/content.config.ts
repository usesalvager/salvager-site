import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// AFM — Agent Failure Modes registry. One .md per case under
// src/content/failuremodes/; body is the prose. Astro 6 uses the glob loader
// (the legacy `type: 'content'` collection was removed in v6). The Zod schema
// below is the locked design contract — do not redesign the axes.
const failuremodes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/failuremodes' }),
  schema: ({ image }) => z.object({
    id: z.string().regex(/^AFM-\d{4}$/),            // e.g. AFM-0002
    state: z.enum(['reserved', 'published', 'rejected']).default('published'),
    title: z.string(),
    one_liner: z.string(),
    abstraction: z.enum(['class', 'case']).default('case'),
    class: z.string(),                              // family, e.g. "destructive-git"
    surface: z.enum(['filesystem', 'shell', 'db', 'cloud-infra', 'email', 'other']),
    verb: z.enum(['delete', 'overwrite', 'reset', 'destroy', 'truncate', 'degrade', 'other']),
    agent: z.array(z.string()).default([]),
    recoverability: z.enum(['reversible', 'reversible-with-external-backup', 'partially-recoverable', 'unrecoverable']),
    blast_radius: z.enum(['single-file', 'project', 'machine', 'fleet', 'external-system']),
    detection_latency: z.enum(['immediate', 'delayed', 'silent']),
    salvager_response: z.enum(['recover', 'intercept', 'prevent', 'out-of-scope']),
    intent: z.enum(['accident', 'misuse', 'adversarial']).default('accident'),
    near_miss: z.boolean().default(false),
    autonomy_level: z.enum(['L1-full', 'L2-on-loop', 'L3-in-loop']).optional(),
    incident_date: z.string(),                      // "2025-07" or "2026"
    relationships: z.array(z.object({ nature: z.enum(['child_of', 'parent_of']), id: z.string() })).default([]),
    xrefs: z.array(z.object({ source_name: z.string(), external_id: z.string(), url: z.string().url() })).default([]),
    sources: z.array(z.object({ url: z.string().url().optional(), name: z.string(), tags: z.array(z.string()).default([]) })).min(1),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { failuremodes };
