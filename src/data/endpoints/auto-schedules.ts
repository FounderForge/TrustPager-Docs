import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// AUTO SCHEDULES (formerly Event Schedules)
// Legacy alias: /api/event-schedules still works and routes to the same handler.
// =============================================================================

export const AUTO_SCHEDULES: ResourceGroup = {
  id: 'auto-schedules',
  label: 'Auto Schedules',
  description: 'Create clock-driven automation schedules that fire on a cron expression, fan out to a resolved audience, and trigger one automation run per row. Legacy path /event-schedules is also accepted.',
  endpoints: [
    {
      method: 'GET',
      path: '/auto-schedules',
      description: 'List all auto schedules for the workspace.',
      scopes: ['schedules:read'],
      isWrite: false,
      params: [
        { name: 'limit', type: 'number', required: false, description: 'Items per page (default 25, max 100)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/auto-schedules" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "a1b2c3d4-...",
      "name": "Daily Staff Digest",
      "is_active": true,
      "cron_expression": "0 9 * * 1-5",
      "timezone": "Australia/Sydney",
      "audience_type": "users",
      "audience_filter": {},
      "automation_id": "b2c3d4e5-...",
      "next_run_at": "2026-04-21T23:00:00+00:00",
      "last_run_at": "2026-04-18T23:00:00+00:00",
      "run_count": 5,
      "max_runs": null,
      "end_at": null,
      "created_at": "2026-04-01T00:00:00Z",
      "updated_at": "2026-04-18T23:00:00Z"
    }
  ],
  "pagination": { "limit": 25, "has_more": false, "next_cursor": null },
  "meta": { "credits_remaining": 9990, "url": "https://app.trustpager.com/auto/schedules" }
}`,
    },
    {
      method: 'GET',
      path: '/auto-schedules/:id',
      description: 'Retrieve a single auto schedule.',
      scopes: ['schedules:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Auto schedule ID', in: 'path' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/auto-schedules/SCHEDULE_ID" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": {
    "id": "a1b2c3d4-...",
    "name": "Weekly Pipeline Review",
    "description": "Fires every Monday 9am AEST",
    "is_active": true,
    "cron_expression": "0 9 * * 1",
    "timezone": "Australia/Sydney",
    "audience_type": "deals",
    "audience_filter": { "status": "open", "stale_days": 7 },
    "automation_id": "b2c3d4e5-...",
    "next_run_at": "2026-04-21T23:00:00+00:00",
    "last_run_at": "2026-04-14T23:00:00+00:00",
    "run_count": 3,
    "max_runs": null,
    "end_at": null,
    "created_at": "2026-04-01T00:00:00Z",
    "updated_at": "2026-04-14T23:00:00Z"
  },
  "meta": { "credits_remaining": 9989 }
}`,
    },
    {
      method: 'POST',
      path: '/auto-schedules',
      description: `Create a new auto schedule. Required fields: name, audience_type, automation_id, and exactly one schedule input (see below).

**Specify the schedule in one of two ways:**

**Option A -- Structured (recommended for AI agents):** Provide time_of_day ("HH:MM", e.g. "08:00") plus optional days_of_week (array of ints 0-6, where 0=Sunday and 6=Saturday) and timezone. The server derives the cron expression automatically.
- Example: time_of_day "08:00", days_of_week [1,2,3,4,5], timezone "Australia/Melbourne" -- stores cron "0 8 * * 1,2,3,4,5"

**Option B -- Raw cron:** Provide cron_expression (standard 5-field syntax) and timezone. Use this for patterns that time_of_day cannot express, such as every-N-minutes, twice-daily, or monthly schedules.
- Example: cron_expression "0 9,17 * * *", timezone "Australia/Sydney" -- fires 9am and 5pm daily

If both are provided, cron_expression wins. Cron is the canonical stored form -- the response always includes cron_expression regardless of which input option was used.

**Common cron patterns:**
- "*/15 * * * *" -- every 15 minutes
- "0 * * * *" -- every hour
- "0 9 * * *" -- daily at 9am
- "0 9 * * 1-5" -- weekdays at 9am
- "0 9 * * 1" -- every Monday at 9am
- "0 9,17 * * *" -- 9am and 5pm daily
- "0 9 1 * *" -- 1st of every month at 9am

**audience_type** controls who receives a run:
- "users" -- one run per staff member (with optional role/user_ids filter)
- "tasks_by_assignee" -- one run per assignee who has open tasks (digest pattern)
- "contacts" -- one run per matching contact
- "deals" -- one run per matching deal

**audience_filter** is type-specific JSON:
- users: { "roles": ["client_editor"], "user_ids": ["uuid"] }
- tasks_by_assignee: { "statuses": ["open"], "include_overdue_only": true, "max_tasks_per_user": 20 }
- contacts: { "contact_type": "lead", "has_email": true, "limit": 500 }
- deals: { "status": "open", "stale_days": 14, "pipeline_id": "uuid", "stage_ids": ["uuid"], "limit": 200 }

Optionally set end_at (ISO timestamp) to stop firing after a date, or max_runs (integer) to auto-deactivate after N fires.`,
      scopes: ['schedules:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Schedule name', in: 'body' },
        { name: 'audience_type', type: 'string', required: true, description: 'One of: users, tasks_by_assignee, contacts, deals', in: 'body' },
        { name: 'automation_id', type: 'uuid', required: true, description: 'UUID of the automation to fire. Must belong to this workspace.', in: 'body' },
        { name: 'time_of_day', type: 'string', required: false, description: 'Schedule time in "HH:MM" format (e.g. "08:00"). Use with optional days_of_week and timezone. Server derives cron_expression automatically. Required if cron_expression is not provided.', in: 'body' },
        { name: 'days_of_week', type: 'array', required: false, description: 'Array of integers 0-6 (0=Sunday, 6=Saturday). Used with time_of_day. Omit or pass empty array for daily. Example: [1,2,3,4,5] for weekdays.', in: 'body' },
        { name: 'cron_expression', type: 'string', required: false, description: 'Standard 5-field cron expression. Use for patterns time_of_day cannot express (every-N-minutes, twice-daily, monthly, etc.). If both time_of_day and cron_expression are provided, cron_expression wins.', in: 'body' },
        { name: 'timezone', type: 'string', required: false, description: 'IANA timezone, e.g. "Australia/Sydney" (default). Used with both input options.', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Optional description', in: 'body' },
        { name: 'is_active', type: 'boolean', required: false, description: 'Whether the schedule fires automatically (default true)', in: 'body' },
        { name: 'audience_filter', type: 'object', required: false, description: 'Audience-specific filter JSON (see description above)', in: 'body' },
        { name: 'end_at', type: 'string', required: false, description: 'ISO timestamp after which the schedule stops firing', in: 'body' },
        { name: 'max_runs', type: 'number', required: false, description: 'Auto-deactivate after firing this many times', in: 'body' },
      ],
      requestExample: `# Option A -- structured (AI-agent-friendly)
curl -X POST \\
  "${API_BASE_URL}/auto-schedules" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: unique-key-here" \\
  -d '{
    "name": "Morning Task Digest",
    "time_of_day": "08:00",
    "days_of_week": [1, 2, 3, 4, 5],
    "timezone": "Australia/Melbourne",
    "audience_type": "tasks_by_assignee",
    "audience_filter": {},
    "automation_id": "YOUR_AUTOMATION_ID"
  }'

# Option B -- raw cron (for complex patterns)
curl -X POST \\
  "${API_BASE_URL}/auto-schedules" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: unique-key-here" \\
  -d '{
    "name": "Daily Staff Digest",
    "cron_expression": "0 9 * * 1-5",
    "timezone": "Australia/Sydney",
    "audience_type": "users",
    "automation_id": "YOUR_AUTOMATION_ID"
  }'`,
      responseExample: `{
  "data": {
    "id": "a1b2c3d4-...",
    "name": "Daily Staff Digest",
    "is_active": true,
    "cron_expression": "0 9 * * 1-5",
    "timezone": "Australia/Sydney",
    "audience_type": "users",
    "audience_filter": {},
    "automation_id": "b2c3d4e5-...",
    "next_run_at": "2026-04-21T23:00:00+00:00",
    "last_run_at": null,
    "run_count": 0,
    "max_runs": null,
    "end_at": null,
    "created_at": "2026-04-19T10:00:00Z",
    "updated_at": "2026-04-19T10:00:00Z"
  },
  "meta": { "credits_remaining": 9988 }
}`,
    },
    {
      method: 'PATCH',
      path: '/auto-schedules/:id',
      description: 'Partial update -- modify any field. Accepts the same two schedule-input options as POST: either time_of_day (+ optional days_of_week) or cron_expression. If cron_expression is provided it takes precedence. Changing either schedule input or timezone automatically recomputes next_run_at.',
      scopes: ['schedules:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Auto schedule ID', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'Schedule name', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Schedule description', in: 'body' },
        { name: 'is_active', type: 'boolean', required: false, description: 'Enable or disable the schedule', in: 'body' },
        { name: 'time_of_day', type: 'string', required: false, description: 'Update the firing time using "HH:MM" format. Server re-derives cron_expression. Use with optional days_of_week.', in: 'body' },
        { name: 'days_of_week', type: 'array', required: false, description: 'Array of integers 0-6. Used with time_of_day to update which days the schedule fires.', in: 'body' },
        { name: 'cron_expression', type: 'string', required: false, description: '5-field cron expression. Takes precedence over time_of_day if both are provided.', in: 'body' },
        { name: 'timezone', type: 'string', required: false, description: 'IANA timezone', in: 'body' },
        { name: 'audience_type', type: 'string', required: false, description: 'One of: users, tasks_by_assignee, contacts, deals', in: 'body' },
        { name: 'audience_filter', type: 'object', required: false, description: 'Audience-specific filter JSON', in: 'body' },
        { name: 'automation_id', type: 'uuid', required: false, description: 'Replace the linked automation', in: 'body' },
        { name: 'end_at', type: 'string', required: false, description: 'ISO timestamp after which the schedule stops firing (null to remove)', in: 'body' },
        { name: 'max_runs', type: 'number', required: false, description: 'Max fires before auto-deactivation (null to remove)', in: 'body' },
      ],
      requestExample: `curl -X PATCH \\
  "${API_BASE_URL}/auto-schedules/SCHEDULE_ID" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"is_active": false}'`,
      responseExample: `{
  "data": {
    "id": "a1b2c3d4-...",
    "name": "Daily Staff Digest",
    "is_active": false,
    "cron_expression": "0 9 * * 1-5",
    "timezone": "Australia/Sydney",
    "audience_type": "users",
    "audience_filter": {},
    "automation_id": "b2c3d4e5-...",
    "next_run_at": "2026-04-21T23:00:00+00:00",
    "last_run_at": null,
    "run_count": 0,
    "max_runs": null,
    "end_at": null,
    "created_at": "2026-04-19T10:00:00Z",
    "updated_at": "2026-04-19T10:30:00Z"
  },
  "meta": { "credits_remaining": 9987 }
}`,
    },
    {
      method: 'DELETE',
      path: '/auto-schedules/:id',
      description: 'Permanently delete an auto schedule. The linked automation is NOT deleted. This cannot be undone.',
      scopes: ['schedules:delete'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Auto schedule ID', in: 'path' },
      ],
      requestExample: `curl -X DELETE \\
  "${API_BASE_URL}/auto-schedules/SCHEDULE_ID" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `(empty body, HTTP 204)`,
    },
    {
      method: 'POST',
      path: '/auto-schedules/preview-cron',
      description: 'Validate a cron expression and preview the next N fire times in a specified timezone. Does NOT create any schedule. Use to confirm a pattern before saving.',
      scopes: ['schedules:read'],
      isWrite: false,
      params: [
        { name: 'cron_expression', type: 'string', required: true, description: 'Standard 5-field cron expression to validate', in: 'body' },
        { name: 'timezone', type: 'string', required: false, description: 'IANA timezone (default "Australia/Sydney")', in: 'body' },
        { name: 'count', type: 'number', required: false, description: 'Number of future fire times to return (1-20, default 5)', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/auto-schedules/preview-cron" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "cron_expression": "0 9 * * 1-5",
    "timezone": "Australia/Sydney",
    "count": 3
  }'`,
      responseExample: `{
  "data": {
    "cron_expression": "0 9 * * 1-5",
    "timezone": "Australia/Sydney",
    "next_runs": [
      "2026-04-21T23:00:00.000Z",
      "2026-04-22T23:00:00.000Z",
      "2026-04-23T23:00:00.000Z"
    ]
  },
  "meta": { "credits_remaining": 9986 }
}`,
    },
    {
      method: 'POST',
      path: '/auto-schedules/:id/fire-now',
      description: 'Manually fire an auto schedule immediately. Resolves the current audience and triggers one automation run per row. Does NOT advance next_run_at, increment run_count, or respect end_at/max_runs limits. Useful for testing, ad-hoc sends, or recovering from a missed fire.',
      scopes: ['schedules:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Auto schedule ID', in: 'path' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/auto-schedules/SCHEDULE_ID/fire-now" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Idempotency-Key: manual-fire-$(date +%s)"`,
      responseExample: `{
  "data": {
    "run_id": "c3d4e5f6-...",
    "status": "completed",
    "audience_size": 11,
    "runs_triggered": 11,
    "runs_failed": 0
  },
  "meta": { "credits_remaining": 9985 }
}`,
    },
    {
      method: 'GET',
      path: '/auto-schedules/:id/audience-preview',
      description: 'Preview the audience a schedule WOULD resolve to right now -- returns the total count and a configurable sample of trigger_data rows, without firing anything. Use before enabling a schedule to verify the filter targets the right rows.',
      scopes: ['schedules:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Auto schedule ID', in: 'path' },
        { name: 'sample', type: 'number', required: false, description: 'Number of sample rows to return (0-50, default 5)', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/auto-schedules/SCHEDULE_ID/audience-preview?sample=3" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": {
    "count": 11,
    "sample": [
      {
        "key": "user:uuid-1",
        "trigger_data": {
          "user_id": "uuid-1",
          "user_email": "alice@example.com",
          "user_full_name": "Alice Smith",
          "user_role": "client_editor"
        }
      }
    ]
  },
  "meta": { "credits_remaining": 9984 }
}`,
    },
    {
      method: 'GET',
      path: '/auto-schedules/:id/runs',
      description: 'List historical fire records for a schedule. Shows audience_size, runs_triggered, runs_failed, status (completed/partial/failed), and timing. Use to verify schedules are firing, debug failures, or audit history. Supports cursor pagination ordered by fired_at descending.',
      scopes: ['schedules:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Auto schedule ID', in: 'path' },
        { name: 'limit', type: 'number', required: false, description: 'Items per page (default 25, max 100)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/auto-schedules/SCHEDULE_ID/runs" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "d4e5f6a7-...",
      "schedule_id": "a1b2c3d4-...",
      "company_id": "ebeff86e-...",
      "fired_at": "2026-04-18T23:00:00Z",
      "completed_at": "2026-04-18T23:00:02Z",
      "status": "completed",
      "audience_size": 11,
      "runs_triggered": 11,
      "runs_failed": 0,
      "error_message": null,
      "created_at": "2026-04-18T23:00:00Z"
    }
  ],
  "pagination": { "limit": 25, "has_more": false, "next_cursor": null },
  "meta": { "credits_remaining": 9983 }
}`,
    },
  ],
};
