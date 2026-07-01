import type { APIRoute } from 'astro';
import { getPublishedCases, type Case } from '../../lib/catalog';
import { buildCaseBundle } from '../../lib/stix';

// Per-case STIX 2.1 bundle at /catalog/<afm-id>.stix.json (e.g. afm-0002.stix.json).
export async function getStaticPaths() {
  const cases = await getPublishedCases();
  return cases.map((entry) => ({ params: { id: entry.data.id.toLowerCase() }, props: { entry } }));
}

export const GET: APIRoute = ({ props, site }) => {
  const bundle = buildCaseBundle(props.entry as Case, site);
  return new Response(JSON.stringify(bundle, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
