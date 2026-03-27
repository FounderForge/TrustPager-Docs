import { type ResourceGroup } from './types.js';

// =============================================================================
// FILES (unified: documents + images + secure files under /files?type=)
// =============================================================================

export const FILES: ResourceGroup = {
  id: 'files',
  label: 'Files',
  description: 'Unified file storage endpoint for all file types. Use ?type=document (private PDFs), ?type=image (public CDN/R2 images), or ?type=secure (confidential private files). Single-resource routes (/files/:id) auto-detect the type.',
  endpoints: [
    {
      method: 'GET',
      path: '/files?type=document|image|secure',
      description: 'List files. The "type" query parameter is required. "document" = private PDFs (25MB max), "image" = public CDN media (10MB max), "secure" = confidential private files (50MB max).',
      scopes: ['files:read'],
      isWrite: false,
      params: [
        { name: 'type', type: 'string', required: true, description: 'File type: document, image, or secure', in: 'query' },
        { name: 'folder', type: 'string', required: false, description: 'Filter by folder name', in: 'query' },
        { name: 'search', type: 'string', required: false, description: 'Search by file name', in: 'query' },
        { name: 'document_type', type: 'string', required: false, description: 'Filter by document type (type=document only)', in: 'query' },
        { name: 'file_category', type: 'string', required: false, description: 'Filter by file category (type=secure only)', in: 'query' },
        { name: 'category', type: 'string', required: false, description: 'Filter by file category (type=image only)', in: 'query' },
      ],
    },
    {
      method: 'GET',
      path: '/files/:id',
      description: 'Get file metadata. Auto-detects the file type (document, image, or secure) from the ID. Returns normalized fields: id, type, name, mime_type, file_size, folder, description, uploaded_by, created_at, plus type-specific fields (public_url for document, download_url for image, file_category for secure).',
      scopes: ['files:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'File ID (any type)', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/files/:id/download',
      description: 'Get a temporary signed download URL for any file type (expires in 60 seconds). Auto-detects type. For public R2 images, returns the permanent r2_url instead.',
      scopes: ['files:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'File ID (any type)', in: 'path' }],
    },
    {
      method: 'PUT',
      path: '/files/:id',
      description: 'Update file metadata (name, description, folder, and type-specific fields). Auto-detects type. For documents: name, description, folder, document_type. For images: name, folder, description. For secure: name, description, folder, file_category.',
      scopes: ['files:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'File ID (any type)', in: 'path' }],
    },
    {
      method: 'DELETE',
      path: '/files/:id',
      description: 'Delete a file and remove it from storage. Auto-detects type. For images: removes from R2. For documents and secure files: removes from Supabase private storage.',
      scopes: ['files:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'File ID (any type)', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/files/upload',
      description: 'Upload a file via base64 content. "type" determines storage backend: "image" stores on public R2/CDN (returns r2_url), "document" stores in private Supabase bucket, "secure" stores in private Supabase bucket with confidential access. Size limits: image=10MB, document=25MB, secure=50MB.',
      scopes: ['files:write'],
      isWrite: true,
      params: [
        { name: 'base64', type: 'string', required: true, description: 'Base64-encoded file content. Data URI prefix (e.g. "data:image/png;base64,") is accepted and auto-stripped.', in: 'body' },
        { name: 'name', type: 'string', required: true, description: 'Filename with extension (e.g. "report.pdf")', in: 'body' },
        { name: 'type', type: 'string', required: true, description: 'Storage type: "document", "image", or "secure"', in: 'body' },
        { name: 'mime_type', type: 'string', required: false, description: 'MIME type (default: application/octet-stream)', in: 'body' },
        { name: 'folder', type: 'string', required: false, description: 'Folder name to organise the file', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Optional description', in: 'body' },
        { name: 'category', type: 'string', required: false, description: 'Category for image files (e.g. images, documents, videos)', in: 'body' },
        { name: 'document_type', type: 'string', required: false, description: 'Document type category (type=document only)', in: 'body' },
        { name: 'file_category', type: 'string', required: false, description: 'File category (type=secure only)', in: 'body' },
      ],
    },
    {
      method: 'POST',
      path: '/files/:id/publish',
      description: 'Publish a private document to a public URL via R2. Creates a publicly accessible copy. Returns public_url.',
      scopes: ['files:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Document file ID (type=document only)', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/files/:id/unpublish',
      description: 'Remove the public URL for a previously published document. The file remains in private storage.',
      scopes: ['files:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Document file ID (type=document only)', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/files/folders?type=document|image|secure',
      description: 'List distinct folder names for a given file type. Use type="document", "image", or "secure".',
      scopes: ['files:read'],
      isWrite: false,
      params: [{ name: 'type', type: 'string', required: true, description: 'File type to list folders for: document, image, or secure', in: 'query' }],
    },
    {
      method: 'POST',
      path: '/files/folders?type=document|image|secure',
      description: 'Create a new folder for a given file type. Pass type as a query parameter and name in the body.',
      scopes: ['files:write'],
      isWrite: true,
      params: [
        { name: 'type', type: 'string', required: true, description: 'File type: document, image, or secure', in: 'query' },
        { name: 'name', type: 'string', required: true, description: 'Folder name', in: 'body' },
      ],
    },
  ],
};
