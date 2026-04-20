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
      description: 'Create a new automation. name and trigger_type are required. For stage_changed automations, pass stage_id directly on the automation -- this is the single source of truth for stage matching (do not use automations_triggers for stage_changed).',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Automation name', in: 'body' },
        { name: 'trigger_type', type: 'string', required: true, description: 'Trigger type. Common values: stage_changed, form_submitted, call_analyzed, sms_received, email_received, checkout_completed. CRM entity triggers (fired by Portal API on CRUD): contact_created, contact_updated, customer_created, customer_updated, deal_created, deal_updated. ENTITY AXIS RULES: contact_type lives on contacts (use contact_created/updated); account_type lives on customers (use customer_created/updated); opportunity_type lives on deals (use deal_created/updated). Update triggers include _changed_fields and _previous_values in trigger data for field-level condition matching.', in: 'body' },
        { name: 'stage_id', type: 'uuid', required: false, description: 'Pipeline stage UUID. Required when trigger_type is "stage_changed". Single source of truth for stage matching.', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Description', in: 'body' },
        { name: 'enabled', type: 'boolean', required: false, description: 'Whether enabled (default: false)', in: 'body' },
        { name: 'priority', type: 'number', required: false, description: 'Execution priority', in: 'body' },
        {
          name: 'conditions',
          type: 'object',
          required: false,
          description: `Conditions that must ALL pass (AND logic) for the automation to fire. Evaluated AFTER CRM enrichment, so CRM fields (tags, deal value, lead source, contact email) are available for ALL trigger types. When conditions are not met the run status is "skipped". Operators: eq, neq, exists, not_exists, gt, gte, lt, lte, contains (tag array), not_contains, contains_any, contains_text, in. Example: { "tags": { "contains": "VIP" }, "deal.value": { "gte": 5000 }, "lead_source": { "in": ["Referral", "Website"] } }`,
          in: 'body',
        },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/automations" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "VIP Lead Welcome",
    "trigger_type": "stage_changed",
    "stage_id": "stage-uuid",
    "conditions": {
      "tags": { "contains": "VIP" },
      "deal.value": { "gte": 5000 },
      "lead_source": { "in": ["Referral", "Website"] }
    },
    "description": "Send welcome email to VIP leads only"
  }'`,
      responseExample: `{
  "data": {
    "id": "auto-uuid-...",
    "name": "VIP Lead Welcome",
    "trigger_type": "stage_changed",
    "stage_id": "stage-uuid",
    "conditions": {
      "tags": { "contains": "VIP" },
      "deal.value": { "gte": 5000 },
      "lead_source": { "in": ["Referral", "Website"] }
    },
    "enabled": false,
    "created_at": "2026-04-18T00:00:00Z"
  }
}`,
    },
    {
      method: 'PATCH',
      path: '/automations/:id',
      description: 'Update an automation. Same writable fields as POST, including conditions. Pass conditions: null to remove all conditions from an automation.',
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
      description: 'List execution runs for an automation. Run status values: completed, failed, running, skipped. Status "skipped" means conditions were evaluated but not met -- the automation did not execute any actions.',
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
        { name: 'action_type', type: 'string', required: true, description: 'Action type (send_custom_email, send_gmail_email, send_sms, trigger_voice_call, call_webhook, add_tasks, create_lead, move_deal, attach_to_event_queue, remove_from_event_queue, apply_tags, remove_tags, assign_user, send_document, send_for_signing, send_form, slack_send_message, trigger_automation, etc.)', in: 'body' },
        { name: 'sequence', type: 'number', required: true, description: 'Execution order', in: 'body' },
        {
          name: 'config',
          type: 'object',
          required: false,
          description: `Action configuration (varies by action_type). Key configs:
send_custom_email: { greeting, customMessage, showReplyButton?, recipient_target?, replyEmail? }
send_gmail_email: { subject, body, recipient_target, sender_mode? } -- body accepts plain text or rich HTML. To embed a clickable image: <a href="URL"><img src="IMAGE_URL" alt="Alt" style="max-width:100%;height:auto;" /></a>. sender_mode: "company" (workspace Gmail from /settings/email) or "assignee" (deal primary assignee personal Gmail). recipient_target: "contact", "account_customer", or "account_supplier". subject and body support {{variable}} placeholders. Gmail signature is auto-appended.
send_sms: { phone_number_id, message_body }
trigger_voice_call: { voice_agent_id }
add_tasks: { tasks: [{ title, category?, due_offset_days? }] }
call_webhook: { url, method? }
create_lead: { pipeline_id, stage_id }
move_deal: { pipeline_id, stage_id, pipeline_name?, stage_name? } - moves the triggering deal to the specified stage
apply_tags: { tags: [{ name, color? }] } - merges tags onto the deal. Deduplicates by name. Color falls back to tag palette or #6b7280.
remove_tags: { tags: [{ name }] } - removes tags from the deal by name (case-insensitive).
assign_user: { user_id } - assigns a team member as primary deal owner. Aliases: assign_deal_user, set_deal_owner. Demotes any existing primary assignee. Use GET /company/users to find user UUIDs.`,
          in: 'body',
        },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/automations/auto-uuid/actions" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "action_type": "send_gmail_email",
    "sequence": 1,
    "config": {
      "subject": "Following up on {{deal.name}}",
      "body": "Hi {{contact.first_name}},\\n\\nJust wanted to follow up. Let me know if you have any questions.\\n\\nBest regards",
      "recipient_target": "contact",
      "sender_mode": "company"
    }
  }'`,
      responseExample: `{
  "data": {
    "id": "action-uuid-...",
    "automation_id": "auto-uuid-...",
    "action_type": "send_gmail_email",
    "sequence": 1,
    "config": {
      "subject": "Following up on {{deal.name}}",
      "body": "Hi {{contact.first_name}},\\n\\nJust wanted to follow up.",
      "recipient_target": "contact",
      "sender_mode": "company"
    },
    "created_at": "2026-03-25T05:00:00Z"
  }
}`,
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
