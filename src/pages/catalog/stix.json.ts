import type { APIRoute } from 'astro';
import { getPublishedCases } from '../../lib/catalog';
import { buildBundle } from '../../lib/stix';

// Static STIX 2.1 bundle, prerendered at build to /catalog/stix.json.
export const GET: APIRoute = async ({ site }) => {
  const bundle = buildBundle(await getPublishedCases(), site);
  return new Response(JSON.stringify(bundle, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
