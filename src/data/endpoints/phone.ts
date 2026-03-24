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
    { method: 'PATCH', path: '/phone/numbers/:id', description: 'Update phone number settings (friendly name, SMS forwarding, etc.).', scopes: ['phone:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Phone number ID', in: 'path' }] },
    { method: 'POST', path: '/phone/numbers/:id/release', description: 'Release a phone number.', scopes: ['phone:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Phone number ID', in: 'path' }] },
    { method: 'GET', path: '/phone/call-logs', description: 'List phone call logs.', scopes: ['calls:read'], isWrite: false },
    { method: 'GET', path: '/phone/addresses', description: 'List regulatory addresses for phone compliance.', scopes: ['phone:read'], isWrite: false },
    { method: 'POST', path: '/phone/addresses', description: 'Create a regulatory address for phone compliance.', scopes: ['phone:write'], isWrite: true },
    { method: 'GET', path: '/phone/bundles', description: 'List regulatory bundles for phone compliance.', scopes: ['phone:read'], isWrite: false },
    { method: 'POST', path: '/phone/bundles', description: 'Create a regulatory bundle.', scopes: ['phone:write'], isWrite: true },
    { method: 'POST', path: '/phone/bundles/:id/submit', description: 'Submit a regulatory bundle for review.', scopes: ['phone:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Bundle ID', in: 'path' }] },
  ],
};
