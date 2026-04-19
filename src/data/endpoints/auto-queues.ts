import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// AUTO QUEUES (formerly Event Queues)
// Legacy alias: /api/event-queues still works and routes to the same handler.
// =============================================================================

export const AUTO_QUEUES: ResourceGroup = {
  id: 'auto-queues',
  label: 'Auto Queues',
  description: 'Manage Auto Queues for sequenced multi-step workflows (drip campaigns, follow-up sequences). Legacy path /event-queues is also accepted.',
  endpoints: [
    { method: 'GET', path: '/auto-queues', description: 'List all auto queues.', scopes: ['automations:read'], isWrite: false },
    { method: 'GET', path: '/auto-queues/:id', description: 'Retrieve an auto queue with its steps.', scopes: ['automations:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Auto queue ID', in: 'path' }] },
    { method: 'POST', path: '/auto-queues', description: 'Create an auto queue.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Queue name', in: 'body' }] },
    { method: 'PATCH', path: '/auto-queues/:id', description: 'Update an auto queue.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Auto queue ID', in: 'path' }] },
    { method: 'DELETE', path: '/auto-queues/:id', description: 'Delete an auto queue.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Auto queue ID', in: 'path' }] },
    { method: 'POST', path: '/auto-queues/:id/steps', description: 'Add a step to an auto queue.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Auto queue ID', in: 'path' }] },
    { method: 'PATCH', path: '/auto-queues/:id/steps/:stepId', description: 'Update an auto queue step.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Auto queue ID', in: 'path' }, { name: 'stepId', type: 'uuid', required: true, description: 'Step ID', in: 'path' }] },
    { method: 'DELETE', path: '/auto-queues/:id/steps/:stepId', description: 'Delete an auto queue step.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Auto queue ID', in: 'path' }, { name: 'stepId', type: 'uuid', required: true, description: 'Step ID', in: 'path' }] },
    {
      method: 'GET',
      path: '/auto-queues/:id/enrollments',
      description: 'List enrollment timer tasks for an auto queue. Shows all scheduled step executions with their status, scheduled_for time, enrollment_time (the anchor time used for delay calculation when set via attach_to_event_queue action config), and linked CRM entity IDs (contact, customer, deal). Supports optional status filter and cursor pagination.',
      scopes: ['automations:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Auto queue ID', in: 'path' },
        { name: 'status', type: 'string', required: false, description: 'Filter by status: pending, processing, completed, cancelled, failed', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results per page (1-100, default 25)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/auto-queues/QUEUE_ID/enrollments?status=pending&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "a1b2c3d4-...",
      "automation_id": "b2c3d4e5-...",
      "task_type": "event_queue_step",
      "scheduled_for": "2026-03-25T10:00:00Z",
      "status": "pending",
      "enrollment_id": "c3d4e5f6-...",
      "enrollment_time": "2026-03-22T10:00:00Z",
      "event_queue_step_id": "d4e5f6a7-...",
      "related_contact_id": "e5f6a7b8-...",
      "related_customer_id": null,
      "related_deal_id": null,
      "cancel_group": "enroll-uuid",
      "retry_count": 0,
      "last_error": null,
      "created_at": "2026-03-22T09:55:00Z",
      "updated_at": "2026-03-22T09:55:00Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "has_more": false,
    "next_cursor": null,
    "prev_cursor": null
  },
  "meta": { "credits_remaining": 9490 }
}`,
    },
    {
      method: 'POST',
      path: '/auto-queues/:id/bulk-enroll',
      description: `Enrol contacts into an auto queue in bulk. Requires EXACTLY ONE of three mutually exclusive targeting modes:

- contact_ids -- explicit list of contact UUIDs (max 500)
- contact_filter -- filter by contact-level fields (individual-person fields: contact_type, source, email, first_name, last_name, job_title, city, state, country)
- customer_filter -- filter by company/customer-level fields (account_type, industry, is_customer, is_supplier, city, state, country) -- resolves to all contacts linked to matching customers

ENTITY AXIS DISTINCTION: contact_type lives on crm_contacts (use contact_filter). account_type lives on crm_customers (use customer_filter). opportunity_type lives on crm_deals (not filterable here -- use automations with deal triggers instead).

Idempotent by default: contacts already enrolled with a pending step are skipped (set skip_if_already_enrolled: false to override). Capped at 500 contacts per call; if the filter would match more, has_more: true is returned and you should call again to page through.`,
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Auto queue ID', in: 'path' },
        { name: 'contact_ids', type: 'string[]', required: false, description: 'Explicit list of contact UUIDs (max 500). Mutually exclusive with contact_filter and customer_filter.', in: 'body' },
        { name: 'contact_filter', type: 'object', required: false, description: 'Filter by contact-level fields. Supported: contact_type, source, email, first_name, last_name, job_title, city, state, country. Values can be a single value or an array (IN). Example: { "contact_type": ["Referrer", "Lawyer"] }', in: 'body' },
        { name: 'customer_filter', type: 'object', required: false, description: 'Filter by customer/company-level fields -- resolves to all contacts linked to matching customers. Supported: account_type, industry, is_customer, is_supplier, city, state, country. Example: { "account_type": "Accounting Firm" }', in: 'body' },
        { name: 'enrollment_time', type: 'string', required: false, description: 'ISO timestamp to use as the anchor for step delay calculations (default: now). Useful for backdating enrolments.', in: 'body' },
        { name: 'skip_if_already_enrolled', type: 'boolean', required: false, description: 'Default true. When true, contacts that already have a pending enrolment in this queue are skipped. Set false to force re-enrolment.', in: 'body' },
      ],
      requestExample: `# Enrol by contact_type (contact-level field)
curl -X POST \\
  "${API_BASE_URL}/auto-queues/QUEUE_ID/bulk-enroll" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contact_filter": { "contact_type": ["Referrer", "Lawyer"] }
  }'

# Enrol all contacts linked to accounting firms (customer-level field)
curl -X POST \\
  "${API_BASE_URL}/auto-queues/QUEUE_ID/bulk-enroll" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_filter": { "account_type": "Accounting Firm", "is_customer": true }
  }'`,
      responseExample: `{
  "data": {
    "enrolled": 47,
    "skipped": 3,
    "failed": 0,
    "enrollment_ids": ["uuid1", "uuid2", "..."],
    "has_more": false
  },
  "meta": { "credits_remaining": 9440, "url": "https://app.trustpager.com/auto/queues/QUEUE_ID" }
}`,
    },
  ],
};
