import { getCollection, type CollectionEntry } from 'astro:content';

export type Case = CollectionEntry<'failuremodes'>;

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Clean, SEO-friendly per-case slug: afm-0002-<slugified-title>.
export const caseSlug = (c: Case) => `${c.data.id.toLowerCase()}-${slugify(c.data.title)}`;

// Only published cases render / export. Class-level entries and reserved/rejected
// IDs are held back. Sorted by AFM id for a stable order.
export async function getPublishedCases(): Promise<Case[]> {
  const all = await getCollection('failuremodes');
  return all
    .filter((c) => c.data.state === 'published' && c.data.abstraction === 'case')
    .sort((a, b) => a.data.id.localeCompare(b.data.id));
}

export async function getPublishedById(): Promise<Map<string, Case>> {
  const all = await getCollection('failuremodes');
  return new Map(
    all.filter((c) => c.data.state === 'published').map((c) => [c.data.id, c]),
  );
}

// --- Badges. Tailwind classes stay literal so v4's scanner keeps them. ---
type Badge = { label: string; cls: string };

export const RECOVERABILITY: Record<string, Badge> = {
  reversible: { label: 'Reversible', cls: 'border-accent-600/50 bg-accent-600/10 text-accent-400' },
  'reversible-with-external-backup': { label: 'Reversible · needs backup', cls: 'border-sky-500/40 bg-sky-500/10 text-sky-300' },
  'partially-recoverable': { label: 'Partially recoverable', cls: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
  unrecoverable: { label: 'Unrecoverable', cls: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
};

export const RESPONSE: Record<string, Badge> = {
  recover: { label: 'Recover', cls: 'border-accent-600/50 bg-accent-600/10 text-accent-400' },
  intercept: { label: 'Intercept', cls: 'border-sky-500/40 bg-sky-500/10 text-sky-300' },
  prevent: { label: 'Prevent', cls: 'border-violet-500/40 bg-violet-500/10 text-violet-300' },
  'out-of-scope': { label: 'Out of scope', cls: 'border-ink-600 bg-ink-800 text-ink-300' },
};

// Neutral pill for the secondary axes on the case page (intent, blast radius).
export const NEUTRAL = 'border-ink-700 bg-ink-850 text-ink-200';

const titleCase = (s: string) => s.replace(/[-_]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
export const label = (s: string) => titleCase(s);
