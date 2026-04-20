import { type ResourceGroup } from './types.js';

// =============================================================================
// LEARNING HUB (Training Canvases + Cards)
// =============================================================================

export const TRAINING: ResourceGroup = {
  id: 'training',
  label: 'Learning Hub',
  description: 'Manage Learning Hub canvases and their cards. Canvases are drag-and-drop boards of cards that can embed YouTube videos, external links, iframes, notepads, PDFs, images, and secure files.',
  endpoints: [
    // -- Canvases --
    {
      method: 'GET',
      path: '/training-canvases',
      description: 'List all Learning Hub canvases. Returns id, name, template, and timestamps. Use GET /training-canvases/:id to retrieve a canvas with its cards.',
      scopes: ['resources:read'],
      isWrite: false,
      params: [
        { name: 'limit', type: 'number', required: false, description: 'Items per page (default 25, max 100)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
      ],
    },
    {
      method: 'GET',
      path: '/training-canvases/:id',
      description: 'Get a single canvas including all cards, sorted by sort_order. Cards include resource_type, url, description, category, and display_config (grid layout).',
      scopes: ['resources:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Canvas UUID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/training-canvases',
      description: 'Create a new Learning Hub canvas. Pass template="getting_started" to seed 6 starter cards automatically.',
      scopes: ['resources:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Canvas name (e.g., "New Hire Onboarding")', in: 'body' },
        { name: 'template', type: 'string', required: false, description: '"getting_started" to seed starter cards', in: 'body' },
      ],
      example: {
        request: { name: 'Sales Playbook' },
        response: {
          data: {
            id: 'uuid',
            company_id: 'uuid',
            name: 'Sales Playbook',
            template: null,
            created_at: '2026-04-20T00:00:00Z',
            updated_at: '2026-04-20T00:00:00Z',
            cards: [],
          },
        },
      },
    },
    {
      method: 'PATCH',
      path: '/training-canvases/:id',
      description: 'Rename a Learning Hub canvas.',
      scopes: ['resources:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Canvas UUID', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'New canvas name', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/training-canvases/:id',
      description: 'Delete a canvas and all its cards. This is permanent.',
      scopes: ['resources:delete'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Canvas UUID', in: 'path' },
      ],
    },

    // -- Cards --
    {
      method: 'POST',
      path: '/training-canvases/:id/cards',
      description: 'Add a card to a canvas. Seven resource_type values are supported:\n- notepad: url = company_notepads.id\n- youtube: url = full YouTube URL\n- link: url = external URL\n- html_embed: url = URL to embed in an iframe\n- document: url = crm_documents.id (opens EnhancedPDFViewer)\n- image: url = company_files.id (must be category=images, opens FilePreviewModal)\n- file: url = company_secure_files.id (opens SecureFilePreviewModal)',
      scopes: ['resources:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Canvas UUID', in: 'path' },
        {
          name: 'resource_type',
          type: 'string',
          required: true,
          description: 'One of: notepad, youtube, link, html_embed, document, image, file',
          in: 'body',
        },
        { name: 'title', type: 'string', required: true, description: 'Card title', in: 'body' },
        {
          name: 'url',
          type: 'string',
          required: true,
          description: 'Entity UUID (for notepad/document/image/file) or full URL (for youtube/link/html_embed)',
          in: 'body',
        },
        { name: 'description', type: 'string', required: false, description: 'Optional card description', in: 'body' },
        { name: 'category', type: 'string', required: false, description: 'training, sales, policy, reference, or general (default)', in: 'body' },
        { name: 'position', type: 'number', required: false, description: 'Sort order (0-based, default 0)', in: 'body' },
        { name: 'display_config', type: 'object', required: false, description: 'Grid layout: { layout: { lg: { x, y, w, h }, md, sm, xs } }', in: 'body' },
      ],
      example: {
        request: {
          title: 'Onboarding PDF',
          resource_type: 'document',
          url: '<crm_documents.id>',
          description: 'Read before your first day',
          category: 'training',
          position: 0,
        },
        response: {
          data: {
            id: 'uuid',
            canvas_id: 'uuid',
            company_id: 'uuid',
            title: 'Onboarding PDF',
            resource_type: 'document',
            url: '<crm_documents.id>',
            description: 'Read before your first day',
            category: 'training',
            sort_order: 0,
            display_config: {},
          },
        },
      },
    },
    {
      method: 'PATCH',
      path: '/training-cards/:id',
      description: 'Update a Learning Hub card. All fields are optional.',
      scopes: ['resources:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Card UUID', in: 'path' },
        { name: 'title', type: 'string', required: false, description: 'New title', in: 'body' },
        { name: 'resource_type', type: 'string', required: false, description: 'New card type', in: 'body' },
        { name: 'url', type: 'string', required: false, description: 'New URL or entity UUID', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'New description', in: 'body' },
        { name: 'category', type: 'string', required: false, description: 'New category', in: 'body' },
        { name: 'position', type: 'number', required: false, description: 'New sort order', in: 'body' },
        { name: 'display_config', type: 'object', required: false, description: 'New grid layout config', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/training-cards/:id',
      description: 'Remove a card from its canvas. Does not delete the underlying entity (the notepad, document, image, or file still exists).',
      scopes: ['resources:delete'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Card UUID', in: 'path' },
      ],
    },
  ],
};
