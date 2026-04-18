import { type ResourceGroup } from './types.js';

// =============================================================================
// NOTEPADS
// =============================================================================

export const NOTEPADS: ResourceGroup = {
  id: 'notepads',
  label: 'Notepads',
  description: 'Manage rich-text notepads organized in folders. Supports markdown input, iterative editing (append/prepend/section patches), and slim responses by default.',
  endpoints: [
    { method: 'GET', path: '/notepads', description: 'List all notepads.', scopes: ['notepads:read'], isWrite: false },
    { method: 'GET', path: '/notepads/:id', description: 'Retrieve a notepad including full content.', scopes: ['notepads:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' }] },
    {
      method: 'POST', path: '/notepads', description: 'Create a notepad. Content accepts plain text or markdown (auto-converted to rich editor format) or a { html, tiptapJson } object. Markdown supports headings, bold, italic, lists, and links. Underscore emphasis respects the CommonMark intra-word rule so snake_case tokens are not italicised. Response is slim by default (id, title, folder, is_favorite, timestamps) -- pass return_content: true to receive the full rendered HTML.',
      scopes: ['notepads:write'], isWrite: true,
      params: [
        { name: 'title', type: 'string', required: true, description: 'Notepad title', in: 'body' },
        { name: 'content', type: 'string', required: false, description: 'Content as plain text/markdown (auto-converted) or { html, tiptapJson } object', in: 'body' },
        { name: 'folder', type: 'string', required: false, description: 'Folder name', in: 'body' },
        { name: 'is_favorite', type: 'boolean', required: false, description: 'Mark as favourite', in: 'body' },
        { name: 'return_content', type: 'boolean', required: false, description: 'Set true to include full rendered HTML in response. Default false.', in: 'body' },
      ],
    },
    {
      method: 'PATCH', path: '/notepads/:id', description: 'Update a notepad. Three editing modes: (1) replace (default) -- pass content to overwrite; (2) append/prepend -- set mode plus content to grow the document without re-sending existing text; (3) patches -- pass a patches array to replace or append to specific sections by heading text. Patches cannot be combined with content or with mode append/prepend. Unmatched headings are reported in meta.patches_unmatched without failing the request. Response is slim by default -- pass return_content: true for full HTML.',
      scopes: ['notepads:write'], isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' },
        { name: 'title', type: 'string', required: false, description: 'Notepad title', in: 'body' },
        { name: 'content', type: 'string', required: false, description: 'Content as plain text/markdown. Used by modes replace, append, and prepend.', in: 'body' },
        { name: 'folder', type: 'string', required: false, description: 'Folder name', in: 'body' },
        { name: 'is_favorite', type: 'boolean', required: false, description: 'Favourite status', in: 'body' },
        { name: 'mode', type: 'string', required: false, description: '"replace" (default), "append", or "prepend". Append/prepend require content. Cannot combine with patches.', in: 'body' },
        { name: 'patches', type: 'array', required: false, description: 'Array of { match_heading, new_content, mode? } objects. match_heading is case-insensitive. Per-patch mode: "replace" (default, keeps heading), "replace_including_heading", "append_to_section".', in: 'body' },
        { name: 'return_content', type: 'boolean', required: false, description: 'Set true to include full rendered HTML in response. Default false.', in: 'body' },
      ],
    },
    { method: 'DELETE', path: '/notepads/:id', description: 'Delete a notepad.', scopes: ['notepads:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' }] },
    { method: 'GET', path: '/notepads/folders', description: 'List notepad folders.', scopes: ['notepads:read'], isWrite: false },
    { method: 'POST', path: '/notepads/folders', description: 'Create a notepad folder.', scopes: ['notepads:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Folder name', in: 'body' }] },
  ],
};
