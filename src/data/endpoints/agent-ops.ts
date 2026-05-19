import { type ResourceGroup } from './types.js';

// =============================================================================
// AGENT OPS
// =============================================================================

export const AGENT_OPS: ResourceGroup = {
  id: 'agent-ops',
  label: 'Agent Ops',
  description: 'Observability and management for AI agent infrastructure. Covers: registry, run log, signals, metrics, tool log, report runs, alert rules, fired alerts, and the aggregated dashboard. All routes require agent-ops:read (reads) or agent-ops:write (writes/actions).',
  endpoints: [
    // --- Dashboard ---
    {
      method: 'GET',
      path: '/agent-ops/dashboard',
      description: 'Aggregated agent operations summary: all registered agents, today\'s runs, pending signals, and report status. Free (0 credits).',
      scopes: ['agent-ops:read'],
      isWrite: false,
      params: [],
      responseExample: `{
  "data": {
    "agents": [
      {
        "id": "880b909e-...",
        "name": "nurture-agent",
        "display_name": "Nurture Agent",
        "agent_type": "scheduled_task",
        "status": "active",
        "last_run_at": "2026-05-19T06:00:00Z",
        "last_success_at": "2026-05-19T06:00:00Z",
        "last_failure_at": null,
        "consecutive_failures": 0,
        "schedule": "0 6 * * *"
      }
    ],
    "today_runs": [],
    "pending_signals": [],
    "report_runs": [],
    "summary": {
      "agents_active": 2,
      "agents_total": 2,
      "runs_today": 0,
      "runs_completed": 0,
      "runs_failed": 0,
      "pending_signals": 0,
      "avg_duration_ms": 0
    }
  }
}`,
    },

    // --- Registry ---
    {
      method: 'GET',
      path: '/agent-ops/registry',
      description: 'List all registered AI agents. Filter by agent_type or status.',
      scopes: ['agent-ops:read'],
      isWrite: false,
      params: [
        { name: 'agent_type', type: 'string', required: false, description: 'Filter by type: cron_report, real_time_responder, scheduled_task, error_handler', in: 'query' },
        { name: 'status', type: 'string', required: false, description: 'Filter by status: active, paused, error, disabled', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (default 25)', in: 'query' },
      ],
      responseExample: `{
  "data": [
    {
      "id": "880b909e-aa2f-4d8c-8372-073921a9d947",
      "company_id": "ebeff86e-...",
      "name": "nurture-agent",
      "display_name": "Nurture Agent",
      "agent_type": "scheduled_task",
      "status": "active",
      "schedule": "0 6 * * *",
      "timezone": "Australia/Sydney",
      "capabilities": ["email", "sms"],
      "created_at": "2026-05-01T00:00:00Z",
      "updated_at": "2026-05-19T06:20:00Z"
    }
  ],
  "pagination": { "has_more": false }
}`,
    },
    {
      method: 'POST',
      path: '/agent-ops/registry',
      description: 'Register a new AI agent.',
      scopes: ['agent-ops:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Machine name (e.g. sales-report)', in: 'body' },
        { name: 'display_name', type: 'string', required: true, description: 'Display name shown in Agent Hub', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'What this agent does', in: 'body' },
        { name: 'agent_type', type: 'string', required: false, description: 'cron_report | real_time_responder | scheduled_task | error_handler', in: 'body' },
        { name: 'status', type: 'string', required: false, description: 'active | paused | error | disabled (default: active)', in: 'body' },
        { name: 'schedule', type: 'string', required: false, description: 'Cron expression (for scheduled agents)', in: 'body' },
        { name: 'timezone', type: 'string', required: false, description: 'IANA timezone (e.g. Australia/Sydney)', in: 'body' },
        { name: 'capabilities', type: 'array', required: false, description: 'e.g. ["email","sms","screenshot"]', in: 'body' },
        { name: 'configuration', type: 'object', required: false, description: 'Agent-specific settings (JSONB)', in: 'body' },
      ],
      requestExample: `{
  "name": "weekly-report",
  "display_name": "Weekly Report Agent",
  "agent_type": "cron_report",
  "schedule": "0 9 * * 1",
  "timezone": "Australia/Sydney",
  "capabilities": ["email", "notepad"]
}`,
      responseExample: `{
  "data": {
    "id": "a1b2c3d4-...",
    "company_id": "ebeff86e-...",
    "name": "weekly-report",
    "display_name": "Weekly Report Agent",
    "status": "active",
    "created_at": "2026-05-19T07:00:00Z"
  }
}`,
    },
    {
      method: 'GET',
      path: '/agent-ops/registry/:id',
      description: 'Get a single registered agent by UUID.',
      scopes: ['agent-ops:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Agent registry UUID', in: 'path' },
      ],
      responseExample: `{
  "data": {
    "id": "880b909e-aa2f-4d8c-8372-073921a9d947",
    "name": "nurture-agent",
    "display_name": "Nurture Agent",
    "status": "active",
    "last_run_at": "2026-05-19T06:00:00Z",
    "consecutive_failures": 0
  }
}`,
    },
    {
      method: 'PATCH',
      path: '/agent-ops/registry/:id',
      description: 'Update an agent registry entry.',
      scopes: ['agent-ops:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Agent registry UUID', in: 'path' },
        { name: 'display_name', type: 'string', required: false, description: 'Updated display name', in: 'body' },
        { name: 'status', type: 'string', required: false, description: 'active | paused | error | disabled', in: 'body' },
        { name: 'schedule', type: 'string', required: false, description: 'New cron expression', in: 'body' },
        { name: 'configuration', type: 'object', required: false, description: 'Agent-specific settings (JSONB)', in: 'body' },
      ],
      responseExample: `{ "data": { "id": "880b909e-...", "status": "paused", "updated_at": "2026-05-19T07:30:00Z" } }`,
    },
    {
      method: 'DELETE',
      path: '/agent-ops/registry/:id',
      description: 'Delete an agent registry entry. Requires agent-ops:delete scope.',
      scopes: ['agent-ops:delete'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Agent registry UUID', in: 'path' },
      ],
      responseExample: `(204 No Content)`,
    },

    // --- Test-Run ---
    {
      method: 'POST',
      path: '/agent-ops/registry/:id/test-run',
      description: 'Trigger a manual test run for a managed agent. Verifies company ownership, confirms the agent is active and managed_agents runtime, then proxies to the dispatcher. Returns a run_id and session_id. Requires agent-ops:write scope.',
      scopes: ['agent-ops:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Agent registry UUID', in: 'path' },
        { name: 'trigger_context', type: 'object', required: false, description: 'Optional context injected into the kickoff (default: { source: "api-test-run" })', in: 'body' },
      ],
      requestExample: `{
  "trigger_context": { "source": "api-test-run", "note": "Manual verification run" }
}`,
      responseExample: `{
  "data": {
    "run_id": "d08d9fc0-fd6e-47e0-9401-4850f091b40f",
    "session_id": "sesn_01K4eijGkTcn88XfHVBNA3VE",
    "trigger_kind": "manual",
    "kickoff_chars": 285,
    "vault_ids_attached": 0
  }
}`,
    },

    // --- Definition Update ---
    {
      method: 'POST',
      path: '/agent-ops/registry/:id/definition',
      description: 'Update the managed agent definition (bumps the version on the underlying AI platform). Verifies company ownership of both the registry row and the linked definition before proxying. Body must contain an "agent" key with the update payload. Requires agent-ops:write scope.',
      scopes: ['agent-ops:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Agent registry UUID', in: 'path' },
        { name: 'agent', type: 'object', required: true, description: 'Definition update payload (e.g. { name, system_prompt, model })', in: 'body' },
      ],
      requestExample: `{
  "agent": {
    "name": "My Updated Agent",
    "system_prompt": "You are a helpful CRM assistant..."
  }
}`,
      responseExample: `{
  "data": {
    "id": "def-uuid",
    "name": "My Updated Agent",
    "current_version": 4,
    "updated_at": "2026-05-19T08:00:00Z"
  }
}`,
    },

    // --- Runs ---
    {
      method: 'GET',
      path: '/agent-ops/runs',
      description: 'List agent run log entries. Filter by agent_name, status, or since date.',
      scopes: ['agent-ops:read'],
      isWrite: false,
      params: [
        { name: 'agent_name', type: 'string', required: false, description: 'Filter by agent name', in: 'query' },
        { name: 'status', type: 'string', required: false, description: 'started | completed | failed | skipped', in: 'query' },
        { name: 'since', type: 'string', required: false, description: 'ISO datetime -- only runs after this time', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (default 25)', in: 'query' },
      ],
      responseExample: `{
  "data": [
    {
      "id": "run-uuid",
      "agent_name": "nurture-agent",
      "task_type": "manual",
      "status": "completed",
      "duration_ms": 12400,
      "started_at": "2026-05-19T06:00:00Z",
      "completed_at": "2026-05-19T06:00:12Z",
      "output_summary": "Sent 3 follow-up emails"
    }
  ]
}`,
    },
    {
      method: 'POST',
      path: '/agent-ops/runs',
      description: 'Log a new agent run. If eve_id is provided and already exists, upserts.',
      scopes: ['agent-ops:write'],
      isWrite: true,
      params: [
        { name: 'agent_name', type: 'string', required: true, description: 'Agent name', in: 'body' },
        { name: 'task_type', type: 'string', required: false, description: 'Task type (e.g. sales-report, email_response)', in: 'body' },
        { name: 'status', type: 'string', required: false, description: 'started | completed | failed | skipped', in: 'body' },
        { name: 'model', type: 'string', required: false, description: 'Model used (e.g. claude-sonnet-4-6)', in: 'body' },
        { name: 'duration_ms', type: 'number', required: false, description: 'Run duration in milliseconds', in: 'body' },
        { name: 'output_summary', type: 'string', required: false, description: 'Human-readable summary of what the agent did', in: 'body' },
      ],
      responseExample: `{ "data": { "id": "run-uuid", "agent_name": "nurture-agent", "status": "started" } }`,
    },
    {
      method: 'PATCH',
      path: '/agent-ops/runs/:id',
      description: 'Update an agent run by UUID or eve_id. Automatically updates agent registry stats on completion or failure.',
      scopes: ['agent-ops:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Run UUID or eve_id (numeric string)', in: 'path' },
        { name: 'status', type: 'string', required: false, description: 'completed | failed | skipped', in: 'body' },
        { name: 'duration_ms', type: 'number', required: false, description: 'Run duration in milliseconds', in: 'body' },
        { name: 'output_summary', type: 'string', required: false, description: 'Human-readable summary of what the agent did', in: 'body' },
        { name: 'error_message', type: 'string', required: false, description: 'Error message if run failed', in: 'body' },
      ],
      responseExample: `{ "data": { "id": "run-uuid", "status": "completed", "duration_ms": 12400 } }`,
    },

    // --- Signals ---
    {
      method: 'GET',
      path: '/agent-ops/signals',
      description: 'List inter-agent signals. Filter by for_agent, created_by, signal type, or pending.',
      scopes: ['agent-ops:read'],
      isWrite: false,
      params: [
        { name: 'for_agent', type: 'string', required: false, description: 'Filter by recipient agent', in: 'query' },
        { name: 'created_by', type: 'string', required: false, description: 'Filter by sender agent', in: 'query' },
        { name: 'signal', type: 'string', required: false, description: 'Filter by signal type', in: 'query' },
        { name: 'pending', type: 'boolean', required: false, description: 'If true, only return unactioned signals', in: 'query' },
      ],
      responseExample: `{ "data": [] }`,
    },
    {
      method: 'POST',
      path: '/agent-ops/signals',
      description: 'Send an inter-agent signal.',
      scopes: ['agent-ops:write'],
      isWrite: true,
      params: [
        { name: 'for_agent', type: 'string', required: true, description: 'Recipient agent name', in: 'body' },
        { name: 'created_by', type: 'string', required: true, description: 'Sender agent name', in: 'body' },
        { name: 'signal', type: 'string', required: true, description: 'Signal type (e.g. screenshot_request, error_fix_request)', in: 'body' },
        { name: 'detail', type: 'string', required: false, description: 'Signal payload', in: 'body' },
        { name: 'expires_at', type: 'string', required: false, description: 'ISO datetime for expiry', in: 'body' },
      ],
      responseExample: `{ "data": { "id": "signal-uuid", "for_agent": "ops-report", "signal": "screenshot_request" } }`,
    },

    // --- Alert Rules ---
    {
      method: 'GET',
      path: '/agent-ops/alert-rules',
      description: 'List configured alert rules for agents.',
      scopes: ['agent-ops:read'],
      isWrite: false,
      params: [
        { name: 'limit', type: 'number', required: false, description: 'Max results (default 25)', in: 'query' },
      ],
      responseExample: `{ "data": [] }`,
    },
    {
      method: 'POST',
      path: '/agent-ops/alert-rules',
      description: 'Create an alert rule. Types: consecutive_failures, duration_exceeded, no_run_since, error_rate.',
      scopes: ['agent-ops:write'],
      isWrite: true,
      params: [
        { name: 'rule_type', type: 'string', required: true, description: 'consecutive_failures | duration_exceeded | no_run_since | error_rate', in: 'body' },
        { name: 'threshold', type: 'object', required: true, description: 'e.g. {"max_failures": 2} or {"max_duration_ms": 300000}', in: 'body' },
        { name: 'agent_name', type: 'string', required: false, description: 'Target agent name (null for global rule)', in: 'body' },
        { name: 'notify_channel', type: 'string', required: false, description: 'slack | email | both', in: 'body' },
        { name: 'enabled', type: 'boolean', required: false, description: 'Default: true', in: 'body' },
      ],
      responseExample: `{ "data": { "id": "rule-uuid", "rule_type": "consecutive_failures", "threshold": {"max_failures": 2}, "enabled": true } }`,
    },

    // --- Alerts Fired ---
    {
      method: 'GET',
      path: '/agent-ops/alerts',
      description: 'List fired agent alerts. Filter by agent_name or unacknowledged.',
      scopes: ['agent-ops:read'],
      isWrite: false,
      params: [
        { name: 'agent_name', type: 'string', required: false, description: 'Filter by agent name', in: 'query' },
        { name: 'unacknowledged', type: 'boolean', required: false, description: 'If true, only unacknowledged alerts', in: 'query' },
      ],
      responseExample: `{ "data": [] }`,
    },
    {
      method: 'POST',
      path: '/agent-ops/alerts/:id/acknowledge',
      description: 'Acknowledge a fired alert.',
      scopes: ['agent-ops:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Alert UUID', in: 'path' },
        { name: 'acknowledged_by', type: 'string', required: false, description: 'Who acknowledged it (defaults to "api")', in: 'body' },
      ],
      responseExample: `{ "data": { "id": "alert-uuid", "acknowledged_at": "2026-05-19T09:00:00Z", "acknowledged_by": "api" } }`,
    },
  ],
};
