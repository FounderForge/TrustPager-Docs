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
    '> TrustPager is a CRM platform with a REST API and MCP server. This documentation site covers every public endpoint, authentication, scopes, MCP tools, error codes, template variables, and the changelog. The API base URL is `https://api.trustpager.com/functions/v1/api/v1`. Authentication is `Authorization: Bearer <api_key>` (one key per workspace).',
  );
  lines.push('');
  lines.push(
    'Endpoints are grouped by resource. Every endpoint below links to a machine-readable Markdown file. A full OpenAPI 3.1 spec is also available at `/openapi.json`.',
  );
  lines.push('');

  lines.push('## API reference');
  lines.push('');
  for (const r of RESOURCES) {
    lines.push(`- [${r.label}](${SITE_URL}/api/${r.id}.md): ${r.description}`);
  }
  lines.push('');

  lines.push('## Guides');
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

  lines.push('## Optional');
  lines.push('');
  lines.push(`- [Full expanded reference (llms-full.txt)](${SITE_URL}/llms-full.txt)`);
  lines.push(`- [OpenAPI 3.1 spec](${SITE_URL}/openapi.json)`);
  lines.push(`- [Machine-readable API index](${SITE_URL}/api-index.json)`);
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
      lines.push(
        `**Scopes:** ${ep.scopes.length ? ep.scopes.map((s) => `\`${s}\``).join(', ') : '_none_'}${ep.isWrite ? ' — _write_' : ''}`,
      );
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
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'API key' },
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
