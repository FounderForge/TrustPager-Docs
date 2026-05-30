import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// COMPANIES (canonical) -- formerly "Customers"
// =============================================================================
//
// 2026-05-13 (Phase A naming refactor):
//   * Canonical resource path is now /companies.
//   * The legacy /customers path is still served indefinitely and accepts every
//     same field. Existing integrations do NOT need to change. New code should
//     use /companies.
//   * MCP tool names follow the same pattern: company_* is canonical,
//     customer_* aliases remain registered.
//
// "Company" here refers to a business account / organisation record in the CRM
// (a buyer or vendor you do business with). It is distinct from the OWN
// workspace company, which lives under the /company resource (singular).
// =============================================================================

export const COMPANIES: ResourceGroup = {
  id: 'companies',
  label: 'Companies',
  description: 'Manage business accounts (companies / organisations) in the CRM. Canonical path is /companies; the legacy /customers path remains supported. Companies can have multiple contacts linked and roll up to opportunities and activities.',
  endpoints: [
    {
      method: 'GET',
      path: '/companies',
      toolName: 'list_companies',
      description: 'List all companies with cursor-based pagination. Legacy alias: GET /customers.',
      scopes: ['companies:read'],
      isWrite: false,
      params: [
        { name: 'search', type: 'string', required: false, description: 'Search by name, email, or phone', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100, default 25)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/companies?limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "company-uuid-...",
      "public_id": "A-001",
      "name": "Acme Corp",
      "email": "info@acme.com",
      "phone": "+61412345678",
      "landline": "+61290001234",
      "industry": "Construction",
      "created_at": "2026-01-10T09:00:00Z"
    }
  ],
  "pagination": { "limit": 10, "has_more": false, "next_cursor": null, "prev_cursor": null },
  "meta": { "credits_remaining": 9500 }
}`,
    },
    {
      method: 'GET',
      path: '/companies/:id',
      toolName: 'get_company',
      description: 'Retrieve a single company by ID. Legacy alias: GET /customers/:id.',
      scopes: ['companies:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Company ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/companies',
      toolName: 'create_company',
      description: 'Create a new company. name is required. Set skip_automations: true to suppress the customer_created trigger -- recommended for historical imports. Legacy alias: POST /customers.',
      scopes: ['companies:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Company / organisation name', in: 'body' },
        { name: 'email', type: 'string', required: false, description: 'Primary email', in: 'body' },
        { name: 'phone', type: 'string', required: false, description: 'Mobile number in E.164 format (e.g. +61412345678). MUST be a mobile number -- landlines will be rejected with a 400 error. Use the landline field for fixed-line/office numbers.', in: 'body' },
        { name: 'landline', type: 'string', required: false, description: 'Landline / office phone number in E.164 format (e.g. +61299991234)', in: 'body' },
        { name: 'industry', type: 'string', required: false, description: 'Industry sector', in: 'body' },
        { name: 'website', type: 'string', required: false, description: 'Website URL', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Notes', in: 'body' },
        { name: 'metadata', type: 'object', required: false, description: 'Custom field values as { field_id: value } pairs. Use GET /crm-settings to discover available custom fields. Reserved key: "quick_links" stores per-company Quick Link URLs as { <type-uuid>: <url> } -- define types via PATCH /company/crm-settings. UUID-shaped keys at metadata root are rejected (400).', in: 'body' },
        { name: 'skip_automations', type: 'boolean', required: false, description: 'Set true to suppress the customer_created trigger. Use for historical imports. Default false.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/companies" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "Acme Corp", "email": "info@acme.com", "phone": "+61412345678", "landline": "+61290001234" }'`,
    },
    {
      method: 'PATCH',
      path: '/companies/:id',
      toolName: 'update_company',
      description: 'Update an existing company. Only include fields you want to change. Every successful PATCH emits a field-level audit row to crm_field_change_log (viewable at /data/crm-logs with the crm_audit:read scope). Legacy alias: PATCH /customers/:id.',
      scopes: ['companies:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Company ID', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'Company / organisation name', in: 'body' },
        { name: 'email', type: 'string', required: false, description: 'Primary email', in: 'body' },
        { name: 'phone', type: 'string', required: false, description: 'Mobile number in E.164 format. Landlines will be rejected -- use the landline field.', in: 'body' },
        { name: 'landline', type: 'string', required: false, description: 'Landline / office phone number in E.164 format. Set to null to clear.', in: 'body' },
        { name: 'industry', type: 'string', required: false, description: 'Industry sector', in: 'body' },
        { name: 'website', type: 'string', required: false, description: 'Website URL', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Notes', in: 'body' },
        { name: 'metadata', type: 'object', required: false, description: 'Custom field values as { field_id: value } pairs. Replaces entire metadata object -- read first with GET /companies/:id and merge locally. Reserved key: "quick_links" stores per-company Quick Link URLs as { <type-uuid>: <url> }. UUID-shaped keys at metadata root are rejected (400).', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/companies/:id',
      toolName: 'delete_company',
      description: 'Delete a company. Legacy alias: DELETE /customers/:id.',
      scopes: ['companies:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Company ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/companies/search',
      toolName: 'search_companies',
      description: 'Search companies by name, email, or phone. Legacy alias: POST /customers/search.',
      scopes: ['companies:read'],
      isWrite: false,
      params: [
        { name: 'query', type: 'string', required: true, description: 'Search query', in: 'body' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100)', in: 'body' },
      ],
    },
    {
      method: 'GET',
      path: '/companies/:id/contacts',
      toolName: 'get_company_contacts',
      description: 'List all contacts linked to this company. Legacy alias: GET /customers/:id/contacts.',
      scopes: ['companies:read', 'contacts:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Company ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/companies/:id/opportunities',
      toolName: 'get_company_opportunities',
      description: 'List all opportunities for this company. Legacy alias: GET /customers/:id/deals (also still supported).',
      scopes: ['companies:read', 'opportunities:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Company ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/companies/:id/activities',
      toolName: 'get_company_activities',
      description: 'List all activities for this company. Legacy alias: GET /customers/:id/activities.',
      scopes: ['companies:read', 'activities:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Company ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/companies/bulk-create',
      toolName: 'bulk_create_companies',
      description: 'Create up to 100 companies in a single request. Built for historical migrations and bulk imports. Set skip_automations: true to suppress customer_created triggers across all records. Returns a created array and an errors array. Legacy alias: POST /customers/bulk-create.',
      scopes: ['companies:write'],
      isWrite: true,
      params: [
        { name: 'records', type: 'object[]', required: true, description: 'Array of company objects (max 100). Each requires name plus any optional fields (email, phone, landline, industry, website, notes, metadata, etc.).', in: 'body' },
        { name: 'skip_automations', type: 'boolean', required: false, description: 'Set true to suppress customer_created triggers across all records. Strongly recommended for historical imports.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/companies/bulk-create" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "skip_automations": true,
    "records": [
      { "name": "Acme Corp", "email": "info@acme.com", "landline": "+61290001234" },
      { "name": "Globex Inc", "email": "contact@globex.com" }
    ]
  }'`,
      responseExample: `{
  "data": {
    "created": [
      { "index": 0, "id": "company-uuid-1", "name": "Acme Corp", ... },
      { "index": 1, "id": "company-uuid-2", "name": "Globex Inc", ... }
    ],
    "errors": [],
    "created_count": 2,
    "error_count": 0
  },
  "meta": { "credits_remaining": 9480 }
}`,
    },
    {
      method: 'POST',
      path: '/companies/bulk-delete',
      toolName: 'bulk_delete_companies',
      description: 'Permanently delete up to 100 companies in a single request. Returns a count of deleted records. Cannot be undone. Legacy alias: POST /customers/bulk-delete.',
      scopes: ['companies:delete'],
      isWrite: true,
      params: [
        { name: 'ids', type: 'uuid[]', required: true, description: 'Array of company UUIDs to delete (max 100)', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/companies/bulk-delete" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"ids":["uuid-1","uuid-2"]}'`,
      responseExample: `{
  "data": { "success": true, "deleted": 2 },
  "meta": { "credits_remaining": 9480 }
}`,
    },
  ],
};
