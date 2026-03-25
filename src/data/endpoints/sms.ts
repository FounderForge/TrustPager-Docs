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
  ],
};
