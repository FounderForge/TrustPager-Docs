import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// AUTOMATIONS (18 endpoints)
// =============================================================================

export const AUTOMATIONS: ResourceGroup = {
  id: 'automations',
  label: 'Automations',
  description: 'Create and manage workflow automations. Includes sub-resources for triggers, actions, and execution runs. Supports enable/disable and manual triggering.',
  endpoints: [
    {
      method: 'GET',
      path: '/automations',
      description: 'List all automations for the company.',
      scopes: ['automations:read'],
      isWrite: false,
      params: [
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/automations?limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "auto-uuid-...",
      "name": "New Lead Welcome Email",
      "trigger_type": "pipeline",
      "enabled": true,
      "priority": 0,
      "created_at": "2026-02-15T12:00:00Z"
    }
  ],
  "pagination": { "limit": 10, "has_more": false, "next_cursor": null, "prev_cursor": null }
}`,
    },
    {
      method: 'GET',
      path: '/automations/:id',
      description: 'Retrieve an automation with its triggers and actions.',
      scopes: ['automations:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/automations',
      description: 'Create a new automation. name and trigger_type are required.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Automation name', in: 'body' },
        { name: 'trigger_type', type: 'string', required: true, description: 'Trigger type (pipeline, website, custom_webhook, platform_trigger)', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Description', in: 'body' },
        { name: 'enabled', type: 'boolean', required: false, description: 'Whether enabled (default: false)', in: 'body' },
        { name: 'priority', type: 'number', required: false, description: 'Execution priority', in: 'body' },
        { name: 'conditions', type: 'object', required: false, description: 'Trigger conditions', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/automations" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "New Lead Welcome",
    "trigger_type": "pipeline",
    "description": "Send welcome email when lead enters pipeline"
  }'`,
    },
    {
      method: 'PATCH',
      path: '/automations/:id',
      description: 'Update an automation.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'DELETE',
      path: '/automations/:id',
      description: 'Delete an automation and all its triggers/actions.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/automations/:id/enable',
      description: 'Enable an automation.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/automations/:id/disable',
      description: 'Disable an automation.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/automations/:id/trigger',
      description: 'Manually trigger an automation with optional test data.',
      scopes: ['automations:trigger'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' },
        { name: 'trigger_data', type: 'object', required: false, description: 'Test data to pass to the automation', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/automations/auto-uuid/trigger" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "trigger_data": { "deal_id": "deal-uuid", "contact_id": "contact-uuid" } }'`,
    },
    {
      method: 'GET',
      path: '/automations/:id/runs',
      description: 'List execution runs for an automation.',
      scopes: ['automations:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/automations/runs/:runId',
      description: 'Get details of a specific automation run including action results.',
      scopes: ['automations:read'],
      isWrite: false,
      params: [{ name: 'runId', type: 'uuid', required: true, description: 'Run ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/automations/:id/triggers',
      description: 'List triggers for an automation.',
      scopes: ['automations:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/automations/:id/triggers',
      description: 'Add a trigger to an automation.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' },
        { name: 'source_type', type: 'string', required: false, description: 'Trigger source type', in: 'body' },
        { name: 'source_id', type: 'string', required: false, description: 'Trigger source ID (e.g. pipeline stage ID)', in: 'body' },
        { name: 'config', type: 'object', required: false, description: 'Trigger configuration', in: 'body' },
      ],
    },
    {
      method: 'PATCH',
      path: '/automations/:id/triggers/:triggerId',
      description: 'Update a trigger.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' },
        { name: 'triggerId', type: 'uuid', required: true, description: 'Trigger ID', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/automations/:id/triggers/:triggerId',
      description: 'Delete a trigger from an automation.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' },
        { name: 'triggerId', type: 'uuid', required: true, description: 'Trigger ID', in: 'path' },
      ],
    },
    {
      method: 'GET',
      path: '/automations/:id/actions',
      description: 'List actions for an automation, ordered by sequence.',
      scopes: ['automations:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/automations/:id/actions',
      description: 'Add an action to an automation. action_type and sequence are required.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' },
        { name: 'action_type', type: 'string', required: true, description: 'Action type (send_custom_email, send_sms, trigger_voice_call, call_webhook, add_tasks, etc.)', in: 'body' },
        { name: 'sequence', type: 'number', required: true, description: 'Execution order', in: 'body' },
        { name: 'config', type: 'object', required: false, description: 'Action configuration (varies by action_type)', in: 'body' },
      ],
    },
    {
      method: 'POST',
      path: '/automations/:id/actions/reorder',
      description: 'Reorder actions within an automation.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' },
        { name: 'action_ids', type: 'string[]', required: true, description: 'Ordered array of action UUIDs', in: 'body' },
      ],
    },
    {
      method: 'PATCH',
      path: '/automations/:id/actions/:actionId',
      description: 'Update an action.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' },
        { name: 'actionId', type: 'uuid', required: true, description: 'Action ID', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/automations/:id/actions/:actionId',
      description: 'Delete an action from an automation.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' },
        { name: 'actionId', type: 'uuid', required: true, description: 'Action ID', in: 'path' },
      ],
    },
  ],
};
