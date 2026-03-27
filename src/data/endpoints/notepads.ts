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
    { method: 'POST', path: '/notepads', description: 'Create a notepad. Content accepts plain text or markdown (auto-converted to rich editor format) or a { html, tiptapJson } object. Markdown supports headings, bold, italic, lists, and links.', scopes: ['notepads:write'], isWrite: true, params: [{ name: 'title', type: 'string', required: true, description: 'Notepad title', in: 'body' }, { name: 'content', type: 'string', required: false, description: 'Content as plain text/markdown (auto-converted) or { html, tiptapJson } object', in: 'body' }, { name: 'folder', type: 'string', required: false, description: 'Folder name', in: 'body' }, { name: 'is_favorite', type: 'boolean', required: false, description: 'Mark as favourite', in: 'body' }] },
    { method: 'PATCH', path: '/notepads/:id', description: 'Update a notepad. Content accepts plain text or markdown (auto-converted) or { html, tiptapJson } object.', scopes: ['notepads:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' }, { name: 'title', type: 'string', required: false, description: 'Notepad title', in: 'body' }, { name: 'content', type: 'string', required: false, description: 'Content as plain text/markdown (auto-converted)', in: 'body' }, { name: 'folder', type: 'string', required: false, description: 'Folder name', in: 'body' }, { name: 'is_favorite', type: 'boolean', required: false, description: 'Favourite status', in: 'body' }] },
    { method: 'DELETE', path: '/notepads/:id', description: 'Delete a notepad.', scopes: ['notepads:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' }] },
    { method: 'GET', path: '/notepads/folders', description: 'List notepad folders.', scopes: ['notepads:read'], isWrite: false },
    { method: 'POST', path: '/notepads/folders', description: 'Create a notepad folder.', scopes: ['notepads:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Folder name', in: 'body' }] },
  ],
};
