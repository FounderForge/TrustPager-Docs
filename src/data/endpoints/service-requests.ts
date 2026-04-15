import { type ResourceGroup } from './types.js';

export const SERVICE_REQUESTS: ResourceGroup = {
  id: 'service-requests',
  label: 'Service Requests',
  description: 'Submit platform improvement requests. Designed for AI agents to report missing capabilities, suggest new features, and flag issues with the MCP, API, or platform.',
  endpoints: [
    {
      method: 'POST',
      path: '/service-requests',
      description: 'Submit a platform improvement request. Stores the request and notifies the engineering team via Slack.',
      scopes: ['service-requests:write'],
      isWrite: true,
      params: [
        { name: 'title', type: 'string', required: true, description: 'Brief summary of the improvement needed (max 200 chars)', in: 'body' },
        { name: 'description', type: 'string', required: true, description: 'Detailed explanation: what you tried, what happened, what should happen instead (max 5000 chars)', in: 'body' },
        { name: 'category', type: 'string', required: false, description: 'Category: missing_tool, missing_field, missing_filter, better_errors, new_capability, workflow_improvement, documentation, bug_report, other', in: 'body' },
        { name: 'affected_tools', type: 'string[]', required: false, description: 'Array of MCP tool names or API endpoints affected', in: 'body' },
        { name: 'suggested_solution', type: 'string', required: false, description: 'What you wish existed from the API/MCP consumer perspective', in: 'body' },
        { name: 'use_case', type: 'string', required: false, description: 'The real-world user task that triggered this request', in: 'body' },
        { name: 'priority', type: 'string', required: false, description: 'Priority: low, medium, high, critical', in: 'body' },
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
    "priority": "medium"
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
    "created_at": "2026-03-25T05:08:56.498025+00:00"
  },
  "meta": { "credits_remaining": 3457 }
}`,
    },
    {
      method: 'POST',
      path: '/service-requests/:id/notes',
      description: 'Add a note to an existing service request. Notes are appended to a JSONB array on the record. Each note stores a UUID, the user_id of the API key owner, the content text, and a created_at timestamp. Useful for adding follow-up information or status updates after the initial request.',
      scopes: ['service-requests:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Service request UUID', in: 'path' },
        { name: 'content', type: 'string', required: true, description: 'Text content of the note (max 5000 chars)', in: 'body' },
      ],
      requestExample: `curl -X POST https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/service-requests/f112de7b-c7df-4193-bacd-2d43c31c1f11/notes \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "Investigated the issue — confirmed the filter parameter is missing from the query builder. Scheduled for sprint 14."
  }'`,
      responseExample: `{
  "data": {
    "id": "f112de7b-c7df-4193-bacd-2d43c31c1f11",
    "title": "Add status filter to list_deals",
    "notes": [
      {
        "id": "572f46fd-a78b-4115-8636-215cdd5c204a",
        "user_id": "771a4a38-3a5d-4a9b-98c3-e10879850c9d",
        "content": "Investigated the issue — confirmed the filter parameter is missing from the query builder. Scheduled for sprint 14.",
        "created_at": "2026-04-15T20:47:11.328Z"
      }
    ],
    "status": "pending",
    "created_at": "2026-03-25T05:08:56.498025+00:00"
  },
  "meta": { "credits_remaining": 3454, "url": "https://app.trustpager.com/settings/service-requests" }
}`,
    },
  ],
};
