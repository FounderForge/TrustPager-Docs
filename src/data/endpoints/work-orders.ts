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
    { method: 'POST', path: '/work-orders', description: 'Create a work order. Pass "status" (string label, e.g. "Pending") to resolve a status by name, or "status_id" (UUID) directly. "status" performs a case-insensitive match against crm_work_order_statuses labels for the company.', scopes: ['work-orders:write'], isWrite: true, params: [
      { name: 'deal_product_id', type: 'uuid', required: true, description: 'Deal product UUID (required)', in: 'body' },
      { name: 'status', type: 'string', required: false, description: 'Status label (e.g. "Pending"). Resolved case-insensitively to a status_id UUID. Use instead of status_id for human-readable input.', in: 'body' },
      { name: 'status_id', type: 'uuid', required: false, description: 'Status UUID. Bypasses label resolution. Use status or status_id, not both.', in: 'body' },
      { name: 'data', type: 'object', required: false, description: 'Work order field data (JSON object)', in: 'body' },
      { name: 'sort_order', type: 'number', required: false, description: 'Sort order for display', in: 'body' },
    ] },
    { method: 'PATCH', path: '/work-orders/:id', description: 'Update a work order. Pass "status" (string label) to resolve by name, or "status_id" (UUID) directly.', scopes: ['work-orders:write'], isWrite: true, params: [
      { name: 'id', type: 'uuid', required: true, description: 'Work order ID', in: 'path' },
      { name: 'status', type: 'string', required: false, description: 'Status label (e.g. "Complete"). Resolved case-insensitively to a status_id UUID.', in: 'body' },
      { name: 'status_id', type: 'uuid', required: false, description: 'Status UUID. Bypasses label resolution.', in: 'body' },
      { name: 'data', type: 'object', required: false, description: 'Work order field data', in: 'body' },
      { name: 'sort_order', type: 'number', required: false, description: 'Sort order for display', in: 'body' },
    ] },
    { method: 'DELETE', path: '/work-orders/:id', description: 'Delete a work order.', scopes: ['work-orders:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Work order ID', in: 'path' }] },
  ],
};
