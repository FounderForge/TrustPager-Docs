import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// CUSTOMERS
// =============================================================================

export const CUSTOMERS: ResourceGroup = {
  id: 'customers',
  label: 'Customers',
  description: 'Manage business accounts (companies/organisations) in the CRM. Customers can have multiple contacts linked.',
  endpoints: [
    {
      method: 'GET',
      path: '/customers',
      description: 'List all customers with cursor-based pagination.',
      scopes: ['customers:read'],
      isWrite: false,
      params: [
        { name: 'search', type: 'string', required: false, description: 'Search by name, email, or phone', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100, default 25)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/customers?limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "cust-uuid-...",
      "public_id": "A-001",
      "name": "Acme Corp",
      "email": "info@acme.com",
      "phone": "+61290001234",
      "industry": "Construction",
      "tags": ["enterprise"],
      "created_at": "2026-01-10T09:00:00Z"
    }
  ],
  "pagination": { "limit": 10, "has_more": false, "next_cursor": null, "prev_cursor": null },
  "meta": { "credits_remaining": 9500 }
}`,
    },
    {
      method: 'GET',
      path: '/customers/:id',
      description: 'Retrieve a single customer by ID.',
      scopes: ['customers:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Customer ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/customers',
      description: 'Create a new customer. name is required.',
      scopes: ['customers:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Company/organisation name', in: 'body' },
        { name: 'email', type: 'string', required: false, description: 'Primary email', in: 'body' },
        { name: 'phone', type: 'string', required: false, description: 'Primary phone', in: 'body' },
        { name: 'industry', type: 'string', required: false, description: 'Industry sector', in: 'body' },
        { name: 'website', type: 'string', required: false, description: 'Website URL', in: 'body' },
        { name: 'tags', type: 'object[]', required: false, description: 'Tags. Each tag is {name: string, color?: string} (hex color, default "#3b82f6"). Plain strings are also accepted and auto-converted. Example: [{"name":"enterprise","color":"#8b5cf6"}]', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Notes', in: 'body' },
        { name: 'metadata', type: 'object', required: false, description: 'Custom field values as { field_id: value } pairs.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/customers" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "Acme Corp", "email": "info@acme.com" }'`,
    },
    {
      method: 'PATCH',
      path: '/customers/:id',
      description: 'Update an existing customer. Only include fields you want to change.',
      scopes: ['customers:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Customer ID', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'Company/organisation name', in: 'body' },
        { name: 'email', type: 'string', required: false, description: 'Primary email', in: 'body' },
        { name: 'phone', type: 'string', required: false, description: 'Primary phone', in: 'body' },
        { name: 'industry', type: 'string', required: false, description: 'Industry sector', in: 'body' },
        { name: 'website', type: 'string', required: false, description: 'Website URL', in: 'body' },
        { name: 'tags', type: 'object[]', required: false, description: 'Tags. Each tag is {name: string, color?: string}. Plain strings are also accepted. Replaces entire tags array.', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Notes', in: 'body' },
        { name: 'metadata', type: 'object', required: false, description: 'Custom field values as { field_id: value } pairs. Replaces entire metadata object.', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/customers/:id',
      description: 'Delete a customer.',
      scopes: ['customers:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Customer ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/customers/search',
      description: 'Search customers by name, email, or phone.',
      scopes: ['customers:read'],
      isWrite: false,
      params: [
        { name: 'query', type: 'string', required: true, description: 'Search query', in: 'body' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100)', in: 'body' },
      ],
    },
    {
      method: 'GET',
      path: '/customers/:id/contacts',
      description: 'List all contacts linked to this customer.',
      scopes: ['customers:read', 'contacts:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Customer ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/customers/:id/deals',
      description: 'List all deals for this customer.',
      scopes: ['customers:read', 'deals:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Customer ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/customers/:id/activities',
      description: 'List all activities for this customer.',
      scopes: ['customers:read', 'activities:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Customer ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/customers/bulk-delete',
      description: 'Permanently delete up to 100 customers/accounts in a single request. Returns a count of deleted records. Cannot be undone.',
      scopes: ['customers:delete'],
      isWrite: true,
      params: [
        { name: 'ids', type: 'uuid[]', required: true, description: 'Array of customer UUIDs to delete (max 100)', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/customers/bulk-delete" \\
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
