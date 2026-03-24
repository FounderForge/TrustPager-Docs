import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// EMAIL (11 endpoints)
// =============================================================================

export const EMAIL: ResourceGroup = {
  id: 'email',
  label: 'Email',
  description: 'Send and receive emails, manage threads, view logs, and configure email settings. Emails are sent via Postmark.',
  endpoints: [
    {
      method: 'GET',
      path: '/email/threads',
      description: 'List email threads with linked entities (contacts, deals, customers).',
      scopes: ['email:read'],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status (open, closed)', in: 'query' },
        { name: 'is_read', type: 'boolean', required: false, description: 'Filter by read status', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Cursor for pagination', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/email/threads?status=open&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "thread-uuid-...",
      "subject": "RE: Project Proposal",
      "status": "open",
      "is_read": false,
      "message_count": 3,
      "last_message_at": "2026-03-22T15:30:00Z",
      "last_message_direction": "inbound",
      "last_message_preview": "Thanks for the proposal...",
      "linked_entities": {
        "contacts": [{ "id": "...", "first_name": "John", "last_name": "Smith" }],
        "deals": [{ "id": "...", "name": "Website Redesign" }],
        "customers": []
      }
    }
  ],
  "pagination": { "limit": 10, "has_more": false, "next_cursor": null, "prev_cursor": null }
}`,
    },
    {
      method: 'GET',
      path: '/email/threads/:id',
      description: 'Retrieve a single email thread with linked entities.',
      scopes: ['email:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Thread ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/email/threads/:id/messages',
      description: 'List all messages (inbound and outbound) in a thread, sorted chronologically.',
      scopes: ['email:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Thread ID', in: 'path' },
        { name: 'limit', type: 'number', required: false, description: 'Max messages per page', in: 'query' },
      ],
    },
    {
      method: 'POST',
      path: '/email/send',
      description: 'Send a new email. Requires to_email, subject, and html_body.',
      scopes: ['email:send'],
      isWrite: true,
      params: [
        { name: 'to_email', type: 'string', required: true, description: 'Recipient email address', in: 'body' },
        { name: 'to_name', type: 'string', required: false, description: 'Recipient name', in: 'body' },
        { name: 'subject', type: 'string', required: true, description: 'Email subject', in: 'body' },
        { name: 'html_body', type: 'string', required: true, description: 'HTML email body', in: 'body' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Link to contact', in: 'body' },
        { name: 'deal_id', type: 'uuid', required: false, description: 'Link to deal', in: 'body' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Link to customer', in: 'body' },
        { name: 'email_config_id', type: 'uuid', required: false, description: 'Email config to use (defaults to company default)', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/email/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to_email": "client@example.com",
    "to_name": "Jane Doe",
    "subject": "Your Proposal",
    "html_body": "<h1>Hello!</h1><p>Your proposal is ready.</p>",
    "deal_id": "deal-uuid-..."
  }'`,
    },
    {
      method: 'POST',
      path: '/email/reply',
      description: 'Reply to an existing email thread.',
      scopes: ['email:send'],
      isWrite: true,
      params: [
        { name: 'thread_id', type: 'uuid', required: true, description: 'Thread ID to reply to', in: 'body' },
        { name: 'reply_html', type: 'string', required: true, description: 'Reply HTML body', in: 'body' },
        { name: 'to_email', type: 'string', required: true, description: 'Recipient email', in: 'body' },
        { name: 'to_name', type: 'string', required: false, description: 'Recipient name', in: 'body' },
        { name: 'in_reply_to', type: 'string', required: false, description: 'Message ID to reply to (for threading)', in: 'body' },
      ],
    },
    {
      method: 'GET',
      path: '/email/logs',
      description: 'List email send logs with optional filters.',
      scopes: ['email:read'],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status', in: 'query' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Filter by contact', in: 'query' },
        { name: 'deal_id', type: 'uuid', required: false, description: 'Filter by deal', in: 'query' },
        { name: 'email_type', type: 'string', required: false, description: 'Filter by type', in: 'query' },
      ],
    },
    {
      method: 'GET',
      path: '/email/configs',
      description: 'List all email configurations for the company.',
      scopes: ['email:read'],
      isWrite: false,
    },
    {
      method: 'GET',
      path: '/email/configs/:id',
      description: 'Retrieve a specific email configuration.',
      scopes: ['email:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Email config ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/email/configs',
      description: 'Create an email configuration. Requires from_email, from_name, and staff_email.',
      scopes: ['email-config:write'],
      isWrite: true,
      params: [
        { name: 'from_email', type: 'string', required: true, description: 'Sender email address', in: 'body' },
        { name: 'from_name', type: 'string', required: true, description: 'Sender display name', in: 'body' },
        { name: 'staff_email', type: 'string', required: true, description: 'Staff notification email', in: 'body' },
        { name: 'config_name', type: 'string', required: false, description: 'Config display name', in: 'body' },
        { name: 'logo_url', type: 'string', required: false, description: 'Logo URL for emails', in: 'body' },
        { name: 'primary_color', type: 'string', required: false, description: 'Primary brand color hex', in: 'body' },
        { name: 'is_default', type: 'boolean', required: false, description: 'Set as default config', in: 'body' },
      ],
    },
    {
      method: 'PATCH',
      path: '/email/configs/:id',
      description: 'Update an email configuration.',
      scopes: ['email-config:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Email config ID', in: 'path' }],
    },
    {
      method: 'DELETE',
      path: '/email/configs/:id',
      description: 'Delete an email configuration.',
      scopes: ['email-config:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Email config ID', in: 'path' }],
    },
  ],
};
