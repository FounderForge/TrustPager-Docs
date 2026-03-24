import { type ResourceGroup } from './types.js';

// =============================================================================
// ACTIVITIES
// =============================================================================

export const ACTIVITIES: ResourceGroup = {
  id: 'activities',
  label: 'Activities',
  description: 'Log and manage CRM activities (calls, meetings, notes) linked to contacts, deals, and customers.',
  endpoints: [
    { method: 'GET', path: '/activities', description: 'List all activities with filters.', scopes: ['activities:read'], isWrite: false },
    { method: 'GET', path: '/activities/:id', description: 'Retrieve an activity by ID.', scopes: ['activities:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Activity ID', in: 'path' }] },
    { method: 'POST', path: '/activities', description: 'Create an activity. Set activity_type to "call", "meeting", or "note". Link to a contact, deal, or customer.', scopes: ['activities:write'], isWrite: true, params: [{ name: 'activity_type', type: 'string', required: true, description: 'Type: call, meeting, or note', in: 'body' }, { name: 'subject', type: 'string', required: true, description: 'Activity subject', in: 'body' }, { name: 'description', type: 'string', required: false, description: 'Activity details/notes', in: 'body' }, { name: 'contact_id', type: 'uuid', required: false, description: 'Contact ID', in: 'body' }, { name: 'deal_id', type: 'uuid', required: false, description: 'Deal ID', in: 'body' }, { name: 'customer_id', type: 'uuid', required: false, description: 'Customer ID', in: 'body' }] },
    { method: 'PATCH', path: '/activities/:id', description: 'Update an activity.', scopes: ['activities:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Activity ID', in: 'path' }, { name: 'subject', type: 'string', required: false, description: 'Activity subject', in: 'body' }, { name: 'description', type: 'string', required: false, description: 'Activity details', in: 'body' }] },
    { method: 'DELETE', path: '/activities/:id', description: 'Delete an activity.', scopes: ['activities:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Activity ID', in: 'path' }] },
  ],
};
