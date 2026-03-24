import { type ResourceGroup } from './types.js';

// =============================================================================
// WORK ORDERS
// =============================================================================

export const WORK_ORDERS: ResourceGroup = {
  id: 'work-orders',
  label: 'Work Orders',
  description: 'Manage work orders linked to deals for tracking project execution.',
  endpoints: [
    { method: 'GET', path: '/work-orders', description: 'List all work orders.', scopes: ['work-orders:read'], isWrite: false },
    { method: 'GET', path: '/work-orders/:id', description: 'Retrieve a work order.', scopes: ['work-orders:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Work order ID', in: 'path' }] },
    { method: 'POST', path: '/work-orders', description: 'Create a work order.', scopes: ['work-orders:write'], isWrite: true, params: [{ name: 'title', type: 'string', required: true, description: 'Title', in: 'body' }, { name: 'deal_id', type: 'uuid', required: false, description: 'Link to deal', in: 'body' }] },
    { method: 'PATCH', path: '/work-orders/:id', description: 'Update a work order.', scopes: ['work-orders:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Work order ID', in: 'path' }] },
    { method: 'DELETE', path: '/work-orders/:id', description: 'Delete a work order.', scopes: ['work-orders:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Work order ID', in: 'path' }] },
  ],
};
