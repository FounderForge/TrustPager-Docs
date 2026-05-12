import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// CONTACTS (11 endpoints)
// =============================================================================

export const CONTACTS: ResourceGroup = {
  id: 'contacts',
  label: 'Contacts',
  description: 'Manage individual contacts (people) in the CRM. Supports search, filtering, sub-resources (opportunities, activities, employers), and AI enrichment.',
  endpoints: [
    {
      method: 'GET',
      path: '/contacts',
      description: 'List all contacts with cursor-based pagination. Supports search, source filter, and date range. Note: contacts do not have tags -- tags live on opportunities only.',
      scopes: ['contacts:read'],
      isWrite: false,
      params: [
        { name: 'search', type: 'string', required: false, description: 'Search by first_name, last_name, email, phone (mobile), or landline', in: 'query' },
        { name: 'source', type: 'string', required: false, description: 'Filter by lead source', in: 'query' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Filter contacts linked to a specific company / account (param name preserved for backward compatibility)', in: 'query' },
        { name: 'created_after', type: 'string', required: false, description: 'ISO date, return contacts created after this date', in: 'query' },
        { name: 'created_before', type: 'string', required: false, description: 'ISO date, return contacts created before this date', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results per page (1-100, default 25)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
        { name: 'fields', type: 'string', required: false, description: 'Comma-separated list of fields to return', in: 'query' },
        { name: 'expand', type: 'string', required: false, description: 'Comma-separated expansions: employers', in: 'query' },
        { name: 'email_unsubscribed', type: 'boolean', required: false, description: 'Filter to contacts who have opted out of email. true = opted out only, false = opted in only. Omit for all contacts.', in: 'query' },
        { name: 'sms_unsubscribed', type: 'boolean', required: false, description: 'Filter to contacts who have opted out of SMS. true = opted out only, false = opted in only. Omit for all contacts.', in: 'query' },
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
      "landline": "+61299991234",
      "date_of_birth": "1985-06-15",
      "job_title": "Director",
      "source": "website",
      "email_unsubscribed": false,
      "sms_unsubscribed": false,
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
    "landline": "+61299991234",
    "date_of_birth": "1985-06-15",
    "job_title": "Director",
    "source": "website",
    "email_unsubscribed": false,
    "sms_unsubscribed": false,
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-03-20T14:00:00Z"
  },
  "meta": { "credits_remaining": 9500 }
}`,
    },
    {
      method: 'POST',
      path: '/contacts',
      description: 'Create a new contact. first_name is required; last_name is optional. Contacts without a last name render cleanly in automation templates via {{contact.display_name}} and {{contact.greeting}}. Empty or whitespace-only last_name values are stored as NULL. Set skip_automations: true to suppress the contact_created trigger -- recommended for historical imports.',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'first_name', type: 'string', required: true, description: 'Contact first name. Trimmed on save.', in: 'body' },
        { name: 'last_name', type: 'string', required: false, description: 'Contact last name (optional). Empty or whitespace-only values are stored as NULL. In merge templates, prefer {{contact.display_name}} (falls back to first name when no last name) and {{contact.greeting}} ("Hi Paul" or "Hi there") over raw {{contact.last_name}}.', in: 'body' },
        { name: 'email', type: 'string', required: false, description: 'Email address', in: 'body' },
        { name: 'phone', type: 'string', required: false, description: 'Mobile number in E.164 format (e.g. +61412345678). MUST be a mobile number -- landlines will be rejected with a 400 error. Use the landline field for fixed-line numbers.', in: 'body' },
        { name: 'landline', type: 'string', required: false, description: 'Landline/fixed-line number in E.164 format (e.g. +61299991234)', in: 'body' },
        { name: 'date_of_birth', type: 'string', required: false, description: 'Date of birth in YYYY-MM-DD format (e.g. 1990-03-26). Used by the birthday messaging cron to send automated birthday emails/SMS.', in: 'body' },
        { name: 'job_title', type: 'string', required: false, description: 'Job title', in: 'body' },
        { name: 'source', type: 'string', required: false, description: 'Lead source (e.g. website, referral, api)', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Free-text notes', in: 'body' },
        { name: 'metadata', type: 'object', required: false, description: 'Custom field values as { field_id: value } pairs. Use GET /crm-settings to discover available custom fields. Reserved key: "quick_links" stores per-contact Quick Link URLs as { <type-uuid>: <url> } -- define types via PATCH /company/crm-settings. UUID-shaped keys at metadata root are rejected (400) -- Quick Link URLs must be nested under metadata.quick_links.', in: 'body' },
        { name: 'address_line1', type: 'string', required: false, description: 'Street address line 1', in: 'body' },
        { name: 'city', type: 'string', required: false, description: 'City', in: 'body' },
        { name: 'state', type: 'string', required: false, description: 'State/province', in: 'body' },
        { name: 'postal_code', type: 'string', required: false, description: 'Postal/zip code', in: 'body' },
        { name: 'country', type: 'string', required: false, description: 'Country (default: Australia)', in: 'body' },
        { name: 'skip_automations', type: 'boolean', required: false, description: 'Set true to suppress the contact_created trigger. Use for historical imports. Default false.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/contacts" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "first_name": "Paul",
    "email": "paul@example.com",
    "phone": "+61412345678",
    "source": "api"
  }'`,
      responseExample: `{
  "data": {
    "id": "new-uuid-...",
    "public_id": "C-002",
    "first_name": "Paul",
    "last_name": null,
    "email": "paul@example.com",
    "phone": "+61412345678",
    "landline": null,
    "job_title": null,
    "source": "api",
    "created_at": "2026-04-20T08:00:00Z",
    "updated_at": "2026-04-20T08:00:00Z"
  },
  "meta": { "credits_remaining": 9499 }
}`,
    },
    {
      method: 'PATCH',
      path: '/contacts/:id',
      description: 'Update an existing contact. Only include fields you want to change. Every successful PATCH emits a field-level audit row to crm_field_change_log (viewable at /data/crm-logs with the crm_audit:read scope).',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
        { name: 'first_name', type: 'string', required: false, description: 'First name. Trimmed on save.', in: 'body' },
        { name: 'last_name', type: 'string', required: false, description: 'Last name. Send "" or null to clear a previously set surname -- empty/whitespace values are stored as NULL.', in: 'body' },
        { name: 'email', type: 'string', required: false, description: 'Email', in: 'body' },
        { name: 'phone', type: 'string', required: false, description: 'Mobile number in E.164 format. Landlines will be rejected -- use the landline field.', in: 'body' },
        { name: 'landline', type: 'string', required: false, description: 'Landline/fixed-line number in E.164 format. Set to null to clear.', in: 'body' },
        { name: 'date_of_birth', type: 'string', required: false, description: 'Date of birth in YYYY-MM-DD format. Set to null to clear.', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Notes', in: 'body' },
        { name: 'metadata', type: 'object', required: false, description: 'Custom field values as { field_id: value } pairs. Replaces entire metadata object -- read first with GET /contacts/:id and merge locally. Reserved key: "quick_links" stores per-contact Quick Link URLs as { <type-uuid>: <url> }. UUID-shaped keys at metadata root are rejected (400).', in: 'body' },
        { name: 'email_unsubscribed', type: 'boolean', required: false, description: 'Set true to mark contact as opted out of email. Set false to re-subscribe. This flag is also updated automatically on hard bounce, spam complaint, or unsubscribe link click.', in: 'body' },
        { name: 'sms_unsubscribed', type: 'boolean', required: false, description: 'Set true to mark contact as opted out of SMS. Set false to re-subscribe. This flag is also updated automatically when the contact texts STOP (opt out) or START (opt in).', in: 'body' },
      ],
      requestExample: `curl -X PATCH \\
  "${API_BASE_URL}/contacts/a1b2c3d4-..." \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "sms_unsubscribed": false }'`,
      responseExample: `{
  "data": {
    "id": "a1b2c3d4-...",
    "first_name": "John",
    "last_name": "Smith",
    "email": "john@example.com",
    "phone": "+61412345678",
    "email_unsubscribed": false,
    "sms_unsubscribed": false,
    "updated_at": "2026-04-27T12:00:00Z"
  },
  "meta": { "credits_remaining": 9498 }
}`,
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
      path: '/contacts/:id/opportunities',
      description: 'List all opportunities associated with a contact. Legacy alias: GET /contacts/:id/deals.',
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
      description: 'List company / account links for this contact.',
      scopes: ['contacts:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/contacts/:id/employers/:customerId',
      description: 'Link a contact to a company / account (employer relationship). Path param name preserved for backward compatibility.',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
        { name: 'customerId', type: 'uuid', required: true, description: 'Company ID to link', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/contacts/:id/employers/:customerId',
      description: 'Remove an employer link between a contact and a company. Path param name preserved for backward compatibility.',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
        { name: 'customerId', type: 'uuid', required: true, description: 'Company ID to unlink', in: 'path' },
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
      path: '/contacts/bulk-create',
      description: 'Create up to 100 contacts in a single request. Built for historical migrations and bulk imports. Each record accepts the same fields as POST /contacts (first_name required). Set skip_automations: true to suppress contact_created triggers across all records. Returns a created array and an errors array.',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'records', type: 'object[]', required: true, description: 'Array of contact objects (max 100). Each requires first_name plus any optional contact fields (last_name, email, phone, landline, job_title, notes, metadata, source, date_of_birth, etc.).', in: 'body' },
        { name: 'skip_automations', type: 'boolean', required: false, description: 'Set true to suppress contact_created triggers across all records. Strongly recommended for historical imports.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/contacts/bulk-create" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "skip_automations": true,
    "records": [
      { "first_name": "Alice", "last_name": "Smith", "email": "alice@example.com" },
      { "first_name": "Bob", "last_name": "Jones", "phone": "+61412345678" }
    ]
  }'`,
      responseExample: `{
  "data": {
    "created": [
      { "index": 0, "id": "contact-uuid-1", "first_name": "Alice", ... },
      { "index": 1, "id": "contact-uuid-2", "first_name": "Bob", ... }
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
      path: '/contacts/voice/unsubscribe',
      description: 'Voice-agent unsubscribe endpoint. Returns text/plain. Called by a Retell voice agent when a caller asks to opt out. Resolves the caller by phone number (from args.phone in the Retell call envelope, with fallback to from_number for inbound or to_number for outbound calls). Unsubscribes ALL contacts in the workspace that share the phone number (Spam Act compliance -- up to 20 matched contacts). Sets email_unsubscribed and sms_unsubscribed to true on each matched contact. Returns a plain-text confirmation string the agent reads aloud. On error the response body begins with "UNSUBSCRIBE NOT COMPLETED -- DO NOT TELL THE CALLER THEY HAVE BEEN REMOVED" so the agent script can instruct the agent to handle the failure gracefully without misleading the caller.',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'phone', type: 'string', required: false, description: 'Caller phone in E.164 or local format. If omitted, resolves from the Retell call envelope (from_number for inbound, to_number for outbound). Provide explicitly when testing outside a live Retell call.', in: 'body' },
        { name: 'reason', type: 'string', required: false, description: 'Optional reason for the unsubscribe (e.g. "caller requested via voice agent"). Stored as a note on the contact.', in: 'body' },
      ],
      requestExample: `# Retell sends the full call envelope. The args wrapper is required.
curl -X POST \\
  "${API_BASE_URL}/contacts/voice/unsubscribe" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "call": { "from_number": "+61412345678" },
    "name": "unsubscribe_caller",
    "args": {
      "reason": "caller requested via voice agent"
    }
  }'`,
      responseExample: `Done! You have been removed from our contact list and will no longer receive calls, SMS, or emails from us.`,
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
