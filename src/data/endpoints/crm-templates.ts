import { type ResourceGroup } from './types.js';

// =============================================================================
// CRM TEMPLATES
// =============================================================================

export const CRM_TEMPLATES: ResourceGroup = {
  id: 'crm-templates',
  label: 'CRM Templates',
  description: 'Manage reusable CRM templates for emails, messages, and automated communications.',
  endpoints: [
    { method: 'GET', path: '/crm-templates', description: 'List all CRM templates.', scopes: ['crm-templates:read'], isWrite: false },
    { method: 'GET', path: '/crm-templates/:id', description: 'Retrieve a CRM template.', scopes: ['crm-templates:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'POST', path: '/crm-templates', description: 'Create a CRM template.', scopes: ['crm-templates:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Template name', in: 'body' }] },
    { method: 'PATCH', path: '/crm-templates/:id', description: 'Update a CRM template.', scopes: ['crm-templates:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'DELETE', path: '/crm-templates/:id', description: 'Delete a CRM template.', scopes: ['crm-templates:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
  ],
};
