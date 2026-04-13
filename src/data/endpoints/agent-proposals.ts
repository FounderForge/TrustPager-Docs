import { type ResourceGroup } from './types.js';

// =============================================================================
// AGENT PROPOSALS
// =============================================================================

export const AGENT_PROPOSALS: ResourceGroup = {
  id: 'agent-proposals',
  label: 'Agent Proposals',
  description: 'Agent action proposals submitted by AI agents for human review and approval. Agents submit proposals when they identify an action that should be taken but requires a human decision. Proposals surface in the Agent Hub at /auto/agent-hub?tab=proposals.',
  endpoints: [
    {
      method: 'GET',
      path: '/agent-proposals',
      description: 'List agent proposals. Defaults to pending. Use status=all to see the full history.',
      scopes: ['agent-ops:read'],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status: pending (default), approved, rejected, expired, executed, failed, or all', in: 'query' },
        { name: 'agent_name', type: 'string', required: false, description: 'Filter by the agent that created the proposal', in: 'query' },
        { name: 'category', type: 'string', required: false, description: 'Filter by category: enable, fix, config, strategy, diagnose, learn', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results per page (default 25, max 100)', in: 'query' },
      ],
      responseExample: `{
  "data": [
    {
      "id": "f1a2b3c4-...",
      "company_id": "ebeff86e-...",
      "agent_name": "project-manager",
      "category": "enable",
      "priority": "high",
      "title": "Enable welcome automation",
      "description": "The welcome sequence is disabled. 3 clients received no onboarding email.",
      "context": { "affected_deals": 3, "pipeline": "Fulfillment Kickoff" },
      "proposed_action": { "tool": "enable_automation", "params": { "id": "auto-uuid" } },
      "options": null,
      "status": "pending",
      "answer": null,
      "answered_by": null,
      "answered_at": null,
      "execution_result": null,
      "executed_at": null,
      "expires_at": "2026-04-20T00:00:00Z",
      "created_at": "2026-04-13T23:00:00Z",
      "updated_at": "2026-04-13T23:00:00Z"
    }
  ],
  "meta": { "url": "https://app.trustpager.com/auto/agent-hub?tab=proposals" }
}`,
    },
    {
      method: 'GET',
      path: '/agent-proposals/:id',
      description: 'Get a single agent proposal by ID.',
      scopes: ['agent-ops:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Proposal UUID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/agent-proposals',
      description: 'Create an agent proposal. Submitted by AI agents when they identify an action that requires human approval. The proposal is surfaced in the Agent Hub for review.',
      scopes: ['agent-ops:write'],
      isWrite: true,
      params: [
        { name: 'agent_name', type: 'string', required: true, description: 'Name of the agent submitting the proposal', in: 'body' },
        { name: 'category', type: 'string', required: true, description: 'Category: enable, fix, config, strategy, diagnose, learn', in: 'body' },
        { name: 'title', type: 'string', required: true, description: 'Short action-oriented title', in: 'body' },
        { name: 'proposed_action', type: 'object', required: true, description: 'Action to execute on approval: { "tool": "<tool_name>", "params": { ... } }. Use tool: "custom" for manual actions.', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Explanation of why this action is needed', in: 'body' },
        { name: 'context', type: 'object', required: false, description: 'Supporting evidence as key-value pairs (e.g. { "days_stale": 22 })', in: 'body' },
        { name: 'priority', type: 'string', required: false, description: 'Priority: low, medium (default), high, critical', in: 'body' },
        { name: 'options', type: 'array', required: false, description: 'List of choices for the reviewer. Each item: { "label": "...", "action": { "tool": "...", "params": {...} } }', in: 'body' },
        { name: 'expires_at', type: 'string', required: false, description: 'ISO datetime when this proposal expires (default: 7 days)', in: 'body' },
      ],
      requestExample: `{
  "agent_name": "project-manager",
  "category": "enable",
  "priority": "high",
  "title": "Enable welcome automation",
  "description": "The welcome sequence automation has been disabled for 5 days. 3 new clients received no onboarding email.",
  "context": { "affected_deals": 3, "pipeline": "Fulfillment Kickoff", "days_disabled": 5 },
  "proposed_action": { "tool": "enable_automation", "params": { "id": "auto-uuid" } }
}`,
      responseExample: `{
  "data": {
    "id": "f1a2b3c4-...",
    "status": "pending",
    "expires_at": "2026-04-20T00:00:00Z"
  },
  "meta": { "url": "https://app.trustpager.com/auto/agent-hub?tab=proposals" }
}`,
    },
    {
      method: 'POST',
      path: '/agent-proposals/:id/approve',
      description: 'Approve a pending proposal and execute its proposed action immediately. The action is resolved via a tool-to-API mapping and executed server-side. The result is stored on the proposal record (status becomes "executed" on success, "failed" on error).',
      scopes: ['agent-ops:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Proposal UUID', in: 'path' },
        { name: 'answer', type: 'string', required: false, description: 'Optional approval note (stored for audit trail)', in: 'body' },
        { name: 'selected_option', type: 'number', required: false, description: 'If the proposal has options, the 0-based index of the chosen option', in: 'body' },
      ],
      requestExample: `{ "answer": "Approved - proceed with enabling the automation." }`,
      responseExample: `{
  "data": {
    "proposal_id": "f1a2b3c4-...",
    "status": "executed",
    "execution_result": { "id": "auto-uuid", "enabled": true }
  }
}`,
    },
    {
      method: 'POST',
      path: '/agent-proposals/:id/reject',
      description: 'Reject a pending proposal. The proposed action is NOT executed. The rejection reason is stored and visible to the agent.',
      scopes: ['agent-ops:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Proposal UUID', in: 'path' },
        { name: 'reason', type: 'string', required: false, description: 'Reason for rejection (shown to the agent for learning)', in: 'body' },
      ],
      requestExample: `{ "reason": "Automation is intentionally paused during Q2 migration." }`,
      responseExample: `{ "data": { "proposal_id": "f1a2b3c4-...", "status": "rejected" } }`,
    },
  ],
};
