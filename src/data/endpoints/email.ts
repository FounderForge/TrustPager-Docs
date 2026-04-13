import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// EMAIL (12 endpoints - threads, send, reply, capabilities, logs, configs)
// =============================================================================

export const EMAIL: ResourceGroup = {
  id: 'email',
  label: 'Email',
  description: 'Send and receive emails via TrustPager Mail or Gmail, manage threads, view logs, and configure email settings. Supports provider selection for Gmail integration.',
  endpoints: [
    {
      method: 'GET',
      path: '/email/threads',
      description: 'List email threads with linked entities (contacts, deals, customers). Supports full-text subject search, entity-based filtering, participant email filtering, and direction filtering.',
      scopes: ['email:read'],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status (open, closed)', in: 'query' },
        { name: 'is_read', type: 'boolean', required: false, description: 'Filter by read status', in: 'query' },
        { name: 'is_automated', type: 'boolean', required: false, description: 'Filter by automated (true) or manual (false) threads', in: 'query' },
        { name: 'direction', type: 'string', required: false, description: 'Filter by last message direction: "inbound" or "outbound"', in: 'query' },
        { name: 'search', type: 'string', required: false, description: 'Search by subject (partial match, case-insensitive). Example: ?search=brochure', in: 'query' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Filter threads linked to a specific contact UUID via conversation links', in: 'query' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Filter threads linked to a specific customer/account UUID via conversation links', in: 'query' },
        { name: 'deal_id', type: 'uuid', required: false, description: 'Filter threads linked to a specific deal UUID via conversation links', in: 'query' },
        { name: 'participant', type: 'string', required: false, description: 'Filter by participant email address (exact match). Finds threads where the given email appears in the participants list.', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Cursor for pagination', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/email/threads?search=proposal&direction=inbound&limit=10" \\
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
      "participants": [{ "name": "John Smith", "email": "john@example.com" }],
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
      description: 'List all messages (inbound and outbound) in a thread, sorted chronologically. Inbound messages include an "attachments" array with attachment metadata (name, mimeType, size). Outbound messages include "has_attachment" (boolean) and "attachment_filename" (string or null).',
      scopes: ['email:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Thread ID', in: 'path' },
        { name: 'limit', type: 'number', required: false, description: 'Max messages per page', in: 'query' },
      ],
      responseExample: `{
  "data": [
    {
      "id": "msg-uuid-...",
      "direction": "inbound",
      "from_email": "client@example.com",
      "from_name": "Jane Doe",
      "subject": "RE: Project Proposal",
      "text_body": "Thanks for the proposal...",
      "attachments": [
        { "name": "contract.pdf", "mimeType": "application/pdf", "size": 45231 }
      ],
      "created_at": "2026-03-22T15:30:00Z"
    },
    {
      "id": "msg-uuid-...",
      "direction": "outbound",
      "sender_email": "team@company.com",
      "recipient_email": "client@example.com",
      "has_attachment": true,
      "attachment_filename": "proposal_v2.pdf",
      "created_at": "2026-03-22T16:00:00Z"
    }
  ],
  "pagination": { "limit": 25, "has_more": false, "next_cursor": null, "prev_cursor": null }
}`,
    },
    {
      method: 'POST',
      path: '/email/send',
      description: 'Send a new email. Default mode is "company" (uses configured Company Mail provider). Use mode "personal" with sender_user_id to send from a specific user\'s Gmail. When contact_id or deal_id is provided, an outbound email activity is automatically logged to their CRM timeline.',
      scopes: ['email:send'],
      isWrite: true,
      params: [
        { name: 'to_email', type: 'string', required: true, description: 'Recipient email address', in: 'body' },
        { name: 'to_name', type: 'string', required: false, description: 'Recipient name', in: 'body' },
        { name: 'subject', type: 'string', required: true, description: 'Email subject', in: 'body' },
        { name: 'html_body', type: 'string', required: true, description: 'HTML email body', in: 'body' },
        { name: 'mode', type: 'string', required: false, description: 'Send mode: "company" (default) or "personal"', in: 'body' },
        { name: 'sender_user_id', type: 'uuid', required: false, description: 'User UUID whose Gmail to send from (required when mode is "personal")', in: 'body' },
        { name: 'from_email', type: 'string', required: false, description: 'Send-as alias when mode is "personal". Must be a valid alias for the sender (use GET /email/capabilities to see available aliases). If omitted, auto-resolves to the user\'s workspace email if it is a valid alias.', in: 'body' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Link to contact. Auto-logs an outbound email activity on the contact timeline.', in: 'body' },
        { name: 'deal_id', type: 'uuid', required: false, description: 'Link to deal. Auto-logs an outbound email activity on the deal timeline.', in: 'body' },
        { name: 'cc', type: 'string', required: false, description: 'CC recipients as comma-separated email addresses', in: 'body' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Link to customer', in: 'body' },
        { name: 'email_config_id', type: 'uuid', required: false, description: 'Email config to use (defaults to company default)', in: 'body' },
        { name: 'attachments', type: 'array', required: false, description: 'File attachments (Gmail only, max 25MB total). Array of objects with filename, mime_type, and content (base64-encoded file data).', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/email/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to_email": "client@example.com",
    "to_name": "Jane Doe",
    "subject": "Your CRM Setup Report",
    "html_body": "<h1>Hello!</h1><p>See attached report.</p>",
    "mode": "personal",
    "sender_user_id": "user-uuid-...",
    "attachments": [
      {
        "filename": "report.pdf",
        "mime_type": "application/pdf",
        "content": "JVBERi0xLjQg... (base64-encoded file)"
      }
    ]
  }'`,
    },
    {
      method: 'POST',
      path: '/email/reply',
      description: 'Reply to an existing email thread. Default mode is "company" (uses configured provider). Use mode "personal" with sender_user_id for a user\'s Gmail.',
      scopes: ['email:send'],
      isWrite: true,
      params: [
        { name: 'thread_id', type: 'uuid', required: true, description: 'Thread ID to reply to', in: 'body' },
        { name: 'reply_html', type: 'string', required: true, description: 'Reply HTML body', in: 'body' },
        { name: 'to_email', type: 'string', required: true, description: 'Recipient email', in: 'body' },
        { name: 'to_name', type: 'string', required: false, description: 'Recipient name', in: 'body' },
        { name: 'cc', type: 'string', required: false, description: 'CC recipients as comma-separated email addresses', in: 'body' },
        { name: 'in_reply_to', type: 'string', required: false, description: 'Message ID to reply to (for threading)', in: 'body' },
        { name: 'mode', type: 'string', required: false, description: 'Send mode: "company" (default) or "personal"', in: 'body' },
        { name: 'sender_user_id', type: 'uuid', required: false, description: 'User UUID whose Gmail to reply from (required when mode is "personal")', in: 'body' },
        { name: 'from_email', type: 'string', required: false, description: 'Send-as alias when mode is "personal". Must be a valid alias for the sender. Use GET /email/capabilities to see available aliases.', in: 'body' },
        { name: 'attachments', type: 'array', required: false, description: 'File attachments (Gmail only, max 25MB total). Array of objects with filename, mime_type, and content (base64-encoded file data).', in: 'body' },
      ],
    },
    {
      method: 'GET',
      path: '/email/capabilities',
      description: 'Check email sending capabilities. Returns authenticated_user (the API caller\'s identity), Company Mail provider (TrustPager Mail or Gmail), and which users have personal Gmail connected. Use authenticated_user to identify who "I" is for personal/conversational sends.',
      scopes: ['email:read'],
      isWrite: false,
      responseExample: `{
  "data": {
    "authenticated_user": {
      "user_id": "user-uuid-...",
      "name": "Simon Smith",
      "email": "simon@company.com",
      "has_personal_gmail": true,
      "hint": "This is the user who owns the API key. For personal sends, use mode \\"personal\\" with this user's sender_user_id."
    },
    "company_mail": {
      "configured": true,
      "provider": "gmail",
      "gmail_email": "team@example.com",
      "gmail_sender_user_id": "user-uuid-...",
      "connection_status": "active",
      "send_as_aliases": [
        { "email": "team@example.com", "displayName": "Team Name", "isDefault": true }
      ]
    },
    "personal_gmail_users": [
      {
        "user_id": "user-uuid-...",
        "email": "simon@company.com",
        "display_name": "Simon Smith",
        "gmail_address": "simon@gmail.com",
        "send_as_aliases": [
          { "email": "simon@company.com", "displayName": "Simon Smith", "isDefault": true },
          { "email": "team@company.com", "displayName": "Team", "isDefault": false }
        ]
      }
    ]
  }
}`,
    },
    {
      method: 'GET',
      path: '/email/logs',
      description: 'List email send logs. Each log includes subject, recipient_email, sender_email, status, provider, cc, thread_id, and sender_user_id. Filter by status, contact, deal, type, or provider.',
      scopes: ['email:read'],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status (sent, delivered, bounced, failed, spam_complaint)', in: 'query' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Filter by contact UUID', in: 'query' },
        { name: 'deal_id', type: 'uuid', required: false, description: 'Filter by deal UUID', in: 'query' },
        { name: 'email_type', type: 'string', required: false, description: 'Filter by type (e.g. form_submission, automation, manual)', in: 'query' },
        { name: 'provider', type: 'string', required: false, description: 'Filter by provider: "postmark" or "gmail"', in: 'query' },
      ],
      responseExample: `{
  "data": [
    {
      "id": "log-uuid-...",
      "subject": "Welcome to TrustPager",
      "recipient_email": "client@example.com",
      "recipient_name": "Jane Doe",
      "sender_email": "team@company.com",
      "sender_name": "Acme Corp",
      "sender_user_id": null,
      "email_type": "automation",
      "status": "delivered",
      "provider": "postmark",
      "cc": null,
      "thread_id": null,
      "contact_id": "contact-uuid-...",
      "customer_id": null,
      "deal_id": null,
      "created_at": "2026-04-14T10:00:00Z"
    }
  ],
  "pagination": { "limit": 25, "has_more": false, "next_cursor": null }
}`,
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
        { name: 'email_provider', type: 'string', required: false, description: 'Company Mail provider: "postmark" (TrustPager Mail) or "gmail"', in: 'body' },
        { name: 'gmail_sender_user_id', type: 'uuid', required: false, description: 'User UUID whose Gmail is used when email_provider is "gmail"', in: 'body' },
      ],
    },
    {
      method: 'PATCH',
      path: '/email/configs/:id',
      description: 'Update an email configuration. Set email_provider to "gmail" and gmail_sender_user_id to switch Company Mail to Gmail.',
      scopes: ['email-config:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Email config ID', in: 'path' },
        { name: 'email_provider', type: 'string', required: false, description: 'Company Mail provider: "postmark" (TrustPager Mail) or "gmail"', in: 'body' },
        { name: 'gmail_sender_user_id', type: 'uuid', required: false, description: 'User UUID whose Gmail is used when email_provider is "gmail"', in: 'body' },
      ],
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
