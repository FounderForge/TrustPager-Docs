import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// EVENT QUEUES
// =============================================================================

export const EVENT_QUEUES: ResourceGroup = {
  id: 'event-queues',
  label: 'Event Queues',
  description: 'Manage event queues for sequenced multi-step workflows (drip campaigns, follow-up sequences).',
  endpoints: [
    { method: 'GET', path: '/event-queues', description: 'List all event queues.', scopes: ['automations:read'], isWrite: false },
    { method: 'GET', path: '/event-queues/:id', description: 'Retrieve an event queue with its steps.', scopes: ['automations:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Event queue ID', in: 'path' }] },
    { method: 'POST', path: '/event-queues', description: 'Create an event queue.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Queue name', in: 'body' }] },
    { method: 'PATCH', path: '/event-queues/:id', description: 'Update an event queue.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Event queue ID', in: 'path' }] },
    { method: 'DELETE', path: '/event-queues/:id', description: 'Delete an event queue.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Event queue ID', in: 'path' }] },
    { method: 'POST', path: '/event-queues/:id/steps', description: 'Add a step to an event queue.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Event queue ID', in: 'path' }] },
    { method: 'PATCH', path: '/event-queues/:id/steps/:stepId', description: 'Update an event queue step.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Event queue ID', in: 'path' }, { name: 'stepId', type: 'uuid', required: true, description: 'Step ID', in: 'path' }] },
    { method: 'DELETE', path: '/event-queues/:id/steps/:stepId', description: 'Delete an event queue step.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Event queue ID', in: 'path' }, { name: 'stepId', type: 'uuid', required: true, description: 'Step ID', in: 'path' }] },
    {
      method: 'GET',
      path: '/event-queues/:id/enrollments',
      description: 'List enrollment timer tasks for an event queue. Shows all scheduled step executions with their status, scheduled_for time, enrollment_time (the anchor time used for delay calculation when set via attach_to_event_queue action config), and linked CRM entity IDs (contact, customer, deal). Supports optional status filter and cursor pagination.',
      scopes: ['automations:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Event queue ID', in: 'path' },
        { name: 'status', type: 'string', required: false, description: 'Filter by status: pending, processing, completed, cancelled, failed', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results per page (1-100, default 25)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/event-queues/QUEUE_ID/enrollments?status=pending&limit=10" \\
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
  ],
};
