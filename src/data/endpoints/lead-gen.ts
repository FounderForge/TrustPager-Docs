import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// LEAD GENERATION (9 endpoints)
// =============================================================================

export const LEAD_GEN: ResourceGroup = {
  id: 'lead-gen',
  label: 'Lead Generation',
  description: 'Search for businesses via Google Maps (powered by Apify), match against existing CRM records, save search configurations, and import results as contacts, customers, and deals. Requires lead-gen:read, lead-gen:write, or lead-gen:delete scopes.',
  endpoints: [
    {
      method: 'POST',
      path: '/lead-gen/search',
      description: 'Start a new Google Maps business search via Apify. For max_results <= 100 the search runs synchronously and returns results immediately. For 101-500 results, the search runs asynchronously -- poll GET /lead-gen/searches/:id until status is "completed". Results are automatically deduplicated and matched against existing CRM contacts (by phone) and customers (by website domain). Credits are charged based on max_results tier.',
      scopes: ['lead-gen:write'],
      isWrite: true,
      params: [
        { name: 'query', type: 'string', required: true, description: 'Business type or search term, e.g. "electricians", "dentists", "restaurants"', in: 'body' },
        { name: 'location', type: 'string', required: true, description: 'Location to search in, e.g. "Sydney, NSW", "Melbourne, VIC, Australia"', in: 'body' },
        { name: 'max_results', type: 'number', required: false, description: 'Max results to fetch (default 100, max 500). Credit tiers: 1-50, 51-100, 101-200, 201-500', in: 'body' },
        { name: 'radius_km', type: 'number', required: false, description: 'Search radius in kilometres from the location centre', in: 'body' },
        { name: 'saved_search_id', type: 'uuid', required: false, description: 'UUID of a saved search to link this run to (updates run_count and last_run_at)', in: 'body' },
        { name: 'place_minimum_stars', type: 'string', required: false, description: 'Minimum Google rating: "two", "twoAndHalf", "three", "threeAndHalf", "four", "fourAndHalf"', in: 'body' },
        { name: 'website_filter', type: 'string', required: false, description: 'Filter by website presence: "allPlaces" (default), "withWebsite", "withoutWebsite"', in: 'body' },
        { name: 'skip_closed_places', type: 'boolean', required: false, description: 'Skip permanently closed businesses (default true)', in: 'body' },
        { name: 'category_filter_words', type: 'string[]', required: false, description: 'Only return results whose Google category contains one of these words', in: 'body' },
        { name: 'scrape_contacts', type: 'boolean', required: false, description: 'Attempt to scrape email addresses from business websites (slower)', in: 'body' },
        { name: 'language', type: 'string', required: false, description: 'Language code for results (default "en")', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/lead-gen/search" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "electricians",
    "location": "Sydney, NSW",
    "max_results": 50,
    "place_minimum_stars": "three",
    "website_filter": "withWebsite"
  }'`,
      responseExample: `{
  "data": {
    "id": "8685d0d4-...",
    "status": "completed",
    "search_query": "electricians",
    "location": "Sydney, NSW",
    "max_results": 50,
    "result_count": 42,
    "new_result_count": 38,
    "already_in_crm_count": 4,
    "credits_charged": 10,
    "created_at": "2026-04-17T04:00:00Z",
    "completed_at": "2026-04-17T04:00:12Z",
    "results": [
      {
        "id": "a1b2c3d4-...",
        "business_name": "Sydney Electrical Services",
        "category": "Electrician",
        "address": "123 George St, Sydney NSW 2000",
        "city": "Sydney",
        "state": "NSW",
        "postal_code": "2000",
        "country_code": "AU",
        "phone": "+61299991234",
        "website": "https://sydneyelectrical.com.au",
        "email": null,
        "rating": 4.8,
        "reviews_count": 156,
        "google_maps_url": "https://maps.google.com/?cid=...",
        "match_status": "new",
        "matched_contact_id": null,
        "matched_customer_id": null,
        "imported": false,
        "imported_at": null
      }
    ],
    "meta": { "url": "https://app.trustpager.com/tools/lead-gen" }
  }
}`,
    },
    {
      method: 'GET',
      path: '/lead-gen/searches',
      description: 'List past lead generation searches with cursor-based pagination, most recent first. Filter by status or saved search.',
      scopes: ['lead-gen:read'],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status: "running", "completed", "failed"', in: 'query' },
        { name: 'saved_search_id', type: 'uuid', required: false, description: 'Filter to runs linked to a specific saved search', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results per page (default 25, max 100)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/lead-gen/searches?status=completed&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "8685d0d4-...",
      "search_query": "electricians",
      "location": "Sydney, NSW",
      "status": "completed",
      "result_count": 42,
      "new_result_count": 38,
      "already_in_crm_count": 4,
      "credits_charged": 10,
      "created_at": "2026-04-17T04:00:00Z",
      "completed_at": "2026-04-17T04:00:12Z"
    }
  ],
  "pagination": { "limit": 10, "has_more": false, "next_cursor": null }
}`,
    },
    {
      method: 'GET',
      path: '/lead-gen/searches/:id',
      description: 'Get a single search by ID including all results. For async searches (max_results > 100) still in "running" status, this endpoint automatically polls Apify and processes results if the run has completed. Poll every 30-60 seconds until status is "completed" or "failed". Results are sorted by Google rating (highest first).',
      scopes: ['lead-gen:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Search UUID', in: 'path' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/lead-gen/searches/8685d0d4-..." \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": {
    "id": "8685d0d4-...",
    "status": "completed",
    "result_count": 42,
    "new_result_count": 38,
    "already_in_crm_count": 4,
    "results": [ ... ],
    "meta": { "url": "https://app.trustpager.com/tools/lead-gen" }
  }
}`,
    },
    {
      method: 'POST',
      path: '/lead-gen/import',
      description: 'Import selected search results into the CRM. Each result creates one contact AND one customer, linked together via crm_contact_customers. A note activity is automatically logged recording the Google Maps source. Optionally creates a deal placed into a specified pipeline stage via crm_deal_pipeline_placements. Only results with imported=false are imported -- already-imported results are filtered out in code (not via a PostgREST filter, to correctly handle null values). Each imported record returns contact_id, customer_id, and deal_id (null if no pipeline provided). Partial failures are non-fatal: a failed individual record returns an error field instead of IDs and is excluded from imported_count.',
      scopes: ['lead-gen:write'],
      isWrite: true,
      params: [
        { name: 'result_ids', type: 'uuid[]', required: true, description: 'Array of result UUIDs to import (from the results array of a search)', in: 'body' },
        { name: 'pipeline_id', type: 'uuid', required: false, description: 'UUID of pipeline to create deals in (requires stage_id)', in: 'body' },
        { name: 'stage_id', type: 'uuid', required: false, description: 'UUID of stage to create deals in (requires pipeline_id)', in: 'body' },
        { name: 'tags', type: 'string[]', required: false, description: 'Tags to apply to imported contacts and customers', in: 'body' },
        { name: 'lead_source', type: 'string', required: false, description: 'Lead source label for imported records (default "Lead Generation")', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/lead-gen/import" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "result_ids": ["a1b2c3d4-...", "b2c3d4e5-..."],
    "pipeline_id": "pipe-uuid-...",
    "stage_id": "stage-uuid-...",
    "tags": ["lead-gen", "electricians"],
    "lead_source": "Google Maps"
  }'`,
      responseExample: `{
  "data": {
    "imported_count": 2,
    "total_requested": 3,
    "imported": [
      {
        "result_id": "a1b2c3d4-...",
        "contact_id": "contact-uuid-...",
        "customer_id": "customer-uuid-...",
        "deal_id": "deal-uuid-..."
      },
      {
        "result_id": "b2c3d4e5-...",
        "contact_id": "contact-uuid-2...",
        "customer_id": "customer-uuid-2...",
        "deal_id": null
      },
      {
        "result_id": "c3d4e5f6-...",
        "contact_id": null,
        "customer_id": null,
        "deal_id": null,
        "error": "duplicate key value violates unique constraint"
      }
    ]
  }
}`,
    },
    {
      method: 'POST',
      path: '/lead-gen/saved-searches',
      description: 'Create a saved search configuration for recurring use. Saved searches store the query, location, and default import settings. Run a saved search by calling POST /lead-gen/search with saved_search_id -- the run_count and last_run_at fields update automatically.',
      scopes: ['lead-gen:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Human-readable name, e.g. "Sydney Electricians"', in: 'body' },
        { name: 'search_query', type: 'string', required: true, description: 'Business type or search term', in: 'body' },
        { name: 'location', type: 'string', required: true, description: 'Location to search in', in: 'body' },
        { name: 'max_results', type: 'number', required: false, description: 'Default max results per run (1-500)', in: 'body' },
        { name: 'radius_km', type: 'number', required: false, description: 'Search radius in kilometres', in: 'body' },
        { name: 'default_pipeline_id', type: 'uuid', required: false, description: 'Default pipeline for deal creation on import', in: 'body' },
        { name: 'default_stage_id', type: 'uuid', required: false, description: 'Default stage for deal creation on import', in: 'body' },
        { name: 'default_tags', type: 'string[]', required: false, description: 'Default tags to apply on import', in: 'body' },
        { name: 'enrich_emails', type: 'boolean', required: false, description: 'Whether to attempt email enrichment by default', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/lead-gen/saved-searches" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Sydney Electricians",
    "search_query": "electricians",
    "location": "Sydney, NSW",
    "max_results": 100,
    "default_tags": ["lead-gen", "electricians"]
  }'`,
      responseExample: `{
  "data": {
    "id": "7d05612a-...",
    "name": "Sydney Electricians",
    "search_query": "electricians",
    "location": "Sydney, NSW",
    "max_results": 100,
    "run_count": 0,
    "last_run_at": null,
    "is_archived": false,
    "created_at": "2026-04-17T04:00:00Z",
    "updated_at": "2026-04-17T04:00:00Z"
  },
  "meta": { "url": "https://app.trustpager.com/tools/lead-gen" }
}`,
    },
    {
      method: 'GET',
      path: '/lead-gen/saved-searches',
      description: 'List all active (non-archived) saved search configurations. Returns the most recently updated first.',
      scopes: ['lead-gen:read'],
      isWrite: false,
      params: [
        { name: 'limit', type: 'number', required: false, description: 'Max results per page (default 25, max 100)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/lead-gen/saved-searches" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "7d05612a-...",
      "name": "Sydney Electricians",
      "search_query": "electricians",
      "location": "Sydney, NSW",
      "max_results": 100,
      "run_count": 5,
      "last_run_at": "2026-04-16T10:00:00Z",
      "is_archived": false
    }
  ],
  "pagination": { "limit": 25, "has_more": false, "next_cursor": null }
}`,
    },
    {
      method: 'GET',
      path: '/lead-gen/saved-searches/:id',
      description: 'Get a single saved search configuration by ID.',
      scopes: ['lead-gen:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Saved search UUID', in: 'path' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/lead-gen/saved-searches/7d05612a-..." \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": {
    "id": "7d05612a-...",
    "name": "Sydney Electricians",
    "search_query": "electricians",
    "location": "Sydney, NSW",
    "max_results": 100,
    "run_count": 5,
    "last_run_at": "2026-04-16T10:00:00Z",
    "last_run_search_id": "prev-search-uuid-..."
  }
}`,
    },
    {
      method: 'PUT',
      path: '/lead-gen/saved-searches/:id',
      description: 'Partial update a saved search configuration. Only provided fields are updated.',
      scopes: ['lead-gen:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Saved search UUID', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'New name', in: 'body' },
        { name: 'search_query', type: 'string', required: false, description: 'Updated search query', in: 'body' },
        { name: 'location', type: 'string', required: false, description: 'Updated location', in: 'body' },
        { name: 'max_results', type: 'number', required: false, description: 'Updated max results', in: 'body' },
        { name: 'radius_km', type: 'number', required: false, description: 'Updated radius in km', in: 'body' },
        { name: 'default_pipeline_id', type: 'uuid', required: false, description: 'Updated default pipeline UUID', in: 'body' },
        { name: 'default_stage_id', type: 'uuid', required: false, description: 'Updated default stage UUID', in: 'body' },
        { name: 'default_tags', type: 'string[]', required: false, description: 'Updated default tags', in: 'body' },
        { name: 'enrich_emails', type: 'boolean', required: false, description: 'Updated email enrichment default', in: 'body' },
      ],
      requestExample: `curl -X PUT \\
  "${API_BASE_URL}/lead-gen/saved-searches/7d05612a-..." \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Sydney Electricians (Updated)", "max_results": 200}'`,
      responseExample: `{
  "data": {
    "id": "7d05612a-...",
    "name": "Sydney Electricians (Updated)",
    "max_results": 200,
    "updated_at": "2026-04-17T05:00:00Z"
  }
}`,
    },
    {
      method: 'DELETE',
      path: '/lead-gen/saved-searches/:id',
      description: 'Archive (soft-delete) a saved search. The saved search will no longer appear in list results. Past searches linked to it are preserved. Returns 204 No Content on success.',
      scopes: ['lead-gen:delete'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Saved search UUID to archive', in: 'path' },
      ],
      requestExample: `curl -X DELETE \\
  "${API_BASE_URL}/lead-gen/saved-searches/7d05612a-..." \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `HTTP 204 No Content`,
    },
  ],
};
