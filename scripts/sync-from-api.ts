#!/usr/bin/env node
/**
 * sync-from-api.ts — keeps TrustPager-Docs in lockstep with the TrustPager-Portal API source.
 *
 * Walks every TrustPager-Portal/supabase/functions/api/routes/*.ts file, finds every
 * `export const <X>_ROUTES: SharedRoute[]` declaration, extracts structured route data,
 * and regenerates the matching `src/data/endpoints/<resource>.ts` file in this repo.
 *
 * Preserves hand-curated content across regenerations:
 *   - resource `label` and `description` (re-used from the existing file if it exists)
 *   - per-endpoint `requestExample` / `responseExample` (read from scripts/api-sync-examples/<resource>.json)
 *
 * Output is deterministic — running twice without API changes produces zero diff.
 *
 * Usage:
 *   npm run sync:api           # regenerate
 *   npm run sync:api -- --check # exit non-zero if regen would produce a diff (CI guard)
 *
 * This is invoked MANUALLY as a post-work step after any edit to the API source.
 * Never auto-committed, never auto-pushed — the diff is yours to review.
 */

import { Project, SyntaxKind, type ObjectLiteralExpression, type ArrayLiteralExpression, type PropertyAssignment } from 'ts-morph';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const ROUTES_DIR = resolve(REPO_ROOT, '..', 'TrustPager-Portal', 'supabase', 'functions', 'api', 'routes');
const ENDPOINTS_DIR = resolve(REPO_ROOT, 'src', 'data', 'endpoints');
const EXAMPLES_DIR = resolve(REPO_ROOT, 'scripts', 'api-sync-examples');

// ============================================================================
// TYPES — mirror src/data/endpoints/types.ts so the parser is self-describing
// ============================================================================

interface ParsedRoute {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  pattern: string[];               // e.g. ['contacts', ':contact_id']
  requiredScopes: string[];
  isWrite: boolean;
  isDelete?: boolean;
  isFree?: boolean;
  requiredFields?: string[];
  toolName: string;
  description: string;
  inputSchema?: { properties?: Record<string, { type?: string; description?: string }>; required?: string[] };
  portalPath?: string;
}

interface ResourceExamples {
  label?: string;
  description?: string;
  endpointExamples?: Record<string, { requestExample?: string; responseExample?: string; notes?: string[] }>;
}

interface ResourceMeta {
  id: string;             // 'contacts'
  exportName: string;     // 'CONTACTS'
  fileName: string;       // 'contacts.ts'
  label: string;          // 'Contacts'
  description: string;    // long-form
  routes: ParsedRoute[];
}

// ============================================================================
// AST WALKERS
// ============================================================================

function getStringValue(prop: PropertyAssignment): string | null {
  const init = prop.getInitializer();
  if (!init) return null;
  const k = init.getKind();
  if (k === SyntaxKind.StringLiteral || k === SyntaxKind.NoSubstitutionTemplateLiteral) {
    // Use decoded literal value, NOT raw text — getText() preserves source-level
    // backslash escapes which would accumulate on each round-trip.
    return (init as any).getLiteralValue();
  }
  return null;
}

function getBooleanValue(prop: PropertyAssignment): boolean | undefined {
  const init = prop.getInitializer();
  if (!init) return undefined;
  const text = init.getText();
  if (text === 'true') return true;
  if (text === 'false') return false;
  return undefined;
}

function getStringArrayValue(prop: PropertyAssignment): string[] {
  const init = prop.getInitializer();
  if (!init || init.getKind() !== SyntaxKind.ArrayLiteralExpression) return [];
  const arr = init as ArrayLiteralExpression;
  return arr.getElements().map(el => {
    const k = el.getKind();
    if (k === SyntaxKind.StringLiteral || k === SyntaxKind.NoSubstitutionTemplateLiteral) {
      return (el as any).getLiteralValue();
    }
    return el.getText();
  });
}

function getObjectValue(prop: PropertyAssignment): any {
  const init = prop.getInitializer();
  if (!init || init.getKind() !== SyntaxKind.ObjectLiteralExpression) return undefined;
  return parseObjectLiteral(init as ObjectLiteralExpression);
}

function parseObjectLiteral(obj: ObjectLiteralExpression): any {
  const result: any = {};
  for (const prop of obj.getProperties()) {
    if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const pa = prop as PropertyAssignment;
    const name = pa.getName().replace(/^['"]|['"]$/g, '');
    const init = pa.getInitializer();
    if (!init) continue;
    const kind = init.getKind();
    if (kind === SyntaxKind.StringLiteral || kind === SyntaxKind.NoSubstitutionTemplateLiteral) {
      result[name] = (init as any).getLiteralValue();
    } else if (kind === SyntaxKind.TrueKeyword) {
      result[name] = true;
    } else if (kind === SyntaxKind.FalseKeyword) {
      result[name] = false;
    } else if (kind === SyntaxKind.NumericLiteral) {
      result[name] = Number(init.getText());
    } else if (kind === SyntaxKind.ObjectLiteralExpression) {
      result[name] = parseObjectLiteral(init as ObjectLiteralExpression);
    } else if (kind === SyntaxKind.ArrayLiteralExpression) {
      const arr = init as ArrayLiteralExpression;
      result[name] = arr.getElements().map(el => {
        const k = el.getKind();
        if (k === SyntaxKind.StringLiteral || k === SyntaxKind.NoSubstitutionTemplateLiteral) {
          return (el as any).getLiteralValue();
        }
        if (k === SyntaxKind.ObjectLiteralExpression) {
          return parseObjectLiteral(el as ObjectLiteralExpression);
        }
        return el.getText();
      });
    }
    // Other kinds (arrow functions, identifiers, etc.) intentionally skipped —
    // they're handler refs and not docs content.
  }
  return result;
}

function parseSharedRouteObject(obj: ObjectLiteralExpression): ParsedRoute | null {
  const out: Partial<ParsedRoute> = {};
  for (const prop of obj.getProperties()) {
    if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const pa = prop as PropertyAssignment;
    const name = pa.getName().replace(/^['"]|['"]$/g, '');
    switch (name) {
      case 'method': {
        const v = getStringValue(pa);
        if (v) out.method = v as ParsedRoute['method'];
        break;
      }
      case 'pattern':
        out.pattern = getStringArrayValue(pa);
        break;
      case 'requiredScopes':
        out.requiredScopes = getStringArrayValue(pa);
        break;
      case 'isWrite': {
        const v = getBooleanValue(pa);
        if (v !== undefined) out.isWrite = v;
        break;
      }
      case 'isDelete': {
        const v = getBooleanValue(pa);
        if (v !== undefined) out.isDelete = v;
        break;
      }
      case 'isFree': {
        const v = getBooleanValue(pa);
        if (v !== undefined) out.isFree = v;
        break;
      }
      case 'requiredFields':
        out.requiredFields = getStringArrayValue(pa);
        break;
      case 'toolName': {
        const v = getStringValue(pa);
        if (v) out.toolName = v;
        break;
      }
      case 'description': {
        const v = getStringValue(pa);
        if (v) out.description = v;
        break;
      }
      case 'input_schema':
        out.inputSchema = getObjectValue(pa);
        break;
      case 'portalPath': {
        const v = getStringValue(pa);
        if (v) out.portalPath = v;
        break;
      }
    }
  }
  if (!out.method || !out.pattern || !out.toolName || !out.description) return null;
  return out as ParsedRoute;
}

function parseRouteFile(filePath: string): { exportName: string; routes: ParsedRoute[] }[] {
  const project = new Project({ useInMemoryFileSystem: false, skipAddingFilesFromTsConfig: true });
  const sf = project.addSourceFileAtPath(filePath);
  const results: { exportName: string; routes: ParsedRoute[] }[] = [];

  for (const decl of sf.getVariableDeclarations()) {
    const name = decl.getName();
    if (!name.endsWith('_ROUTES')) continue;

    const typeNode = decl.getTypeNode();
    const isShared = typeNode?.getText().includes('SharedRoute[]');
    if (!isShared) continue;

    const init = decl.getInitializer();
    if (!init || init.getKind() !== SyntaxKind.ArrayLiteralExpression) continue;

    const arr = init as ArrayLiteralExpression;
    const routes: ParsedRoute[] = [];
    for (const el of arr.getElements()) {
      if (el.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;
      const parsed = parseSharedRouteObject(el as ObjectLiteralExpression);
      if (parsed) routes.push(parsed);
    }
    if (routes.length > 0) results.push({ exportName: name, routes });
  }
  return results;
}

// ============================================================================
// MAPPING — SharedRoute (API source) → Endpoint (docs shape)
// ============================================================================

function patternToPath(pattern: string[]): string {
  return '/' + pattern.join('/');
}

function inputSchemaToParams(
  route: ParsedRoute,
): Array<{ name: string; type: string; required: boolean; description: string; in: 'path' | 'query' | 'body' }> {
  const props = route.inputSchema?.properties ?? {};
  const required = new Set(route.inputSchema?.required ?? []);
  const pathParams = new Set(
    route.pattern.filter(seg => seg.startsWith(':')).map(seg => seg.slice(1)),
  );

  const out: Array<{ name: string; type: string; required: boolean; description: string; in: 'path' | 'query' | 'body' }> = [];
  for (const [name, schema] of Object.entries(props)) {
    const inLocation: 'path' | 'query' | 'body' = pathParams.has(name)
      ? 'path'
      : route.method === 'GET' || route.method === 'DELETE'
        ? 'query'
        : 'body';
    out.push({
      name,
      type: schema?.type || 'string',
      required: inLocation === 'path' ? true : required.has(name),
      description: schema?.description || '',
      in: inLocation,
    });
  }
  return out;
}

// ============================================================================
// PER-RESOURCE EXAMPLES REGISTRY
// ============================================================================

function readExamples(resourceId: string): ResourceExamples {
  const fp = join(EXAMPLES_DIR, `${resourceId}.json`);
  if (!existsSync(fp)) return {};
  try {
    return JSON.parse(readFileSync(fp, 'utf8'));
  } catch (err) {
    console.warn(`[sync] failed to parse ${fp}: ${(err as Error).message}`);
    return {};
  }
}

// ============================================================================
// EXISTING FILE INTROSPECTION — harvest label, description, AND per-endpoint
// examples (requestExample / responseExample / notes) from the current
// hand-maintained file. Makes the first regen zero-data-loss: every example
// already in the docs survives. Subsequent regens preserve them too, unless
// an override is supplied in scripts/api-sync-examples/<resource>.json.
// ============================================================================

type HarvestedParam = { name: string; type: string; required: boolean; description: string; in: 'path' | 'query' | 'body' };

interface ExistingMeta {
  label?: string;
  description?: string;
  endpointExamples: Record<string, { requestExample?: string; responseExample?: string; notes?: string[]; params?: HarvestedParam[] }>;
}

function readExistingResourceMeta(filePath: string): ExistingMeta {
  if (!existsSync(filePath)) return { endpointExamples: {} };
  try {
    const project = new Project({ useInMemoryFileSystem: false, skipAddingFilesFromTsConfig: true });
    const sf = project.addSourceFileAtPath(filePath);

    const out: ExistingMeta = { endpointExamples: {} };

    for (const decl of sf.getVariableDeclarations()) {
      const init = decl.getInitializer();
      if (!init || init.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;
      const obj = init as ObjectLiteralExpression;

      // Top-level ResourceGroup fields
      for (const prop of obj.getProperties()) {
        if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;
        const pa = prop as PropertyAssignment;
        const name = pa.getName().replace(/^['"]|['"]$/g, '');
        if (name === 'label') {
          const v = getStringValue(pa);
          if (v) out.label = v;
        } else if (name === 'description') {
          const v = getStringValue(pa);
          if (v) out.description = v;
        } else if (name === 'endpoints') {
          const endpointsInit = pa.getInitializer();
          if (!endpointsInit || endpointsInit.getKind() !== SyntaxKind.ArrayLiteralExpression) continue;
          const arr = endpointsInit as ArrayLiteralExpression;
          for (const el of arr.getElements()) {
            if (el.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;
            harvestEndpointExample(el as ObjectLiteralExpression, out.endpointExamples);
          }
        }
      }
    }
    return out;
  } catch (err) {
    console.warn(`[sync] failed to harvest existing examples from ${basename(filePath)}: ${(err as Error).message}`);
    return { endpointExamples: {} };
  }
}

function harvestEndpointExample(
  obj: ObjectLiteralExpression,
  out: Record<string, { requestExample?: string; responseExample?: string; notes?: string[]; params?: HarvestedParam[] }>,
): void {
  let method: string | undefined;
  let path: string | undefined;
  let requestExample: string | undefined;
  let responseExample: string | undefined;
  let notes: string[] | undefined;
  let params: HarvestedParam[] | undefined;

  for (const prop of obj.getProperties()) {
    if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const pa = prop as PropertyAssignment;
    const name = pa.getName().replace(/^['"]|['"]$/g, '');
    const init = pa.getInitializer();
    if (!init) continue;

    if (name === 'method') {
      method = getStringValue(pa) ?? undefined;
    } else if (name === 'path') {
      path = getStringValue(pa) ?? undefined;
    } else if (name === 'requestExample' || name === 'responseExample') {
      const kind = init.getKind();
      let raw: string | undefined;
      if (kind === SyntaxKind.NoSubstitutionTemplateLiteral || kind === SyntaxKind.StringLiteral) {
        raw = init.getText().slice(1, -1);
      } else if (kind === SyntaxKind.TemplateExpression) {
        raw = init.getText().slice(1, -1);
      }
      if (raw !== undefined) {
        if (name === 'requestExample') requestExample = raw;
        else responseExample = raw;
      }
    } else if (name === 'notes') {
      const kind = init.getKind();
      if (kind === SyntaxKind.ArrayLiteralExpression) {
        const arr = init as ArrayLiteralExpression;
        notes = arr.getElements()
          .map(el => {
            const k = el.getKind();
            if (k === SyntaxKind.StringLiteral || k === SyntaxKind.NoSubstitutionTemplateLiteral) {
              return (el as any).getLiteralValue();
            }
            return '';
          })
          .filter(s => s.length > 0);
      }
    } else if (name === 'params') {
      const kind = init.getKind();
      if (kind === SyntaxKind.ArrayLiteralExpression) {
        const arr = init as ArrayLiteralExpression;
        params = [];
        for (const el of arr.getElements()) {
          if (el.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;
          const p = parseObjectLiteral(el as ObjectLiteralExpression);
          if (p.name && p.in) {
            params.push({
              name: p.name,
              type: p.type ?? 'string',
              required: !!p.required,
              description: p.description ?? '',
              in: p.in,
            });
          }
        }
      }
    }
  }

  if (method && path) {
    const key = `${method} ${path}`;
    out[key] = { requestExample, responseExample, notes, params };
  }
}

// ============================================================================
// EMITTER — write src/data/endpoints/<resource>.ts
// ============================================================================

function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function emitResourceFile(
  meta: ResourceMeta,
  examples: ResourceExamples,
  existingExamples: Record<string, { requestExample?: string; responseExample?: string; notes?: string[]; params?: HarvestedParam[] }>,
): string {
  const lines: string[] = [];
  lines.push(`// AUTOGENERATED by scripts/sync-from-api.ts — DO NOT EDIT BY HAND.`);
  lines.push(`// Source of truth: ../../../TrustPager-Portal/supabase/functions/api/routes/${meta.fileName}`);
  lines.push(`// To regenerate after API changes: npm run sync:api`);
  lines.push(`// Hand-curated examples live in scripts/api-sync-examples/${meta.id}.json`);
  lines.push(``);
  lines.push(`import { type ResourceGroup, API_BASE_URL } from './types.js';`);
  lines.push(``);
  lines.push(`export const ${meta.exportName}: ResourceGroup = {`);
  lines.push(`  id: '${meta.id}',`);
  lines.push(`  label: '${esc(meta.label)}',`);
  lines.push(`  description: '${esc(meta.description)}',`);
  lines.push(`  endpoints: [`);

  for (const r of meta.routes) {
    const path = patternToPath(r.pattern);
    const schemaParams = inputSchemaToParams(r);
    const exKey = `${r.method} ${path}`;
    // Precedence: explicit JSON override > harvested from existing file > synthesised
    const override = examples.endpointExamples?.[exKey];
    const harvested = existingExamples[exKey];
    const reqExample = override?.requestExample ?? harvested?.requestExample;
    const respExample = override?.responseExample ?? harvested?.responseExample;
    const exNotes = override?.notes ?? harvested?.notes;

    // Params merge: schema-derived (canonical from SharedRoute.input_schema) +
    // any harvested params not already covered. This preserves richer query-param
    // documentation that lives in the hand-maintained file but isn't yet declared
    // in the API source's input_schema. Long-term those declarations should be
    // enriched, but harvesting prevents data loss in the meantime.
    const seenNames = new Set(schemaParams.map(p => p.name));
    const additionalParams = (harvested?.params ?? []).filter(p => !seenNames.has(p.name));
    const params = [...schemaParams, ...additionalParams];

    lines.push(`    {`);
    lines.push(`      method: '${r.method}',`);
    lines.push(`      path: '${path}',`);
    lines.push(`      toolName: '${esc(r.toolName)}',`);
    lines.push(`      description: '${esc(r.description)}',`);
    lines.push(`      scopes: [${r.requiredScopes.map(s => `'${s}'`).join(', ')}],`);
    lines.push(`      isWrite: ${r.isWrite},`);
    if (params.length > 0) {
      lines.push(`      params: [`);
      for (const p of params) {
        lines.push(
          `        { name: '${p.name}', type: '${p.type}', required: ${p.required}, description: '${esc(p.description)}', in: '${p.in}' },`,
        );
      }
      lines.push(`      ],`);
    }
    if (reqExample) {
      lines.push(`      requestExample: \`${reqExample.replace(/`/g, '\\`')}\`,`);
    } else {
      // Synthesise curl example from method + path (only when no harvest + no override)
      const curlMethod = r.method === 'GET' ? '' : `-X ${r.method} `;
      const bodyParams = params.filter(p => p.in === 'body');
      const exampleBody = bodyParams.length
        ? ` \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(
            Object.fromEntries(bodyParams.slice(0, 3).map(p => [p.name, '...'])),
          )}'`
        : '';
      lines.push(
        `      requestExample: \`curl ${curlMethod}\\\n  "\${API_BASE_URL}${path}" \\\n  -H "Authorization: Bearer YOUR_API_KEY"${exampleBody}\`,`,
      );
    }
    if (respExample) {
      lines.push(`      responseExample: \`${respExample.replace(/`/g, '\\`')}\`,`);
    }
    if (exNotes && exNotes.length) {
      lines.push(`      notes: [`);
      for (const n of exNotes) lines.push(`        '${esc(n)}',`);
      lines.push(`      ],`);
    }
    lines.push(`    },`);
  }
  lines.push(`  ],`);
  lines.push(`};`);
  lines.push(``);
  return lines.join('\n');
}

// ============================================================================
// MAIN
// ============================================================================

const RESOURCE_LABEL_FALLBACKS: Record<string, string> = {
  contacts: 'Contacts',
  companies: 'Companies',
  customers: 'Customers',
  opportunities: 'Opportunities',
  deals: 'Deals',
  pipelines: 'Pipelines',
  // …extend as needed; only used when an existing file doesn't supply one.
};

function fileNameToResourceId(fileName: string): string {
  return basename(fileName, '.ts');
}

function exportNameFromRoutes(exportName: string): string {
  // 'CONTACTS_ROUTES' → 'CONTACTS'
  return exportName.replace(/_ROUTES$/, '');
}

interface SyncOptions {
  check?: boolean;  // Don't write; exit non-zero if a regen would produce a diff
}

async function main(opts: SyncOptions = {}) {
  console.log(`[sync] reading routes from ${ROUTES_DIR}`);
  if (!existsSync(ROUTES_DIR)) {
    console.error(`[sync] routes dir not found: ${ROUTES_DIR}`);
    process.exit(1);
  }

  const routeFiles = readdirSync(ROUTES_DIR)
    .filter(f => f.endsWith('.ts'))
    .filter(f => f !== 'agents.ts' && f !== 'batch.ts')  // intentionally excluded — see Phase 2.1 audit
    .map(f => join(ROUTES_DIR, f));

  console.log(`[sync] found ${routeFiles.length} route files (excluding agents.ts, batch.ts)`);

  let totalRoutes = 0;
  let filesWritten = 0;
  let filesUnchanged = 0;
  let filesSkipped = 0;
  const driftFiles: string[] = [];

  for (const filePath of routeFiles) {
    const fileName = basename(filePath);
    const resourceId = fileNameToResourceId(fileName);

    const parsed = parseRouteFile(filePath);
    if (parsed.length === 0) {
      filesSkipped++;
      console.log(`[sync] SKIP ${fileName} — no SharedRoute[] declarations`);
      continue;
    }

    // A single route file may declare multiple _ROUTES arrays (rare). Concatenate.
    const allRoutes = parsed.flatMap(p => p.routes);
    const exportName = exportNameFromRoutes(parsed[0].exportName);
    totalRoutes += allRoutes.length;

    const outFile = join(ENDPOINTS_DIR, fileName);
    const existing = readExistingResourceMeta(outFile);
    const examples = readExamples(resourceId);

    const meta: ResourceMeta = {
      id: resourceId,
      exportName,
      fileName,
      label: examples.label ?? existing.label ?? RESOURCE_LABEL_FALLBACKS[resourceId] ?? exportName,
      description: examples.description ?? existing.description ?? `${resourceId} endpoints.`,
      routes: allRoutes,
    };

    const newContent = emitResourceFile(meta, examples, existing.endpointExamples);

    if (existsSync(outFile)) {
      const oldContent = readFileSync(outFile, 'utf8');
      if (oldContent === newContent) {
        filesUnchanged++;
        continue;
      }
      if (opts.check) {
        driftFiles.push(fileName);
        continue;
      }
    }

    if (!opts.check) writeFileSync(outFile, newContent, 'utf8');
    filesWritten++;
    console.log(`[sync] ${opts.check ? 'WOULD WRITE' : 'WROTE'} ${fileName} (${allRoutes.length} routes)`);
  }

  console.log(`[sync] —`);
  console.log(`[sync] ${totalRoutes} routes parsed across ${routeFiles.length} files`);
  console.log(`[sync] ${filesWritten} ${opts.check ? 'would change' : 'written'}, ${filesUnchanged} unchanged, ${filesSkipped} skipped`);

  if (opts.check && driftFiles.length > 0) {
    console.error(`[sync] DRIFT detected in ${driftFiles.length} files:`);
    for (const f of driftFiles) console.error(`  - ${f}`);
    console.error(`[sync] Run \`npm run sync:api\` to regenerate.`);
    process.exit(2);
  }
}

const args = process.argv.slice(2);
const opts: SyncOptions = {
  check: args.includes('--check'),
};

main(opts).catch(err => {
  console.error('[sync] failed:', err);
  process.exit(1);
});
