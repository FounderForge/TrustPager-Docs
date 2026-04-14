import { type ResourceGroup } from './types.js';

// =============================================================================
// SMS
// =============================================================================

export const SMS: ResourceGroup = {
  id: 'sms',
  label: 'SMS',
  description: 'Send and receive SMS messages. View conversations and message history.',
  endpoints: [
    { method: 'GET', path: '/sms/conversations', description: 'List SMS conversations. Returns involved_user_ids showing which team members have interacted.', scopes: ['sms:read'], isWrite: false },
    { method: 'GET', path: '/sms/conversations/:id', description: 'Retrieve an SMS conversation with involved_user_ids and linked entities.', scopes: ['sms:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Conversation ID', in: 'path' }] },
    { method: 'GET', path: '/sms/conversations/:id/messages', description: 'List messages in a conversation.', scopes: ['sms:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Conversation ID', in: 'path' }] },
    { method: 'POST', path: '/sms/send', description: 'Send an SMS message.', scopes: ['sms:send'], isWrite: true, params: [{ name: 'to_number', type: 'string', required: true, description: 'Recipient phone number (E.164)', in: 'body' }, { name: 'message', type: 'string', required: true, description: 'SMS message body', in: 'body' }, { name: 'phone_number_id', type: 'uuid', required: false, description: 'Sender phone number ID', in: 'body' }] },
    {
      method: 'PATCH',
      path: '/sms/conversations/:id',
      description: 'Update an SMS conversation — set unread_count to 0 to mark as read, or change status.',
      scopes: ['sms:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Conversation UUID', in: 'path' },
        { name: 'unread_count', type: 'number', required: false, description: 'Set to 0 to mark conversation as read', in: 'body' },
        { name: 'status', type: 'string', required: false, description: 'Conversation status (e.g. active, archived)', in: 'body' },
      ],
    },
    {
      method: 'POST',
      path: '/sms/conversations/mark-read',
      description: 'Bulk mark SMS conversations as read. Use conversation_ids for specific conversations, or all:true to mark all unread conversations read. Returns the count of conversations updated.',
      scopes: ['sms:write'],
      isWrite: true,
      params: [
        { name: 'conversation_ids', type: 'uuid[]', required: false, description: 'Array of conversation UUIDs to mark as read (max 100). Omit if using all:true.', in: 'body' },
        { name: 'all', type: 'boolean', required: false, description: 'Set true to mark ALL unread conversations as read', in: 'body' },
      ],
    },
  ],
};
