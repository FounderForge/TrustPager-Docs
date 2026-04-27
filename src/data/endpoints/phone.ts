import { type ResourceGroup } from './types.js';

// =============================================================================
// PHONE
// =============================================================================

export const PHONE: ResourceGroup = {
  id: 'phone',
  label: 'Phone',
  description: 'Manage phone numbers and call logs. Search for available numbers to purchase.',
  endpoints: [
    { method: 'GET', path: '/phone/numbers', description: 'List company phone numbers.', scopes: ['phone:read'], isWrite: false },
    { method: 'POST', path: '/phone/numbers/search', description: 'Search available phone numbers to purchase.', scopes: ['phone:read'], isWrite: false, params: [{ name: 'country', type: 'string', required: false, description: 'Country code (default: AU)', in: 'body' }, { name: 'area_code', type: 'string', required: false, description: 'Area code filter', in: 'body' }] },
    { method: 'POST', path: '/phone/numbers/buy', description: 'Purchase a phone number.', scopes: ['phone:write'], isWrite: true, params: [{ name: 'phone_number', type: 'string', required: true, description: 'Phone number to purchase', in: 'body' }] },
    { method: 'DELETE', path: '/phone/numbers/:id', description: 'Release a phone number.', scopes: ['phone:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Phone number ID', in: 'path' }] },
    { method: 'GET', path: '/phone/numbers/:id', description: 'Get a specific phone number by ID.', scopes: ['phone:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Phone number ID', in: 'path' }] },
    {
      method: 'PATCH',
      path: '/phone/numbers/:id',
      description: 'Update phone number settings. Settable fields: friendly_name, transfer_number, inbound_voice_agent_config_id (voice_agent_config UUID or null), outbound_voice_agent_config_id (voice_agent_config UUID or null). When either agent assignment field is included, the API immediately pushes the change to Retell and returns retell_last_synced_at / retell_last_sync_error. Retell sync failure does NOT roll back the DB write.',
      scopes: ['phone:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Phone number ID', in: 'path' },
        { name: 'friendly_name', type: 'string', required: false, description: 'Display name', in: 'body' },
        { name: 'transfer_number', type: 'string', required: false, description: 'Call forwarding number in E.164 format', in: 'body' },
        { name: 'inbound_voice_agent_config_id', type: 'string|null', required: false, description: 'voice_agent_config UUID for answering inbound calls. Pass null to clear.', in: 'body' },
        { name: 'outbound_voice_agent_config_id', type: 'string|null', required: false, description: 'voice_agent_config UUID for outbound caller ID. Pass null to clear.', in: 'body' },
      ],
    },
    { method: 'POST', path: '/phone/numbers/:id/release', description: 'Release a phone number.', scopes: ['phone:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Phone number ID', in: 'path' }] },
    { method: 'GET', path: '/phone/call-logs', description: 'List phone call logs.', scopes: ['calls:read'], isWrite: false },
    { method: 'GET', path: '/phone/addresses', description: 'List regulatory addresses for phone compliance.', scopes: ['phone:read'], isWrite: false },
    { method: 'POST', path: '/phone/addresses', description: 'Create a regulatory address for phone compliance.', scopes: ['phone:write'], isWrite: true },
    { method: 'GET', path: '/phone/bundles', description: 'List regulatory bundles for phone compliance.', scopes: ['phone:read'], isWrite: false },
    { method: 'POST', path: '/phone/bundles', description: 'Create a regulatory bundle.', scopes: ['phone:write'], isWrite: true },
    { method: 'POST', path: '/phone/bundles/:id/submit', description: 'Submit a regulatory bundle for review.', scopes: ['phone:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Bundle ID', in: 'path' }] },
  ],
};
