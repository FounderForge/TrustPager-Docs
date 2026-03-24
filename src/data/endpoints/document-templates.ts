import { type ResourceGroup } from './types.js';

// =============================================================================
// DOCUMENT TEMPLATES
// =============================================================================

export const DOCUMENT_TEMPLATES: ResourceGroup = {
  id: 'document-templates',
  label: 'Document Templates',
  description: 'Manage document templates with sections for proposals, contracts, and more.',
  endpoints: [
    { method: 'GET', path: '/document-templates', description: 'List all document templates.', scopes: ['documents:read'], isWrite: false },
    { method: 'GET', path: '/document-templates/:id', description: 'Retrieve a document template with sections.', scopes: ['documents:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'POST', path: '/document-templates', description: 'Create a document template.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Template name', in: 'body' }] },
    { method: 'PATCH', path: '/document-templates/:id', description: 'Update a document template.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'DELETE', path: '/document-templates/:id', description: 'Delete a document template.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'POST', path: '/document-templates/:id/duplicate', description: 'Duplicate a document template.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'GET', path: '/document-templates/:id/sections', description: 'List sections for a document template.', scopes: ['documents:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'POST', path: '/document-templates/:id/sections', description: 'Add a section to a template.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'PATCH', path: '/document-templates/:id/sections/:sectionId', description: 'Update a template section.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }, { name: 'sectionId', type: 'uuid', required: true, description: 'Section ID', in: 'path' }] },
    { method: 'DELETE', path: '/document-templates/:id/sections/:sectionId', description: 'Delete a template section.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }, { name: 'sectionId', type: 'uuid', required: true, description: 'Section ID', in: 'path' }] },
    { method: 'POST', path: '/document-templates/:id/sections/reorder', description: 'Reorder sections in a document template.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }, { name: 'section_ids', type: 'string[]', required: true, description: 'Ordered array of section UUIDs', in: 'body' }] },
  ],
};
