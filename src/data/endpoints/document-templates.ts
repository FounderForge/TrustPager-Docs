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
    {
      method: 'POST',
      path: '/document-templates/:id/sections',
      description: 'Add a section to a template. The "type" field accepts kebab-case (e.g. "signer-input"), PascalCase aliases (e.g. "SignerInput"), and underscore aliases (e.g. "signer_input") -- all normalized server-side. Valid types: cover-page, text-block, two-column, table, product-table, product-showcase, image-block, signature-block, signer-input, divider, page-break, quote-callout, terms-conditions, guarantee, doc-header, doc-footer, dynamic-pricing, dynamic-products, dynamic-timeline, dynamic-executive-summary, dynamic-needs-solutions, dynamic-recommendations, dynamic-callout, dynamic-guarantee, rich-content, product-brochure.',
      scopes: ['documents:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' },
        { name: 'type', type: 'string', required: true, description: 'Section type. Use "signer-input" for a field the signer fills in at signing time (not the sender). The signer-input content shape: { label: string, fieldType: "text"|"textarea"|"date"|"number", required: boolean, placeholder?: string, signerEmail?: string }. Leave signerEmail blank to assign to the primary signer.', in: 'body' },
        { name: 'content', type: 'object', required: false, description: 'Section content JSON. Shape varies by type.', in: 'body' },
        { name: 'styling', type: 'object', required: false, description: 'Section styling overrides (backgroundColor, paddingTop, paddingBottom).', in: 'body' },
        { name: 'order_index', type: 'number', required: false, description: 'Display order (ascending).', in: 'body' },
        { name: 'is_visible', type: 'boolean', required: false, description: 'Whether the section is visible (default true).', in: 'body' },
      ],
    },
    { method: 'PATCH', path: '/document-templates/:id/sections/:sectionId', description: 'Update a template section.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }, { name: 'sectionId', type: 'uuid', required: true, description: 'Section ID', in: 'path' }] },
    { method: 'DELETE', path: '/document-templates/:id/sections/:sectionId', description: 'Delete a template section.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }, { name: 'sectionId', type: 'uuid', required: true, description: 'Section ID', in: 'path' }] },
    { method: 'POST', path: '/document-templates/:id/sections/reorder', description: 'Reorder sections in a document template.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }, { name: 'section_ids', type: 'string[]', required: true, description: 'Ordered array of section UUIDs', in: 'body' }] },
  ],
};
