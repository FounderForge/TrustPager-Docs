import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// EMAIL CAMPAIGNS (9 endpoints - CRUD, send, audience preview, recipients, unsubscribes)
// =============================================================================

export const EMAIL_CAMPAIGNS: ResourceGroup = {
  id: 'email-campaigns',
  label: 'Email Campaigns',
  description: 'Create and send bulk broadcast email campaigns to segmented audiences. Supports tag-based and pipeline-based audience filters, delivery tracking (opens, clicks, bounces), and automatic unsubscribe management.',
  endpoints: [
    {
      method: 'GET',
      path: '/email-campaigns',
      description: 'List all email campaigns for the company. Filter by status.',
      scopes: ['email-campaigns:read'],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status: draft, scheduled, sending, sent, failed', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for pagination', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/email-campaigns?status=sent&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "campaign-uuid-...",
      "name": "April Newsletter",
      "status": "sent",
      "subject": "What's new this April",
      "recipient_count": 124,
      "sent_count": 124,
      "delivered_count": 121,
      "opened_count": 58,
      "clicked_count": 23,
      "bounced_count": 3,
      "unsubscribed_count": 1,
      "sent_at": "2026-04-01T09:00:00Z",
      "created_at": "2026-03-28T14:00:00Z"
    }
  ],
  "pagination": { "limit": 10, "has_more": false, "next_cursor": null }
}`,
    },
    {
      method: 'POST',
      path: '/email-campaigns',
      description: 'Create a new draft email campaign. Provide a name at minimum. Set subject, body_html, and segment_filter before sending.',
      scopes: ['email-campaigns:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Campaign display name', in: 'body' },
        { name: 'subject', type: 'string', required: false, description: 'Email subject line', in: 'body' },
        { name: 'intro_text', type: 'string', required: false, description: 'Optional intro text shown above the body', in: 'body' },
        { name: 'body_html', type: 'string', required: false, description: 'Email body as HTML', in: 'body' },
        { name: 'cta_text', type: 'string', required: false, description: 'Call-to-action button label', in: 'body' },
        { name: 'cta_url', type: 'string', required: false, description: 'Call-to-action button URL', in: 'body' },
        { name: 'show_reply_button', type: 'boolean', required: false, description: 'Show reply button in footer (default true)', in: 'body' },
        { name: 'email_config_id', type: 'uuid', required: false, description: 'Sender identity UUID. If omitted, auto-resolves to the company default Postmark config.', in: 'body' },
        { name: 'segment_filter', type: 'object', required: false, description: 'Audience filter. See segment_filter schema below.', in: 'body' },
        { name: 'scheduled_for', type: 'string', required: false, description: 'ISO 8601 timestamp to schedule send. Null = manual send.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/email-campaigns" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "April Newsletter",
    "subject": "What is new this April",
    "body_html": "<p>Hi {{first_name}},</p><p>Here is what we have been up to...</p>",
    "cta_text": "Read More",
    "cta_url": "https://example.com/blog",
    "segment_filter": {
      "tags": [{ "name": "newsletter" }],
      "exclude_unsubscribed": true
    }
  }'`,
      responseExample: `{
  "data": {
    "id": "campaign-uuid-...",
    "name": "April Newsletter",
    "status": "draft",
    "subject": "What is new this April",
    "body_html": "<p>Hi {{first_name}},</p>...",
    "segment_filter": { "tags": [{ "name": "newsletter" }], "exclude_unsubscribed": true },
    "created_at": "2026-04-01T10:00:00Z"
  }
}`,
    },
    {
      method: 'GET',
      path: '/email-campaigns/:id',
      description: 'Get a single campaign by ID with full content and delivery stats.',
      scopes: ['email-campaigns:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Campaign UUID', in: 'path' }],
    },
    {
      method: 'PATCH',
      path: '/email-campaigns/:id',
      description: 'Update a draft or scheduled campaign. Only draft and scheduled campaigns can be modified.',
      scopes: ['email-campaigns:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Campaign UUID', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'Campaign name', in: 'body' },
        { name: 'subject', type: 'string', required: false, description: 'Email subject', in: 'body' },
        { name: 'intro_text', type: 'string', required: false, description: 'Intro text', in: 'body' },
        { name: 'body_html', type: 'string', required: false, description: 'Email body HTML', in: 'body' },
        { name: 'cta_text', type: 'string', required: false, description: 'CTA button label', in: 'body' },
        { name: 'cta_url', type: 'string', required: false, description: 'CTA button URL', in: 'body' },
        { name: 'show_reply_button', type: 'boolean', required: false, description: 'Show reply button', in: 'body' },
        { name: 'email_config_id', type: 'uuid', required: false, description: 'Sender config UUID', in: 'body' },
        { name: 'segment_filter', type: 'object', required: false, description: 'Audience filter', in: 'body' },
        { name: 'scheduled_for', type: 'string', required: false, description: 'Schedule timestamp (ISO 8601)', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/email-campaigns/:id',
      description: 'Delete a campaign. Only draft or failed campaigns can be deleted.',
      scopes: ['email-campaigns:delete'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Campaign UUID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/email-campaigns/:id/send',
      description: 'Send a campaign immediately via Postmark broadcast stream. Campaign must be in draft or scheduled status, must have subject and body_html set, and must match at least one contact. Resolves audience, batches sends (up to 500 per batch), and records per-recipient status. This action cannot be undone.',
      scopes: ['email-campaigns:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Campaign UUID', in: 'path' }],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/email-campaigns/campaign-uuid-here/send" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": {
    "id": "campaign-uuid-...",
    "status": "sending",
    "recipient_count": 124,
    "sent_count": 124,
    "failed_count": 0
  }
}`,
    },
    {
      method: 'GET',
      path: '/email-campaigns/:id/preview-audience',
      description: 'Preview the audience that would receive this campaign. Returns total count and up to 50 sample contacts. Use before sending to confirm the segment filter is correct.',
      scopes: ['email-campaigns:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Campaign UUID', in: 'path' }],
      responseExample: `{
  "data": {
    "total": 124,
    "sample": [
      { "id": "contact-uuid", "email": "jane@example.com", "first_name": "Jane", "last_name": "Smith" }
    ]
  }
}`,
    },
    {
      method: 'GET',
      path: '/email-campaigns/:id/recipients',
      description: 'List per-recipient delivery records for a campaign. Filter by status or search by email. Statuses: queued, sent, delivered, opened, clicked, bounced, failed.',
      scopes: ['email-campaigns:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Campaign UUID', in: 'path' },
        { name: 'status', type: 'string', required: false, description: 'Filter by recipient status', in: 'query' },
        { name: 'search', type: 'string', required: false, description: 'Search by email address', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for pagination', in: 'query' },
      ],
      responseExample: `{
  "data": [
    {
      "id": "recipient-uuid",
      "email": "jane@example.com",
      "first_name": "Jane",
      "last_name": "Smith",
      "status": "opened",
      "opened_at": "2026-04-01T11:32:00Z",
      "clicked_at": null,
      "bounced_at": null,
      "created_at": "2026-04-01T09:00:00Z"
    }
  ],
  "pagination": { "limit": 25, "has_more": false, "next_cursor": null }
}`,
    },
    {
      method: 'GET',
      path: '/email-campaigns/unsubscribes',
      description: 'List all email unsubscribe records for the company. Includes reason (link_click, hard_bounce, complaint, unsubscribe_header) and the campaign that triggered it.',
      scopes: ['email-campaigns:read'],
      isWrite: false,
      params: [
        { name: 'limit', type: 'number', required: false, description: 'Max results', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for pagination', in: 'query' },
      ],
      responseExample: `{
  "data": [
    {
      "id": "unsub-uuid",
      "email": "john@example.com",
      "contact_id": "contact-uuid",
      "campaign_id": "campaign-uuid",
      "reason": "link_click",
      "created_at": "2026-04-01T11:45:00Z"
    }
  ],
  "pagination": { "limit": 25, "has_more": false }
}`,
    },
  ],
};
