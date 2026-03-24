import { type ResourceGroup } from './types.js';

// =============================================================================
// COMPANY
// =============================================================================

export const COMPANY: ResourceGroup = {
  id: 'company',
  label: 'Company',
  description: 'View and manage company settings, users, and CRM configuration.',
  endpoints: [
    { method: 'GET', path: '/company', description: 'Retrieve company details.', scopes: ['company:read'], isWrite: false },
    { method: 'PATCH', path: '/company', description: 'Update company settings.', scopes: ['company:write'], isWrite: true },
    { method: 'GET', path: '/company/users', description: 'List all users in the company.', scopes: ['users:read'], isWrite: false },
    { method: 'GET', path: '/company/users/:userId', description: 'Get details for a specific user in the company.', scopes: ['users:read'], isWrite: false, params: [{ name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' }] },
    { method: 'POST', path: '/company/users/invite', description: 'Invite a user to the company.', scopes: ['users:write'], isWrite: true, params: [{ name: 'email', type: 'string', required: true, description: 'Email to invite', in: 'body' }, { name: 'role', type: 'string', required: false, description: 'User role', in: 'body' }] },
    { method: 'PATCH', path: '/company/users/:userId/role', description: 'Update a user role.', scopes: ['users:write'], isWrite: true, params: [{ name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' }, { name: 'role', type: 'string', required: true, description: 'New role', in: 'body' }] },
    { method: 'DELETE', path: '/company/users/:userId', description: 'Remove a user from the company.', scopes: ['users:write'], isWrite: true, params: [{ name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' }] },
    { method: 'GET', path: '/company/crm-settings', description: 'Get CRM settings (deal stages, lead sources, etc.).', scopes: ['company:read'], isWrite: false },
    { method: 'PATCH', path: '/company/crm-settings', description: 'Update CRM settings.', scopes: ['company:write'], isWrite: true },
  ],
};
