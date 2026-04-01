import { type ResourceGroup } from './types.js';

// =============================================================================
// KNOWLEDGE BASE
// =============================================================================

export const KNOWLEDGE: ResourceGroup = {
  id: 'knowledge',
  label: 'Knowledge Base',
  description: 'Manage company knowledge base entries with semantic search powered by Voyage AI embeddings. Use for policies, FAQs, agent instructions, and product documentation.',
  endpoints: [
    {
      method: 'GET',
      path: '/knowledge',
      description: 'List all knowledge base entries. Filter by category or tag.',
      scopes: ['knowledge:read'],
      isWrite: false,
      params: [
        { name: 'category', type: 'string', required: false, description: 'Filter by category: general, agent, faq, policy, procedure, product', in: 'query' },
        { name: 'tag', type: 'string', required: false, description: 'Filter entries that include this tag', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Items per page (default 25, max 100)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for pagination', in: 'query' },
      ],
    },
    {
      method: 'GET',
      path: '/knowledge/:id',
      description: 'Retrieve a single knowledge base entry by ID.',
      scopes: ['knowledge:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Knowledge entry ID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/knowledge',
      description: 'Create a knowledge base entry. An embedding is automatically generated for semantic search. Valid categories: general (default), agent, faq, policy, procedure, product.',
      scopes: ['knowledge:write'],
      isWrite: true,
      params: [
        { name: 'title', type: 'string', required: true, description: 'Entry title', in: 'body' },
        { name: 'content', type: 'string', required: true, description: 'Entry content - the full knowledge text', in: 'body' },
        { name: 'category', type: 'string', required: false, description: 'Category: general (default), agent, faq, policy, procedure, product', in: 'body' },
        { name: 'tags', type: 'string[]', required: false, description: 'Array of tag strings for filtering', in: 'body' },
        { name: 'source_type', type: 'string', required: false, description: 'Source type (e.g. manual, transcript, document)', in: 'body' },
        { name: 'source_id', type: 'uuid', required: false, description: 'UUID of the source record', in: 'body' },
      ],
    },
    {
      method: 'PATCH',
      path: '/knowledge/:id',
      description: 'Update a knowledge base entry. If title or content changes, the embedding is automatically regenerated.',
      scopes: ['knowledge:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Knowledge entry ID', in: 'path' },
        { name: 'title', type: 'string', required: false, description: 'Updated title', in: 'body' },
        { name: 'content', type: 'string', required: false, description: 'Updated content', in: 'body' },
        { name: 'category', type: 'string', required: false, description: 'Category: general, agent, faq, policy, procedure, product', in: 'body' },
        { name: 'tags', type: 'string[]', required: false, description: 'Updated tags array (replaces existing)', in: 'body' },
        { name: 'source_type', type: 'string', required: false, description: 'Source type', in: 'body' },
        { name: 'source_id', type: 'uuid', required: false, description: 'Source record UUID', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/knowledge/:id',
      description: 'Delete a knowledge base entry permanently.',
      scopes: ['knowledge:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Knowledge entry ID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/knowledge/search',
      description: 'Semantic search across the knowledge base using natural language. Powered by Voyage AI embeddings and pgvector. Returns entries ranked by cosine similarity. Usage count is automatically incremented for returned entries.',
      scopes: ['knowledge:read'],
      isWrite: false,
      params: [
        { name: 'query', type: 'string', required: true, description: 'Natural language search query', in: 'body' },
        { name: 'category', type: 'string', required: false, description: 'Restrict search to a category: general, agent, faq, policy, procedure, product', in: 'body' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (default 5, max 20)', in: 'body' },
        { name: 'threshold', type: 'number', required: false, description: 'Minimum similarity 0.0-1.0 (default 0.3)', in: 'body' },
      ],
    },
  ],
};
