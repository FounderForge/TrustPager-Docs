import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// CONTACTS (11 endpoints)
// =============================================================================

export const CONTACTS: ResourceGroup = {
  id: 'contacts',
  label: 'Contacts',
  description: 'Manage individual contacts (people) in the CRM. Supports search, filtering, sub-resources (deals, activities, employers), and AI enrichment.',
  endpoints: [
    {
      method: 'GET',
      path: '/contacts',
      description: 'List all contacts with cursor-based pagination. Supports search, source filter, tags filter, and date range.',
      scopes: ['contacts:read'],
      isWrite: false,
      params: [
        { name: 'search', type: 'string', required: false, description: 'Search by first_name, last_name, email, or phone', in: 'query' },
        { name: 'source', type: 'string', required: false, description: 'Filter by lead source', in: 'query' },
        { name: 'tags', type: 'string[]', required: false, description: 'Filter by tags (JSON array)', in: 'query' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Filter contacts linked to a specific customer', in: 'query' },
        { name: 'created_after', type: 'string', required: false, description: 'ISO date, return contacts created after this date', in: 'query' },
        { name: 'created_before', type: 'string', required: false, description: 'ISO date, return contacts created before this date', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results per page (1-100, default 25)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
        { name: 'fields', type: 'string', required: false, description: 'Comma-separated list of fields to return', in: 'query' },
        { name: 'expand', type: 'string', required: false, description: 'Comma-separated expansions: employers', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/contacts?search=John&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "a1b2c3d4-...",
      "public_id": "C-001",
      "first_name": "John",
      "last_name": "Smith",
      "email": "john@example.com",
      "phone": "+61412345678",
      "date_of_birth": "1985-06-15",
      "job_title": "Director",
      "source": "website",
      "tags": ["vip"],
      "created_at": "2026-01-15T10:30:00Z",
      "updated_at": "2026-03-20T14:00:00Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "has_more": true,
    "next_cursor": "a1b2c3d4-...",
    "prev_cursor": null
  },
  "meta": { "credits_remaining": 9500 }
}`,
    },
    {
      method: 'GET',
      path: '/contacts/:id',
      description: 'Retrieve a single contact by ID. Supports field selection and employer expansion.',
      scopes: ['contacts:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
        { name: 'fields', type: 'string', required: false, description: 'Comma-separated list of fields', in: 'query' },
        { name: 'expand', type: 'string', required: false, description: 'Comma-separated expansions: employers', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/contacts/a1b2c3d4-..." \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": {
    "id": "a1b2c3d4-...",
    "public_id": "C-001",
    "first_name": "John",
    "last_name": "Smith",
    "email": "john@example.com",
    "phone": "+61412345678",
    "date_of_birth": "1985-06-15",
    "job_title": "Director",
    "source": "website",
    "tags": ["vip"],
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-03-20T14:00:00Z"
  },
  "meta": { "credits_remaining": 9500 }
}`,
    },
    {
      method: 'POST',
      path: '/contacts',
      description: 'Create a new contact. first_name is required.',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'first_name', type: 'string', required: true, description: 'Contact first name', in: 'body' },
        { name: 'last_name', type: 'string', required: false, description: 'Contact last name', in: 'body' },
        { name: 'email', type: 'string', required: false, description: 'Email address', in: 'body' },
        { name: 'phone', type: 'string', required: false, description: 'Phone number (E.164 format preferred)', in: 'body' },
        { name: 'date_of_birth', type: 'string', required: false, description: 'Date of birth in YYYY-MM-DD format (e.g. 1990-03-26). Used by the birthday messaging cron to send automated birthday emails/SMS.', in: 'body' },
        { name: 'job_title', type: 'string', required: false, description: 'Job title', in: 'body' },
        { name: 'source', type: 'string', required: false, description: 'Lead source (e.g. website, referral, api)', in: 'body' },
        { name: 'tags', type: 'object[]', required: false, description: 'Tags. Each tag is {name: string, color?: string} (hex color, default "#3b82f6"). Plain strings are also accepted and auto-converted. Example: [{"name":"vip","color":"#ef4444"}]', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Free-text notes', in: 'body' },
        { name: 'metadata', type: 'object', required: false, description: 'Custom field values as { field_id: value } pairs. Use GET /crm-settings to discover available custom fields.', in: 'body' },
        { name: 'address_line1', type: 'string', required: false, description: 'Street address line 1', in: 'body' },
        { name: 'city', type: 'string', required: false, description: 'City', in: 'body' },
        { name: 'state', type: 'string', required: false, description: 'State/province', in: 'body' },
        { name: 'postal_code', type: 'string', required: false, description: 'Postal/zip code', in: 'body' },
        { name: 'country', type: 'string', required: false, description: 'Country (default: Australia)', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/contacts" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@example.com",
    "phone": "+61412345678",
    "source": "api",
    "tags": ["new-lead"]
  }'`,
      responseExample: `{
  "data": {
    "id": "new-uuid-...",
    "public_id": "C-002",
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@example.com",
    "phone": "+61412345678",
    "job_title": null,
    "source": "api",
    "tags": ["new-lead"],
    "created_at": "2026-03-23T10:00:00Z",
    "updated_at": "2026-03-23T10:00:00Z"
  },
  "meta": { "credits_remaining": 9499 }
}`,
    },
    {
      method: 'PATCH',
      path: '/contacts/:id',
      description: 'Update an existing contact. Only include fields you want to change.',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
        { name: 'first_name', type: 'string', required: false, description: 'First name', in: 'body' },
        { name: 'last_name', type: 'string', required: false, description: 'Last name', in: 'body' },
        { name: 'email', type: 'string', required: false, description: 'Email', in: 'body' },
        { name: 'phone', type: 'string', required: false, description: 'Phone', in: 'body' },
        { name: 'date_of_birth', type: 'string', required: false, description: 'Date of birth in YYYY-MM-DD format. Set to null to clear.', in: 'body' },
        { name: 'tags', type: 'object[]', required: false, description: 'Tags. Each tag is {name: string, color?: string}. Plain strings are also accepted. Replaces entire tags array.', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Notes', in: 'body' },
        { name: 'metadata', type: 'object', required: false, description: 'Custom field values as { field_id: value } pairs. Replaces entire metadata object.', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/contacts/:id',
      description: 'Delete a contact. Returns 204 No Content on success.',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/contacts/search',
      description: 'Full-text search across contact names, email, and phone. Returns up to 100 results.',
      scopes: ['contacts:read'],
      isWrite: false,
      params: [
        { name: 'query', type: 'string', required: true, description: 'Search query', in: 'body' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100, default 25)', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/contacts/search" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "query": "john", "limit": 10 }'`,
    },
    {
      method: 'GET',
      path: '/contacts/:id/deals',
      description: 'List all deals associated with a contact.',
      scopes: ['contacts:read', 'deals:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
      ],
    },
    {
      method: 'GET',
      path: '/contacts/:id/activities',
      description: 'List all activities (calls, meetings, notes) for a contact.',
      scopes: ['contacts:read', 'activities:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
      ],
    },
    {
      method: 'GET',
      path: '/contacts/:id/employers',
      description: 'List customer (company) links for this contact.',
      scopes: ['contacts:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/contacts/:id/employers/:customerId',
      description: 'Link a contact to a customer (employer relationship).',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
        { name: 'customerId', type: 'uuid', required: true, description: 'Customer ID to link', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/contacts/:id/employers/:customerId',
      description: 'Remove an employer link between a contact and customer.',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
        { name: 'customerId', type: 'uuid', required: true, description: 'Customer ID to unlink', in: 'path' },
      ],
    },
    {
      method: 'GET',
      path: '/contacts/:id/birthday-sends',
      description: 'Get birthday message send history for a contact. Returns all years birthday emails/SMS were sent, the channels used, and the send date. Useful for auditing birthday message delivery.',
      scopes: ['contacts:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
      ],
      responseExample: `{
  "data": [
    {
      "id": "uuid-...",
      "year_number": 1,
      "birthday_date": "2026-03-26",
      "channels_sent": ["email", "sms"],
      "sent_at": "2026-03-26T06:00:00Z"
    }
  ],
  "meta": { "credits_remaining": 9490 }
}`,
    },
    {
      method: 'POST',
      path: '/contacts/bulk-delete',
      description: 'Permanently delete up to 100 contacts in a single request. Returns a count of deleted records. Cannot be undone.',
      scopes: ['contacts:delete'],
      isWrite: true,
      params: [
        { name: 'ids', type: 'uuid[]', required: true, description: 'Array of contact UUIDs to delete (max 100)', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/contacts/bulk-delete" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"ids":["uuid-1","uuid-2","uuid-3"]}'`,
      responseExample: `{
  "data": { "success": true, "deleted": 3 },
  "meta": { "credits_remaining": 9450 }
}`,
    },
  ],
};
