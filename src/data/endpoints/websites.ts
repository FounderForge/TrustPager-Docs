import { type ResourceGroup } from './types.js';

// =============================================================================
// WEBSITES
// =============================================================================

export const WEBSITES: ResourceGroup = {
  id: 'websites',
  label: 'Websites',
  description: 'Manage TrustPager-hosted websites, pages, and page sections.',
  endpoints: [
    { method: 'GET', path: '/websites', description: 'List all websites.', scopes: ['websites:read'], isWrite: false },
    { method: 'GET', path: '/websites/:id', description: 'Retrieve a website.', scopes: ['websites:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Website ID', in: 'path' }] },
    { method: 'POST', path: '/websites', description: 'Create a website. name is required.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Website name', in: 'body' }, { name: 'domain', type: 'string', required: false, description: 'Custom domain', in: 'body' }] },
    { method: 'PATCH', path: '/websites/:id', description: 'Update a website.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Website ID', in: 'path' }] },
    { method: 'DELETE', path: '/websites/:id', description: 'Delete a website.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Website ID', in: 'path' }] },
    { method: 'GET', path: '/websites/:id/pages', description: 'List pages for a website.', scopes: ['websites:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Website ID', in: 'path' }] },
    { method: 'POST', path: '/websites/:id/pages', description: 'Create a page for a website. title and slug are required.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Website ID', in: 'path' }, { name: 'title', type: 'string', required: true, description: 'Page title', in: 'body' }, { name: 'slug', type: 'string', required: true, description: 'URL slug', in: 'body' }, { name: 'page_type', type: 'string', required: false, description: 'Page type', in: 'body' }] },
    { method: 'GET', path: '/websites/:id/pages/:pageId', description: 'Retrieve a page with its sections.', scopes: ['websites:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Website ID', in: 'path' }, { name: 'pageId', type: 'uuid', required: true, description: 'Page ID', in: 'path' }] },
    { method: 'PATCH', path: '/websites/:id/pages/:pageId', description: 'Update a website page.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Website ID', in: 'path' }, { name: 'pageId', type: 'uuid', required: true, description: 'Page ID', in: 'path' }] },
    { method: 'DELETE', path: '/websites/:id/pages/:pageId', description: 'Delete a website page.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Website ID', in: 'path' }, { name: 'pageId', type: 'uuid', required: true, description: 'Page ID', in: 'path' }] },
    { method: 'GET', path: '/websites/:id/pages/:pageId/sections', description: 'List sections for a page.', scopes: ['websites:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Website ID', in: 'path' }, { name: 'pageId', type: 'uuid', required: true, description: 'Page ID', in: 'path' }] },
    { method: 'POST', path: '/websites/:id/pages/:pageId/sections', description: 'Create a section on a page. type is required.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Website ID', in: 'path' }, { name: 'pageId', type: 'uuid', required: true, description: 'Page ID', in: 'path' }, { name: 'type', type: 'string', required: true, description: 'Section type', in: 'body' }] },
    { method: 'PATCH', path: '/websites/:id/pages/:pageId/sections/:sectionId', description: 'Update a page section.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Website ID', in: 'path' }, { name: 'pageId', type: 'uuid', required: true, description: 'Page ID', in: 'path' }, { name: 'sectionId', type: 'uuid', required: true, description: 'Section ID', in: 'path' }] },
    { method: 'DELETE', path: '/websites/:id/pages/:pageId/sections/:sectionId', description: 'Delete a page section.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Website ID', in: 'path' }, { name: 'pageId', type: 'uuid', required: true, description: 'Page ID', in: 'path' }, { name: 'sectionId', type: 'uuid', required: true, description: 'Section ID', in: 'path' }] },
    { method: 'POST', path: '/websites/:id/pages/:pageId/sections/reorder', description: 'Reorder sections on a page.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Website ID', in: 'path' }, { name: 'pageId', type: 'uuid', required: true, description: 'Page ID', in: 'path' }, { name: 'section_ids', type: 'string[]', required: true, description: 'Ordered array of section UUIDs', in: 'body' }] },
  ],
};
