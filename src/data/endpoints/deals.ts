import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// DEALS (16+ endpoints)
// =============================================================================

export const DEALS: ResourceGroup = {
  id: 'deals',
  label: 'Deals',
  description: 'Manage deals (opportunities) through your sales pipeline. Supports sub-resources for products, product costs, contacts, users, activities, tasks, work orders, and pipeline moves.',
  endpoints: [
    {
      method: 'GET',
      path: '/deals',
      description: 'List all deals with cursor-based pagination. Supports search, status, contact, customer, pipeline, stage, and date filters. Always includes pipeline placements.',
      scopes: ['deals:read'],
      isWrite: false,
      params: [
        { name: 'search', type: 'string', required: false, description: 'Search by deal name', in: 'query' },
        { name: 'status', type: 'string', required: false, description: 'Filter by status (open, won, lost)', in: 'query' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Filter by primary contact', in: 'query' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Filter by customer', in: 'query' },
        { name: 'assigned_to', type: 'uuid', required: false, description: 'Filter by assigned user', in: 'query' },
        { name: 'pipeline_id', type: 'uuid', required: false, description: 'Filter by pipeline', in: 'query' },
        { name: 'stage_id', type: 'uuid', required: false, description: 'Filter by pipeline stage. Can be combined with pipeline_id or used alone.', in: 'query' },
        { name: 'created_after', type: 'string', required: false, description: 'ISO date filter', in: 'query' },
        { name: 'created_before', type: 'string', required: false, description: 'ISO date filter', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100, default 25)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
        { name: 'expand', type: 'string', required: false, description: 'Expansions: contact, customer, products, assigned_users', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/deals?status=open&pipeline_id=UUID&stage_id=UUID&limit=25" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "deal-uuid-...",
      "public_id": "D-001",
      "name": "Website Redesign",
      "status": "open",
      "contact_id": "contact-uuid-...",
      "customer_id": "cust-uuid-...",
      "currency": "AUD",
      "probability": 75,
      "expected_close_date": "2026-04-30",
      "tags": ["web", "design"],
      "placements": [
        {
          "pipeline_id": "pipe-uuid-...",
          "stage_id": "stage-uuid-...",
          "crm_pipelines": { "id": "pipe-uuid-...", "name": "Sales" },
          "crm_pipeline_stages": { "id": "stage-uuid-...", "name": "Proposal", "color": "#3B82F6" }
        }
      ],
      "created_at": "2026-03-01T09:00:00Z"
    }
  ],
  "pagination": { "limit": 25, "has_more": false, "next_cursor": null, "prev_cursor": null },
  "meta": { "credits_remaining": 9500 }
}`,
    },
    {
      method: 'GET',
      path: '/deals/:id',
      description: 'Retrieve a single deal by ID with pipeline placements. Supports expansions.',
      scopes: ['deals:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'expand', type: 'string', required: false, description: 'Expansions: contact, customer, products, assigned_users', in: 'query' },
      ],
    },
    {
      method: 'POST',
      path: '/deals',
      description: 'Create a new deal. name is required.',
      scopes: ['deals:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Deal name', in: 'body' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Primary contact ID', in: 'body' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Customer ID', in: 'body' },
        { name: 'status', type: 'string', required: false, description: 'Deal status (open, won, lost)', in: 'body' },
        { name: 'currency', type: 'string', required: false, description: 'Currency code (default: AUD)', in: 'body' },
        { name: 'probability', type: 'number', required: false, description: 'Win probability (0-100)', in: 'body' },
        { name: 'expected_close_date', type: 'string', required: false, description: 'Expected close date (YYYY-MM-DD)', in: 'body' },
        { name: 'lead_source', type: 'string', required: false, description: 'Lead source', in: 'body' },
        { name: 'tags', type: 'object[]', required: false, description: 'Tags. Each tag is {name: string, color?: string} (hex color, default "#3b82f6"). Plain strings are also accepted and auto-converted. Example: [{"name":"hot-lead","color":"#ef4444"}]', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Notes', in: 'body' },
        { name: 'metadata', type: 'object', required: false, description: 'Custom field values as { field_id: value } pairs.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/deals" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Website Redesign",
    "contact_id": "contact-uuid-...",
    "customer_id": "cust-uuid-...",
    "currency": "AUD",
    "probability": 75,
    "expected_close_date": "2026-04-30"
  }'`,
    },
    {
      method: 'PATCH',
      path: '/deals/:id',
      description: 'Update an existing deal. Only include fields you want to change.',
      scopes: ['deals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'Deal name', in: 'body' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Primary contact ID', in: 'body' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Customer ID', in: 'body' },
        { name: 'currency', type: 'string', required: false, description: 'Currency code', in: 'body' },
        { name: 'probability', type: 'number', required: false, description: 'Win probability (0-100)', in: 'body' },
        { name: 'expected_close_date', type: 'string', required: false, description: 'Expected close date (YYYY-MM-DD)', in: 'body' },
        { name: 'lead_source', type: 'string', required: false, description: 'Lead source', in: 'body' },
        { name: 'tags', type: 'object[]', required: false, description: 'Tags. Each tag is {name: string, color?: string}. Plain strings are also accepted. Replaces entire tags array.', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Notes', in: 'body' },
        { name: 'metadata', type: 'object', required: false, description: 'Custom field values as { field_id: value } pairs. Replaces entire metadata object.', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/deals/:id',
      description: 'Delete a deal.',
      scopes: ['deals:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/deals/search',
      description: 'Search deals by name.',
      scopes: ['deals:read'],
      isWrite: false,
      params: [
        { name: 'query', type: 'string', required: true, description: 'Search query', in: 'body' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100)', in: 'body' },
      ],
    },
    {
      method: 'POST',
      path: '/deals/:id/move',
      description: 'Move a deal to a pipeline stage. If the deal is not in the pipeline, it will be added. If it is in a different pipeline, it will be moved. When the stage actually changes, any stage_changed automations configured for the target stage fire automatically (fire-and-forget). Set skip_automations=true to suppress this, e.g. for bulk moves or when the caller handles automations separately.',
      scopes: ['deals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'pipeline_id', type: 'uuid', required: true, description: 'Target pipeline ID', in: 'body' },
        { name: 'stage_id', type: 'uuid', required: true, description: 'Target stage ID', in: 'body' },
        { name: 'position', type: 'number', required: false, description: 'Position within stage (default 0)', in: 'body' },
        { name: 'skip_automations', type: 'boolean', required: false, description: 'Set true to suppress stage_changed automation triggers. Default false.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/deals/deal-uuid/move" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "pipeline_id": "pipe-uuid", "stage_id": "stage-uuid", "skip_automations": false }'`,
      responseExample: `{
  "id": "placement-uuid",
  "deal_id": "deal-uuid",
  "pipeline_id": "pipe-uuid",
  "stage_id": "stage-uuid",
  "position": 0,
  "meta": { "credits_remaining": 9499 }
}`,
    },
    {
      method: 'GET',
      path: '/deals/:id/products',
      description: 'List products attached to a deal with pricing details.',
      scopes: ['deals:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/deals/:id/products',
      description: 'Add a product to a deal. product_id is required.',
      scopes: ['deals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'product_id', type: 'uuid', required: true, description: 'Product ID to add', in: 'body' },
        { name: 'quantity', type: 'number', required: false, description: 'Quantity (default: 1)', in: 'body' },
        { name: 'unit_price', type: 'number', required: false, description: 'Override price', in: 'body' },
        { name: 'discount_percent', type: 'number', required: false, description: 'Discount %', in: 'body' },
      ],
    },
    {
      method: 'PATCH',
      path: '/deals/:id/products/:dealProductId',
      description: 'Update a deal product (quantity, price, discount).',
      scopes: ['deals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'dealProductId', type: 'uuid', required: true, description: 'Deal product ID', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/deals/:id/products/:dealProductId',
      description: 'Remove a product from a deal.',
      scopes: ['deals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'dealProductId', type: 'uuid', required: true, description: 'Deal product ID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/deals/:id/products/reorder',
      description: 'Reorder products on a deal by providing an ordered array of deal product IDs.',
      scopes: ['deals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'product_ids', type: 'string[]', required: true, description: 'Ordered array of deal product UUIDs', in: 'body' },
      ],
    },
    {
      method: 'GET',
      path: '/deals/:id/product-costs/:dealProductId',
      description: 'List costs for a deal product.',
      scopes: ['deals:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'dealProductId', type: 'uuid', required: true, description: 'Deal product ID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/deals/:id/product-costs/:dealProductId',
      description: 'Create a cost entry for a deal product.',
      scopes: ['deals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'dealProductId', type: 'uuid', required: true, description: 'Deal product ID', in: 'path' },
        { name: 'label', type: 'string', required: false, description: 'Cost label', in: 'body' },
        { name: 'unit_cost', type: 'number', required: false, description: 'Unit cost amount', in: 'body' },
        { name: 'quantity', type: 'number', required: false, description: 'Quantity', in: 'body' },
        { name: 'currency', type: 'string', required: false, description: 'Currency code', in: 'body' },
        { name: 'supplier_id', type: 'uuid', required: false, description: 'Supplier customer ID', in: 'body' },
        { name: 'supplier_product_id', type: 'uuid', required: false, description: 'Supplier product ID', in: 'body' },
      ],
    },
    {
      method: 'PATCH',
      path: '/deals/:id/product-costs/:costId',
      description: 'Update a deal product cost entry.',
      scopes: ['deals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'costId', type: 'uuid', required: true, description: 'Cost entry ID', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/deals/:id/product-costs/:costId',
      description: 'Delete a deal product cost entry.',
      scopes: ['deals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'costId', type: 'uuid', required: true, description: 'Cost entry ID', in: 'path' },
      ],
    },
    {
      method: 'GET',
      path: '/deals/:id/contacts',
      description: 'List all contacts associated with a deal (beyond the primary contact).',
      scopes: ['deals:read', 'contacts:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/deals/:id/contacts/:contactId',
      description: 'Associate an additional contact with a deal.',
      scopes: ['deals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'contactId', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/deals/:id/contacts/:contactId',
      description: 'Remove a contact association from a deal.',
      scopes: ['deals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'contactId', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
      ],
    },
    {
      method: 'GET',
      path: '/deals/:id/users',
      description: 'List users assigned to a deal.',
      scopes: ['deals:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/deals/:id/users/:userId',
      description: 'Assign a user to a deal.',
      scopes: ['deals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/deals/:id/users/:userId',
      description: 'Remove a user assignment from a deal.',
      scopes: ['deals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' },
      ],
    },
    {
      method: 'GET',
      path: '/deals/:id/activities',
      description: 'List all activities for a deal.',
      scopes: ['deals:read', 'activities:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/deals/:id/tasks',
      description: 'List all tasks for a deal.',
      scopes: ['deals:read', 'tasks:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/deals/:id/work-orders',
      description: 'List all work orders for a deal.',
      scopes: ['deals:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/deals/:id/probability',
      description: 'Use AI to calculate deal win probability based on deal data and history.',
      scopes: ['ai:use'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' }],
    },
  ],
};
