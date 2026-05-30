/**
 * Generate AI-readable documentation artifacts from the endpoint data in
 * src/data/endpoints/*.ts. Emits everything into public/ so Vite serves it in
 * dev and copies it into dist/ at build time.
 *
 * Outputs:
 *   /llms.txt           — compact index (llmstxt.org standard)
 *   /llms-full.txt      — every endpoint inlined with curl + params + scopes
 *   /openapi.json       — OpenAPI 3.1 spec
 *   /api-index.json     — machine-readable resource/endpoint index
 *   /api/{id}.md        — one markdown file per resource
 *   /api/{id}/{slug}.md — one markdown file per endpoint (deep link)
 *   /robots.txt         — allow AI crawlers, point at sitemap
 *   /sitemap.xml        — lists all of the above + the SPA routes
 *
 * This script has no runtime cost — it runs once per build.
 */

import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  RESOURCES,
  API_BASE_URL,
  type Endpoint,
  type ResourceGroup,
  type EndpointParam,
} from '../src/data/endpoints/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '..', 'public');
const GENERATED_ROOT = resolve(PUBLIC, 'api');

const SITE_URL = 'https://docs.trustpager.com';
const API_VERSION = '1.0.0';
const SPA_ROUTES = [
  '/',
  '/quickstart',
  '/authentication',
  '/api',
  '/mcp-setup',
  '/mcp-tools',
  '/mcp-examples',
  '/template-variables',
  '/errors',
  '/changelog',
];

// --- helpers ----------------------------------------------------------------

function endpointSlug(ep: Endpoint): string {
  const pathSlug = ep.path.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
  return `${ep.method.toLowerCase()}-${pathSlug || 'root'}`;
}

function pathToOpenApi(path: string): string {
  return path.replace(/:([a-z0-9_]+)/gi, '{$1}');
}

function openApiParams(ep: Endpoint) {
  if (!ep.params) return [];
  return ep.params
    .filter((p) => p.in !== 'body')
    .map((p) => ({
      name: p.name,
      in: p.in,
      required: p.in === 'path' ? true : p.required,
      description: p.description,
      schema: { type: mapType(p.type) },
    }));
}

function mapType(t: string): string {
  const base = t.toLowerCase();
  if (base === 'uuid' || base === 'string' || base === 'date' || base === 'datetime') return 'string';
  if (base === 'number' || base === 'integer' || base === 'int') return 'number';
  if (base === 'boolean' || base === 'bool') return 'boolean';
  if (base === 'array' || base.endsWith('[]')) return 'array';
  if (base === 'object') return 'object';
  return 'string';
}

function bodySchema(ep: Endpoint) {
  const bodyParams = (ep.params ?? []).filter((p) => p.in === 'body');
  if (bodyParams.length === 0) return undefined;
  const properties: Record<string, { type: string; description: string }> = {};
  const required: string[] = [];
  for (const p of bodyParams) {
    properties[p.name] = { type: mapType(p.type), description: p.description };
    if (p.required) required.push(p.name);
  }
  return {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties,
          ...(required.length ? { required } : {}),
        },
      },
    },
  };
}

function mkdirp(p: string) {
  mkdirSync(p, { recursive: true });
}

function write(relative: string, content: string) {
  const full = resolve(PUBLIC, relative);
  mkdirp(dirname(full));
  writeFileSync(full, content, 'utf8');
}

// --- markdown emitters ------------------------------------------------------

function endpointMarkdown(ep: Endpoint, resource: ResourceGroup): string {
  const lines: string[] = [];
  lines.push(`# ${ep.method} ${ep.path}`);
  lines.push('');
  lines.push(`**Resource:** [${resource.label}](./${resource.id}.md)  `);
  if (ep.toolName) lines.push(`**MCP tool:** \`${ep.toolName}\`  `);
  lines.push(`**Scopes:** ${ep.scopes.length ? ep.scopes.map((s) => `\`${s}\``).join(', ') : '_none_'}  `);
  lines.push(`**Write operation:** ${ep.isWrite ? 'yes' : 'no'}`);
  lines.push('');
  lines.push(ep.description);
  lines.push('');

  if (ep.params && ep.params.length) {
    lines.push('## Parameters');
    lines.push('');
    lines.push('| Name | In | Type | Required | Description |');
    lines.push('|------|----|------|----------|-------------|');
    for (const p of ep.params) {
      lines.push(
        `| \`${p.name}\` | ${p.in} | ${p.type} | ${p.required ? 'yes' : 'no'} | ${p.description.replace(/\|/g, '\\|')} |`,
      );
    }
    lines.push('');
  }

  if (ep.requestExample) {
    lines.push('## Request example');
    lines.push('');
    lines.push('```bash');
    lines.push(ep.requestExample);
    lines.push('```');
    lines.push('');
  }

  if (ep.responseExample) {
    lines.push('## Response example');
    lines.push('');
    lines.push('```json');
    lines.push(ep.responseExample);
    lines.push('```');
    lines.push('');
  } else if (ep.response || ep.example) {
    lines.push('## Response example');
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(ep.response ?? ep.example, null, 2));
    lines.push('```');
    lines.push('');
  }

  if (ep.notes && ep.notes.length) {
    lines.push('## Notes');
    lines.push('');
    for (const note of ep.notes) lines.push(`- ${note}`);
    lines.push('');
  }

  lines.push('---');
  lines.push(`Base URL: \`${API_BASE_URL}\` — Auth: \`Authorization: Bearer YOUR_API_KEY\``);
  return lines.join('\n');
}

function resourceMarkdown(resource: ResourceGroup): string {
  const lines: string[] = [];
  lines.push(`# ${resource.label}`);
  lines.push('');
  lines.push(resource.description);
  lines.push('');
  lines.push(`**Base URL:** \`${API_BASE_URL}\``);
  lines.push('');
  lines.push('## Endpoints');
  lines.push('');
  for (const ep of resource.endpoints) {
    const slug = endpointSlug(ep);
    lines.push(`### ${ep.method} ${ep.path}`);
    lines.push('');
    lines.push(ep.description);
    lines.push('');
    lines.push(
      `**Scopes:** ${ep.scopes.length ? ep.scopes.map((s) => `\`${s}\``).join(', ') : '_none_'} — [full detail](./${resource.id}/${slug}.md)`,
    );
    lines.push('');
  }
  return lines.join('\n');
}

// --- llms.txt emitters ------------------------------------------------------

function llmsShort(): string {
  const lines: string[] = [];
  lines.push('# TrustPager');
  lines.push('');
  lines.push(
    '> TrustPager is an AI-first CRM platform. AI assistants like Claude Code use TrustPager as a tool surface to run a workspace end-to-end — opportunities (deals), contacts, companies, automations, voice agents, scheduling, documents, forms, transcripts, and more. This file is the entry briefing for AI agents working against TrustPager.',
  );
  lines.push('');
  lines.push('## Get connected');
  lines.push('');
  lines.push('- **REST API base URL:** `https://api.trustpager.com/functions/v1/api/v1`');
  lines.push('- **Auth:** `Authorization: Bearer tp_live_...` — one key per workspace');
  lines.push('- **Create or rotate your key:** https://app.trustpager.com/settings/api');
  lines.push('- **MCP server:** workspace-scoped install URL follows the pattern `https://mcp.trustpager.com/<workspace-slug>/mcp` (HTTP streamable transport). Get yours from https://app.trustpager.com/auto/ai-access (the "AI Access" page) — that page emits the full `claude mcp add ...` command for your workspace. Recommended for interactive AI sessions.');
  lines.push('- **Welcome / discovery endpoint:** `GET https://api.trustpager.com/functions/v1/api/v1/` — returns a JSON manifest pointing at every other artefact listed below. No auth required.');
  lines.push('');
  lines.push('## Common tasks (cookbook)');
  lines.push('');
  lines.push('Recipes are paste-ready markdown. Read these before fanning out into bulk REST calls — they tell you which surface to use and what gotchas to avoid.');
  lines.push('');
  lines.push(`- [Bulk-fetch transcripts](${SITE_URL}/cookbook/bulk-fetch-transcripts.md) — paginate \`/transcripts\` via REST, save to disk, analyse offline. Solves the "100 transcripts is too much for MCP context" case.`);
  lines.push(`- [MCP vs REST — when to use which](${SITE_URL}/cookbook/mcp-vs-rest-decision.md) — decision rules + side-by-side. Both surfaces hit the same workspace.`);
  lines.push(`- [Paginate correctly](${SITE_URL}/cookbook/paginate-correctly.md) — \`?limit\`, \`?after\`, \`has_more\`, field selection, expansions. Same pattern on every list endpoint.`);
  lines.push('');
  lines.push('## Key concepts');
  lines.push('');
  lines.push('- **Scopes.** API keys are scoped (e.g. `contacts:read`, `opportunities:write`, `admin`). The `admin` scope is a superscope. Scopes are stamped on the key at creation time and visible on each key in Settings → API.');
  lines.push('- **Approval queue.** Keys with `-approval` scopes (e.g. `contacts:write-approval`) return **202** on write operations with an `approval_id`. The action is queued, not executed. Do NOT retry. Check `GET /approvals/:id`. Approvers act at https://app.trustpager.com/settings/api?tab=approvals.');
  lines.push('- **Pagination.** `{ data, pagination: { has_more, next_cursor } }`. Pass `next_cursor` back as `?after=`. Default limit 25, max 100.');
  lines.push('- **Idempotency.** Send `Idempotency-Key: <unique>` header on writes to prevent duplicates on retry. Same key within 24 hours returns cached response.');
  lines.push('- **Error responses.** 401/403/404 bodies include a `docs` URL and `auth_scheme` / `required_scopes` fields. Headers include `WWW-Authenticate: Bearer realm="trustpager"` and `Link: <docs>; rel="help"`. If you hit auth issues, the error itself tells you where to look.');
  lines.push('- **Credit costs.** Reads are free. Writes are billed; AI generation and send operations are billed more. MCP rates are ~10x cheaper than REST flat-rate. Check balance any time via `GET /credit/balance` or `get_credit_balance` MCP tool.');
  lines.push('- **Approval and idempotency are surface-agnostic.** Same key, same behaviour, whether you call via MCP or REST.');
  lines.push('');
  lines.push('## Discovery surface — machine-readable everything');
  lines.push('');
  lines.push(`- [OpenAPI 3.1 spec](${SITE_URL}/openapi.json) — declares \`bearerAuth\` with \`bearerFormat: tp_live_*\`. Every endpoint, every param, every scope.`);
  lines.push(`- [Full reference (llms-full.txt)](${SITE_URL}/llms-full.txt) — every endpoint inlined with curl + params + scopes`);
  lines.push(`- [Machine-readable resource index](${SITE_URL}/api-index.json) — JSON map of resources → endpoints with metadata`);
  lines.push(`- [Per-endpoint markdown](${SITE_URL}/api/{resource}/{verb}.md) — fetchable directly. Replace \`{resource}\` and \`{verb}\` with real values.`);
  lines.push(`- [Sitemap](${SITE_URL}/sitemap.xml) — every public URL`);
  lines.push(`- [\`.well-known/ai-plugin.json\`](${SITE_URL}/.well-known/ai-plugin.json) — ChatGPT-plugin-compatible manifest. Names this OpenAPI spec, the MCP install URL, and the auth scheme.`);
  lines.push(`- [\`.well-known/api-catalog\`](${SITE_URL}/.well-known/api-catalog) — RFC 9727 catalog`);
  lines.push('');
  lines.push('## Guides (longer-form)');
  lines.push('');
  lines.push(`- [Quickstart](${SITE_URL}/quickstart)`);
  lines.push(`- [Authentication & scopes](${SITE_URL}/authentication)`);
  lines.push(`- [MCP setup](${SITE_URL}/mcp-setup)`);
  lines.push(`- [MCP tools](${SITE_URL}/mcp-tools)`);
  lines.push(`- [MCP examples](${SITE_URL}/mcp-examples)`);
  lines.push(`- [Template variables](${SITE_URL}/template-variables)`);
  lines.push(`- [Error reference](${SITE_URL}/errors)`);
  lines.push(`- [Changelog](${SITE_URL}/changelog)`);
  lines.push('');
  lines.push('## Full API reference (inventory)');
  lines.push('');
  lines.push('Every resource has a dedicated markdown file with every endpoint inlined. Fetch them on demand:');
  lines.push('');
  for (const r of RESOURCES) {
    lines.push(`- [${r.label}](${SITE_URL}/api/${r.id}.md): ${r.description}`);
  }
  lines.push('');
  return lines.join('\n');
}

function llmsFull(): string {
  const lines: string[] = [];
  lines.push('# TrustPager API — full reference');
  lines.push('');
  lines.push(`Base URL: \`${API_BASE_URL}\``);
  lines.push('Authentication: `Authorization: Bearer <api_key>` (one API key per workspace).');
  lines.push('');
  lines.push(`Generated ${new Date().toISOString()} from the source-of-truth endpoint data.`);
  lines.push('');

  for (const r of RESOURCES) {
    lines.push('---');
    lines.push('');
    lines.push(`## ${r.label}`);
    lines.push('');
    lines.push(r.description);
    lines.push('');
    for (const ep of r.endpoints) {
      lines.push(`### ${ep.method} ${ep.path}`);
      lines.push('');
      lines.push(ep.description);
      lines.push('');
      const meta = [
        `**Scopes:** ${ep.scopes.length ? ep.scopes.map((s) => `\`${s}\``).join(', ') : '_none_'}`,
      ];
      if (ep.toolName) meta.push(`**MCP tool:** \`${ep.toolName}\``);
      if (ep.isWrite) meta.push('_write_');
      lines.push(meta.join(' — '));
      lines.push('');
      if (ep.params && ep.params.length) {
        lines.push('Parameters:');
        for (const p of ep.params) {
          lines.push(
            `  - \`${p.name}\` (${p.in}, ${p.type}${p.required ? ', required' : ''}): ${p.description}`,
          );
        }
        lines.push('');
      }
      if (ep.requestExample) {
        lines.push('```bash');
        lines.push(ep.requestExample);
        lines.push('```');
        lines.push('');
      }
    }
  }
  return lines.join('\n');
}

// --- OpenAPI emitter --------------------------------------------------------

function openApiDoc() {
  const paths: Record<string, Record<string, unknown>> = {};
  const resourceTags = RESOURCES.map((r) => ({ name: r.label, description: r.description }));

  for (const r of RESOURCES) {
    for (const ep of r.endpoints) {
      const oaPath = pathToOpenApi(ep.path);
      if (!paths[oaPath]) paths[oaPath] = {};
      const op: Record<string, unknown> = {
        tags: [r.label],
        summary: ep.description.split('.')[0],
        description: ep.description,
        operationId: `${ep.method.toLowerCase()}${r.id}${oaPath.replace(/[^a-z0-9]+/gi, '_')}`,
        security: [{ bearerAuth: [] }],
        parameters: openApiParams(ep),
        responses: {
          '200': { description: 'Success' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized — missing or invalid API key' },
          '403': { description: 'Forbidden — insufficient scope' },
          '404': { description: 'Not found' },
          '429': { description: 'Rate limited' },
        },
      };
      if (ep.scopes.length) {
        (op as Record<string, unknown>)['x-scopes'] = ep.scopes;
      }
      if (ep.toolName) {
        (op as Record<string, unknown>)['x-mcp-tool'] = ep.toolName;
      }
      const body = bodySchema(ep);
      if (body) (op as Record<string, unknown>)['requestBody'] = body;
      paths[oaPath][ep.method.toLowerCase()] = op;
    }
  }

  return {
    openapi: '3.1.0',
    info: {
      title: 'TrustPager API',
      version: API_VERSION,
      description:
        'REST API for TrustPager CRM. Every workspace has a single API key with scoped permissions. See https://docs.trustpager.com for guides, MCP setup, and changelog.',
      contact: { name: 'TrustPager', url: 'https://docs.trustpager.com' },
    },
    servers: [{ url: API_BASE_URL, description: 'Production' }],
    tags: resourceTags,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'tp_live_*',
          description: 'TrustPager API key. One key per workspace. Format: `tp_live_<random>`. Header: `Authorization: Bearer tp_live_...`. Create or rotate at https://app.trustpager.com/settings/api. Scopes are stamped on the key at creation time; see https://docs.trustpager.com/authentication for the full scope reference.',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths,
  };
}

// --- machine-readable index -------------------------------------------------

function apiIndex() {
  return {
    generated_at: new Date().toISOString(),
    base_url: API_BASE_URL,
    site_url: SITE_URL,
    auth: { type: 'bearer', header: 'Authorization', format: 'Bearer <api_key>' },
    resources: RESOURCES.map((r) => ({
      id: r.id,
      label: r.label,
      description: r.description,
      doc_url: `${SITE_URL}/api/${r.id}.md`,
      endpoints: r.endpoints.map((ep) => ({
        method: ep.method,
        path: ep.path,
        tool_name: ep.toolName,
        description: ep.description,
        scopes: ep.scopes,
        is_write: ep.isWrite,
        doc_url: `${SITE_URL}/api/${r.id}/${endpointSlug(ep)}.md`,
        params: (ep.params ?? []).map((p: EndpointParam) => ({
          name: p.name,
          in: p.in,
          type: p.type,
          required: p.required,
          description: p.description,
        })),
      })),
    })),
  };
}

// --- robots.txt + sitemap.xml -----------------------------------------------

function robotsTxt(): string {
  return [
    '# TrustPager developer documentation',
    '# AI agents and crawlers are welcome.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# Explicit allow for common AI crawlers',
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    'User-agent: Claude-Web',
    'Allow: /',
    '',
    'User-agent: anthropic-ai',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    'User-agent: CCBot',
    'Allow: /',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');
}

function sitemapXml(): string {
  const urls: string[] = [];
  const now = new Date().toISOString().slice(0, 10);

  for (const route of SPA_ROUTES) urls.push(`${SITE_URL}${route}`);
  urls.push(`${SITE_URL}/llms.txt`);
  urls.push(`${SITE_URL}/llms-full.txt`);
  urls.push(`${SITE_URL}/openapi.json`);
  urls.push(`${SITE_URL}/api-index.json`);

  for (const r of RESOURCES) {
    urls.push(`${SITE_URL}/api/${r.id}`);
    urls.push(`${SITE_URL}/api/${r.id}.md`);
    for (const ep of r.endpoints) {
      urls.push(`${SITE_URL}/api/${r.id}/${endpointSlug(ep)}.md`);
    }
  }

  const body = urls
    .map((u) => `  <url><loc>${u}</loc><lastmod>${now}</lastmod></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

// --- main -------------------------------------------------------------------

export function generateAiDocs() {
  // Clean previously generated API docs so deleted endpoints disappear.
  if (existsSync(GENERATED_ROOT)) rmSync(GENERATED_ROOT, { recursive: true, force: true });
  mkdirp(GENERATED_ROOT);

  // Root artifacts
  write('llms.txt', llmsShort());
  write('llms-full.txt', llmsFull());
  write('openapi.json', JSON.stringify(openApiDoc(), null, 2));
  write('api-index.json', JSON.stringify(apiIndex(), null, 2));
  write('robots.txt', robotsTxt());
  write('sitemap.xml', sitemapXml());

  // Per-resource + per-endpoint markdown
  let endpointCount = 0;
  for (const r of RESOURCES) {
    write(`api/${r.id}.md`, resourceMarkdown(r));
    for (const ep of r.endpoints) {
      write(`api/${r.id}/${endpointSlug(ep)}.md`, endpointMarkdown(ep, r));
      endpointCount++;
    }
  }

  return {
    resources: RESOURCES.length,
    endpoints: endpointCount,
  };
}

// Allow direct CLI invocation: `node --import tsx scripts/generate-ai-docs.ts`
const isMain =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, '/') ?? '');

if (isMain) {
  const stats = generateAiDocs();
  // eslint-disable-next-line no-console
  console.log(
    `[ai-docs] wrote ${stats.resources} resources, ${stats.endpoints} endpoints → public/`,
  );
}
