import { type ResourceGroup } from './types.js';

// =============================================================================
// DOCUMENTS
// =============================================================================

export const DOCUMENTS: ResourceGroup = {
  id: 'documents',
  label: 'Documents',
  description: 'Manage CRM documents (uploaded files). Supports folders, downloads via signed URLs, and CRUD operations.',
  endpoints: [
    { method: 'GET', path: '/documents', description: 'List all documents. Supports folder, document_type, and search filters.', scopes: ['documents:read'], isWrite: false, params: [{ name: 'folder', type: 'string', required: false, description: 'Filter by folder name', in: 'query' }, { name: 'document_type', type: 'string', required: false, description: 'Filter by document type', in: 'query' }, { name: 'search', type: 'string', required: false, description: 'Search by name', in: 'query' }] },
    { method: 'GET', path: '/documents/:id', description: 'Retrieve a document.', scopes: ['documents:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Document ID', in: 'path' }] },
    { method: 'POST', path: '/documents', description: 'Create a document record. name is required.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Document name', in: 'body' }, { name: 'folder', type: 'string', required: false, description: 'Folder name', in: 'body' }, { name: 'document_type', type: 'string', required: false, description: 'Document type', in: 'body' }] },
    { method: 'DELETE', path: '/documents/:id', description: 'Delete a document.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Document ID', in: 'path' }] },
    { method: 'GET', path: '/documents/:id/download', description: 'Get a signed download URL for a document (expires in 60 seconds).', scopes: ['documents:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Document ID', in: 'path' }] },
    { method: 'GET', path: '/documents/folders', description: 'List all unique document folder names.', scopes: ['documents:read'], isWrite: false },
  ],
};
