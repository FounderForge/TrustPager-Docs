import { type ResourceGroup } from './types.js';

// =============================================================================
// APPROVALS
// =============================================================================

export const APPROVALS: ResourceGroup = {
  id: 'approvals',
  label: 'Approvals',
  description: 'Manage API actions queued for human approval. When an API key has a "with Approval" permission level, write operations are held here until a team member reviews them.',
  endpoints: [
    {
      method: 'GET',
      path: '/approvals',
      description: 'List pending (or all) approval requests for the company.',
      scopes: [],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status: pending (default), approved, rejected, expired, or all', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results per page (default 25, max 100)', in: 'query' },
      ],
      responseExample: `{
  "data": [
    {
      "id": "f1a2b3c4-...",
      "company_id": "ebeff86e-...",
      "api_key_id": "key-uuid",
      "resource": "contacts",
      "action": "write",
      "method": "POST",
      "path": "/contacts",
      "status": "pending",
      "request_body": { "first_name": "Jane", "email": "jane@example.com" },
      "target_id": null,
      "created_at": "2026-03-29T04:00:00Z",
      "expires_at": null,
      "resolved_at": null,
      "resolved_by": null
    }
  ],
  "meta": { "limit": 25, "has_more": false, "next_cursor": null, "prev_cursor": null }
}`,
    },
    {
      method: 'GET',
      path: '/approvals/:id',
      description: 'Get a single approval request by ID.',
      scopes: [],
      isWrite: false,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Approval UUID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/approvals/:id/approve',
      description: 'Approve and execute a queued API action. The stored operation is run immediately and the result is saved on the approval record.',
      scopes: [],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Approval UUID', in: 'path' },
      ],
      responseExample: `{
  "approval_id": "f1a2b3c4-...",
  "status": "approved",
  "execution_status": 201,
  "execution_result": { "id": "new-contact-uuid", "first_name": "Jane", "email": "jane@example.com" }
}`,
    },
    {
      method: 'POST',
      path: '/approvals/:id/reject',
      description: 'Reject a queued API action. The action is NOT executed. An optional rejection reason can be provided.',
      scopes: [],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Approval UUID', in: 'path' },
        { name: 'reason', type: 'string', required: false, description: 'Rejection reason (optional)', in: 'body' },
      ],
      requestExample: `{ "reason": "Duplicate contact already exists" }`,
      responseExample: `{ "approval_id": "f1a2b3c4-...", "status": "rejected" }`,
    },
  ],
};
