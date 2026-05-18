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
      description: 'Start a new Google Maps business search via Apify. For max_results <= 100 the search runs synchronously and returns results immediately. For 101-500 results, the search runs asynchronously -- poll GET /lead-gen/searches/:id until status is "completed". When scrape_contacts=true, the search always runs asynchronously (website scraping exceeds sync timeout), website_filter is forced to "withWebsite", and results without a valid email are dropped before saving (email guarantee) -- result_count reflects only kept rows. Results are automatically deduplicated and matched against existing CRM contacts (by phone) and customers (by website domain). Credits are charged based on max_results tier.',
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
        { name: 'scrape_contacts', type: 'boolean', required: false, description: 'Scrape email addresses from business websites. When true: always runs async (returns immediately, poll for completion), forces website_filter to "withWebsite", drops results without a valid email (email guarantee), result_count reflects only kept rows. Use lead_gen_get_search to poll until status="completed".', in: 'body' },
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
        { name: 'enrich_emails', type: 'boolean', required: false, description: 'When true, all runs of this saved search automatically set scrape_contacts=true: always async, forces website_filter to "withWebsite", drops results without a valid email (email guarantee). Saved searches with enrich_emails=true will never return email-less rows.', in: 'body' },
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
        { name: 'enrich_emails', type: 'boolean', required: false, description: 'Updated email enrichment default. When true, all runs auto-set scrape_contacts=true (always async, forces website="withWebsite", email guarantee).', in: 'body' },
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
    {
      method: 'POST',
      path: '/lead-gen/results',
      description: 'Record a manual result for a lead-gen search result (e.g. mark as contacted, won, not interested). Creates an activity log entry on the linked contact if one exists.',
      scopes: ['lead-gen:write'],
      isWrite: true,
      params: [
        { name: 'search_id', type: 'uuid', required: true, description: 'Search UUID this result belongs to', in: 'body' },
        { name: 'place_id', type: 'string', required: true, description: 'External place identifier from the search result', in: 'body' },
        { name: 'result_type', type: 'string', required: true, description: 'Outcome type: contacted, not_interested, won, lost', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Optional notes about the outcome', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/lead-gen/results" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"search_id":"7d05612a-...","place_id":"ChIJ...","result_type":"contacted","notes":"Left voicemail"}'`,
      responseExample: `{
  "id": "b1c2d3e4-...",
  "search_id": "7d05612a-...",
  "place_id": "ChIJ...",
  "result_type": "contacted",
  "notes": "Left voicemail",
  "created_at": "2026-05-01T10:00:00Z"
}`,
    },
    {
      method: 'POST',
      path: '/lead-gen/initiatives',
      description: 'Create a new outreach initiative (multi-step automated sequence). An initiative defines the name, goal, and optional daily send cap. Add steps via POST /lead-gen/initiatives/:id/steps, then enrol leads via POST /lead-gen/initiatives/:id/enrol.',
      scopes: ['lead-gen:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Initiative display name', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Internal description of this outreach goal', in: 'body' },
        { name: 'daily_send_cap', type: 'integer', required: false, description: 'Max outreach actions per day across all enrolments (default: no cap beyond per-user limits)', in: 'body' },
        { name: 'status', type: 'string', required: false, description: 'Initial status: draft (default) or active', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/lead-gen/initiatives" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Q3 Roofing Outreach","description":"Multi-touch email + SMS sequence","status":"draft"}'`,
      responseExample: `{
  "id": "a1b2c3d4-...",
  "name": "Q3 Roofing Outreach",
  "description": "Multi-touch email + SMS sequence",
  "status": "draft",
  "daily_send_cap": null,
  "step_count": 0,
  "enrolment_count": 0,
  "created_at": "2026-05-01T10:00:00Z"
}`,
    },
    {
      method: 'GET',
      path: '/lead-gen/initiatives',
      description: 'List all outreach initiatives for your workspace. Returns initiatives ordered by creation date descending, with step and enrolment counts.',
      scopes: ['lead-gen:read'],
      params: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status: draft, active, paused, completed', in: 'query' },
        { name: 'limit', type: 'integer', required: false, description: 'Max results to return (default: 50)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Pagination cursor from previous response', in: 'query' },
      ],
      requestExample: `curl \\
  "${API_BASE_URL}/lead-gen/initiatives?status=active" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "a1b2c3d4-...",
      "name": "Q3 Roofing Outreach",
      "status": "active",
      "step_count": 3,
      "enrolment_count": 47,
      "created_at": "2026-05-01T10:00:00Z"
    }
  ],
  "pagination": { "has_more": false, "next_cursor": null }
}`,
    },
    {
      method: 'GET',
      path: '/lead-gen/initiatives/:id',
      description: 'Retrieve a single outreach initiative including its full step list and summary enrolment counts.',
      scopes: ['lead-gen:read'],
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Initiative UUID', in: 'path' },
      ],
      requestExample: `curl \\
  "${API_BASE_URL}/lead-gen/initiatives/a1b2c3d4-..." \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "id": "a1b2c3d4-...",
  "name": "Q3 Roofing Outreach",
  "status": "active",
  "steps": [
    { "id": "s1...", "step_number": 1, "action_type": "send_gmail_email", "delay_days": 0 },
    { "id": "s2...", "step_number": 2, "action_type": "send_sms", "delay_days": 3 }
  ],
  "enrolment_count": 47,
  "created_at": "2026-05-01T10:00:00Z"
}`,
    },
    {
      method: 'PATCH',
      path: '/lead-gen/initiatives/:id',
      description: 'Update an outreach initiative\'s name, description, status, or daily send cap. Set status to "active" to begin processing enrolments, "paused" to temporarily halt sends.',
      scopes: ['lead-gen:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Initiative UUID', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'Updated name', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Updated description', in: 'body' },
        { name: 'status', type: 'string', required: false, description: 'New status: draft, active, paused, completed', in: 'body' },
        { name: 'daily_send_cap', type: 'integer', required: false, description: 'Updated daily send cap (null to remove cap)', in: 'body' },
      ],
      requestExample: `curl -X PATCH \\
  "${API_BASE_URL}/lead-gen/initiatives/a1b2c3d4-..." \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"status":"active"}'`,
      responseExample: `{
  "id": "a1b2c3d4-...",
  "name": "Q3 Roofing Outreach",
  "status": "active",
  "updated_at": "2026-05-02T09:00:00Z"
}`,
    },
    {
      method: 'DELETE',
      path: '/lead-gen/initiatives/:id',
      description: 'Delete an outreach initiative. All associated steps and enrolments are also removed. Active enrolments in progress will be cancelled. Returns 204 No Content on success.',
      scopes: ['lead-gen:delete'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Initiative UUID to delete', in: 'path' },
      ],
      requestExample: `curl -X DELETE \\
  "${API_BASE_URL}/lead-gen/initiatives/a1b2c3d4-..." \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `HTTP 204 No Content`,
    },
    {
      method: 'POST',
      path: '/lead-gen/initiatives/:id/steps',
      description: 'Add a new step to an outreach initiative. Steps are executed in step_number order. Supported action types: send_gmail_email (requires gmail_connection_id and subject/body templates with {{lead.*}} tokens), send_sms (requires sms body with {{lead.*}} tokens), notify_assigned_staff (sends an internal alert email to the enrolling user).',
      scopes: ['lead-gen:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Initiative UUID', in: 'path' },
        { name: 'step_number', type: 'integer', required: true, description: 'Execution order (1-based). Existing steps with >= this number are shifted down.', in: 'body' },
        { name: 'action_type', type: 'string', required: true, description: 'Action to perform: send_gmail_email, send_sms, notify_assigned_staff', in: 'body' },
        { name: 'delay_days', type: 'integer', required: false, description: 'Days to wait after the previous step before executing this one (default: 0)', in: 'body' },
        { name: 'config', type: 'object', required: true, description: 'Action-specific config. For send_gmail_email: {gmail_connection_id, subject, body}. For send_sms: {body}. For notify_assigned_staff: {subject, body}.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/lead-gen/initiatives/a1b2c3d4-.../steps" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"step_number":1,"action_type":"send_gmail_email","delay_days":0,"config":{"gmail_connection_id":"conn-id","subject":"Hi {{lead.name}}","body":"Hi {{lead.name}}, I saw your business {{lead.business_name}}..."}}'`,
      responseExample: `{
  "id": "s1b2c3d4-...",
  "initiative_id": "a1b2c3d4-...",
  "step_number": 1,
  "action_type": "send_gmail_email",
  "delay_days": 0,
  "config": { "gmail_connection_id": "conn-id", "subject": "Hi {{lead.name}}", "body": "..." },
  "created_at": "2026-05-01T10:00:00Z"
}`,
    },
    {
      method: 'PATCH',
      path: '/lead-gen/initiatives/:id/steps/:stepId',
      description: 'Update a step\'s delay, config (subject/body templates), or reorder its step_number. Updating step_number re-sequences other steps automatically.',
      scopes: ['lead-gen:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Initiative UUID', in: 'path' },
        { name: 'stepId', type: 'uuid', required: true, description: 'Step UUID', in: 'path' },
        { name: 'delay_days', type: 'integer', required: false, description: 'Updated delay in days', in: 'body' },
        { name: 'config', type: 'object', required: false, description: 'Updated action config', in: 'body' },
        { name: 'step_number', type: 'integer', required: false, description: 'New step position (triggers re-sequence)', in: 'body' },
      ],
      requestExample: `curl -X PATCH \\
  "${API_BASE_URL}/lead-gen/initiatives/a1b2c3d4-.../steps/s1b2c3d4-..." \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"delay_days":2}'`,
      responseExample: `{
  "id": "s1b2c3d4-...",
  "step_number": 1,
  "delay_days": 2,
  "updated_at": "2026-05-02T09:00:00Z"
}`,
    },
    {
      method: 'DELETE',
      path: '/lead-gen/initiatives/:id/steps/:stepId',
      description: 'Remove a step from an initiative. Subsequent steps are re-numbered to fill the gap. Returns 204 No Content on success.',
      scopes: ['lead-gen:delete'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Initiative UUID', in: 'path' },
        { name: 'stepId', type: 'uuid', required: true, description: 'Step UUID to remove', in: 'path' },
      ],
      requestExample: `curl -X DELETE \\
  "${API_BASE_URL}/lead-gen/initiatives/a1b2c3d4-.../steps/s1b2c3d4-..." \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `HTTP 204 No Content`,
    },
    {
      method: 'POST',
      path: '/lead-gen/initiatives/:id/enrol',
      description: 'Enrol one or more search results into an outreach initiative. Each enrolment tracks progress through the initiative\'s steps. Leads already enrolled in this initiative are skipped (idempotent). Unsubscribed leads are silently excluded.',
      scopes: ['lead-gen:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Initiative UUID', in: 'path' },
        { name: 'search_result_ids', type: 'array', required: true, description: 'Array of search result UUIDs to enrol', in: 'body' },
        { name: 'assigned_user_id', type: 'uuid', required: false, description: 'User whose Gmail connection to use for email steps. Defaults to the API key owner.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/lead-gen/initiatives/a1b2c3d4-.../enrol" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"search_result_ids":["r1...","r2...","r3..."]}'`,
      responseExample: `{
  "enrolled": 3,
  "skipped_already_enrolled": 0,
  "skipped_unsubscribed": 0,
  "enrolment_ids": ["e1...","e2...","e3..."]
}`,
    },
    {
      method: 'GET',
      path: '/lead-gen/initiatives/:id/enrolments',
      description: 'List enrolments for an initiative. Returns each enrolment with the lead\'s details, current step number, status, and next scheduled action date.',
      scopes: ['lead-gen:read'],
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Initiative UUID', in: 'path' },
        { name: 'status', type: 'string', required: false, description: 'Filter by enrolment status: active, completed, unsubscribed, failed', in: 'query' },
        { name: 'limit', type: 'integer', required: false, description: 'Max results (default: 50)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Pagination cursor', in: 'query' },
      ],
      requestExample: `curl \\
  "${API_BASE_URL}/lead-gen/initiatives/a1b2c3d4-.../enrolments?status=active" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "e1...",
      "lead_name": "Acme Plumbing",
      "lead_email": "info@acmeplumbing.com",
      "current_step": 1,
      "status": "active",
      "next_action_at": "2026-05-04T10:00:00Z"
    }
  ],
  "pagination": { "has_more": true, "next_cursor": "e2..." }
}`,
    },
    {
      method: 'POST',
      path: '/lead-gen/initiatives/dispatcher/run',
      description: 'Manually trigger the initiative dispatcher for your workspace. The dispatcher processes all due enrolment tasks: sends emails, SMS messages, and staff notifications for active initiatives. Under normal operation this runs automatically via cron. Use this endpoint to trigger an immediate processing cycle, for testing, or to catch up after a pause. Returns a summary of tasks processed.',
      scopes: ['lead-gen:write'],
      isWrite: true,
      params: [
        { name: 'initiative_id', type: 'uuid', required: false, description: 'Limit dispatch to a single initiative. Omit to process all active initiatives.', in: 'body' },
        { name: 'dry_run', type: 'boolean', required: false, description: 'If true, simulate processing without sending anything (default: false)', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/lead-gen/initiatives/dispatcher/run" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{}'`,
      responseExample: `{
  "tasks_processed": 12,
  "tasks_sent": 10,
  "tasks_skipped": 2,
  "runs": [
    { "enrolment_id": "e1...", "step": 1, "action": "send_gmail_email", "status": "sent" },
    { "enrolment_id": "e2...", "step": 1, "action": "send_sms", "status": "sent" }
  ]
}`,
    },
  ],
};
