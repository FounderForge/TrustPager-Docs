import { type ResourceGroup } from './types.js';

// =============================================================================
// WORK ORDERS
// =============================================================================

export const WORK_ORDERS: ResourceGroup = {
  id: 'work-orders',
  label: 'Work Orders',
  description: 'Manage work orders linked to deals for tracking project execution. Work orders appear on the CRM Calendar, support team assignment, and scheduled dates.',
  endpoints: [
    { method: 'GET', path: '/work-orders', description: 'List all work orders. Filter by deal_product_id, status_id, assigned_to (user UUID), or schedule_date (ISO date, exact match).', scopes: ['work-orders:read'], isWrite: false, params: [
      { name: 'deal_product_id', type: 'uuid', required: false, description: 'Filter by deal product UUID', in: 'query' },
      { name: 'status_id', type: 'uuid', required: false, description: 'Filter by work order status UUID', in: 'query' },
      { name: 'assigned_to', type: 'uuid', required: false, description: 'Filter by assigned team member user UUID', in: 'query' },
      { name: 'schedule_date', type: 'string', required: false, description: 'Filter by scheduled date (ISO date, e.g. "2026-04-25"). Exact match.', in: 'query' },
      { name: 'limit', type: 'number', required: false, description: 'Items per page (default 25, max 100)', in: 'query' },
      { name: 'after', type: 'string', required: false, description: 'Cursor for pagination', in: 'query' },
    ] },
    { method: 'GET', path: '/work-orders/:id', description: 'Retrieve a single work order. Response includes schedule_date (ISO date) and assigned_to (user UUID or null).', scopes: ['work-orders:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Work order ID', in: 'path' }] },
    { method: 'POST', path: '/work-orders', description: 'Create a work order. Pass "status" (string label, e.g. "Pending") to resolve a status by name, or "status_id" (UUID) directly. "status" performs a case-insensitive match against crm_work_order_statuses labels for the company. Use schedule_date to control when the work order appears on the calendar, and assigned_to to assign a team member.', scopes: ['work-orders:write'], isWrite: true, params: [
      { name: 'deal_product_id', type: 'uuid', required: true, description: 'Deal product UUID (required)', in: 'body' },
      { name: 'status', type: 'string', required: false, description: 'Status label (e.g. "Pending"). Resolved case-insensitively to a status_id UUID. Use instead of status_id for human-readable input.', in: 'body' },
      { name: 'status_id', type: 'uuid', required: false, description: 'Status UUID. Bypasses label resolution. Use status or status_id, not both.', in: 'body' },
      { name: 'schedule_date', type: 'string', required: false, description: 'ISO date (e.g. "2026-04-25"). When the work order is scheduled. Controls calendar placement. Defaults to today.', in: 'body' },
      { name: 'assigned_to', type: 'uuid', required: false, description: 'User UUID of the team member assigned to this work order. Must be a member of the company.', in: 'body' },
      { name: 'data', type: 'object', required: false, description: 'Work order field data (JSON object)', in: 'body' },
      { name: 'sort_order', type: 'number', required: false, description: 'Sort order for display', in: 'body' },
    ] },
    { method: 'PATCH', path: '/work-orders/:id', description: 'Update a work order. Pass "status" (string label) to resolve by name, or "status_id" (UUID) directly. Set assigned_to to null to unassign.', scopes: ['work-orders:write'], isWrite: true, params: [
      { name: 'id', type: 'uuid', required: true, description: 'Work order ID', in: 'path' },
      { name: 'status', type: 'string', required: false, description: 'Status label (e.g. "Complete"). Resolved case-insensitively to a status_id UUID.', in: 'body' },
      { name: 'status_id', type: 'uuid', required: false, description: 'Status UUID. Bypasses label resolution.', in: 'body' },
      { name: 'schedule_date', type: 'string', required: false, description: 'ISO date (e.g. "2026-05-01"). Updates the calendar scheduling date.', in: 'body' },
      { name: 'assigned_to', type: 'uuid', required: false, description: 'User UUID of the assigned team member. Pass null to unassign.', in: 'body' },
      { name: 'data', type: 'object', required: false, description: 'Work order field data', in: 'body' },
      { name: 'sort_order', type: 'number', required: false, description: 'Sort order for display', in: 'body' },
    ] },
    { method: 'DELETE', path: '/work-orders/:id', description: 'Delete a work order.', scopes: ['work-orders:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Work order ID', in: 'path' }] },
    { method: 'POST', path: '/work-orders/send-work-status', description: 'Send a PIN-protected Work Status Portal link to a client via email. The client receives a unique link where they can view the progress of all work orders on the deal. Requires the deal to have work orders and the company to have email configured. Returns success, portal_id, and token.', scopes: ['work-orders:write'], isWrite: true, params: [
      { name: 'deal_id', type: 'uuid', required: true, description: 'Deal UUID. The portal shows all work orders for this deal.', in: 'body' },
      { name: 'recipient_email', type: 'string', required: true, description: 'Client email address', in: 'body' },
      { name: 'recipient_name', type: 'string', required: true, description: 'Client display name', in: 'body' },
      { name: 'personal_message', type: 'string', required: false, description: 'Optional personal message included in the email', in: 'body' },
      { name: 'expires_in_days', type: 'number', required: false, description: 'Days until the portal link expires (default 30)', in: 'body' },
    ] },
  ],
};
