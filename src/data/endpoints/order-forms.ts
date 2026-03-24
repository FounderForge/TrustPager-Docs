import { type ResourceGroup } from './types.js';

// =============================================================================
// ORDER FORMS
// =============================================================================

export const ORDER_FORMS: ResourceGroup = {
  id: 'order-forms',
  label: 'Order Forms',
  description: 'Manage payment order forms connected to Stripe for product purchases.',
  endpoints: [
    { method: 'GET', path: '/order-forms', description: 'List all order forms.', scopes: ['websites:read'], isWrite: false },
    { method: 'GET', path: '/order-forms/:id', description: 'Retrieve an order form.', scopes: ['websites:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Order form ID', in: 'path' }] },
    { method: 'POST', path: '/order-forms', description: 'Create an order form.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Form name', in: 'body' }] },
    { method: 'PATCH', path: '/order-forms/:id', description: 'Update an order form.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Order form ID', in: 'path' }] },
    { method: 'DELETE', path: '/order-forms/:id', description: 'Delete an order form.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Order form ID', in: 'path' }] },
    { method: 'GET', path: '/order-forms/:id/logs', description: 'List order form payment logs.', scopes: ['websites:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Order form ID', in: 'path' }] },
  ],
};
