import { type ResourceGroup } from './types.js';

export const SERVICE_REQUESTS: ResourceGroup = {
  id: 'service-requests',
  label: 'Service Requests',
  description: 'Submit and manage platform improvement requests. Designed for AI agents to report missing capabilities, suggest new features, and flag issues with the MCP, API, or platform. Supports listing, filtering, note threads, inline note editing, and two-way ticket linking.',
  endpoints: [
    {
      method: 'GET',
      path: '/service-requests',
      description: 'List service requests for the authenticated company. Supports cursor pagination and multiple filters. Returns requests in reverse-chronological order with full note threads and related_ids.',
      scopes: ['service-requests:read'],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status: pending, in_progress, resolved, closed', in: 'query' },
        { name: 'category', type: 'string', required: false, description: 'Filter by category stored in context JSON: missing_tool, missing_field, missing_filter, better_errors, new_capability, workflow_improvement, documentation, bug_report, other', in: 'query' },
        { name: 'priority', type: 'string', required: false, description: 'Filter by priority stored in context JSON: low, medium, high, critical', in: 'query' },
        { name: 'search', type: 'string', required: false, description: 'Case-insensitive search across title and description fields', in: 'query' },
        { name: 'affected_tool', type: 'string', required: false, description: 'Filter to requests that list this tool name in context.affected_tools', in: 'query' },
        { name: 'submitted_by_me', type: 'boolean', required: false, description: 'If true, return only requests submitted by the API key owner (user_id match)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Pagination cursor from a previous response', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Page size (default 25, max 100)', in: 'query' },
      ],
      requestExample: `curl https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/service-requests?status=pending&priority=high \\
  -H "Authorization: Bearer tp_live_..."`,
      responseExample: `{
  "data": [
    {
      "id": "f112de7b-c7df-4193-bacd-2d43c31c1f11",
      "title": "Add status filter to list_deals",
      "description": "Cannot filter deals by status (won/lost/open).",
      "status": "pending",
      "context": {
        "source": "api",
        "category": "missing_filter",
        "priority": "high",
        "affected_tools": ["list_deals"]
      },
      "related_ids": [],
      "notes": [],
      "created_at": "2026-04-19T05:08:56.498025+00:00",
      "updated_at": "2026-04-19T05:08:56.498025+00:00",
      "user_id": "771a4a38-3a5d-4a9b-98c3-e10879850c9d"
    }
  ],
  "meta": {
    "credits_remaining": 3457,
    "pagination": { "has_more": false, "next_cursor": null, "count": 1 }
  }
}`,
    },
    {
      method: 'GET',
      path: '/service-requests/:id',
      description: 'Get a single service request by ID. Returns the full record including notes array, related_ids, context JSON, and slack_message_ts.',
      scopes: ['service-requests:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Service request UUID', in: 'path' },
      ],
      requestExample: `curl https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/service-requests/f112de7b-c7df-4193-bacd-2d43c31c1f11 \\
  -H "Authorization: Bearer tp_live_..."`,
      responseExample: `{
  "data": {
    "id": "f112de7b-c7df-4193-bacd-2d43c31c1f11",
    "title": "Add status filter to list_deals",
    "description": "Cannot filter deals by status (won/lost/open). Had to fetch all deals and filter client-side.",
    "status": "pending",
    "context": {
      "source": "api",
      "category": "missing_filter",
      "priority": "medium",
      "affected_tools": ["list_deals"],
      "suggested_solution": "Add a status query parameter to GET /deals",
      "use_case": "User asked for a report of won deals from last quarter"
    },
    "related_ids": [],
    "notes": [],
    "slack_message_ts": "1745035736.123456",
    "created_at": "2026-04-19T05:08:56.498025+00:00",
    "updated_at": "2026-04-19T05:08:56.498025+00:00",
    "user_id": "771a4a38-3a5d-4a9b-98c3-e10879850c9d"
  },
  "meta": { "credits_remaining": 3456 }
}`,
    },
    {
      method: 'POST',
      path: '/service-requests',
      description: 'Submit a platform improvement request. Stores the request, sends a Slack notification to the engineering team, and returns the created record. Now accepts an optional related_ids array to link this request to existing requests at creation time (two-way symmetry is maintained automatically).',
      scopes: ['service-requests:write'],
      isWrite: true,
      params: [
        { name: 'title', type: 'string', required: true, description: 'Brief summary of the improvement needed (max 200 chars)', in: 'body' },
        { name: 'description', type: 'string', required: true, description: 'Detailed explanation: what you tried, what happened, what should happen instead (max 50000 chars)', in: 'body' },
        { name: 'category', type: 'string', required: false, description: 'Category: missing_tool, missing_field, missing_filter, better_errors, new_capability, workflow_improvement, documentation, bug_report, other', in: 'body' },
        { name: 'affected_tools', type: 'string[]', required: false, description: 'Array of MCP tool names or API endpoints affected, e.g. ["list_deals", "GET /deals"]', in: 'body' },
        { name: 'suggested_solution', type: 'string', required: false, description: 'What you wish existed from the API/MCP consumer perspective', in: 'body' },
        { name: 'use_case', type: 'string', required: false, description: 'The real-world user task that triggered this request', in: 'body' },
        { name: 'priority', type: 'string', required: false, description: 'Priority: low, medium, high, critical', in: 'body' },
        { name: 'related_ids', type: 'string[]', required: false, description: 'UUIDs of existing service requests to link to this one. Must belong to the same company. Two-way links are created automatically.', in: 'body' },
      ],
      requestExample: `curl -X POST https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/service-requests \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Add status filter to list_deals",
    "description": "Cannot filter deals by status (won/lost/open). Had to fetch all deals and filter client-side.",
    "category": "missing_filter",
    "affected_tools": ["list_deals"],
    "suggested_solution": "Add a status query parameter to GET /deals",
    "use_case": "User asked for a report of won deals from last quarter",
    "priority": "medium",
    "related_ids": ["a1b2c3d4-e5f6-7890-abcd-ef1234567890"]
  }'`,
      responseExample: `{
  "data": {
    "id": "f112de7b-c7df-4193-bacd-2d43c31c1f11",
    "title": "Add status filter to list_deals",
    "description": "Cannot filter deals by status (won/lost/open)...",
    "context": {
      "source": "api",
      "category": "missing_filter",
      "priority": "medium",
      "affected_tools": ["list_deals"],
      "suggested_solution": "Add a status query parameter to GET /deals",
      "use_case": "User asked for a report of won deals from last quarter"
    },
    "status": "pending",
    "related_ids": ["a1b2c3d4-e5f6-7890-abcd-ef1234567890"],
    "created_at": "2026-04-19T05:08:56.498025+00:00"
  },
  "meta": {
    "credits_remaining": 3457,
    "url": "https://app.trustpager.com/settings/service-requests",
    "message": "Service request logged. The customer can track all requests at the URL above."
  }
}`,
    },
    {
      method: 'POST',
      path: '/service-requests/:id/notes',
      description: 'Add a note to an existing service request. Notes are appended to a JSONB array on the record. Each note stores a UUID, the user_id of the API key owner, the content text, and a created_at timestamp. Does NOT change the request status. Max content length raised to 20000 chars.',
      scopes: ['service-requests:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Service request UUID', in: 'path' },
        { name: 'content', type: 'string', required: true, description: 'Text content of the note (max 20000 chars)', in: 'body' },
      ],
      requestExample: `curl -X POST https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/service-requests/f112de7b-c7df-4193-bacd-2d43c31c1f11/notes \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "Investigated the issue -- confirmed the filter parameter is missing from the query builder. Scheduled for sprint 14."
  }'`,
      responseExample: `{
  "data": {
    "id": "f112de7b-c7df-4193-bacd-2d43c31c1f11",
    "title": "Add status filter to list_deals",
    "notes": [
      {
        "id": "572f46fd-a78b-4115-8636-215cdd5c204a",
        "user_id": "771a4a38-3a5d-4a9b-98c3-e10879850c9d",
        "content": "Investigated the issue -- confirmed the filter parameter is missing from the query builder. Scheduled for sprint 14.",
        "created_at": "2026-04-19T20:47:11.328Z"
      }
    ],
    "status": "pending",
    "created_at": "2026-04-19T05:08:56.498025+00:00"
  },
  "meta": { "credits_remaining": 3454, "url": "https://app.trustpager.com/settings/service-requests" }
}`,
    },
    {
      method: 'PATCH',
      path: '/service-requests/:id/notes/:noteId',
      description: 'Edit an existing note on a service request. Only the original note author (matched by user_id of the API key owner) can edit their own notes. Adds an edited_at timestamp to the note object on success. Does NOT change the request status.',
      scopes: ['service-requests:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Service request UUID', in: 'path' },
        { name: 'noteId', type: 'string', required: true, description: 'Note UUID (from the id field inside the notes array)', in: 'path' },
        { name: 'content', type: 'string', required: true, description: 'Replacement content for the note (max 20000 chars)', in: 'body' },
      ],
      requestExample: `curl -X PATCH https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/service-requests/f112de7b-c7df-4193-bacd-2d43c31c1f11/notes/572f46fd-a78b-4115-8636-215cdd5c204a \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "Confirmed the filter parameter is missing. Now affects list_customers too. Escalating priority."
  }'`,
      responseExample: `{
  "data": {
    "id": "f112de7b-c7df-4193-bacd-2d43c31c1f11",
    "title": "Add status filter to list_deals",
    "notes": [
      {
        "id": "572f46fd-a78b-4115-8636-215cdd5c204a",
        "user_id": "771a4a38-3a5d-4a9b-98c3-e10879850c9d",
        "content": "Confirmed the filter parameter is missing. Now affects list_customers too. Escalating priority.",
        "created_at": "2026-04-19T20:47:11.328Z",
        "edited_at": "2026-04-19T21:05:33.000Z"
      }
    ],
    "status": "pending",
    "updated_at": "2026-04-19T21:05:33.000Z"
  },
  "meta": { "credits_remaining": 3453 }
}`,
    },
    {
      method: 'POST',
      path: '/service-requests/:id/links',
      description: 'Add or remove related service request links. Both directions are maintained automatically (two-way symmetry). A request cannot link to itself. All IDs must belong to the same company -- cross-company linking is rejected.',
      scopes: ['service-requests:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Service request UUID to update links on', in: 'path' },
        { name: 'add', type: 'string[]', required: false, description: 'UUIDs of service requests to link to this one. Each must exist in this company.', in: 'body' },
        { name: 'remove', type: 'string[]', required: false, description: 'UUIDs of service requests to unlink from this one. Two-way link is also removed.', in: 'body' },
      ],
      requestExample: `curl -X POST https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/service-requests/f112de7b-c7df-4193-bacd-2d43c31c1f11/links \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "add": ["a1b2c3d4-e5f6-7890-abcd-ef1234567890"],
    "remove": []
  }'`,
      responseExample: `{
  "data": {
    "id": "f112de7b-c7df-4193-bacd-2d43c31c1f11",
    "related_ids": ["a1b2c3d4-e5f6-7890-abcd-ef1234567890"],
    "updated_at": "2026-04-19T21:10:00.000Z"
  },
  "meta": { "credits_remaining": 3452 }
}`,
    },
  ],
};
