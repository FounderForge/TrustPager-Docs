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
  ],
};
