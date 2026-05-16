import { type ResourceGroup } from './types.js';

// =============================================================================
// EVIE IN-APP AGENT
// =============================================================================
// These endpoints power the Evie sidebar agent embedded in the TrustPager
// portal. They are separate edge functions, NOT under the standard /api/v1/
// prefix. Auth uses tp_oauth_* tokens minted by /evie-grant.
//
// Base URL for Evie endpoints:
//   https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/
//
// Workflow:
//   1. Browser authenticates via Supabase JWT (portal session)
//   2. POST /evie-grant -> receive tp_oauth_* token
//   3. POST /agent-chat with Bearer tp_oauth_* -> SSE stream of turns
//   4. POST /agent-chat-compact when thread grows too long
// =============================================================================

export const EVIE: ResourceGroup = {
  id: 'evie',
  label: 'Evie (In-App Agent)',
  description: 'Evie is the conversational AI assistant embedded in the TrustPager CRM sidebar. These endpoints are separate from the standard /api/v1 gateway and use OAuth tokens minted specifically for the in-app agent.',
  endpoints: [
    // -------------------------------------------------------------------------
    // evie-grant: mint OAuth token
    // -------------------------------------------------------------------------
    {
      method: 'POST',
      path: '/evie-grant',
      description: 'Mint an Evie OAuth token for the authenticated user. The caller must supply a Supabase JWT (portal session token) as the Bearer credential. The endpoint verifies workspace membership and returns a tp_oauth_* token scoped to the intersection of the client max-scopes and the user role scopes. Idempotent: re-calling revokes any prior Evie token for the same (user, company) pair and issues a fresh one. Store the returned access_token in sessionStorage; include it as Bearer on all /agent-chat calls.',
      scopes: [],
      isWrite: true,
      params: [
        { name: 'company_id', type: 'uuid', required: true, description: 'Target workspace company ID. Must be a workspace the authenticated user belongs to.', in: 'body' },
      ],
      requestExample: `POST /functions/v1/evie-grant
Authorization: Bearer <supabase-jwt>
Content-Type: application/json

{
  "company_id": "ebeff86e-7b09-4e49-96db-f711d69d2d57"
}`,
      responseExample: `{
  "access_token": "tp_oauth_a1b2c3d4e5f6...",
  "token_type": "Bearer",
  "scope": "contacts:read opportunities:read tasks:write ...",
  "scope_count": 47
}`,
      notes: [
        'This endpoint requires verify_jwt=true - the caller must supply a valid Supabase JWT, not a tp_live_* API key.',
        'The returned tp_oauth_* token is scoped via intersection: (evie_in_app client max-scopes) AND (user role scopes). Admins get a broader set than viewers.',
        'Destructive actions (delete, certain writes) may require approval-tier scopes and route through the approval queue at /settings/api?tab=approvals.',
        'The evie_in_app OAuth client is bootstrapped automatically on first grant call - no pre-configuration required.',
      ],
    },

    // -------------------------------------------------------------------------
    // agent-chat: SSE conversation endpoint
    // -------------------------------------------------------------------------
    {
      method: 'POST',
      path: '/agent-chat',
      description: 'Run a single Evie conversation turn and stream the result via Server-Sent Events (SSE). The caller supplies a tp_oauth_* token (from /evie-grant) as the Bearer credential. Evie uses the token scopes to determine which CRM tools she can call, dispatches tool calls in-process (no HTTP round-trip per tool), and streams text + tool-call events back in real time. The thread is created automatically on the first message; supply thread_id on subsequent messages to continue a conversation. Model: TrustPager AI Standard (fast) by default; prefix your message with /think for TrustPager AI Advanced.',
      scopes: [],
      isWrite: true,
      params: [
        { name: 'message', type: 'string', required: true, description: 'User message text. Prefix with /think to use the advanced reasoning model.', in: 'body' },
        { name: 'thread_id', type: 'uuid', required: false, description: 'Existing thread ID for multi-turn conversations. Omit to start a new thread.', in: 'body' },
        {
          name: 'context',
          type: 'object',
          required: false,
          description: 'Portal context for grounding Evie in the user current location. Include current_route (e.g. /crm/opportunities/123), entity_type (opportunity|contact|company), and entity_id when on a detail page.',
          in: 'body',
        },
        {
          name: 'attachments',
          type: 'array',
          required: false,
          description: 'Image attachments (jpeg, png, gif, webp). Each item: { media_type, data (base64 without data: prefix), secure_file_id? }. Max 5MB per image.',
          in: 'body',
        },
      ],
      requestExample: `POST /functions/v1/agent-chat
Authorization: Bearer tp_oauth_a1b2c3d4e5f6...
Content-Type: application/json

{
  "message": "How many open opportunities do we have in the Sales pipeline?",
  "thread_id": "a1b2c3d4-...",
  "context": {
    "current_route": "/crm/pipelines",
    "entity_type": null,
    "entity_id": null
  }
}`,
      responseExample: `-- SSE stream events --

event: thread
data: {"thread_id":"a1b2c3d4-..."}

event: tool_use
data: {"id":"tu_abc","name":"list_pipelines","input":{},"status":"running","api_path":"GET /pipelines","portal_path":"/crm/pipelines"}

event: tool_result
data: {"id":"tu_abc","status":"ok","http_status":200,"body":{...},"credits_charged":0,"portal_path":"/crm/pipelines"}

event: tool_use
data: {"id":"tu_def","name":"list_opportunities","input":{"pipeline_id":"...","status":"open"},"status":"running","api_path":"GET /opportunities"}

event: tool_result
data: {"id":"tu_def","status":"ok","http_status":200,"body":{"data":[...],"pagination":{...}},"credits_charged":0}

event: text
data: {"text":"You have 12 open opportunities in the Sales pipeline, worth a combined $240,000."}

event: usage
data: {"model":"TrustPager AI Standard","input_tokens":2150,"output_tokens":48,"llm_credits_charged":3,"tool_credits_charged":0,"total_credits_charged":3,"routing_reason":"default"}

event: done
data: {"thread_id":"a1b2c3d4-..."}`,
      notes: [
        'This endpoint streams Server-Sent Events (SSE). Use EventSource or fetch with stream reading on the client.',
        'Thread ownership is enforced server-side: you can only continue threads created by your (user, company) pair.',
        'Tool calls that return HTTP 202 with an approval_id are queued for human review at /settings/api?tab=approvals. Evie surfaces these as "Pending approval" cards in the UI.',
        'Per-turn credits charged are reported in the usage event. LLM credits are debited post-turn; tool credits vary by tool.',
        'The /think prefix upgrades the model for that turn. This uses more credits.',
        'Max tool-call iterations per turn: 12. If the conversation requires more than 12 sequential tool calls, use /agent-chat-compact to summarise and continue.',
      ],
    },

    // -------------------------------------------------------------------------
    // agent-chat-compact: thread compaction
    // -------------------------------------------------------------------------
    {
      method: 'POST',
      path: '/agent-chat-compact',
      description: 'Compact a long Evie conversation thread into a new thread seeded with a summary of the original. Call this when a thread grows too long for efficient context handling. The original thread is marked as compacted (superseded_by_thread_id is set); the returned new_thread_id is ready for continued conversation. A mechanical compaction pass runs first (free); if the thread is still too long after that, a lightweight AI summarisation pass runs (small credit cost). The new thread starts with one assistant message summarising the conversation so far.',
      scopes: [],
      isWrite: true,
      params: [
        { name: 'thread_id', type: 'uuid', required: true, description: 'The thread to compact. Must belong to the authenticated (user, company) pair.', in: 'body' },
      ],
      requestExample: `POST /functions/v1/agent-chat-compact
Authorization: Bearer tp_oauth_a1b2c3d4e5f6...
Content-Type: application/json

{
  "thread_id": "a1b2c3d4-..."
}`,
      responseExample: `{
  "new_thread_id": "e5f6a7b8-...",
  "parent_thread_id": "a1b2c3d4-...",
  "summary_source": "mechanical",
  "stats": {
    "original_messages": 28,
    "after_messages": 6,
    "before_tokens": 9200,
    "after_tokens": 3100,
    "llm_input_tokens": 0,
    "llm_output_tokens": 0
  }
}`,
      notes: [
        'summary_source is "mechanical" (deterministic, zero LLM cost) or "haiku" (AI summary, small credit cost).',
        'The original thread cannot be compacted twice (returns 409 if already superseded).',
        'Continue the conversation by POSTing to /agent-chat with the new_thread_id.',
      ],
    },

    // -------------------------------------------------------------------------
    // _meta/tools: agent tool catalog
    // -------------------------------------------------------------------------
    {
      method: 'GET',
      path: '/api/v1/_meta/tools',
      description: 'Return the list of CRM tools available to the authenticated API key holder. Each tool entry includes: name (snake_case), description, input_schema (JSON Schema), preferred_model (haiku|sonnet), api_path, required_scopes, is_write, and portal_path. Tools are filtered by the caller scopes - a tp_live_* key with only contacts:read will see only read-scoped contact tools. Used internally by Evie to populate her tool catalog at chat-open; also useful for building your own agent on top of the TrustPager API.',
      scopes: [],
      isWrite: false,
      params: [],
      responseExample: `{
  "data": {
    "tools": [
      {
        "name": "list_opportunities",
        "description": "List open, won, or lost opportunities. Filter by pipeline, stage, contact, or company. Returns paginated results with cursor.",
        "input_schema": {
          "type": "object",
          "properties": {
            "pipeline_id": { "type": "string", "description": "Filter by pipeline UUID" },
            "status": { "type": "string", "enum": ["open","won","lost"] },
            "limit": { "type": "number", "description": "Items per page (max 100)" }
          }
        },
        "preferred_model": "haiku",
        "api_path": "GET /opportunities",
        "required_scopes": ["opportunities:read"],
        "is_write": false,
        "portal_path": "/crm/opportunities"
      }
    ],
    "count": 54
  }
}`,
      notes: [
        'The tool catalog is scope-filtered: only tools whose required_scopes are satisfied by the caller token are returned.',
        'preferred_model indicates which AI model tier is recommended for this tool call. haiku is fast and cheap for read/simple ops; sonnet for subjective or complex output.',
        'This endpoint is GET-only, free (no credit cost), and idempotent.',
      ],
    },
  ],
};
