import { v5 as uuidv5 } from 'uuid';
import { caseSlug, type Case } from './catalog';

// STIX 2.1 export. Each published case becomes an attack-pattern SDO, a
// course-of-action SDO (the Salvager response), and a `recovers-from`
// relationship SRO tying them together — all wrapped in one bundle.
//
// TAXII 2.1 transport is a later step; a static bundle served over HTTP is v1.

// Fixed namespace so uuidv5(AFM-id) is stable across builds. Do not change it:
// changing it renumbers every STIX object id.
const NS = 'b6f3d4c2-1a90-4e7b-9f2a-5c8e0d1a2b3c';

// AFM dates are coarse ("2026", "2025-07"). Normalize to a valid, deterministic
// STIX timestamp so the bundle is byte-stable and re-diffable across builds.
function stixDate(incident: string): string {
  const [y, m = '01'] = incident.split('-');
  return `${y}-${m.padStart(2, '0')}-01T00:00:00.000Z`;
}

const RESPONSE_COA: Record<string, string> = {
  recover: 'Salvager recovers the affected files from its own per-file revision store, independent of git — restoring the working tree to the instant before the destructive action.',
  intercept: 'Salvager intercepts the action before it lands, holding the change so it can be inspected or declined.',
  prevent: 'Salvager prevents the action outright, refusing the operation that would cause unrecoverable loss.',
  'out-of-scope': 'This failure mode is outside what the Salvager watcher can see or act on; it is catalogued for completeness.',
};

// The three SDO/SRO objects for a single case.
export function caseObjects(c: Case, site: URL | undefined) {
  const d = c.data;
  const created = stixDate(d.incident_date);
  const url = new URL(`catalog/${caseSlug(c)}`, site ?? 'https://salvager.sh/').href;

  const apId = `attack-pattern--${uuidv5(d.id, NS)}`;
  const coaId = `course-of-action--${uuidv5(`${d.id}/coa`, NS)}`;

  const attackPattern = {
    type: 'attack-pattern',
    spec_version: '2.1',
    id: apId,
    created,
    modified: created,
    name: d.title,
    description: d.one_liner,
    external_references: [
      { source_name: 'salvager-afm', external_id: d.id, url },
      ...d.xrefs.map((x) => ({ source_name: x.source_name, external_id: x.external_id, url: x.url })),
    ],
    // Salvager's own axes, carried as custom (x_) properties.
    x_salvager_recoverability: d.recoverability,
    x_salvager_blast_radius: d.blast_radius,
    x_salvager_response: d.salvager_response,
    x_salvager_intent: d.intent,
  };

  const courseOfAction = {
    type: 'course-of-action',
    spec_version: '2.1',
    id: coaId,
    created,
    modified: created,
    name: `Salvager response: ${d.salvager_response}`,
    description: RESPONSE_COA[d.salvager_response],
  };

  const relationship = {
    type: 'relationship',
    spec_version: '2.1',
    id: `relationship--${uuidv5(`${d.id}/rel`, NS)}`,
    created,
    modified: created,
    relationship_type: 'recovers-from',
    source_ref: coaId,
    target_ref: apId,
  };

  return [attackPattern, courseOfAction, relationship];
}

function bundle(objects: unknown[], seed: string) {
  return { type: 'bundle', id: `bundle--${uuidv5(seed, NS)}`, objects };
}

export function buildBundle(cases: Case[], site: URL | undefined) {
  return bundle(cases.flatMap((c) => caseObjects(c, site)), 'afm-registry-bundle');
}

export function buildCaseBundle(c: Case, site: URL | undefined) {
  return bundle(caseObjects(c, site), `afm-case-bundle/${c.data.id}`);
}
