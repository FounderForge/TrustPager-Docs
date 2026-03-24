import { type ResourceGroup } from './types.js';

// =============================================================================
// NOTEPADS
// =============================================================================

export const NOTEPADS: ResourceGroup = {
  id: 'notepads',
  label: 'Notepads',
  description: 'Manage rich-text notepads organized in folders.',
  endpoints: [
    { method: 'GET', path: '/notepads', description: 'List all notepads.', scopes: ['notepads:read'], isWrite: false },
    { method: 'GET', path: '/notepads/:id', description: 'Retrieve a notepad.', scopes: ['notepads:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' }] },
    { method: 'POST', path: '/notepads', description: 'Create a notepad.', scopes: ['notepads:write'], isWrite: true, params: [{ name: 'title', type: 'string', required: true, description: 'Notepad title', in: 'body' }] },
    { method: 'PATCH', path: '/notepads/:id', description: 'Update a notepad.', scopes: ['notepads:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' }] },
    { method: 'DELETE', path: '/notepads/:id', description: 'Delete a notepad.', scopes: ['notepads:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' }] },
    { method: 'GET', path: '/notepads/folders', description: 'List notepad folders.', scopes: ['notepads:read'], isWrite: false },
    { method: 'POST', path: '/notepads/folders', description: 'Create a notepad folder.', scopes: ['notepads:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Folder name', in: 'body' }] },
  ],
};
