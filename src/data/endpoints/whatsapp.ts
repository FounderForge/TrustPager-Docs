import { type ResourceGroup } from './types.js';

// =============================================================================
// WHATSAPP
// =============================================================================

export const WHATSAPP: ResourceGroup = {
  id: 'whatsapp',
  label: 'WhatsApp',
  description: 'Send and receive WhatsApp messages. Pair a phone number, view 1:1 conversations and group conversations, send messages, and manage CRM links.',
  endpoints: [
    // -------------------------------------------------------------------------
    // Pairing
    // -------------------------------------------------------------------------
    {
      method: 'GET',
      path: '/whatsapp/pairing',
      description: 'Get the WhatsApp pairing status for the current user. Returns status (connected / awaiting_qr / connecting / disconnected / failed), paired phone number, and QR code data URL when pairing is in progress.',
      scopes: ['whatsapp:read'],
      isWrite: false,
      responseExample: `// Connected pairing
{
  "data": {
    "pairing": {
      "id": "uuid...",
      "status": "connected",
      "paired_phone_e164": "+61412345678",
      "paired_display_name": "Simon",
      "paired_at": "2026-05-28T10:00:00Z",
      "synced_company_ids": ["ebeff86e-..."]
    }
  }
}

// No pairing active
{ "data": { "pairing": null } }`,
    },
    {
      method: 'POST',
      path: '/whatsapp/pair',
      description: 'Begin pairing a WhatsApp account. Returns a QR code data URL the user scans in WhatsApp (Settings -> Linked Devices -> Link a Device). Poll GET /whatsapp/pairing every few seconds until status becomes "connected".',
      scopes: ['whatsapp:write'],
      isWrite: true,
      responseExample: `{
  "data": {
    "success": true,
    "pairing_id": "uuid...",
    "qr_code_data_url": "data:image/png;base64,...",
    "pairing_code": "ABCD-EFGH",
    "status": "awaiting_qr",
    "qr_expires_at": "2026-05-28T10:01:00Z"
  }
}`,
    },
    {
      method: 'POST',
      path: '/whatsapp/disconnect',
      description: 'Disconnect the current WhatsApp pairing. Deletes the underlying session and clears the pairing row. Use to re-pair against a different phone number.',
      scopes: ['whatsapp:write'],
      isWrite: true,
    },

    // -------------------------------------------------------------------------
    // Conversations (1:1 inbox)
    // -------------------------------------------------------------------------
    {
      method: 'GET',
      path: '/whatsapp/conversations',
      description: 'List WhatsApp 1:1 conversations. Returns phone number, last message preview, unread count, and linked CRM entities. Supports cursor pagination.',
      scopes: ['whatsapp:read'],
      isWrite: false,
      params: [
        { name: 'limit', type: 'number', required: false, description: 'Items per page (default 25, max 100)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
        { name: 'status', type: 'string', required: false, description: 'Filter by status: open or closed', in: 'query' },
        { name: 'external_phone', type: 'string', required: false, description: 'Filter by E.164 phone number', in: 'query' },
        { name: 'unread', type: 'boolean', required: false, description: 'true to return only conversations with unread messages', in: 'query' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Filter conversations linked to a contact', in: 'query' },
        { name: 'opportunity_id', type: 'uuid', required: false, description: 'Filter conversations linked to an opportunity', in: 'query' },
      ],
    },
    {
      method: 'GET',
      path: '/whatsapp/conversations/:id',
      description: 'Get a single WhatsApp conversation by ID.',
      scopes: ['whatsapp:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Conversation UUID', in: 'path' }],
    },
    {
      method: 'PATCH',
      path: '/whatsapp/conversations/:id',
      description: 'Update a WhatsApp conversation. Set unread_count to 0 to mark as read, change status, or link/unlink CRM entities.',
      scopes: ['whatsapp:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Conversation UUID', in: 'path' },
        { name: 'unread_count', type: 'number', required: false, description: 'Set to 0 to mark as read', in: 'body' },
        { name: 'status', type: 'string', required: false, description: 'Conversation status: open or closed', in: 'body' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Link to contact UUID (null to unlink)', in: 'body' },
        { name: 'opportunity_id', type: 'uuid', required: false, description: 'Link to opportunity UUID (null to unlink)', in: 'body' },
      ],
    },
    {
      method: 'GET',
      path: '/whatsapp/conversations/:id/messages',
      description: 'List messages in a WhatsApp 1:1 conversation. Returns message body, direction (inbound/outbound), delivery status, and timestamps.',
      scopes: ['whatsapp:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Conversation UUID', in: 'path' },
        { name: 'limit', type: 'number', required: false, description: 'Items per page (default 50, max 200)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for older messages', in: 'query' },
        { name: 'direction', type: 'string', required: false, description: 'Filter by direction: inbound or outbound', in: 'query' },
      ],
    },

    // -------------------------------------------------------------------------
    // Send (1:1)
    // -------------------------------------------------------------------------
    {
      method: 'POST',
      path: '/whatsapp/send',
      description: 'Send a WhatsApp message to a phone number or into an existing conversation. Costs 2 credits. Either to_phone or conversation_id is required. Sends are suppressed if the contact has whatsapp_unsubscribed: true on their contact record.',
      scopes: ['whatsapp:send'],
      isWrite: true,
      params: [
        { name: 'to_phone', type: 'string', required: false, description: 'Recipient phone in E.164 format (required if conversation_id is omitted)', in: 'body' },
        { name: 'conversation_id', type: 'uuid', required: false, description: 'Existing conversation UUID to reply into (required if to_phone is omitted)', in: 'body' },
        { name: 'body', type: 'string', required: true, description: 'Message text. Supports Unicode and emoji.', in: 'body' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Link send to a contact for CRM timeline', in: 'body' },
        { name: 'opportunity_id', type: 'uuid', required: false, description: 'Link send to an opportunity for CRM timeline', in: 'body' },
      ],
      responseExample: `{
  "data": {
    "success": true,
    "whatsapp_message_id": "uuid...",
    "conversation_id": "uuid...",
    "status": "queued"
  }
}`,
    },

    // -------------------------------------------------------------------------
    // Groups
    // -------------------------------------------------------------------------
    {
      method: 'GET',
      path: '/whatsapp/groups',
      description: 'List WhatsApp groups the paired account is a member of. Returns group name, member count, last message preview, and linked CRM entities.',
      scopes: ['whatsapp:read'],
      isWrite: false,
      params: [
        { name: 'limit', type: 'number', required: false, description: 'Items per page (default 25, max 100)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
        { name: 'linked_deal_id', type: 'uuid', required: false, description: 'Filter groups linked to an opportunity UUID', in: 'query' },
        { name: 'linked_customer_id', type: 'uuid', required: false, description: 'Filter groups linked to a company UUID', in: 'query' },
        { name: 'unlinked', type: 'boolean', required: false, description: 'true to return only groups not linked to any CRM entity', in: 'query' },
      ],
    },
    {
      method: 'GET',
      path: '/whatsapp/groups/:id',
      description: 'Get a single WhatsApp group by ID.',
      scopes: ['whatsapp:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Group UUID', in: 'path' }],
    },
    {
      method: 'PATCH',
      path: '/whatsapp/groups/:id',
      description: 'Update a WhatsApp group record. Link to CRM entities (opportunity, company) or mark as read.',
      scopes: ['whatsapp:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Group UUID', in: 'path' },
        { name: 'unread_count', type: 'number', required: false, description: 'Set to 0 to mark as read', in: 'body' },
        { name: 'linked_deal_id', type: 'uuid', required: false, description: 'Link to opportunity UUID (null to unlink)', in: 'body' },
        { name: 'linked_customer_id', type: 'uuid', required: false, description: 'Link to company UUID (null to unlink)', in: 'body' },
      ],
    },
    {
      method: 'GET',
      path: '/whatsapp/groups/:id/messages',
      description: 'List messages in a WhatsApp group conversation.',
      scopes: ['whatsapp:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Group UUID', in: 'path' },
        { name: 'limit', type: 'number', required: false, description: 'Items per page (default 50, max 200)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for older messages', in: 'query' },
        { name: 'direction', type: 'string', required: false, description: 'Filter by direction: inbound or outbound', in: 'query' },
      ],
    },
    {
      method: 'POST',
      path: '/whatsapp/groups/send',
      description: 'Send a message into a WhatsApp group. Costs 2 credits. The group must be visible to the workspace (the paired account is a member).',
      scopes: ['whatsapp:send'],
      isWrite: true,
      params: [
        { name: 'group_id', type: 'uuid', required: true, description: 'Group UUID (from GET /whatsapp/groups)', in: 'body' },
        { name: 'body', type: 'string', required: true, description: 'Message text. Supports Unicode and emoji.', in: 'body' },
      ],
    },
  ],
};
