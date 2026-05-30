import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// OPPORTUNITIES (canonical) -- formerly "Deals"
// =============================================================================
//
// 2026-05-13 (Phase A naming refactor):
//   * Canonical resource path is now /opportunities.
//   * The legacy /deals path is still served indefinitely and accepts every
//     same field. Existing integrations do NOT need to change. New code should
//     use /opportunities.
//   * MCP tool names follow the same pattern: opportunity_* is canonical,
//     deal_* aliases remain registered.
//
// Sub-resources (all available under both /opportunities/:id and /deals/:id):
//   products, product-costs, contacts, users, activities, tasks, work-orders,
//   files, documents, images, spreadsheets, invoices
// =============================================================================

export const OPPORTUNITIES: ResourceGroup = {
  id: 'opportunities',
  label: 'Opportunities',
  description: 'Manage sales opportunities through your pipeline. Canonical path is /opportunities; the legacy /deals path remains supported. Sub-resources cover products, product costs, contacts, users, activities, tasks, work orders, pipeline moves, file/document/image/spreadsheet attachments, and invoices.',
  endpoints: [
    {
      method: 'GET',
      path: '/opportunities',
      toolName: 'list_opportunities',
      description: 'List all opportunities with cursor-based pagination. Supports search, status, contact, company, pipeline, stage, and date filters. Always includes pipeline placements. Response always includes read-only referral attribution fields: primary_referrer_contact_id (UUID of the most-recent referrer, maintained by a Postgres trigger) and primary_referrer_category (workspace category string). Use expand=referrer to inline the full referrer contact object. When using expand=products, payment_status on each product is stripped unless the caller has invoices:read scope. Legacy alias: GET /deals (same response shape).',
      scopes: ['opportunities:read'],
      isWrite: false,
      params: [
        { name: 'search', type: 'string', required: false, description: 'Search by opportunity name, contact name/email/phone, or company name/email/phone', in: 'query' },
        { name: 'status', type: 'string', required: false, description: 'Filter by status (open, won, lost)', in: 'query' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Filter by primary contact', in: 'query' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Filter by company (formerly "customer_id" -- field name preserved for backward compatibility)', in: 'query' },
        { name: 'assigned_to', type: 'uuid', required: false, description: 'Filter by assigned user', in: 'query' },
        { name: 'pipeline_id', type: 'uuid', required: false, description: 'Filter by pipeline', in: 'query' },
        { name: 'stage_id', type: 'uuid', required: false, description: 'Filter by pipeline stage. Can be combined with pipeline_id or used alone.', in: 'query' },
        { name: 'created_after', type: 'string', required: false, description: 'ISO date filter', in: 'query' },
        { name: 'created_before', type: 'string', required: false, description: 'ISO date filter', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100, default 25)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
        { name: 'expand', type: 'string', required: false, description: 'Expansions: contact, referrer, customer, products, assigned_users. "referrer" inlines the referrer contact for opportunities with primary_referrer_contact_id set.', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/opportunities?status=open&pipeline_id=UUID&stage_id=UUID&limit=25" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "opp-uuid-...",
      "public_id": "OPP-001",
      "name": "Website Redesign",
      "status": "open",
      "contact_id": "contact-uuid-...",
      "customer_id": "company-uuid-...",
      "currency": "AUD",
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
      path: '/opportunities/:id',
      toolName: 'get_opportunity',
      description: 'Retrieve a single opportunity by ID with pipeline placements. Supports expansions. Legacy alias: GET /deals/:id.',
      scopes: ['opportunities:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'expand', type: 'string', required: false, description: 'Expansions: contact, referrer, customer, products, assigned_users. "referrer" inlines the referrer contact (id, public_id, first_name, last_name, email, phone, job_title) when primary_referrer_contact_id is set.', in: 'query' },
      ],
      responseExample: `{
  "data": {
    "id": "opp-uuid",
    "name": "Radiology Referral -- John Smith",
    "status": "open",
    "primary_referrer_contact_id": "referrer-contact-uuid",
    "primary_referrer_category": "CT",
    "referrer": {
      "id": "referrer-contact-uuid",
      "public_id": "CONT-042",
      "first_name": "Dr",
      "last_name": "Smith",
      "email": "dr.smith@clinic.com.au",
      "phone": "+61285551234",
      "job_title": "Radiologist"
    },
    "placements": [...]
  },
  "meta": { "credits_remaining": 9499 }
}`,
    },
    {
      method: 'POST',
      path: '/opportunities',
      toolName: 'create_opportunity',
      description: 'Create a new opportunity. name is required. Set skip_automations: true to suppress the deal_created trigger -- recommended for historical imports to avoid spamming contacts with automation emails. Legacy alias: POST /deals.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Opportunity name', in: 'body' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Primary contact ID', in: 'body' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Company ID (field name preserved for backward compatibility)', in: 'body' },
        { name: 'status', type: 'string', required: false, description: 'Status (open, won, lost)', in: 'body' },
        { name: 'currency', type: 'string', required: false, description: 'Currency code (default: AUD)', in: 'body' },
        { name: 'lead_source', type: 'string', required: false, description: 'Lead source', in: 'body' },
        { name: 'tags', type: 'object[]', required: false, description: 'Tags. Each tag is {name: string, color?: string} (hex color, default "#3b82f6"). Plain strings are also accepted and auto-converted. Example: [{"name":"hot-lead","color":"#ef4444"}]', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Notes', in: 'body' },
        { name: 'metadata', type: 'object', required: false, description: 'Custom field values as { field_id: value } pairs. Use GET /crm-settings to discover available custom fields. Reserved key: "quick_links" stores per-opportunity Quick Link URLs as { <type-uuid>: <url> } -- define types via PATCH /company/crm-settings. UUID-shaped keys at metadata root are rejected (400).', in: 'body' },
        { name: 'skip_automations', type: 'boolean', required: false, description: 'Set true to suppress the deal_created trigger. Use for historical imports so old opportunities do not trigger automation emails. Default false.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/opportunities" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Website Redesign",
    "contact_id": "contact-uuid-...",
    "customer_id": "company-uuid-...",
    "currency": "AUD"
  }'`,
    },
    {
      method: 'PATCH',
      path: '/opportunities/:id',
      toolName: 'update_opportunity',
      description: 'Update an existing opportunity. Only include fields you want to change. Every successful PATCH emits a field-level audit row to crm_field_change_log (viewable at /data/crm-logs with the crm_audit:read scope). Legacy alias: PATCH /deals/:id.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'Opportunity name', in: 'body' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Primary contact ID', in: 'body' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Company ID', in: 'body' },
        { name: 'currency', type: 'string', required: false, description: 'Currency code', in: 'body' },
        { name: 'lead_source', type: 'string', required: false, description: 'Lead source', in: 'body' },
        { name: 'tags', type: 'object[]', required: false, description: 'Tags. Each tag is {name: string, color?: string}. Plain strings are also accepted. Replaces entire tags array.', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Notes', in: 'body' },
        { name: 'metadata', type: 'object', required: false, description: 'Custom field values as { field_id: value } pairs. Replaces entire metadata object -- read first with GET /opportunities/:id and merge locally. Reserved key: "quick_links" stores per-opportunity Quick Link URLs as { <type-uuid>: <url> }. UUID-shaped keys at metadata root are rejected (400).', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/opportunities/:id',
      toolName: 'delete_opportunity',
      description: 'Delete an opportunity. Legacy alias: DELETE /deals/:id.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/opportunities/search',
      toolName: 'search_opportunities',
      description: 'Search opportunities by name, contact name/email/phone, or company name/email/phone. Matches across opportunity name and linked contact/company fields. Legacy alias: POST /deals/search.',
      scopes: ['opportunities:read'],
      isWrite: false,
      params: [
        { name: 'query', type: 'string', required: true, description: 'Search query', in: 'body' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (1-100)', in: 'body' },
      ],
    },
    {
      method: 'POST',
      path: '/opportunities/:id/move',
      toolName: 'move_opportunity',
      description: 'Move an opportunity to a pipeline stage. If the opportunity is not in the pipeline, it will be added. If it is in a different pipeline, it will be moved. When the stage actually changes, stage_changed automations fire automatically. Use skip_automations=true to suppress all automation triggers, or pass skip_action_ids with an array of action UUIDs to suppress only specific actions within automations (the automation still runs and is logged, but those actions are bypassed and recorded in the run\'s skipped_action_ids field). Legacy alias: POST /deals/:id/move.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'pipeline_id', type: 'uuid', required: true, description: 'Target pipeline ID', in: 'body' },
        { name: 'stage_id', type: 'uuid', required: true, description: 'Target stage ID', in: 'body' },
        { name: 'position', type: 'number', required: false, description: 'Position within stage (default 0)', in: 'body' },
        { name: 'skip_automations', type: 'boolean', required: false, description: 'Set true to suppress ALL stage_changed automation triggers. Default false. Use skip_action_ids for per-action control.', in: 'body' },
        { name: 'skip_action_ids', type: 'uuid[]', required: false, description: 'Array of automation action UUIDs to suppress on this move. The automation still fires but these specific actions are bypassed and logged in the run record. Use list_automation_actions to find action IDs.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/opportunities/opp-uuid/move" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "pipeline_id": "pipe-uuid", "stage_id": "stage-uuid", "skip_action_ids": ["action-uuid-to-skip"] }'`,
      responseExample: `{
  "data": {
    "id": "placement-uuid",
    "deal_id": "opp-uuid",
    "pipeline_id": "pipe-uuid",
    "stage_id": "stage-uuid",
    "position": 0
  },
  "meta": { "credits_remaining": 9499 }
}`,
    },
    {
      method: 'POST',
      path: '/opportunities/:id/add-card',
      toolName: 'add_opportunity_card',
      description: 'Add an opportunity card to a pipeline WITHOUT removing existing cards in other pipelines. Enables an opportunity to appear in multiple pipelines simultaneously (dual/multi placement). If the opportunity already has a card in the target pipeline, its stage is updated. Stage_changed automations fire on new placements or stage changes. Supports skip_automations and skip_action_ids for fine-grained automation control. Legacy alias: POST /deals/:id/add-card.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'pipeline_id', type: 'uuid', required: true, description: 'Target pipeline ID', in: 'body' },
        { name: 'stage_id', type: 'uuid', required: true, description: 'Target stage ID', in: 'body' },
        { name: 'position', type: 'number', required: false, description: 'Position within stage (default 0)', in: 'body' },
        { name: 'skip_automations', type: 'boolean', required: false, description: 'Set true to suppress ALL stage_changed automation triggers. Default false.', in: 'body' },
        { name: 'skip_action_ids', type: 'uuid[]', required: false, description: 'Array of automation action UUIDs to suppress on this card add. Automations still fire but these actions are bypassed and logged.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/opportunities/opp-uuid/add-card" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "pipeline_id": "pipe-uuid", "stage_id": "stage-uuid" }'`,
      responseExample: `{
  "data": {
    "id": "placement-uuid",
    "deal_id": "opp-uuid",
    "pipeline_id": "pipe-uuid",
    "stage_id": "stage-uuid",
    "position": 0
  },
  "meta": { "credits_remaining": 9499 }
}`,
    },
    // --- Products ---
    {
      method: 'GET',
      path: '/opportunities/:id/products',
      toolName: 'list_opportunity_products',
      description: 'List products attached to an opportunity with pricing and payment status. payment_status is only included in the response when the caller has invoices:read scope. Legacy alias: GET /deals/:id/products.',
      scopes: ['opportunities:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
      ],
      responseExample: `{
  "data": [
    {
      "id": "opp-product-uuid",
      "product_id": "product-uuid",
      "quantity": 2,
      "unit_price": 950,
      "discount_percent": 10,
      "deposit_percent": null,
      "payment_status": "unpaid",
      "sort_order": 0,
      "crm_products": { "id": "product-uuid", "name": "Silver Package", "price": 1000, "currency": "AUD" }
    }
  ],
  "pagination": { "limit": 25, "has_more": false, "next_cursor": null, "prev_cursor": null },
  "meta": { "credits_remaining": 9499 }
}`,
    },
    {
      method: 'POST',
      path: '/opportunities/:id/products',
      toolName: 'add_opportunity_product',
      description: 'Add a product to an opportunity. product_id is required. Optionally set payment_status (requires invoices:write scope). Valid payment_status values: unpaid (default), deposit_invoiced, invoiced, paid. Legacy alias: POST /deals/:id/products.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'product_id', type: 'uuid', required: true, description: 'Product ID to add', in: 'body' },
        { name: 'quantity', type: 'number', required: false, description: 'Quantity (default: 1)', in: 'body' },
        { name: 'unit_price', type: 'number', required: false, description: 'Override price', in: 'body' },
        { name: 'discount_percent', type: 'number', required: false, description: 'Discount %', in: 'body' },
        { name: 'deposit_percent', type: 'number', required: false, description: 'Deposit %', in: 'body' },
        { name: 'payment_status', type: 'string', required: false, description: 'Payment lifecycle stage. Requires invoices:write scope. Values: unpaid (default), deposit_invoiced, invoiced, paid.', in: 'body' },
      ],
    },
    {
      method: 'PATCH',
      path: '/opportunities/:id/products/:opportunityProductId',
      toolName: 'update_opportunity_product',
      description: 'Update an opportunity product. Supports quantity, price, discount, deposit, and payment_status. Setting payment_status requires invoices:write scope -- returns 403 otherwise. Valid payment_status values: unpaid, deposit_invoiced, invoiced, paid. Legacy alias: PATCH /deals/:id/products/:dealProductId.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'opportunityProductId', type: 'uuid', required: true, description: 'Opportunity product ID (legacy: dealProductId)', in: 'path' },
        { name: 'quantity', type: 'number', required: false, description: 'New quantity', in: 'body' },
        { name: 'unit_price', type: 'number', required: false, description: 'New unit price', in: 'body' },
        { name: 'discount_percent', type: 'number', required: false, description: 'New discount %', in: 'body' },
        { name: 'deposit_percent', type: 'number', required: false, description: 'New deposit %', in: 'body' },
        { name: 'payment_status', type: 'string', required: false, description: 'Payment lifecycle stage. Requires invoices:write scope. Values: unpaid, deposit_invoiced, invoiced, paid.', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/opportunities/:id/products/:opportunityProductId',
      toolName: 'remove_opportunity_product',
      description: 'Remove a product from an opportunity. Legacy alias: DELETE /deals/:id/products/:dealProductId.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'opportunityProductId', type: 'uuid', required: true, description: 'Opportunity product ID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/opportunities/:id/products/reorder',
      toolName: 'reorder_opportunity_products',
      description: 'Reorder products on an opportunity by providing an ordered array of opportunity product IDs. Legacy alias: POST /deals/:id/products/reorder.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'product_ids', type: 'string[]', required: true, description: 'Ordered array of opportunity product UUIDs', in: 'body' },
      ],
    },
    // --- Product costs ---
    {
      method: 'GET',
      path: '/opportunities/:id/product-costs/:opportunityProductId',
      toolName: 'list_opportunity_product_costs',
      description: 'List costs for an opportunity product. Legacy alias: GET /deals/:id/product-costs/:dealProductId.',
      scopes: ['opportunities:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'opportunityProductId', type: 'uuid', required: true, description: 'Opportunity product ID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/opportunities/:id/product-costs/:opportunityProductId',
      toolName: 'create_opportunity_product_cost',
      description: 'Create a cost entry for an opportunity product. Legacy alias: POST /deals/:id/product-costs/:dealProductId.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'opportunityProductId', type: 'uuid', required: true, description: 'Opportunity product ID', in: 'path' },
        { name: 'label', type: 'string', required: false, description: 'Cost label', in: 'body' },
        { name: 'unit_cost', type: 'number', required: false, description: 'Unit cost amount', in: 'body' },
        { name: 'quantity', type: 'number', required: false, description: 'Quantity', in: 'body' },
        { name: 'currency', type: 'string', required: false, description: 'Currency code', in: 'body' },
        { name: 'supplier_id', type: 'uuid', required: false, description: 'Supplier company ID', in: 'body' },
        { name: 'supplier_product_id', type: 'uuid', required: false, description: 'Supplier product ID', in: 'body' },
      ],
    },
    {
      method: 'PATCH',
      path: '/opportunities/:id/product-costs/:costId',
      description: 'Update an opportunity product cost entry. Legacy alias: PATCH /deals/:id/product-costs/:costId.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'costId', type: 'uuid', required: true, description: 'Cost entry ID', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/opportunities/:id/product-costs/:costId',
      description: 'Delete an opportunity product cost entry. Legacy alias: DELETE /deals/:id/product-costs/:costId.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'costId', type: 'uuid', required: true, description: 'Cost entry ID', in: 'path' },
      ],
    },
    // --- Contacts ---
    {
      method: 'GET',
      path: '/opportunities/:id/contacts',
      toolName: 'list_opportunity_contacts',
      description: 'List all contacts associated with an opportunity (beyond the primary contact). Legacy alias: GET /deals/:id/contacts.',
      scopes: ['opportunities:read', 'contacts:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/opportunities/:id/contacts/:contactId',
      toolName: 'add_opportunity_contact',
      description: 'Associate an additional contact with an opportunity. Legacy alias: POST /deals/:id/contacts/:contactId.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'contactId', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/opportunities/:id/contacts/:contactId',
      toolName: 'remove_opportunity_contact',
      description: 'Remove a contact association from an opportunity. Legacy alias: DELETE /deals/:id/contacts/:contactId.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'contactId', type: 'uuid', required: true, description: 'Contact ID', in: 'path' },
      ],
    },
    // --- Users ---
    {
      method: 'GET',
      path: '/opportunities/:id/users',
      toolName: 'list_opportunity_users',
      description: 'List users assigned to an opportunity. Legacy alias: GET /deals/:id/users.',
      scopes: ['opportunities:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/opportunities/:id/users/:userId',
      toolName: 'add_opportunity_user',
      description: 'Assign a user to an opportunity. Legacy alias: POST /deals/:id/users/:userId.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/opportunities/:id/users/:userId',
      toolName: 'remove_opportunity_user',
      description: 'Remove a user assignment from an opportunity. Legacy alias: DELETE /deals/:id/users/:userId.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' },
      ],
    },
    // --- Activities / Tasks / Work orders ---
    {
      method: 'GET',
      path: '/opportunities/:id/activities',
      toolName: 'get_opportunity_activities',
      description: 'List all activities for an opportunity. Legacy alias: GET /deals/:id/activities.',
      scopes: ['opportunities:read', 'activities:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/opportunities/:id/tasks',
      toolName: 'get_opportunity_tasks',
      description: 'List all tasks for an opportunity. Legacy alias: GET /deals/:id/tasks.',
      scopes: ['opportunities:read', 'tasks:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' }],
    },
    {
      method: 'GET',
      path: '/opportunities/:id/work-orders',
      toolName: 'get_opportunity_work_orders',
      description: 'List all work orders for an opportunity. Legacy alias: GET /deals/:id/work-orders.',
      scopes: ['opportunities:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' }],
    },
    // --- Attachments: Files (new 2026-05-13) ---
    {
      method: 'GET',
      path: '/opportunities/:id/files',
      toolName: 'list_opportunity_files',
      description: 'List files attached to an opportunity. Returns file metadata for every file linked to the opportunity (any file type accepted by /files -- documents, images, secure). Legacy alias: GET /deals/:id/files. Matching MCP tool: list_opportunity_files.',
      scopes: ['opportunities:read', 'files:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/opportunities/:id/files/:fileId',
      toolName: 'add_opportunity_file',
      description: 'Attach an existing file to an opportunity. The file must already exist in the workspace (upload via POST /files first if needed). Legacy alias: POST /deals/:id/files/:fileId. Matching MCP tool: add_opportunity_file.',
      scopes: ['opportunities:write', 'files:read'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'fileId', type: 'uuid', required: true, description: 'File ID to attach', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/opportunities/:id/files/:fileId',
      toolName: 'remove_opportunity_file',
      description: 'Remove a file attachment from an opportunity. Detaches the link only -- the file itself is not deleted (use DELETE /files/:id to fully delete the file). Legacy alias: DELETE /deals/:id/files/:fileId. Matching MCP tool: remove_opportunity_file.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'fileId', type: 'uuid', required: true, description: 'File ID to detach', in: 'path' },
      ],
    },
    // --- Attachments: Documents (new 2026-05-13) ---
    {
      method: 'GET',
      path: '/opportunities/:id/documents',
      toolName: 'list_opportunity_documents',
      description: 'List CRM documents attached to an opportunity. Returns generated documents (proposals, contracts, etc.) linked to the opportunity. Legacy alias: GET /deals/:id/documents. Matching MCP tool: list_opportunity_documents.',
      scopes: ['opportunities:read', 'documents:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/opportunities/:id/documents/:documentId',
      toolName: 'add_opportunity_document',
      description: 'Attach an existing CRM document to an opportunity. Legacy alias: POST /deals/:id/documents/:documentId. Matching MCP tool: add_opportunity_document.',
      scopes: ['opportunities:write', 'documents:read'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'documentId', type: 'uuid', required: true, description: 'Document ID to attach', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/opportunities/:id/documents/:documentId',
      toolName: 'remove_opportunity_document',
      description: 'Remove a document attachment from an opportunity. Detaches the link only -- the document itself is not deleted. Legacy alias: DELETE /deals/:id/documents/:documentId. Matching MCP tool: remove_opportunity_document.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'documentId', type: 'uuid', required: true, description: 'Document ID to detach', in: 'path' },
      ],
    },
    // --- Attachments: Images (new 2026-05-13) ---
    {
      method: 'GET',
      path: '/opportunities/:id/images',
      toolName: 'list_opportunity_images',
      description: 'List image files attached to an opportunity. Filters /files attachments to type=image. Legacy alias: GET /deals/:id/images. Matching MCP tool: list_opportunity_images.',
      scopes: ['opportunities:read', 'files:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/opportunities/:id/images/:imageId',
      toolName: 'add_opportunity_image',
      description: 'Attach an existing image file (type=image) to an opportunity. Legacy alias: POST /deals/:id/images/:imageId. Matching MCP tool: add_opportunity_image.',
      scopes: ['opportunities:write', 'files:read'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'imageId', type: 'uuid', required: true, description: 'Image file ID to attach', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/opportunities/:id/images/:imageId',
      toolName: 'remove_opportunity_image',
      description: 'Remove an image attachment from an opportunity. Detaches the link only -- the image file itself is not deleted. Legacy alias: DELETE /deals/:id/images/:imageId. Matching MCP tool: remove_opportunity_image.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'imageId', type: 'uuid', required: true, description: 'Image file ID to detach', in: 'path' },
      ],
    },
    // --- Attachments: Spreadsheets (new 2026-05-13) ---
    {
      method: 'GET',
      path: '/opportunities/:id/spreadsheets',
      toolName: 'list_opportunity_spreadsheets',
      description: 'List spreadsheets attached to an opportunity. Returns metadata for every spreadsheet linked to the opportunity (including spreadsheets auto-created by form submissions where the form is linked to the opportunity). Legacy alias: GET /deals/:id/spreadsheets. Matching MCP tool: list_opportunity_spreadsheets.',
      scopes: ['opportunities:read', 'spreadsheets:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/opportunities/:id/spreadsheets/:spreadsheetId',
      toolName: 'add_opportunity_spreadsheet',
      description: 'Attach an existing spreadsheet to an opportunity. Legacy alias: POST /deals/:id/spreadsheets/:spreadsheetId. Matching MCP tool: add_opportunity_spreadsheet.',
      scopes: ['opportunities:write', 'spreadsheets:read'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'spreadsheetId', type: 'uuid', required: true, description: 'Spreadsheet ID to attach', in: 'path' },
      ],
    },
    {
      method: 'DELETE',
      path: '/opportunities/:id/spreadsheets/:spreadsheetId',
      toolName: 'remove_opportunity_spreadsheet',
      description: 'Remove a spreadsheet attachment from an opportunity. Detaches the link only -- the spreadsheet itself is not deleted. Legacy alias: DELETE /deals/:id/spreadsheets/:spreadsheetId. Matching MCP tool: remove_opportunity_spreadsheet.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' },
        { name: 'spreadsheetId', type: 'uuid', required: true, description: 'Spreadsheet ID to detach', in: 'path' },
      ],
    },
    // --- Invoices (new 2026-05-13) ---
    {
      method: 'GET',
      path: '/opportunities/:id/invoices',
      toolName: 'list_opportunity_invoices',
      description: 'List invoices linked to an opportunity. Invoices are read-only here -- this endpoint surfaces every invoice that references the opportunity via trustpager_deal_id, so AI agents and integrations can answer "what has this customer been billed for?" without needing the invoices:write scope. Requires the invoices:read scope. Legacy alias: GET /deals/:id/invoices. Matching MCP tool: list_opportunity_invoices.',
      scopes: ['opportunities:read', 'invoices:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Opportunity ID', in: 'path' }],
    },
    // --- Bulk ---
    {
      method: 'POST',
      path: '/opportunities/bulk-create',
      toolName: 'bulk_create_opportunities',
      description: 'Create up to 100 opportunities in a single request. Built for historical migrations and bulk data loads. Top-level pipeline_id/stage_id act as defaults inherited by each record unless overridden. Set skip_automations: true (strongly recommended for imports) to suppress deal_created triggers across all records. Returns a created array and an errors array so partial successes can be recovered from without duplicating work on retry. Legacy alias: POST /deals/bulk-create.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'records', type: 'object[]', required: true, description: 'Array of opportunity objects (max 100). Each requires name plus any optional fields (contact_id, customer_id, pipeline_id, stage_id, status, value, notes, tags, metadata, etc.).', in: 'body' },
        { name: 'pipeline_id', type: 'uuid', required: false, description: 'Default pipeline UUID applied to every record unless the record sets its own.', in: 'body' },
        { name: 'stage_id', type: 'uuid', required: false, description: 'Default stage UUID applied to every record unless the record sets its own.', in: 'body' },
        { name: 'skip_automations', type: 'boolean', required: false, description: 'Set true to suppress deal_created triggers across all records. Strongly recommended for historical imports.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/opportunities/bulk-create" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "pipeline_id": "pipe-uuid",
    "stage_id": "stage-uuid",
    "skip_automations": true,
    "records": [
      { "name": "Opportunity A", "contact_id": "contact-uuid-1", "value": 1500 },
      { "name": "Opportunity B", "contact_id": "contact-uuid-2", "value": 2000 }
    ]
  }'`,
      responseExample: `{
  "data": {
    "created": [
      { "index": 0, "id": "opp-uuid-1", "name": "Opportunity A", ... },
      { "index": 1, "id": "opp-uuid-2", "name": "Opportunity B", ... }
    ],
    "errors": [],
    "created_count": 2,
    "error_count": 0
  },
  "meta": { "credits_remaining": 9480 }
}`,
    },
    {
      method: 'POST',
      path: '/opportunities/bulk-delete',
      toolName: 'bulk_delete_opportunities',
      description: 'Permanently delete up to 100 opportunities in a single request. Each opportunity is cascade-deleted including its products, pipeline placements, contacts, and users. Returns a count of deleted records and any IDs that failed. Cannot be undone. Legacy alias: POST /deals/bulk-delete.',
      scopes: ['opportunities:delete'],
      isWrite: true,
      params: [
        { name: 'ids', type: 'uuid[]', required: true, description: 'Array of opportunity UUIDs to delete (max 100)', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/opportunities/bulk-delete" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"ids":["uuid-1","uuid-2","uuid-3"]}'`,
      responseExample: `{
  "data": { "success": true, "deleted": 3 },
  "meta": { "credits_remaining": 9450 }
}`,
    },
    {
      method: 'POST',
      path: '/opportunities/bulk-move',
      toolName: 'bulk_move_opportunities',
      description: 'Move up to 100 opportunities to a pipeline stage in a single request. Set skip_automations=true to suppress all stage_changed automation triggers (recommended for bulk moves to avoid flooding contacts). Alternatively, pass skip_action_ids to suppress only specific automation actions across all records in the batch. Returns a count of moved records and any IDs that failed. Legacy alias: POST /deals/bulk-move.',
      scopes: ['opportunities:write'],
      isWrite: true,
      params: [
        { name: 'ids', type: 'uuid[]', required: true, description: 'Array of opportunity UUIDs to move (max 100)', in: 'body' },
        { name: 'pipeline_id', type: 'uuid', required: true, description: 'Target pipeline UUID', in: 'body' },
        { name: 'stage_id', type: 'uuid', required: true, description: 'Target stage UUID within the pipeline', in: 'body' },
        { name: 'skip_automations', type: 'boolean', required: false, description: 'Suppress ALL stage_changed automation triggers (default false). Strongly recommended for bulk moves.', in: 'body' },
        { name: 'skip_action_ids', type: 'uuid[]', required: false, description: 'Array of automation action UUIDs to suppress across all records in this bulk move. Automations still fire but these actions are bypassed on every record.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/opportunities/bulk-move" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"ids":["uuid-1","uuid-2"],"pipeline_id":"pipe-uuid","stage_id":"stage-uuid","skip_action_ids":["email-action-uuid"]}'`,
      responseExample: `{
  "data": { "success": true, "moved": 2 },
  "meta": { "credits_remaining": 9440 }
}`,
    },
  ],
};
