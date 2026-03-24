import { type ResourceGroup } from './types.js';

// =============================================================================
// BILLING
// =============================================================================

export const BILLING: ResourceGroup = {
  id: 'billing',
  label: 'Billing',
  description: 'View billing plans and credit balance.',
  endpoints: [
    { method: 'GET', path: '/billing/plan', description: 'Get the company billing plan details.', scopes: ['billing:read'], isWrite: false },
    { method: 'GET', path: '/billing/balance', description: 'Get the current API credit balance.', scopes: ['billing:read'], isWrite: false },
    { method: 'GET', path: '/billing/usage', description: 'List credit transactions and usage history.', scopes: ['billing:read'], isWrite: false, params: [{ name: 'limit', type: 'number', required: false, description: 'Max results per page', in: 'query' }, { name: 'after', type: 'string', required: false, description: 'Cursor for pagination', in: 'query' }] },
  ],
};
