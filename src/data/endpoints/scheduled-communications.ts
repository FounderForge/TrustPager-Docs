import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// SCHEDULED COMMUNICATIONS (Communications Dispatcher)
// =============================================================================

export const SCHEDULED_COMMUNICATIONS: ResourceGroup = {
  id: 'scheduled-communications',
  label: 'Scheduled Communications',
  description: 'Queue deferred emails, SMS, and AI voice calls for future dispatch. The communications_scheduler_tick cron (runs every minute) claims pending rows, enforces business-hours windows, retries with exponential backoff, and dispatches via the automation pipeline. Row lifecycle: pending -> dispatching -> dispatched | failed | cancelled | skipped.',
  endpoints: [
    {
      method: 'GET',
      path: '/scheduled-communications',
      description: 'List all scheduled communications for the company. Supports filtering by status, channel, and linked entity (contact, deal, customer). Paginated via cursor.',
      scopes: ['dispatcher:read'],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'Filter by lifecycle status: pending, dispatching, dispatched, failed, cancelled, skipped', in: 'query' },
        { name: 'channel', type: 'string', required: false, description: 'Filter by channel: email, sms, voice_call', in: 'query' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Filter by linked contact UUID', in: 'query' },
        { name: 'deal_id', type: 'uuid', required: false, description: 'Filter by linked deal/opportunity UUID', in: 'query' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Filter by linked customer/account UUID', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100, default 25)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for pagination', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/scheduled-communications?status=pending&channel=email&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "60b5889e-c8e1-4273-836e-67a3f0b3231a",
      "company_id": "ebeff86e-7b09-4e49-96db-f711d69d2d57",
      "channel": "email",
      "status": "pending",
      "scheduled_for": "2026-05-01T09:00:00+00:00",
      "timezone": "Australia/Sydney",
      "respect_business_hours": true,
      "payload": {
        "to_email": "client@example.com",
        "subject": "Follow-up from our call",
        "html_body": "<p>Hi Sarah, ...</p>"
      },
      "contact_id": "abc123...",
      "deal_id": null,
      "customer_id": null,
      "attempt_count": 0,
      "last_attempt_at": null,
      "last_error": null,
      "dispatched_at": null,
      "dispatched_external_id": null,
      "source": "api",
      "created_at": "2026-04-23T15:00:00Z",
      "updated_at": "2026-04-23T15:00:00Z"
    }
  ],
  "pagination": { "limit": 10, "has_more": false, "next_cursor": null, "prev_cursor": null },
  "meta": { "credits_remaining": 50000, "url": "https://app.trustpager.com/inbox/dispatcher" }
}`,
    },
    {
      method: 'POST',
      path: '/scheduled-communications',
      description: 'Schedule a future email, SMS, or AI voice call. Requires dispatcher:write PLUS a channel-specific scope (email:send, sms:send, or calls:initiate). The row is created with status="pending". The scheduler tick picks it up at or after scheduled_for. If respect_business_hours=true, the scheduler holds the row outside of the configured business window and re-schedules to the next window start in the callee\'s timezone.',
      scopes: ['dispatcher:write', 'email:send | sms:send | calls:initiate'],
      isWrite: true,
      params: [
        { name: 'channel', type: 'string', required: true, description: 'Channel: email, sms, or voice_call', in: 'body' },
        { name: 'scheduled_for', type: 'string', required: true, description: 'ISO 8601 dispatch time. Must not be more than 1 minute in the past.', in: 'body' },
        { name: 'payload', type: 'object', required: true, description: 'Channel-specific payload. email: {to_email, subject, html_body, [from_email, sender_user_id, mode, contact_id, deal_id, customer_id, cc, to_name]}. sms: {phone_number_id, to_number, message_body}. voice_call: {voice_agent_outbound_config_id, to_number, [dynamic_variables, metadata, follow_ups]}. The follow_ups object enables multi-attempt voice cadence: {max_attempts (integer, total including first), follow_up_delays (array of hours between each retry -- decimal allowed, e.g. 0.5 for 30 min), voice_agent_outbound_config_id (uuid), to_number (E.164), [respect_business_hours, dynamic_variables, contact_id, customer_id, deal_id]}.', in: 'body' },
        { name: 'timezone', type: 'string', required: false, description: 'IANA timezone for business-hours evaluation (e.g. "Australia/Sydney"). Falls back to company default if omitted.', in: 'body' },
        { name: 'respect_business_hours', type: 'boolean', required: false, description: 'If true, hold delivery until callee is within business hours. Default false.', in: 'body' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Link to a contact UUID for timeline logging', in: 'body' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Link to a customer/account UUID', in: 'body' },
        { name: 'deal_id', type: 'uuid', required: false, description: 'Link to a deal/opportunity UUID for timeline logging', in: 'body' },
        { name: 'related_entity_type', type: 'string', required: false, description: 'Generic entity type for additional context linkage', in: 'body' },
        { name: 'related_entity_id', type: 'uuid', required: false, description: 'Generic entity ID for additional context linkage', in: 'body' },
        { name: 'cancel_policy', type: 'object', required: false, description: 'Optional cancellation policy configuration (jsonb)', in: 'body' },
      ],
      requestExample: `# Schedule an email for tomorrow morning (business hours enforced)
curl -X POST \\
  "${API_BASE_URL}/scheduled-communications" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "email",
    "scheduled_for": "2026-05-01T09:00:00Z",
    "timezone": "Australia/Sydney",
    "respect_business_hours": true,
    "payload": {
      "to_email": "client@example.com",
      "subject": "Following up on your quote",
      "html_body": "<p>Hi Sarah, just checking in...</p>",
      "contact_id": "abc123..."
    },
    "contact_id": "abc123..."
  }'

# Schedule an AI voice call for next week
curl -X POST \\
  "${API_BASE_URL}/scheduled-communications" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "voice_call",
    "scheduled_for": "2026-05-05T10:00:00Z",
    "timezone": "Australia/Brisbane",
    "respect_business_hours": true,
    "payload": {
      "voice_agent_outbound_config_id": "config-uuid...",
      "to_number": "+61412345678",
      "dynamic_variables": { "contact_name": "Sarah", "deal_name": "Website Project" }
    }
  }'

# Schedule a voice call with multi-attempt cadence (3 attempts: now, +2h, +24h)
curl -X POST \\
  "${API_BASE_URL}/scheduled-communications" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "voice_call",
    "scheduled_for": "2026-05-05T10:00:00Z",
    "timezone": "Australia/Brisbane",
    "respect_business_hours": true,
    "contact_id": "contact-uuid...",
    "payload": {
      "voice_agent_outbound_config_id": "config-uuid...",
      "to_number": "+61412345678",
      "dynamic_variables": { "contact_name": "Sarah" },
      "follow_ups": {
        "max_attempts": 3,
        "follow_up_delays": [2, 24],
        "voice_agent_outbound_config_id": "config-uuid...",
        "to_number": "+61412345678",
        "respect_business_hours": true,
        "contact_id": "contact-uuid..."
      }
    }
  }'`,
      responseExample: `{
  "data": {
    "id": "60b5889e-c8e1-4273-836e-67a3f0b3231a",
    "channel": "email",
    "status": "pending",
    "scheduled_for": "2026-05-01T09:00:00+00:00",
    "timezone": "Australia/Sydney",
    "respect_business_hours": true,
    "payload": { "to_email": "client@example.com", "subject": "Following up on your quote", "html_body": "..." },
    "contact_id": "abc123...",
    "attempt_count": 0,
    "source": "api",
    "created_at": "2026-04-23T15:00:00Z"
  },
  "meta": { "credits_remaining": 49999 }
}`,
      notes: [
        'Scheduling email requires dispatcher:write AND email:send scopes.',
        'Scheduling SMS requires dispatcher:write AND sms:send scopes.',
        'Scheduling a voice call requires dispatcher:write AND calls:initiate scopes.',
        'When respect_business_hours=true, the scheduler defers rows outside Mon-Fri 9-5 in the callee\'s timezone (configurable per company).',
        'The scheduler tick runs every minute. Expect up to 1 minute of latency after scheduled_for.',
        'Rows retry with exponential backoff: email/SMS up to 3 attempts, voice_call up to 2.',
        'Voice cadence (multi-attempt): include a follow_ups object in the voice_call payload to automatically schedule retries. follow_up_delays is an array of hours between each attempt (supports decimals: 0.5 = 30 min). The cadence stops early if the call connects and the contact speaks for 10+ seconds (real conversation detected). Retries are queued as new pending rows in the dispatcher.',
      ],
    },
    {
      method: 'GET',
      path: '/scheduled-communications/:id',
      description: 'Retrieve a single scheduled communication by ID with full status, payload, and dispatch result (dispatched_external_id, dispatched_at, attempt_count, last_error).',
      scopes: ['dispatcher:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Scheduled communication UUID', in: 'path' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/scheduled-communications/60b5889e-c8e1-4273-836e-67a3f0b3231a" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": {
    "id": "60b5889e-c8e1-4273-836e-67a3f0b3231a",
    "channel": "voice_call",
    "status": "dispatched",
    "scheduled_for": "2026-04-24T08:00:00+00:00",
    "timezone": "Australia/Sydney",
    "respect_business_hours": true,
    "payload": { "voice_agent_outbound_config_id": "...", "to_number": "+61412345678" },
    "attempt_count": 1,
    "dispatched_at": "2026-04-24T08:00:47Z",
    "dispatched_external_id": "call_abc123",
    "last_error": null,
    "source": "api"
  }
}`,
    },
    {
      method: 'PATCH',
      path: '/scheduled-communications/:id',
      description: 'Update a pending scheduled communication. Only rows with status="pending" can be modified. Editable fields: scheduled_for, timezone, respect_business_hours, payload, cancel_policy. Returns a validation error if the row is not pending.',
      scopes: ['dispatcher:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Scheduled communication UUID', in: 'path' },
        { name: 'scheduled_for', type: 'string', required: false, description: 'New ISO 8601 dispatch time', in: 'body' },
        { name: 'timezone', type: 'string', required: false, description: 'IANA timezone override', in: 'body' },
        { name: 'respect_business_hours', type: 'boolean', required: false, description: 'Toggle business-hours enforcement', in: 'body' },
        { name: 'payload', type: 'object', required: false, description: 'Replacement payload (must still satisfy channel required fields)', in: 'body' },
        { name: 'cancel_policy', type: 'object', required: false, description: 'Replacement cancel policy', in: 'body' },
      ],
      requestExample: `curl -X PATCH \\
  "${API_BASE_URL}/scheduled-communications/60b5889e-c8e1-4273-836e-67a3f0b3231a" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"scheduled_for": "2026-05-02T09:00:00Z", "respect_business_hours": false}'`,
      responseExample: `{
  "data": {
    "id": "60b5889e-c8e1-4273-836e-67a3f0b3231a",
    "status": "pending",
    "scheduled_for": "2026-05-02T09:00:00+00:00",
    "respect_business_hours": false,
    "updated_at": "2026-04-23T16:00:00Z"
  }
}`,
    },
    {
      method: 'DELETE',
      path: '/scheduled-communications/:id',
      description: 'Soft-cancel a pending scheduled communication. Sets status to "cancelled". The row is retained for audit. Returns 204 No Content on success. Returns a validation error if the row is not pending.',
      scopes: ['dispatcher:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Scheduled communication UUID to cancel', in: 'path' },
      ],
      requestExample: `curl -X DELETE \\
  "${API_BASE_URL}/scheduled-communications/60b5889e-c8e1-4273-836e-67a3f0b3231a" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `HTTP 204 No Content`,
    },
    {
      method: 'POST',
      path: '/scheduled-communications/:id/dispatch-now',
      description: 'Flush a pending scheduled communication immediately. Sets scheduled_for to now and disables business-hours enforcement so the next scheduler tick (within 1 minute) picks it up. Only works on "pending" rows.',
      scopes: ['dispatcher:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Scheduled communication UUID to dispatch immediately', in: 'path' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/scheduled-communications/60b5889e-c8e1-4273-836e-67a3f0b3231a/dispatch-now" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": {
    "id": "60b5889e-c8e1-4273-836e-67a3f0b3231a",
    "status": "pending",
    "scheduled_for": "2026-04-23T16:05:12.431Z",
    "respect_business_hours": false,
    "updated_at": "2026-04-23T16:05:12Z"
  },
  "meta": { "credits_remaining": 49998 }
}`,
      notes: [
        'Status remains "pending" until the scheduler tick claims it (within 1 minute).',
        'business-hours enforcement is disabled -- the scheduler dispatches regardless of the callee\'s local time.',
      ],
    },
  ],
};
