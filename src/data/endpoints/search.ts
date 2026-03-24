import { type ResourceGroup, API_BASE_URL } from './types.js';

export const SEARCH: ResourceGroup = {
  id: 'search',
  label: 'Universal Search',
  description: 'Search across all entity types (contacts, customers, deals) in a single call. Supports fuzzy/typo-tolerant matching on names via pg_trgm.',
  endpoints: [
    {
      method: 'POST',
      path: '/search',
      description: 'Universal fuzzy search across contacts, customers, and deals. Returns ranked results with entity_type, display_name, subtitle, and relevance rank. Exact substring matches rank highest (1.0), fuzzy matches rank by trigram similarity. Names support typo-tolerant matching; email and phone use exact substring matching.',
      scopes: ['contacts:read', 'customers:read', 'deals:read'],
      isWrite: false,
      params: [
        { name: 'query', type: 'string', required: true, description: 'Search text -- matches names, emails, phone numbers across all entity types', in: 'body' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100, default 25)', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/search" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "query": "Sarah", "limit": 10 }'`,
      responseExample: `{
  "data": [
    {
      "entity_type": "contact",
      "entity_id": "a1b2c3d4-...",
      "display_name": "Sarah Johnson",
      "subtitle": "sarah@example.com",
      "rank": 1.0
    },
    {
      "entity_type": "customer",
      "entity_id": "e5f6a7b8-...",
      "display_name": "Sarah Johnson Ltd",
      "subtitle": "info@sarahjohnson.com.au",
      "rank": 0.85
    },
    {
      "entity_type": "deal",
      "entity_id": "c9d0e1f2-...",
      "display_name": "Website Redesign - Sarah Johnson",
      "subtitle": "open",
      "rank": 0.72
    }
  ],
  "meta": { "credits_remaining": 4500 }
}`,
    },
  ],
};
