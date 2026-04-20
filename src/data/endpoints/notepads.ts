import { type ResourceGroup } from './types.js';

// =============================================================================
// NOTEPADS
// =============================================================================

export const NOTEPADS: ResourceGroup = {
  id: 'notepads',
  label: 'Notepads',
  description: 'Manage rich-text notepads organized in folders. Supports markdown input, iterative editing (append/prepend/section patches), per-record visibility, and ACL-based access control for restricted notes.',
  endpoints: [
    {
      method: 'GET', path: '/notepads', description: 'List all notepads. Supports filters for folder_id, folder (legacy name), visibility, is_favorite, and title search.',
      scopes: ['notepads:read'], isWrite: false,
      params: [
        { name: 'folder_id', type: 'uuid', required: false, description: 'Filter by folder UUID', in: 'query' },
        { name: 'folder', type: 'string', required: false, description: 'Filter by folder name (legacy)', in: 'query' },
        { name: 'visibility', type: 'string', required: false, description: 'Filter by visibility: all_users, admins_only, creator_only, restricted', in: 'query' },
        { name: 'is_favorite', type: 'boolean', required: false, description: 'Filter by favourite status', in: 'query' },
        { name: 'search', type: 'string', required: false, description: 'Search by title (case-insensitive)', in: 'query' },
      ],
    },
    { method: 'GET', path: '/notepads/:id', description: 'Retrieve a notepad including full content and visibility.', scopes: ['notepads:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' }] },
    {
      method: 'POST', path: '/notepads', description: 'Create a notepad. Content accepts plain text or markdown (auto-converted to rich editor format) or a { html, tiptapJson } object. Defaults to visibility="all_users" -- pass "admins_only", "creator_only", or "restricted" to restrict access. For "restricted" notes, add ACL entries via POST /notepads/:id/acl. Response is slim by default (id, title, folder, visibility, is_favorite, timestamps) -- pass return_content: true to receive the full rendered HTML.',
      scopes: ['notepads:write'], isWrite: true,
      params: [
        { name: 'title', type: 'string', required: true, description: 'Notepad title', in: 'body' },
        { name: 'content', type: 'string', required: false, description: 'Content as plain text/markdown (auto-converted) or { html, tiptapJson } object', in: 'body' },
        { name: 'folder_id', type: 'uuid', required: false, description: 'Folder UUID (preferred over folder name)', in: 'body' },
        { name: 'folder', type: 'string', required: false, description: 'Folder name (legacy -- resolved or created)', in: 'body' },
        { name: 'visibility', type: 'string', required: false, description: 'all_users (default), admins_only, creator_only, or restricted', in: 'body' },
        { name: 'is_favorite', type: 'boolean', required: false, description: 'Mark as favourite', in: 'body' },
        { name: 'return_content', type: 'boolean', required: false, description: 'Set true to include full rendered HTML in response. Default false.', in: 'body' },
      ],
    },
    {
      method: 'PATCH', path: '/notepads/:id', description: 'Update a notepad. Three editing modes: (1) replace (default) -- pass content to overwrite; (2) append/prepend -- set mode plus content to grow the document without re-sending existing text; (3) patches -- pass a patches array to replace or append to specific sections by heading text. Can also update visibility or folder_id. Response is slim by default -- pass return_content: true for full HTML.',
      scopes: ['notepads:write'], isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' },
        { name: 'title', type: 'string', required: false, description: 'Notepad title', in: 'body' },
        { name: 'content', type: 'string', required: false, description: 'Content as plain text/markdown. Used by modes replace, append, and prepend.', in: 'body' },
        { name: 'folder_id', type: 'uuid', required: false, description: 'Folder UUID (pass null to unfile)', in: 'body' },
        { name: 'folder', type: 'string', required: false, description: 'Folder name (legacy)', in: 'body' },
        { name: 'visibility', type: 'string', required: false, description: 'all_users, admins_only, creator_only, or restricted', in: 'body' },
        { name: 'is_favorite', type: 'boolean', required: false, description: 'Favourite status', in: 'body' },
        { name: 'mode', type: 'string', required: false, description: '"replace" (default), "append", or "prepend". Append/prepend require content. Cannot combine with patches.', in: 'body' },
        { name: 'patches', type: 'array', required: false, description: 'Array of { match_heading, new_content, mode? } objects. match_heading is case-insensitive. Per-patch mode: "replace" (default, keeps heading), "replace_including_heading", "append_to_section".', in: 'body' },
        { name: 'return_content', type: 'boolean', required: false, description: 'Set true to include full rendered HTML in response. Default false.', in: 'body' },
      ],
    },
    { method: 'DELETE', path: '/notepads/:id', description: 'Delete a notepad.', scopes: ['notepads:delete'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' }] },

    { method: 'GET', path: '/notepads/folders', description: 'List notepad folders. Each folder has id, name, parent_id, visibility, created_by, and timestamps.', scopes: ['notepads:read'], isWrite: false },
    {
      method: 'POST', path: '/notepads/folders', description: 'Create a notepad folder.',
      scopes: ['notepads:write'], isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Folder name', in: 'body' },
        { name: 'parent_id', type: 'uuid', required: false, description: 'Parent folder UUID for nesting', in: 'body' },
        { name: 'visibility', type: 'string', required: false, description: 'all_users (default), admins_only, creator_only, or restricted', in: 'body' },
      ],
    },
    { method: 'GET', path: '/notepads/folders/:id', description: 'Get a single notepad folder by ID.', scopes: ['notepads:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Folder ID', in: 'path' }] },
    {
      method: 'PATCH', path: '/notepads/folders/:id', description: 'Update a notepad folder -- rename, re-parent, or change visibility.',
      scopes: ['notepads:write'], isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Folder ID', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'New folder name', in: 'body' },
        { name: 'parent_id', type: 'uuid', required: false, description: 'New parent folder UUID (null for root)', in: 'body' },
        { name: 'visibility', type: 'string', required: false, description: 'all_users, admins_only, creator_only, or restricted', in: 'body' },
      ],
    },
    { method: 'DELETE', path: '/notepads/folders/:id', description: 'Delete a notepad folder. Notepads inside are unfiled (folder_id cleared) -- not deleted.', scopes: ['notepads:delete'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Folder ID', in: 'path' }] },

    { method: 'GET', path: '/notepads/:id/acl', description: 'List ACL entries for a restricted notepad. Returns user_id and role_name grants.', scopes: ['notepads:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' }] },
    {
      method: 'POST', path: '/notepads/:id/acl', description: 'Grant a user or role access to a restricted notepad. Set visibility to "restricted" first, then add ACL entries.',
      scopes: ['notepads:write'], isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' },
        { name: 'principal_type', type: 'string', required: true, description: '"user" or "role"', in: 'body' },
        { name: 'principal_id', type: 'string', required: true, description: 'User UUID (when principal_type=user) or role name (when principal_type=role)', in: 'body' },
      ],
    },
    { method: 'GET', path: '/notepads/folders/:id/acl', description: 'List ACL entries for a restricted notepad folder.', scopes: ['notepads:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Folder ID', in: 'path' }] },
    {
      method: 'POST', path: '/notepads/folders/:id/acl', description: 'Grant a user or role access to a restricted notepad folder.',
      scopes: ['notepads:write'], isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Folder ID', in: 'path' },
        { name: 'principal_type', type: 'string', required: true, description: '"user" or "role"', in: 'body' },
        { name: 'principal_id', type: 'string', required: true, description: 'User UUID or role name', in: 'body' },
      ],
    },
    { method: 'DELETE', path: '/notepads/acl/:id', description: 'Revoke an ACL entry by its ID. Works for both notepad and folder ACL entries.', scopes: ['notepads:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'ACL entry ID', in: 'path' }] },
  ],
};
