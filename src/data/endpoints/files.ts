import { type ResourceGroup } from './types.js';

// =============================================================================
// FILES
// =============================================================================

export const FILES: ResourceGroup = {
  id: 'files',
  label: 'Files',
  description: 'Upload, download, and manage files and folders in the company file storage.',
  endpoints: [
    { method: 'GET', path: '/files', description: 'List files in a folder.', scopes: ['files:read'], isWrite: false },
    { method: 'GET', path: '/files/:id', description: 'Get file metadata.', scopes: ['files:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'File ID', in: 'path' }] },
    { method: 'GET', path: '/files/:id/download', description: 'Download a file (returns signed URL).', scopes: ['files:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'File ID', in: 'path' }] },
    { method: 'DELETE', path: '/files/:id', description: 'Delete a file.', scopes: ['files:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'File ID', in: 'path' }] },
    { method: 'GET', path: '/files/folders', description: 'List file folders.', scopes: ['files:read'], isWrite: false },
    { method: 'POST', path: '/files/folders', description: 'Create a file folder.', scopes: ['files:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Folder name', in: 'body' }] },
    { method: 'POST', path: '/files/upload', description: 'Upload a file via base64 content. Stores permanently on CDN and creates a file record. Returns r2_url for public access. Max 10MB. Use after ai/generate-image to persist AI-generated images.', scopes: ['files:write'], isWrite: true, params: [{ name: 'base64', type: 'string', required: true, description: 'Base64-encoded file content. Data URI prefix (e.g. "data:image/png;base64,") is accepted and auto-stripped.', in: 'body' }, { name: 'name', type: 'string', required: true, description: 'Filename with extension (e.g. "hero-banner.webp")', in: 'body' }, { name: 'mime_type', type: 'string', required: false, description: 'MIME type (default: application/octet-stream). Common: image/png, image/webp, application/pdf', in: 'body' }, { name: 'category', type: 'string', required: false, description: 'File category: images, documents, videos, audio, other (default: other)', in: 'body' }, { name: 'folder', type: 'string', required: false, description: 'Folder name to organise the file', in: 'body' }] },
  ],
};
