// =============================================================================
// TYPES
// =============================================================================

export interface EndpointParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  in: 'path' | 'query' | 'body';
}

export interface Endpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  scopes: string[];
  isWrite: boolean;
  params?: EndpointParam[];
  requestExample?: string;
  responseExample?: string;
}

export interface ResourceGroup {
  id: string;
  label: string;
  description: string;
  endpoints: Endpoint[];
}

// =============================================================================
// BASE URL
// =============================================================================

export const API_BASE_URL = 'https://api.trustpager.com/v1';

// =============================================================================
// CONTACTS (11 endpoints)
// =============================================================================

const CONTACTS: ResourceGroup = {
  id: 'contacts',
  label: 'Contacts',
  description: 'Manage individual contacts (people) in the CRM. Supports search, filtering, sub-resources (deals, activities, employers), and AI enrichment.',
  endpoints: [
    {
      method: 'GET',
      path: '/contacts',
      description: 'List all contacts with cursor-based pagination. Supports search, source filter, tags filter, and date range.',
      scopes: ['contacts:read'],
      isWrite: false,
      params: [
        { name: 'search', type: 'string', required: false, description: 'Search by first_name, last_name, or email', in: 'query' },
        { name: 'source', type: 'string', required: false, description: 'Filter by lead source', in: 'query' },
        { name: 'tags', type: 'string[]', required: false, description: 'Filter by tags (JSON array)', in: 'query' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Filter contacts linked to a specific customer', in: 'query' },
        { name: 'created_after', type: 'string', required: false, description: 'ISO date, return contacts created after this date', in: 'query' },
        { name: 'created_before', type: 'string', required: false, description: 'ISO date, return contacts created before this date', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results per page (1-100, default 25)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
        { name: 'fields', type: 'string', required: false, description: 'Comma-separated list of fields to return', in: 'query' },
        { name: 'expand', type: 'string', required: false, description: 'Comma-separated expansions: employers', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/contacts?search=John&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "a1b2c3d4-...",
      "public_id": "C-001",
      "first_name": "John",
      "last_name": "Smith",
      "email": "john@example.com",
      "phone": "+61412345678",
      "job_title": "Director",
      "source": "website",
      "tags": ["vip"],
      "created_at": "2026-01-15T10:30:00Z",
      "updated_at": "2026-03-20T14:00:00Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "has_more": true,
    "next_cursor": "a1b2c3d4-...",
    "prev_cursor": null
  },
  "meta": { "credits_remaining": 9500 }
}`,
    },
    {
      method: 'GET',
      path: '/contacts/:id',
      description: 'Retrieve a single contact by ID. Supports field selection and employer expansion.',
      scopes: ['contacts:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
        { name: 'fields', type: 'string', required: false, description: 'Comma-separated list of fields', in: 'query' },
        { name: 'expand', type: 'string', required: false, description: 'Comma-separated expansions: employers', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/contacts/a1b2c3d4-..." \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": {
    "id": "a1b2c3d4-...",
    "public_id": "C-001",
    "first_name": "John",
    "last_name": "Smith",
    "email": "john@example.com",
    "phone": "+61412345678",
    "job_title": "Director",
    "source": "website",
    "tags": ["vip"],
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-03-20T14:00:00Z"
  },
  "meta": { "credits_remaining": 9500 }
}`,
    },
    {
      method: 'POST',
      path: '/contacts',
      description: 'Create a new contact. first_name is required.',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'first_name', type: 'string', required: true, description: 'Contact first name', in: 'body' },
        { name: 'last_name', type: 'string', required: false, description: 'Contact last name', in: 'body' },
        { name: 'email', type: 'string', required: false, description: 'Email address', in: 'body' },
        { name: 'phone', type: 'string', required: false, description: 'Phone number (E.164 format preferred)', in: 'body' },
        { name: 'job_title', type: 'string', required: false, description: 'Job title', in: 'body' },
        { name: 'source', type: 'string', required: false, description: 'Lead source (e.g. website, referral, api)', in: 'body' },
        { name: 'tags', type: 'string[]', required: false, description: 'Array of tags', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Free-text notes', in: 'body' },
        { name: 'metadata', type: 'object', required: false, description: 'Custom key-value metadata', in: 'body' },
        { name: 'address_line1', type: 'string', required: false, description: 'Street address line 1', in: 'body' },
        { name: 'city', type: 'string', required: false, description: 'City', in: 'body' },
        { name: 'state', type: 'string', required: false, description: 'State/province', in: 'body' },
        { name: 'postal_code', type: 'string', required: false, description: 'Postal/zip code', in: 'body' },
        { name: 'country', type: 'string', required: false, description: 'Country (default: Australia)', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/contacts" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@example.com",
    "phone": "+61412345678",
    "source": "api",
    "tags": ["new-lead"]
  }'`,
      responseExample: `{
  "data": {
    "id": "new-uuid-...",
    "public_id": "C-002",
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@example.com",
    "phone": "+61412345678",
    "job_title": null,
    "source": "api",
    "tags": ["new-lead"],
    "created_at": "2026-03-23T10:00:00Z",
    "updated_at": "2026-03-23T10:00:00Z"
  },
  "meta": { "credits_remaining": 9499 }
}`,
    },
    {
      method: 'PATCH',
      path: '/contacts/:id',
      description: 'Update an existing contact. Only include fields you want to change.',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
        { name: 'first_name', type: 'string', required: false, description: 'First name', in: 'body' },
        { name: 'last_name', type: 'string', required: false, description: 'Last name', in: 'body' },
        { name: 'email', type: 'string', required: false, description: 'Email', in: 'body' },
        { name: 'phone', type: 'string', required: false, description: 'Phone', in: 'body' },
        { name: 'tags', type: 'string[]', required: false, description: 'Tags (replaces existing)', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/contacts/:id',
      description: 'Delete a contact. Returns 204 No Content on success.',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/contacts/search',
      description: 'Full-text search across contact names and email. Returns up to 100 results.',
      scopes: ['contacts:read'],
      isWrite: false,
      params: [
        { name: 'query', type: 'string', required: true, description: 'Search query', in: 'body' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100, default 25)', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/contacts/search" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "query": "john", "limit": 10 }'`,
    },
    {
      method: 'GET',
      path: '/contacts/:id/deals',
      description: 'List all deals associated with a contact.',
      scopes: ['contacts:read', 'deals:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
      ],
    },
    {
      method: 'GET',
      path: '/contacts/:id/activities',
      description: 'List all activities (calls, meetings, notes) for a contact.',
      scopes: ['contacts:read', 'activities:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
      ],
    },
    {
      method: 'GET',
      path: '/contacts/:id/employers',
      description: 'List customer (company) links for this contact.',
      scopes: ['contacts:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/contacts/:id/employers/:customerId',
      description: 'Link a contact to a customer (employer relationship).',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
        { name: 'customerId', type: 'uuid', required: true, description: 'Customer ID to link', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/contacts/:id/employers/:customerId',
      description: 'Remove an employer link between a contact and customer.',
      scopes: ['contacts:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
        { name: 'customerId', type: 'uuid', required: true, description: 'Customer ID to unlink', in: 'path' },
      ],
    },
  ],
};

// =============================================================================
// CUSTOMERS
// =============================================================================

const CUSTOMERS: ResourceGroup = {
  id: 'customers',
  label: 'Customers',
  description: 'Manage business accounts (companies/organisations) in the CRM. Customers can have multiple contacts linked.',
  endpoints: [
    {
      method: 'GET',
      path: '/customers',
      description: 'List all customers with cursor-based pagination.',
      scopes: ['customers:read'],
      isWrite: false,
      params: [
        { name: 'search', type: 'string', required: false, description: 'Search by name or email', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100, default 25)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/customers?limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "cust-uuid-...",
      "public_id": "A-001",
      "name": "Acme Corp",
      "email": "info@acme.com",
      "phone": "+61290001234",
      "industry": "Construction",
      "tags": ["enterprise"],
      "created_at": "2026-01-10T09:00:00Z"
    }
  ],
  "pagination": { "limit": 10, "has_more": false, "next_cursor": null, "prev_cursor": null },
  "meta": { "credits_remaining": 9500 }
}`,
    },
    {
      method: 'GET',
      path: '/customers/:id',
      description: 'Retrieve a single customer by ID.',
      scopes: ['customers:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Customer ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/customers',
      description: 'Create a new customer. name is required.',
      scopes: ['customers:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Company/organisation name', in: 'body' },
        { name: 'email', type: 'string', required: false, description: 'Primary email', in: 'body' },
        { name: 'phone', type: 'string', required: false, description: 'Primary phone', in: 'body' },
        { name: 'industry', type: 'string', required: false, description: 'Industry sector', in: 'body' },
        { name: 'website', type: 'string', required: false, description: 'Website URL', in: 'body' },
        { name: 'tags', type: 'string[]', required: false, description: 'Tags', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/customers" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "Acme Corp", "email": "info@acme.com" }'`,
    },
    {
      method: 'PATCH',
      path: '/customers/:id',
      description: 'Update an existing customer.',
      scopes: ['customers:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Customer ID', in: 'path' }],
    },
    {
      method: 'DELETE',
      path: '/customers/:id',
      description: 'Delete a customer.',
      scopes: ['customers:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Customer ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/customers/search',
      description: 'Search customers by name, email, or phone.',
      scopes: ['customers:read'],
      isWrite: false,
      params: [
        { name: 'query', type: 'string', required: true, description: 'Search query', in: 'body' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100)', in: 'body' },
      ],
    },
    {
      method: 'GET',
      path: '/customers/:id/contacts',
      description: 'List all contacts linked to this customer.',
      scopes: ['customers:read', 'contacts:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Customer ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/customers/:id/deals',
      description: 'List all deals for this customer.',
      scopes: ['customers:read', 'deals:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Customer ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/customers/:id/activities',
      description: 'List all activities for this customer.',
      scopes: ['customers:read', 'activities:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Customer ID', in: 'path' }],
    },
  ],
};

// =============================================================================
// DEALS (16+ endpoints)
// =============================================================================

const DEALS: ResourceGroup = {
  id: 'deals',
  label: 'Deals',
  description: 'Manage deals (opportunities) through your sales pipeline. Supports sub-resources for products, product costs, contacts, users, activities, tasks, work orders, and pipeline moves.',
  endpoints: [
    {
      method: 'GET',
      path: '/deals',
      description: 'List all deals with cursor-based pagination. Supports search, status, contact, customer, pipeline, and date filters. Always includes pipeline placements.',
      scopes: ['deals:read'],
      isWrite: false,
      params: [
        { name: 'search', type: 'string', required: false, description: 'Search by deal name', in: 'query' },
        { name: 'status', type: 'string', required: false, description: 'Filter by status (open, won, lost)', in: 'query' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Filter by primary contact', in: 'query' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Filter by customer', in: 'query' },
        { name: 'assigned_to', type: 'uuid', required: false, description: 'Filter by assigned user', in: 'query' },
        { name: 'pipeline_id', type: 'uuid', required: false, description: 'Filter by pipeline', in: 'query' },
        { name: 'created_after', type: 'string', required: false, description: 'ISO date filter', in: 'query' },
        { name: 'created_before', type: 'string', required: false, description: 'ISO date filter', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100, default 25)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
        { name: 'expand', type: 'string', required: false, description: 'Expansions: contact, customer, products, assigned_users', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/deals?status=open&pipeline_id=UUID&limit=25" \\
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
        { name: 'tags', type: 'string[]', required: false, description: 'Tags', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Notes', in: 'body' },
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
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' }],
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
      description: 'Move a deal to a pipeline stage. If the deal is not in the pipeline, it will be added. If it is in a different pipeline, it will be moved.',
      scopes: ['deals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Deal ID', in: 'path' },
        { name: 'pipeline_id', type: 'uuid', required: true, description: 'Target pipeline ID', in: 'body' },
        { name: 'stage_id', type: 'uuid', required: true, description: 'Target stage ID', in: 'body' },
        { name: 'position', type: 'number', required: false, description: 'Position within stage', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/deals/deal-uuid/move" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "pipeline_id": "pipe-uuid", "stage_id": "stage-uuid" }'`,
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

// =============================================================================
// AUTOMATIONS (18 endpoints)
// =============================================================================

const AUTOMATIONS: ResourceGroup = {
  id: 'automations',
  label: 'Automations',
  description: 'Create and manage workflow automations. Includes sub-resources for triggers, actions, and execution runs. Supports enable/disable and manual triggering.',
  endpoints: [
    {
      method: 'GET',
      path: '/automations',
      description: 'List all automations for the company.',
      scopes: ['automations:read'],
      isWrite: false,
      params: [
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/automations?limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "auto-uuid-...",
      "name": "New Lead Welcome Email",
      "trigger_type": "pipeline",
      "enabled": true,
      "priority": 0,
      "created_at": "2026-02-15T12:00:00Z"
    }
  ],
  "pagination": { "limit": 10, "has_more": false, "next_cursor": null, "prev_cursor": null }
}`,
    },
    {
      method: 'GET',
      path: '/automations/:id',
      description: 'Retrieve an automation with its triggers and actions.',
      scopes: ['automations:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/automations',
      description: 'Create a new automation. name and trigger_type are required.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Automation name', in: 'body' },
        { name: 'trigger_type', type: 'string', required: true, description: 'Trigger type (pipeline, website, custom_webhook, platform_trigger)', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Description', in: 'body' },
        { name: 'enabled', type: 'boolean', required: false, description: 'Whether enabled (default: false)', in: 'body' },
        { name: 'priority', type: 'number', required: false, description: 'Execution priority', in: 'body' },
        { name: 'conditions', type: 'object', required: false, description: 'Trigger conditions', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/automations" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "New Lead Welcome",
    "trigger_type": "pipeline",
    "description": "Send welcome email when lead enters pipeline"
  }'`,
    },
    {
      method: 'PATCH',
      path: '/automations/:id',
      description: 'Update an automation.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'DELETE',
      path: '/automations/:id',
      description: 'Delete an automation and all its triggers/actions.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/automations/:id/enable',
      description: 'Enable an automation.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/automations/:id/disable',
      description: 'Disable an automation.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/automations/:id/trigger',
      description: 'Manually trigger an automation with optional test data.',
      scopes: ['automations:trigger'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' },
        { name: 'trigger_data', type: 'object', required: false, description: 'Test data to pass to the automation', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/automations/auto-uuid/trigger" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "trigger_data": { "deal_id": "deal-uuid", "contact_id": "contact-uuid" } }'`,
    },
    {
      method: 'GET',
      path: '/automations/:id/runs',
      description: 'List execution runs for an automation.',
      scopes: ['automations:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/automations/runs/:runId',
      description: 'Get details of a specific automation run including action results.',
      scopes: ['automations:read'],
      isWrite: false,
      params: [{ name: 'runId', type: 'uuid', required: true, description: 'Run ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/automations/:id/triggers',
      description: 'List triggers for an automation.',
      scopes: ['automations:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/automations/:id/triggers',
      description: 'Add a trigger to an automation.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' },
        { name: 'source_type', type: 'string', required: false, description: 'Trigger source type', in: 'body' },
        { name: 'source_id', type: 'string', required: false, description: 'Trigger source ID (e.g. pipeline stage ID)', in: 'body' },
        { name: 'config', type: 'object', required: false, description: 'Trigger configuration', in: 'body' },
      ],
    },
    {
      method: 'PATCH',
      path: '/automations/:id/triggers/:triggerId',
      description: 'Update a trigger.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' },
        { name: 'triggerId', type: 'uuid', required: true, description: 'Trigger ID', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/automations/:id/triggers/:triggerId',
      description: 'Delete a trigger from an automation.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' },
        { name: 'triggerId', type: 'uuid', required: true, description: 'Trigger ID', in: 'path' },
      ],
    },
    {
      method: 'GET',
      path: '/automations/:id/actions',
      description: 'List actions for an automation, ordered by sequence.',
      scopes: ['automations:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/automations/:id/actions',
      description: 'Add an action to an automation. action_type and sequence are required.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' },
        { name: 'action_type', type: 'string', required: true, description: 'Action type (send_custom_email, send_sms, trigger_voice_call, call_webhook, add_tasks, etc.)', in: 'body' },
        { name: 'sequence', type: 'number', required: true, description: 'Execution order', in: 'body' },
        { name: 'config', type: 'object', required: false, description: 'Action configuration (varies by action_type)', in: 'body' },
      ],
    },
    {
      method: 'PATCH',
      path: '/automations/:id/actions/:actionId',
      description: 'Update an action.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' },
        { name: 'actionId', type: 'uuid', required: true, description: 'Action ID', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/automations/:id/actions/:actionId',
      description: 'Delete an action from an automation.',
      scopes: ['automations:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Automation ID', in: 'path' },
        { name: 'actionId', type: 'uuid', required: true, description: 'Action ID', in: 'path' },
      ],
    },
  ],
};

// =============================================================================
// EMAIL (11 endpoints)
// =============================================================================

const EMAIL: ResourceGroup = {
  id: 'email',
  label: 'Email',
  description: 'Send and receive emails, manage threads, view logs, and configure email settings. Emails are sent via Postmark.',
  endpoints: [
    {
      method: 'GET',
      path: '/email/threads',
      description: 'List email threads with linked entities (contacts, deals, customers).',
      scopes: ['email:read'],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status (open, closed)', in: 'query' },
        { name: 'is_read', type: 'boolean', required: false, description: 'Filter by read status', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Cursor for pagination', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/email/threads?status=open&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "thread-uuid-...",
      "subject": "RE: Project Proposal",
      "status": "open",
      "is_read": false,
      "message_count": 3,
      "last_message_at": "2026-03-22T15:30:00Z",
      "last_message_direction": "inbound",
      "last_message_preview": "Thanks for the proposal...",
      "linked_entities": {
        "contacts": [{ "id": "...", "first_name": "John", "last_name": "Smith" }],
        "deals": [{ "id": "...", "name": "Website Redesign" }],
        "customers": []
      }
    }
  ],
  "pagination": { "limit": 10, "has_more": false, "next_cursor": null, "prev_cursor": null }
}`,
    },
    {
      method: 'GET',
      path: '/email/threads/:id',
      description: 'Retrieve a single email thread with linked entities.',
      scopes: ['email:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Thread ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/email/threads/:id/messages',
      description: 'List all messages (inbound and outbound) in a thread, sorted chronologically.',
      scopes: ['email:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Thread ID', in: 'path' },
        { name: 'limit', type: 'number', required: false, description: 'Max messages per page', in: 'query' },
      ],
    },
    {
      method: 'POST',
      path: '/email/send',
      description: 'Send a new email. Requires to_email, subject, and html_body.',
      scopes: ['email:send'],
      isWrite: true,
      params: [
        { name: 'to_email', type: 'string', required: true, description: 'Recipient email address', in: 'body' },
        { name: 'to_name', type: 'string', required: false, description: 'Recipient name', in: 'body' },
        { name: 'subject', type: 'string', required: true, description: 'Email subject', in: 'body' },
        { name: 'html_body', type: 'string', required: true, description: 'HTML email body', in: 'body' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Link to contact', in: 'body' },
        { name: 'deal_id', type: 'uuid', required: false, description: 'Link to deal', in: 'body' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Link to customer', in: 'body' },
        { name: 'email_config_id', type: 'uuid', required: false, description: 'Email config to use (defaults to company default)', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/email/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to_email": "client@example.com",
    "to_name": "Jane Doe",
    "subject": "Your Proposal",
    "html_body": "<h1>Hello!</h1><p>Your proposal is ready.</p>",
    "deal_id": "deal-uuid-..."
  }'`,
    },
    {
      method: 'POST',
      path: '/email/reply',
      description: 'Reply to an existing email thread.',
      scopes: ['email:send'],
      isWrite: true,
      params: [
        { name: 'thread_id', type: 'uuid', required: true, description: 'Thread ID to reply to', in: 'body' },
        { name: 'reply_html', type: 'string', required: true, description: 'Reply HTML body', in: 'body' },
        { name: 'to_email', type: 'string', required: true, description: 'Recipient email', in: 'body' },
        { name: 'to_name', type: 'string', required: false, description: 'Recipient name', in: 'body' },
        { name: 'in_reply_to', type: 'string', required: false, description: 'Message ID to reply to (for threading)', in: 'body' },
      ],
    },
    {
      method: 'GET',
      path: '/email/logs',
      description: 'List email send logs with optional filters.',
      scopes: ['email:read'],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status', in: 'query' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Filter by contact', in: 'query' },
        { name: 'deal_id', type: 'uuid', required: false, description: 'Filter by deal', in: 'query' },
        { name: 'email_type', type: 'string', required: false, description: 'Filter by type', in: 'query' },
      ],
    },
    {
      method: 'GET',
      path: '/email/configs',
      description: 'List all email configurations for the company.',
      scopes: ['email:read'],
      isWrite: false,
    },
    {
      method: 'GET',
      path: '/email/configs/:id',
      description: 'Retrieve a specific email configuration.',
      scopes: ['email:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Email config ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/email/configs',
      description: 'Create an email configuration. Requires from_email, from_name, and staff_email.',
      scopes: ['email-config:write'],
      isWrite: true,
      params: [
        { name: 'from_email', type: 'string', required: true, description: 'Sender email address', in: 'body' },
        { name: 'from_name', type: 'string', required: true, description: 'Sender display name', in: 'body' },
        { name: 'staff_email', type: 'string', required: true, description: 'Staff notification email', in: 'body' },
        { name: 'config_name', type: 'string', required: false, description: 'Config display name', in: 'body' },
        { name: 'logo_url', type: 'string', required: false, description: 'Logo URL for emails', in: 'body' },
        { name: 'primary_color', type: 'string', required: false, description: 'Primary brand color hex', in: 'body' },
        { name: 'is_default', type: 'boolean', required: false, description: 'Set as default config', in: 'body' },
      ],
    },
    {
      method: 'PATCH',
      path: '/email/configs/:id',
      description: 'Update an email configuration.',
      scopes: ['email-config:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Email config ID', in: 'path' }],
    },
    {
      method: 'DELETE',
      path: '/email/configs/:id',
      description: 'Delete an email configuration.',
      scopes: ['email-config:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Email config ID', in: 'path' }],
    },
  ],
};

// =============================================================================
// PIPELINES
// =============================================================================

const PIPELINES: ResourceGroup = {
  id: 'pipelines',
  label: 'Pipelines',
  description: 'Manage sales pipelines and their stages. Deals move through pipeline stages to track progress.',
  endpoints: [
    { method: 'GET', path: '/pipelines', description: 'List all pipelines.', scopes: ['pipelines:read'], isWrite: false },
    { method: 'GET', path: '/pipelines/:id', description: 'Retrieve a pipeline with its stages.', scopes: ['pipelines:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }] },
    { method: 'POST', path: '/pipelines', description: 'Create a new pipeline. name is required.', scopes: ['pipelines:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Pipeline name', in: 'body' }] },
    { method: 'PATCH', path: '/pipelines/:id', description: 'Update a pipeline.', scopes: ['pipelines:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }] },
    { method: 'DELETE', path: '/pipelines/:id', description: 'Delete a pipeline.', scopes: ['pipelines:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }] },
    { method: 'GET', path: '/pipelines/:id/stages', description: 'List stages for a pipeline.', scopes: ['pipelines:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }] },
    { method: 'POST', path: '/pipelines/:id/stages', description: 'Add a stage to a pipeline.', scopes: ['pipelines:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }, { name: 'name', type: 'string', required: true, description: 'Stage name', in: 'body' }] },
    { method: 'PATCH', path: '/pipelines/:id/stages/:stageId', description: 'Update a pipeline stage.', scopes: ['pipelines:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }, { name: 'stageId', type: 'uuid', required: true, description: 'Stage ID', in: 'path' }] },
    { method: 'DELETE', path: '/pipelines/:id/stages/:stageId', description: 'Delete a pipeline stage.', scopes: ['pipelines:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }, { name: 'stageId', type: 'uuid', required: true, description: 'Stage ID', in: 'path' }] },
    { method: 'GET', path: '/pipelines/:id/deals', description: 'List deals in a pipeline.', scopes: ['pipelines:read', 'deals:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }] },
    { method: 'GET', path: '/pipelines/:id/summary', description: 'Get pipeline summary with deal counts and values per stage.', scopes: ['pipelines:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }] },
  ],
};

// =============================================================================
// PRODUCTS
// =============================================================================

const PRODUCTS: ResourceGroup = {
  id: 'products',
  label: 'Products',
  description: 'Manage products and services that can be added to deals.',
  endpoints: [
    { method: 'GET', path: '/products', description: 'List all products.', scopes: ['products:read'], isWrite: false },
    { method: 'GET', path: '/products/:id', description: 'Retrieve a product by ID.', scopes: ['products:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Product ID', in: 'path' }] },
    { method: 'POST', path: '/products', description: 'Create a product. name is required.', scopes: ['products:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Product name', in: 'body' }, { name: 'price', type: 'number', required: false, description: 'Unit price', in: 'body' }, { name: 'currency', type: 'string', required: false, description: 'Currency (default: AUD)', in: 'body' }, { name: 'sku', type: 'string', required: false, description: 'SKU code', in: 'body' }] },
    { method: 'PATCH', path: '/products/:id', description: 'Update a product.', scopes: ['products:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Product ID', in: 'path' }] },
    { method: 'DELETE', path: '/products/:id', description: 'Delete a product.', scopes: ['products:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Product ID', in: 'path' }] },
  ],
};

// =============================================================================
// SUPPLIER PRODUCTS
// =============================================================================

const SUPPLIER_PRODUCTS: ResourceGroup = {
  id: 'supplier-products',
  label: 'Supplier Products',
  description: 'Manage supplier product catalogues for cost tracking on deals.',
  endpoints: [
    { method: 'GET', path: '/supplier-products', description: 'List all supplier products.', scopes: ['products:read'], isWrite: false },
    { method: 'GET', path: '/supplier-products/:id', description: 'Retrieve a supplier product.', scopes: ['products:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Supplier product ID', in: 'path' }] },
    { method: 'POST', path: '/supplier-products', description: 'Create a supplier product.', scopes: ['products:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Product name', in: 'body' }] },
    { method: 'PATCH', path: '/supplier-products/:id', description: 'Update a supplier product.', scopes: ['products:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Supplier product ID', in: 'path' }] },
    { method: 'DELETE', path: '/supplier-products/:id', description: 'Delete a supplier product.', scopes: ['products:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Supplier product ID', in: 'path' }] },
  ],
};

// =============================================================================
// ACTIVITIES
// =============================================================================

const ACTIVITIES: ResourceGroup = {
  id: 'activities',
  label: 'Activities',
  description: 'Log and manage CRM activities (calls, meetings, notes) linked to contacts, deals, and customers.',
  endpoints: [
    { method: 'GET', path: '/activities', description: 'List all activities with filters.', scopes: ['activities:read'], isWrite: false },
    { method: 'GET', path: '/activities/:id', description: 'Retrieve an activity by ID.', scopes: ['activities:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Activity ID', in: 'path' }] },
    { method: 'POST', path: '/activities/log-call', description: 'Log a phone call activity.', scopes: ['activities:write'], isWrite: true, params: [{ name: 'subject', type: 'string', required: true, description: 'Call subject', in: 'body' }, { name: 'contact_id', type: 'uuid', required: false, description: 'Contact ID', in: 'body' }, { name: 'deal_id', type: 'uuid', required: false, description: 'Deal ID', in: 'body' }] },
    { method: 'POST', path: '/activities/log-meeting', description: 'Log a meeting activity.', scopes: ['activities:write'], isWrite: true, params: [{ name: 'subject', type: 'string', required: true, description: 'Meeting subject', in: 'body' }] },
    { method: 'POST', path: '/activities/add-note', description: 'Add a note to a contact, deal, or customer.', scopes: ['activities:write'], isWrite: true, params: [{ name: 'description', type: 'string', required: true, description: 'Note content', in: 'body' }, { name: 'contact_id', type: 'uuid', required: false, description: 'Contact ID', in: 'body' }, { name: 'deal_id', type: 'uuid', required: false, description: 'Deal ID', in: 'body' }] },
    { method: 'DELETE', path: '/activities/:id', description: 'Delete an activity.', scopes: ['activities:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Activity ID', in: 'path' }] },
  ],
};

// =============================================================================
// TASKS
// =============================================================================

const TASKS: ResourceGroup = {
  id: 'tasks',
  label: 'Tasks',
  description: 'Create, assign, and manage tasks linked to deals and contacts.',
  endpoints: [
    { method: 'GET', path: '/tasks', description: 'List all tasks with filters.', scopes: ['tasks:read'], isWrite: false },
    { method: 'GET', path: '/tasks/:id', description: 'Retrieve a task.', scopes: ['tasks:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Task ID', in: 'path' }] },
    { method: 'POST', path: '/tasks', description: 'Create a task. title is required.', scopes: ['tasks:write'], isWrite: true, params: [{ name: 'title', type: 'string', required: true, description: 'Task title', in: 'body' }, { name: 'deal_id', type: 'uuid', required: false, description: 'Link to deal', in: 'body' }, { name: 'assigned_to', type: 'uuid', required: false, description: 'Assign to user ID', in: 'body' }] },
    { method: 'PATCH', path: '/tasks/:id', description: 'Update a task.', scopes: ['tasks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Task ID', in: 'path' }] },
    { method: 'DELETE', path: '/tasks/:id', description: 'Delete a task.', scopes: ['tasks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Task ID', in: 'path' }] },
    { method: 'POST', path: '/tasks/:id/complete', description: 'Mark a task as complete.', scopes: ['tasks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Task ID', in: 'path' }] },
    { method: 'GET', path: '/tasks/categories', description: 'List task categories.', scopes: ['tasks:read'], isWrite: false },
  ],
};

// =============================================================================
// WORK ORDERS
// =============================================================================

const WORK_ORDERS: ResourceGroup = {
  id: 'work-orders',
  label: 'Work Orders',
  description: 'Manage work orders linked to deals for tracking project execution.',
  endpoints: [
    { method: 'GET', path: '/work-orders', description: 'List all work orders.', scopes: ['work-orders:read'], isWrite: false },
    { method: 'GET', path: '/work-orders/:id', description: 'Retrieve a work order.', scopes: ['work-orders:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Work order ID', in: 'path' }] },
    { method: 'POST', path: '/work-orders', description: 'Create a work order.', scopes: ['work-orders:write'], isWrite: true, params: [{ name: 'title', type: 'string', required: true, description: 'Title', in: 'body' }, { name: 'deal_id', type: 'uuid', required: false, description: 'Link to deal', in: 'body' }] },
    { method: 'PATCH', path: '/work-orders/:id', description: 'Update a work order.', scopes: ['work-orders:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Work order ID', in: 'path' }] },
    { method: 'DELETE', path: '/work-orders/:id', description: 'Delete a work order.', scopes: ['work-orders:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Work order ID', in: 'path' }] },
  ],
};

// =============================================================================
// EVENT QUEUES
// =============================================================================

const EVENT_QUEUES: ResourceGroup = {
  id: 'event-queues',
  label: 'Event Queues',
  description: 'Manage event queues for sequenced multi-step workflows (drip campaigns, follow-up sequences).',
  endpoints: [
    { method: 'GET', path: '/event-queues', description: 'List all event queues.', scopes: ['automations:read'], isWrite: false },
    { method: 'GET', path: '/event-queues/:id', description: 'Retrieve an event queue with its steps.', scopes: ['automations:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Event queue ID', in: 'path' }] },
    { method: 'POST', path: '/event-queues', description: 'Create an event queue.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Queue name', in: 'body' }] },
    { method: 'PATCH', path: '/event-queues/:id', description: 'Update an event queue.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Event queue ID', in: 'path' }] },
    { method: 'DELETE', path: '/event-queues/:id', description: 'Delete an event queue.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Event queue ID', in: 'path' }] },
    { method: 'POST', path: '/event-queues/:id/steps', description: 'Add a step to an event queue.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Event queue ID', in: 'path' }] },
    { method: 'PATCH', path: '/event-queues/:id/steps/:stepId', description: 'Update an event queue step.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Event queue ID', in: 'path' }, { name: 'stepId', type: 'uuid', required: true, description: 'Step ID', in: 'path' }] },
    { method: 'DELETE', path: '/event-queues/:id/steps/:stepId', description: 'Delete an event queue step.', scopes: ['automations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Event queue ID', in: 'path' }, { name: 'stepId', type: 'uuid', required: true, description: 'Step ID', in: 'path' }] },
  ],
};

// =============================================================================
// SMS
// =============================================================================

const SMS: ResourceGroup = {
  id: 'sms',
  label: 'SMS',
  description: 'Send and receive SMS messages. View conversations and message history.',
  endpoints: [
    { method: 'GET', path: '/sms/conversations', description: 'List SMS conversations.', scopes: ['sms:read'], isWrite: false },
    { method: 'GET', path: '/sms/conversations/:id', description: 'Retrieve an SMS conversation.', scopes: ['sms:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Conversation ID', in: 'path' }] },
    { method: 'GET', path: '/sms/conversations/:id/messages', description: 'List messages in a conversation.', scopes: ['sms:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Conversation ID', in: 'path' }] },
    { method: 'POST', path: '/sms/send', description: 'Send an SMS message.', scopes: ['sms:send'], isWrite: true, params: [{ name: 'to_number', type: 'string', required: true, description: 'Recipient phone number (E.164)', in: 'body' }, { name: 'message', type: 'string', required: true, description: 'SMS message body', in: 'body' }, { name: 'phone_number_id', type: 'uuid', required: false, description: 'Sender phone number ID', in: 'body' }] },
  ],
};

// =============================================================================
// PHONE
// =============================================================================

const PHONE: ResourceGroup = {
  id: 'phone',
  label: 'Phone',
  description: 'Manage phone numbers and call logs. Search for available numbers to purchase.',
  endpoints: [
    { method: 'GET', path: '/phone/numbers', description: 'List company phone numbers.', scopes: ['phone:read'], isWrite: false },
    { method: 'POST', path: '/phone/numbers/search', description: 'Search available phone numbers to purchase.', scopes: ['phone:read'], isWrite: false, params: [{ name: 'country', type: 'string', required: false, description: 'Country code (default: AU)', in: 'body' }, { name: 'area_code', type: 'string', required: false, description: 'Area code filter', in: 'body' }] },
    { method: 'POST', path: '/phone/numbers/buy', description: 'Purchase a phone number.', scopes: ['phone:write'], isWrite: true, params: [{ name: 'phone_number', type: 'string', required: true, description: 'Phone number to purchase', in: 'body' }] },
    { method: 'DELETE', path: '/phone/numbers/:id', description: 'Release a phone number.', scopes: ['phone:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Phone number ID', in: 'path' }] },
    { method: 'GET', path: '/phone/calls', description: 'List phone call logs.', scopes: ['calls:read'], isWrite: false },
    { method: 'POST', path: '/phone/call', description: 'Initiate a phone call via a voice agent.', scopes: ['calls:initiate'], isWrite: true, params: [{ name: 'to_number', type: 'string', required: true, description: 'Number to call (E.164)', in: 'body' }, { name: 'voice_agent_id', type: 'uuid', required: true, description: 'Voice agent to use', in: 'body' }] },
  ],
};

// =============================================================================
// VOICE AGENTS
// =============================================================================

const VOICE_AGENTS: ResourceGroup = {
  id: 'voice-agents',
  label: 'Voice Agents',
  description: 'Manage AI voice agents that handle phone calls.',
  endpoints: [
    { method: 'GET', path: '/voice-agents', description: 'List all voice agents.', scopes: ['voice-agents:read'], isWrite: false },
    { method: 'GET', path: '/voice-agents/:id', description: 'Retrieve a voice agent.', scopes: ['voice-agents:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Voice agent ID', in: 'path' }] },
  ],
};

// =============================================================================
// TEXT AGENTS
// =============================================================================

const TEXT_AGENTS: ResourceGroup = {
  id: 'text-agents',
  label: 'Text Agents',
  description: 'Manage AI text agents that handle SMS and chat conversations.',
  endpoints: [
    { method: 'GET', path: '/text-agents', description: 'List all text agents.', scopes: ['voice-agents:read'], isWrite: false },
    { method: 'GET', path: '/text-agents/:id', description: 'Retrieve a text agent.', scopes: ['voice-agents:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Text agent ID', in: 'path' }] },
    { method: 'POST', path: '/text-agents', description: 'Create a text agent.', scopes: ['voice-agents:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Agent name', in: 'body' }] },
    { method: 'PATCH', path: '/text-agents/:id', description: 'Update a text agent.', scopes: ['voice-agents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Text agent ID', in: 'path' }] },
    { method: 'DELETE', path: '/text-agents/:id', description: 'Delete a text agent.', scopes: ['voice-agents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Text agent ID', in: 'path' }] },
    { method: 'GET', path: '/text-agents/:id/responses', description: 'List responses generated by a text agent.', scopes: ['voice-agents:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Text agent ID', in: 'path' }] },
  ],
};

// =============================================================================
// TRANSCRIPTS
// =============================================================================

const TRANSCRIPTS: ResourceGroup = {
  id: 'transcripts',
  label: 'Transcripts',
  description: 'View call transcripts and AI coaching results.',
  endpoints: [
    { method: 'GET', path: '/transcripts', description: 'List all transcripts.', scopes: ['calls:read'], isWrite: false },
    { method: 'GET', path: '/transcripts/:id', description: 'Retrieve a transcript.', scopes: ['calls:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Transcript ID', in: 'path' }] },
    { method: 'GET', path: '/transcripts/coaching', description: 'List AI coaching results.', scopes: ['calls:read'], isWrite: false },
    { method: 'GET', path: '/transcripts/coaching/:id', description: 'Retrieve a coaching result.', scopes: ['calls:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Coaching result ID', in: 'path' }] },
    { method: 'POST', path: '/transcripts/:id/coaching', description: 'Run AI coaching analysis on a transcript.', scopes: ['ai:use'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Transcript ID', in: 'path' }] },
  ],
};

// =============================================================================
// DOCUMENT TEMPLATES
// =============================================================================

const DOCUMENT_TEMPLATES: ResourceGroup = {
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
    { method: 'POST', path: '/document-templates/:id/sections', description: 'Add a section to a template.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'PATCH', path: '/document-templates/:id/sections/:sectionId', description: 'Update a template section.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }, { name: 'sectionId', type: 'uuid', required: true, description: 'Section ID', in: 'path' }] },
    { method: 'DELETE', path: '/document-templates/:id/sections/:sectionId', description: 'Delete a template section.', scopes: ['documents:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }, { name: 'sectionId', type: 'uuid', required: true, description: 'Section ID', in: 'path' }] },
  ],
};

// =============================================================================
// DOCUMENTS
// =============================================================================

const DOCUMENTS: ResourceGroup = {
  id: 'documents',
  label: 'Documents',
  description: 'Manage generated documents (from templates) sent to contacts.',
  endpoints: [
    { method: 'GET', path: '/documents', description: 'List all documents.', scopes: ['documents:read'], isWrite: false },
    { method: 'GET', path: '/documents/:id', description: 'Retrieve a document.', scopes: ['documents:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Document ID', in: 'path' }] },
  ],
};

// =============================================================================
// SIGNING
// =============================================================================

const SIGNING: ResourceGroup = {
  id: 'signing',
  label: 'Signing',
  description: 'Manage e-signature envelopes. Send documents for signing and track completion status.',
  endpoints: [
    { method: 'GET', path: '/signing/envelopes', description: 'List signing envelopes.', scopes: ['documents:read'], isWrite: false },
    { method: 'GET', path: '/signing/envelopes/:id', description: 'Retrieve a signing envelope with recipients.', scopes: ['documents:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Envelope ID', in: 'path' }] },
    { method: 'POST', path: '/signing/send', description: 'Send a document for signing.', scopes: ['signing:send'], isWrite: true, params: [{ name: 'template_id', type: 'uuid', required: true, description: 'Document template ID', in: 'body' }, { name: 'contact_id', type: 'uuid', required: false, description: 'Contact ID', in: 'body' }, { name: 'deal_id', type: 'uuid', required: false, description: 'Deal ID', in: 'body' }] },
    { method: 'POST', path: '/signing/envelopes/:id/resend', description: 'Resend signing email to recipients.', scopes: ['signing:send'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Envelope ID', in: 'path' }] },
  ],
};

// =============================================================================
// FORMS
// =============================================================================

const FORMS: ResourceGroup = {
  id: 'forms',
  label: 'Forms',
  description: 'Create form templates, manage fields, send forms to contacts, and view submissions.',
  endpoints: [
    { method: 'GET', path: '/forms/templates', description: 'List all form templates.', scopes: ['forms:read'], isWrite: false },
    { method: 'GET', path: '/forms/templates/:id', description: 'Retrieve a form template with fields.', scopes: ['forms:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'POST', path: '/forms/templates', description: 'Create a form template.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Form name', in: 'body' }] },
    { method: 'PATCH', path: '/forms/templates/:id', description: 'Update a form template.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'DELETE', path: '/forms/templates/:id', description: 'Delete a form template.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'POST', path: '/forms/templates/:id/fields', description: 'Add a field to a form.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'POST', path: '/forms/send', description: 'Send a form to a contact.', scopes: ['forms:send'], isWrite: true, params: [{ name: 'template_id', type: 'uuid', required: true, description: 'Form template ID', in: 'body' }, { name: 'contact_id', type: 'uuid', required: false, description: 'Contact ID', in: 'body' }] },
    { method: 'GET', path: '/forms/submissions', description: 'List form submissions.', scopes: ['forms:read'], isWrite: false },
    { method: 'GET', path: '/forms/submissions/:id', description: 'Retrieve a form submission.', scopes: ['forms:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Submission ID', in: 'path' }] },
  ],
};

// =============================================================================
// WEBSITES
// =============================================================================

const WEBSITES: ResourceGroup = {
  id: 'websites',
  label: 'Websites',
  description: 'Manage TrustPager-hosted websites and landing pages.',
  endpoints: [
    { method: 'GET', path: '/websites', description: 'List all websites.', scopes: ['websites:read'], isWrite: false },
    { method: 'GET', path: '/websites/:id', description: 'Retrieve a website.', scopes: ['websites:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Website ID', in: 'path' }] },
    { method: 'PATCH', path: '/websites/:id', description: 'Update a website.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Website ID', in: 'path' }] },
  ],
};

// =============================================================================
// ORDER FORMS
// =============================================================================

const ORDER_FORMS: ResourceGroup = {
  id: 'order-forms',
  label: 'Order Forms',
  description: 'Manage payment order forms connected to Stripe for product purchases.',
  endpoints: [
    { method: 'GET', path: '/order-forms', description: 'List all order forms.', scopes: ['websites:read'], isWrite: false },
    { method: 'GET', path: '/order-forms/:id', description: 'Retrieve an order form.', scopes: ['websites:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Order form ID', in: 'path' }] },
    { method: 'POST', path: '/order-forms', description: 'Create an order form.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Form name', in: 'body' }] },
    { method: 'PATCH', path: '/order-forms/:id', description: 'Update an order form.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Order form ID', in: 'path' }] },
    { method: 'DELETE', path: '/order-forms/:id', description: 'Delete an order form.', scopes: ['websites:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Order form ID', in: 'path' }] },
    { method: 'GET', path: '/order-forms/:id/logs', description: 'List order form payment logs.', scopes: ['websites:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Order form ID', in: 'path' }] },
  ],
};

// =============================================================================
// FILES
// =============================================================================

const FILES: ResourceGroup = {
  id: 'files',
  label: 'Files',
  description: 'Upload, download, and manage files and folders in the company file storage.',
  endpoints: [
    { method: 'GET', path: '/files', description: 'List files in a folder.', scopes: ['files:read'], isWrite: false },
    { method: 'GET', path: '/files/:id', description: 'Get file metadata.', scopes: ['files:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'File ID', in: 'path' }] },
    { method: 'GET', path: '/files/:id/download', description: 'Download a file (returns signed URL).', scopes: ['files:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'File ID', in: 'path' }] },
    { method: 'DELETE', path: '/files/:id', description: 'Delete a file.', scopes: ['files:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'File ID', in: 'path' }] },
    { method: 'GET', path: '/files/folders', description: 'List file folders.', scopes: ['files:read'], isWrite: false },
    { method: 'POST', path: '/files/folders', description: 'Create a file folder.', scopes: ['files:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Folder name', in: 'body' }] },
  ],
};

// =============================================================================
// NOTEPADS
// =============================================================================

const NOTEPADS: ResourceGroup = {
  id: 'notepads',
  label: 'Notepads',
  description: 'Manage rich-text notepads organized in folders.',
  endpoints: [
    { method: 'GET', path: '/notepads', description: 'List all notepads.', scopes: ['notepads:read'], isWrite: false },
    { method: 'GET', path: '/notepads/:id', description: 'Retrieve a notepad.', scopes: ['notepads:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' }] },
    { method: 'POST', path: '/notepads', description: 'Create a notepad.', scopes: ['notepads:write'], isWrite: true, params: [{ name: 'title', type: 'string', required: true, description: 'Notepad title', in: 'body' }] },
    { method: 'PATCH', path: '/notepads/:id', description: 'Update a notepad.', scopes: ['notepads:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' }] },
    { method: 'DELETE', path: '/notepads/:id', description: 'Delete a notepad.', scopes: ['notepads:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Notepad ID', in: 'path' }] },
    { method: 'GET', path: '/notepads/folders', description: 'List notepad folders.', scopes: ['notepads:read'], isWrite: false },
    { method: 'POST', path: '/notepads/folders', description: 'Create a notepad folder.', scopes: ['notepads:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Folder name', in: 'body' }] },
  ],
};

// =============================================================================
// COMPANY
// =============================================================================

const COMPANY: ResourceGroup = {
  id: 'company',
  label: 'Company',
  description: 'View and manage company settings, users, and CRM configuration.',
  endpoints: [
    { method: 'GET', path: '/company', description: 'Retrieve company details.', scopes: ['company:read'], isWrite: false },
    { method: 'PATCH', path: '/company', description: 'Update company settings.', scopes: ['company:write'], isWrite: true },
    { method: 'GET', path: '/company/users', description: 'List all users in the company.', scopes: ['users:read'], isWrite: false },
    { method: 'POST', path: '/company/users/invite', description: 'Invite a user to the company.', scopes: ['users:write'], isWrite: true, params: [{ name: 'email', type: 'string', required: true, description: 'Email to invite', in: 'body' }, { name: 'role', type: 'string', required: false, description: 'User role', in: 'body' }] },
    { method: 'PATCH', path: '/company/users/:userId/role', description: 'Update a user role.', scopes: ['users:write'], isWrite: true, params: [{ name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' }, { name: 'role', type: 'string', required: true, description: 'New role', in: 'body' }] },
    { method: 'DELETE', path: '/company/users/:userId', description: 'Remove a user from the company.', scopes: ['users:write'], isWrite: true, params: [{ name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' }] },
    { method: 'GET', path: '/company/crm-settings', description: 'Get CRM settings (deal stages, lead sources, etc.).', scopes: ['company:read'], isWrite: false },
    { method: 'PATCH', path: '/company/crm-settings', description: 'Update CRM settings.', scopes: ['company:write'], isWrite: true },
  ],
};

// =============================================================================
// CRM TEMPLATES
// =============================================================================

const CRM_TEMPLATES: ResourceGroup = {
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

// =============================================================================
// INTEGRATIONS
// =============================================================================

const INTEGRATIONS: ResourceGroup = {
  id: 'integrations',
  label: 'Integrations',
  description: 'View connected integrations (Slack, Xero, etc.).',
  endpoints: [
    { method: 'GET', path: '/integrations', description: 'List all active integrations.', scopes: ['integrations:read'], isWrite: false },
  ],
};

// =============================================================================
// WEBHOOKS
// =============================================================================

const WEBHOOKS: ResourceGroup = {
  id: 'webhooks',
  label: 'Webhooks',
  description: 'Manage incoming and outgoing webhooks for external system integration.',
  endpoints: [
    { method: 'GET', path: '/webhooks/incoming', description: 'List incoming webhooks.', scopes: ['webhooks:read'], isWrite: false },
    { method: 'GET', path: '/webhooks/incoming/:id', description: 'Retrieve an incoming webhook.', scopes: ['webhooks:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'POST', path: '/webhooks/incoming', description: 'Create an incoming webhook.', scopes: ['webhooks:write'], isWrite: true },
    { method: 'PATCH', path: '/webhooks/incoming/:id', description: 'Update an incoming webhook.', scopes: ['webhooks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'DELETE', path: '/webhooks/incoming/:id', description: 'Delete an incoming webhook.', scopes: ['webhooks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'GET', path: '/webhooks/outgoing', description: 'List outgoing webhooks.', scopes: ['webhooks:read'], isWrite: false },
    { method: 'GET', path: '/webhooks/outgoing/:id', description: 'Retrieve an outgoing webhook.', scopes: ['webhooks:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'POST', path: '/webhooks/outgoing', description: 'Create an outgoing webhook.', scopes: ['webhooks:write'], isWrite: true },
    { method: 'PATCH', path: '/webhooks/outgoing/:id', description: 'Update an outgoing webhook.', scopes: ['webhooks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'DELETE', path: '/webhooks/outgoing/:id', description: 'Delete an outgoing webhook.', scopes: ['webhooks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'POST', path: '/webhooks/outgoing/:id/test', description: 'Send a test event to an outgoing webhook.', scopes: ['webhooks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'GET', path: '/webhooks/outgoing/:id/logs', description: 'View delivery logs for an outgoing webhook.', scopes: ['webhooks:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'GET', path: '/webhooks/subscriptions', description: 'List webhook event subscriptions.', scopes: ['webhooks:read'], isWrite: false },
    { method: 'POST', path: '/webhooks/subscriptions', description: 'Subscribe to a webhook event.', scopes: ['webhooks:write'], isWrite: true },
    { method: 'DELETE', path: '/webhooks/subscriptions/:id', description: 'Unsubscribe from a webhook event.', scopes: ['webhooks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Subscription ID', in: 'path' }] },
  ],
};

// =============================================================================
// AI
// =============================================================================

const AI: ResourceGroup = {
  id: 'ai',
  label: 'AI',
  description: 'AI-powered features including entity enrichment, text editing, deal probability, and pipeline generation.',
  endpoints: [
    { method: 'POST', path: '/ai/enrich', description: 'Enrich a contact or customer with AI-generated data from the web.', scopes: ['ai:use'], isWrite: true, params: [{ name: 'entity_type', type: 'string', required: true, description: 'Entity type (contact or customer)', in: 'body' }, { name: 'entity_id', type: 'uuid', required: true, description: 'Entity ID', in: 'body' }] },
    { method: 'POST', path: '/ai/edit-text', description: 'Edit or generate text using AI.', scopes: ['ai:use'], isWrite: true, params: [{ name: 'text', type: 'string', required: true, description: 'Text to edit', in: 'body' }, { name: 'instruction', type: 'string', required: true, description: 'Editing instruction', in: 'body' }] },
    { method: 'POST', path: '/ai/generate-pipeline', description: 'Generate a pipeline structure using AI based on a description.', scopes: ['ai:use'], isWrite: true, params: [{ name: 'description', type: 'string', required: true, description: 'Description of the business process', in: 'body' }] },
  ],
};

// =============================================================================
// BILLING
// =============================================================================

const BILLING: ResourceGroup = {
  id: 'billing',
  label: 'Billing',
  description: 'View billing plans and credit balance.',
  endpoints: [
    { method: 'GET', path: '/billing/plan', description: 'Get the company billing plan details.', scopes: ['billing:read'], isWrite: false },
    { method: 'GET', path: '/billing/credits', description: 'Get the current API credit balance.', scopes: ['billing:read'], isWrite: false },
  ],
};

// =============================================================================
// EXPORT
// =============================================================================

export const RESOURCES: ResourceGroup[] = [
  CONTACTS,
  CUSTOMERS,
  DEALS,
  PIPELINES,
  PRODUCTS,
  SUPPLIER_PRODUCTS,
  ACTIVITIES,
  TASKS,
  WORK_ORDERS,
  AUTOMATIONS,
  EVENT_QUEUES,
  EMAIL,
  SMS,
  PHONE,
  VOICE_AGENTS,
  TEXT_AGENTS,
  TRANSCRIPTS,
  DOCUMENT_TEMPLATES,
  DOCUMENTS,
  SIGNING,
  FORMS,
  WEBSITES,
  ORDER_FORMS,
  FILES,
  NOTEPADS,
  COMPANY,
  CRM_TEMPLATES,
  INTEGRATIONS,
  WEBHOOKS,
  AI,
  BILLING,
];

/** Look up a resource group by its id (URL slug) */
export function getResourceById(id: string): ResourceGroup | undefined {
  return RESOURCES.find(r => r.id === id);
}
