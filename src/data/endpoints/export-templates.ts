import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// EXPORT TEMPLATES (8 endpoints)
// Saved export templates let you define a column layout, filter set, sort order,
// and output format once, then run or preview on demand. Templates support named
// views (per-user saved filter/sort configurations). Four root entities are
// supported: opportunity, contact, account, work_order.
// Scopes: exports:read, exports:write, exports:delete
// =============================================================================

export const EXPORT_TEMPLATES: ResourceGroup = {
  id: 'export-templates',
  label: 'Export Templates',
  description:
    'Reusable export configurations that combine a column layout, filters, sort order, and output format into a named template. ' +
    'Run a template to get XLSX or CSV data; preview returns the first 10 rows. ' +
    'Named views let each user persist their own filter/sort variant on a shared template. ' +
    'Scopes: exports:read, exports:write, exports:delete.',
  endpoints: [
    // -------------------------------------------------------------------------
    // Field Catalog
    // -------------------------------------------------------------------------
    {
      method: 'GET',
      path: '/exports/field-catalog',
      toolName: 'get_export_field_catalog',
      description:
        'Discover which fields are available as columns and filters for a given root entity. ' +
        'Returns filter_fields (with allowed operator sets per field type) and column_fields (source + relation options). ' +
        'Call this before building a create_export_template payload so column IDs and filter ops are correct.',
      scopes: ['exports:read'],
      isWrite: false,
      params: [
        {
          name: 'root_entity',
          type: 'string',
          required: true,
          description:
            'Entity to explore. One of: opportunity, contact, account, work_order.',
          in: 'query',
        },
      ],
      example: {
        request: `curl -H "Authorization: Bearer tp_live_..." \\
  "${API_BASE_URL}/exports/field-catalog?root_entity=opportunity"`,
        response: JSON.stringify(
          {
            root_entity: 'opportunity',
            filter_fields: [
              {
                key: 'tags',
                label: 'Tags',
                type: 'tags',
                ops: ['in', 'not_in', 'is_null', 'not_null'],
              },
              {
                key: 'status',
                label: 'Status',
                type: 'select',
                ops: ['eq', 'neq', 'in', 'is_null', 'not_null'],
                options: ['open', 'won', 'lost'],
              },
              {
                key: 'created_at',
                label: 'Created At',
                type: 'date',
                ops: ['gte', 'lte', 'between', 'is_null', 'not_null'],
              },
            ],
            column_fields: [
              { key: 'name', label: 'Name', source: 'root' },
              { key: 'primary_contact', label: 'Primary Contact', source: 'relation' },
            ],
          },
          null,
          2,
        ),
      },
    },

    // -------------------------------------------------------------------------
    // Templates CRUD
    // -------------------------------------------------------------------------
    {
      method: 'GET',
      path: '/exports/templates',
      toolName: 'list_export_templates',
      description: 'List all export templates for this workspace.',
      scopes: ['exports:read'],
      isWrite: false,
      params: [
        {
          name: 'root_entity',
          type: 'string',
          required: false,
          description: 'Filter by root entity. One of: opportunity, contact, account, work_order.',
          in: 'query',
        },
        {
          name: 'search',
          type: 'string',
          required: false,
          description: 'Partial name match.',
          in: 'query',
        },
        {
          name: 'limit',
          type: 'number',
          required: false,
          description: 'Items per page (default 25, max 100).',
          in: 'query',
        },
        {
          name: 'after',
          type: 'string',
          required: false,
          description: 'Cursor: last ID from previous page.',
          in: 'query',
        },
      ],
    },
    {
      method: 'GET',
      path: '/exports/templates/:id',
      toolName: 'get_export_template',
      description: 'Get a single export template with full column, filter, and output config.',
      scopes: ['exports:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Template ID.', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/exports/templates',
      toolName: 'create_export_template',
      description: 'Create an export template. Define columns (root fields or relation fields), filters, optional sort, and output format.',
      scopes: ['exports:write'],
      isWrite: true,
      params: [
        {
          name: 'name',
          type: 'string',
          required: true,
          description: 'Template name.',
          in: 'body',
        },
        {
          name: 'root_entity',
          type: 'string',
          required: true,
          description: 'One of: opportunity, contact, account, work_order.',
          in: 'body',
        },
        {
          name: 'columns',
          type: 'array',
          required: true,
          description:
            'Array of ExportColumn objects. Each has: id (uuid), source ("root" or "relation"), ' +
            'field (for root source, dotted path e.g. "name", "created_at", "metadata.cf_custom"), ' +
            'relation (for relation source, e.g. "primary_contact", "pipeline", "stage"), ' +
            'relation_mode ("primary", "first_n", "comma_joined", "explode"), ' +
            'relation_field (field on the related entity, e.g. "email", "name"), ' +
            'header (column label), format (optional: "date", "datetime", "currency", "boolean", "array").',
          in: 'body',
        },
        {
          name: 'filters',
          type: 'array',
          required: false,
          description:
            'Array of ExportFilter objects. Each has: id (uuid), field (dotted path), op, value. ' +
            'Canonical ops: eq, neq, in, not_in, gte, lte, between, contains (text substring), is_null, not_null. ' +
            'Tags use "in" (OR -- "has any of these tags") and "not_in" (NOR -- "has none of these tags"). ' +
            'Reference fields (pipeline_id, stage_id, assigned_to, status): in, not_in. ' +
            'Legacy: "not_contains" on tags is a back-compat alias for "not_in" -- new code should use "not_in".',
          in: 'body',
        },
        {
          name: 'sort',
          type: 'array',
          required: false,
          description:
            'Array of ExportSortEntry objects: { column_id, direction: "asc"|"desc" }. ' +
            'column_id must reference an ExportColumn.id from the columns array. ' +
            'Only root-source scalar columns can be sorted; relation columns are silently skipped.',
          in: 'body',
        },
        {
          name: 'output',
          type: 'object',
          required: false,
          description:
            'ExportOutput config: { format: "xlsx"|"csv", bom: boolean (CSV UTF-8 BOM, default true), ' +
            'filename_template: string (tokens: {name}, {YYYY}, {MM}, {DD}, {YYYY-MM-DD}) }.',
          in: 'body',
        },
      ],
      example: {
        request: `curl -X POST \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Tagged PET leads - not VIP",
    "root_entity": "opportunity",
    "columns": [
      { "id": "c1", "source": "root", "field": "name", "header": "Name" },
      { "id": "c2", "source": "root", "field": "tags", "header": "Tags", "format": "array" },
      { "id": "c3", "source": "relation", "relation": "primary_contact", "relation_field": "email", "relation_mode": "primary", "header": "Email" }
    ],
    "filters": [
      { "id": "f1", "field": "tags", "op": "in", "value": ["PET"] },
      { "id": "f2", "field": "tags", "op": "not_in", "value": ["VIP"] }
    ],
    "output": { "format": "xlsx" }
  }' \\
  "${API_BASE_URL}/exports/templates"`,
        response: JSON.stringify(
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: 'Tagged PET leads - not VIP',
            root_entity: 'opportunity',
            columns: [],
            filters: [],
            output: { format: 'xlsx' },
            created_at: '2026-05-19T12:00:00Z',
          },
          null,
          2,
        ),
      },
    },
    {
      method: 'PATCH',
      path: '/exports/templates/:id',
      toolName: 'update_export_template',
      description: 'Update an export template. All body fields are optional; send only the fields you want to change.',
      scopes: ['exports:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Template ID.', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'New name.', in: 'body' },
        { name: 'columns', type: 'array', required: false, description: 'Replacement column array (full replace, not merge).', in: 'body' },
        {
          name: 'filters',
          type: 'array',
          required: false,
          description:
            'Replacement filter array. Canonical ops: eq, neq, in, not_in, gte, lte, between, contains (text substring), is_null, not_null. ' +
            'Tags use in (OR) / not_in (NOR). Legacy not_contains is a back-compat alias for not_in.',
          in: 'body',
        },
        { name: 'sort', type: 'array', required: false, description: 'Replacement sort array.', in: 'body' },
        { name: 'output', type: 'object', required: false, description: 'Replacement output config.', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/exports/templates/:id',
      toolName: 'delete_export_template',
      description: 'Delete an export template and all its saved views.',
      scopes: ['exports:delete'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Template ID.', in: 'path' },
      ],
    },

    // -------------------------------------------------------------------------
    // Run / Preview
    // -------------------------------------------------------------------------
    {
      method: 'POST',
      path: '/exports/templates/:id/preview',
      toolName: 'preview_export_template',
      description:
        'Preview the first 10 rows of an export template (or a saved view). ' +
        'Returns JSON with headers and rows -- useful for verifying filter logic before running a full export. ' +
        'Filters, sort, and column layout from the template (or overrides in the request body) are applied. ' +
        'All filter operators are supported: tags use in (OR/"has any of") / not_in (NOR/"has none of"). ' +
        'Legacy not_contains is a back-compat alias for not_in.',
      scopes: ['exports:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Template ID.', in: 'path' },
        {
          name: 'view_id',
          type: 'uuid',
          required: false,
          description: 'Apply a saved view\'s filter/sort overrides on top of the template.',
          in: 'body',
        },
      ],
      example: {
        request: `curl -X POST \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{}' \\
  "${API_BASE_URL}/exports/templates/3fa85f64-5717-4562-b3fc-2c963f66afa6/preview"`,
        response: JSON.stringify(
          {
            headers: ['Name', 'Tags', 'Email'],
            rows: [
              ['Acme Corp', 'PET', 'contact@acme.com'],
              ['Beta Ltd', 'PET, REFERRAL', 'info@beta.com'],
            ],
            rowCount: 2,
            truncated: false,
            sheetName: 'Opportunities',
          },
          null,
          2,
        ),
      },
    },
    {
      method: 'POST',
      path: '/exports/templates/:id/run',
      toolName: 'run_export_template',
      description:
        'Run an export template and download the resulting XLSX or CSV file. ' +
        'Up to 250,000 rows are exported (X-Truncated: 1 header if the cap is hit). ' +
        'Optionally apply a saved view\'s filter/sort overrides. ' +
        'Supports all filter operators: tags use in (OR/"has any of") / not_in (NOR/"has none of"); not_contains is a back-compat alias for not_in.',
      scopes: ['exports:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Template ID.', in: 'path' },
        {
          name: 'view_id',
          type: 'uuid',
          required: false,
          description: 'Apply a saved view\'s filter/sort overrides before running.',
          in: 'body',
        },
      ],
      example: {
        request: `curl -X POST \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{}' \\
  "${API_BASE_URL}/exports/templates/3fa85f64-5717-4562-b3fc-2c963f66afa6/run" \\
  --output export.xlsx`,
        response: `# Binary XLSX (or CSV) file download.
# Response headers:
# Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
# Content-Disposition: attachment; filename="Tagged PET leads - not VIP-2026-05-19.xlsx"
# X-Row-Count: 87
# X-Truncated: 0`,
      },
    },

    // -------------------------------------------------------------------------
    // Views (per-user saved filter/sort configurations)
    // -------------------------------------------------------------------------
    {
      method: 'GET',
      path: '/exports/templates/:id/views',
      toolName: 'list_export_template_views',
      description: 'List all saved views for an export template.',
      scopes: ['exports:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Template ID.', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/exports/templates/:id/views',
      toolName: 'create_export_template_view',
      description: 'Create a saved view on an export template. A view stores a per-user filter/sort overlay without modifying the base template.',
      scopes: ['exports:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Template ID.', in: 'path' },
        { name: 'name', type: 'string', required: true, description: 'View name.', in: 'body' },
        {
          name: 'filters',
          type: 'array',
          required: false,
          description: 'Filter overrides. Same ExportFilter shape as the template (see POST /exports/templates).',
          in: 'body',
        },
        {
          name: 'sort',
          type: 'array',
          required: false,
          description: 'Sort overrides. Same ExportSortEntry shape as the template.',
          in: 'body',
        },
      ],
    },
    {
      method: 'PATCH',
      path: '/exports/templates/:template_id/views/:id',
      toolName: 'update_export_template_view',
      description: 'Update a saved view name, filters, or sort.',
      scopes: ['exports:write'],
      isWrite: true,
      params: [
        { name: 'template_id', type: 'uuid', required: true, description: 'Template ID.', in: 'path' },
        { name: 'id', type: 'uuid', required: true, description: 'View ID.', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'New name.', in: 'body' },
        { name: 'filters', type: 'array', required: false, description: 'Replacement filter array.', in: 'body' },
        { name: 'sort', type: 'array', required: false, description: 'Replacement sort array.', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/exports/templates/:template_id/views/:id',
      toolName: 'delete_export_template_view',
      description: 'Delete a saved view.',
      scopes: ['exports:delete'],
      isWrite: true,
      params: [
        { name: 'template_id', type: 'uuid', required: true, description: 'Template ID.', in: 'path' },
        { name: 'id', type: 'uuid', required: true, description: 'View ID.', in: 'path' },
      ],
    },
  ],
};
