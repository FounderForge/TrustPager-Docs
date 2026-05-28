import { type ResourceGroup } from './types.js';

export const REFERRALS: ResourceGroup = {
  id: 'referrals',
  label: 'Referrals',
  description: 'Track the referrer -> referred contact -> opportunity chain. Includes workspace-defined category picklist, a leaderboard endpoint, a public token-based submission form, and a create_referral automation action for pipeline-driven partner registration. Every write to the referrals table fires the referral_attributed automation trigger (see GET /schemas/triggers/referral_attributed). Attribution is also cached on the opportunity: crm_deals.primary_referrer_contact_id and crm_deals.primary_referrer_category are maintained by a Postgres trigger and surface in GET /opportunities/:id (including the expand=referrer expansion).',
  endpoints: [
    // ==================== LIST ====================
    {
      method: 'GET',
      path: '/referrals',
      description: 'List referrals for the workspace. Filter by status, referrer_contact_id, referred_contact_id, or category. Returns the full referral chain including category and notes.',
      scopes: ['referrals:read'],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'pending | accepted | converted | declined', in: 'query' },
        { name: 'referrer_contact_id', type: 'string', required: false, description: 'UUID. Filter to referrals made BY this contact.', in: 'query' },
        { name: 'referred_contact_id', type: 'string', required: false, description: 'UUID. Filter to the referral that produced this contact.', in: 'query' },
        { name: 'category', type: 'string', required: false, description: 'Filter by workspace-defined category (e.g. "CT", "MRI", "Mortgage").', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max records to return (default 20, max 100).', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for pagination (from previous response pagination.next_cursor).', in: 'query' },
      ],
      requestExample: `curl "https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/referrals?category=CT&status=pending" \\
  -H "Authorization: Bearer tp_live_..."`,
      responseExample: `{
  "data": [
    {
      "id": "f2788884-aaaa-bbbb-cccc-111111111111",
      "company_id": "ebeff86e-7b09-4e49-96db-f711d69d2d57",
      "referrer_contact_id": "1068084c-f975-4bb8-be1b-4f0a2f0843be",
      "referred_contact_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "referred_deal_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "source": "form",
      "status": "pending",
      "category": "CT",
      "notes": null,
      "converted_at": null,
      "created_at": "2026-05-01T09:00:00.000Z",
      "updated_at": "2026-05-01T09:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "has_more": false,
    "next_cursor": null
  },
  "meta": { "credits_remaining": 4500 }
}`,
    },
    // ==================== GET ====================
    {
      method: 'GET',
      path: '/referrals/:id',
      description: 'Get a single referral by UUID.',
      scopes: ['referrals:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Referral UUID.', in: 'path' },
      ],
      requestExample: `curl "https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/referrals/f2788884-aaaa-bbbb-cccc-111111111111" \\
  -H "Authorization: Bearer tp_live_..."`,
      responseExample: `{
  "data": {
    "id": "f2788884-aaaa-bbbb-cccc-111111111111",
    "company_id": "ebeff86e-7b09-4e49-96db-f711d69d2d57",
    "referrer_contact_id": "1068084c-f975-4bb8-be1b-4f0a2f0843be",
    "referred_contact_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "referred_deal_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "source": "form",
    "status": "pending",
    "category": "CT",
    "notes": null,
    "converted_at": null,
    "created_at": "2026-05-01T09:00:00.000Z",
    "updated_at": "2026-05-01T09:00:00.000Z",
    "created_by": "user-uuid-here"
  },
  "meta": { "credits_remaining": 4500 }
}`,
    },
    // ==================== CREATE ====================
    {
      method: 'POST',
      path: '/referrals',
      description: 'Manually log a referral (verbal/ad-hoc). source defaults to "manual". For form-driven flows use POST /referrals/request. For automation-driven partner registration configure the create_referral automation action (fires on stage changes; defaults referrer to the opportunity\'s primary contact when no referrer_contact_id is configured).',
      scopes: ['referrals:write'],
      isWrite: true,
      params: [
        { name: 'referrer_contact_id', type: 'string', required: true, description: 'UUID of the contact who made the referral.', in: 'body' },
        { name: 'referred_contact_id', type: 'string', required: false, description: 'UUID of the referred person if already in the CRM.', in: 'body' },
        { name: 'referred_deal_id', type: 'string', required: false, description: 'UUID of the opportunity created from this referral.', in: 'body' },
        { name: 'source', type: 'string', required: false, description: 'form | manual | api. Defaults to "manual".', in: 'body' },
        { name: 'status', type: 'string', required: false, description: 'pending | accepted | converted | declined. Defaults to "pending".', in: 'body' },
        { name: 'category', type: 'string', required: false, description: 'Workspace-defined category (e.g. "CT", "MRI", "Mortgage"). Configure the picklist via PATCH /v1/company/crm-settings with referral_categories.', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Free-text notes about this referral.', in: 'body' },
      ],
      requestExample: `curl -X POST "https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/referrals" \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "referrer_contact_id": "1068084c-f975-4bb8-be1b-4f0a2f0843be",
    "category": "MRI",
    "notes": "Met at the networking event last Tuesday"
  }'`,
      responseExample: `{
  "data": {
    "id": "8aa0c05e-d0b2-49b3-b6e8-2da112254c63",
    "company_id": "ebeff86e-7b09-4e49-96db-f711d69d2d57",
    "referrer_contact_id": "1068084c-f975-4bb8-be1b-4f0a2f0843be",
    "referred_contact_id": null,
    "referred_deal_id": null,
    "source": "manual",
    "status": "pending",
    "category": "MRI",
    "notes": "Met at the networking event last Tuesday",
    "converted_at": null,
    "created_at": "2026-05-16T10:00:00.000Z",
    "updated_at": "2026-05-16T10:00:00.000Z"
  },
  "meta": { "credits_remaining": 4499 }
}`,
    },
    // ==================== UPDATE ====================
    {
      method: 'PATCH',
      path: '/referrals/:id',
      description: 'Update a referral. Writable fields: referred_contact_id, referred_deal_id, status, category, notes. Setting status="converted" stamps converted_at but does NOT send the thank-you email -- use POST /referrals/:id/convert for the full flow.',
      scopes: ['referrals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Referral UUID.', in: 'path' },
        { name: 'referred_contact_id', type: 'string', required: false, description: 'Link to the referred contact UUID.', in: 'body' },
        { name: 'referred_deal_id', type: 'string', required: false, description: 'Link to the opportunity UUID.', in: 'body' },
        { name: 'status', type: 'string', required: false, description: 'pending | accepted | converted | declined', in: 'body' },
        { name: 'category', type: 'string', required: false, description: 'Update the workspace category.', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Update free-text notes.', in: 'body' },
      ],
      requestExample: `curl -X PATCH "https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/referrals/8aa0c05e-d0b2-49b3-b6e8-2da112254c63" \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"status": "accepted", "category": "CT"}'`,
      responseExample: `{
  "data": {
    "id": "8aa0c05e-d0b2-49b3-b6e8-2da112254c63",
    "status": "accepted",
    "category": "CT",
    "updated_at": "2026-05-16T10:05:00.000Z"
  },
  "meta": { "credits_remaining": 4498 }
}`,
    },
    // ==================== DELETE ====================
    {
      method: 'DELETE',
      path: '/referrals/:id',
      description: 'Delete a referral row. The linked contact and opportunity are NOT deleted -- only the referral relationship row is removed.',
      scopes: ['referrals:delete'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Referral UUID.', in: 'path' },
      ],
      requestExample: `curl -X DELETE "https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/referrals/8aa0c05e-d0b2-49b3-b6e8-2da112254c63" \\
  -H "Authorization: Bearer tp_live_..."`,
      responseExample: `HTTP 204 No Content`,
    },
    // ==================== CONVERT ====================
    {
      method: 'POST',
      path: '/referrals/:id/convert',
      description: 'Mark a referral as converted (referred deal closed Won) AND send the branded thank-you email to the referrer. Stamps converted_at. Prefer this over PATCH /referrals/:id when transitioning to converted -- it triggers the email side-effect. Response includes thank_you_sent boolean.',
      scopes: ['referrals:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Referral UUID.', in: 'path' },
      ],
      requestExample: `curl -X POST "https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/referrals/f2788884-aaaa-bbbb-cccc-111111111111/convert" \\
  -H "Authorization: Bearer tp_live_..."`,
      responseExample: `{
  "data": {
    "id": "f2788884-aaaa-bbbb-cccc-111111111111",
    "status": "converted",
    "converted_at": "2026-05-16T11:00:00.000Z",
    "thank_you_sent": true,
    "thank_you_error": null
  },
  "meta": { "credits_remaining": 4497 }
}`,
    },
    // ==================== REQUEST ====================
    {
      method: 'POST',
      path: '/referrals/request',
      description: 'Send a tracked referral-request email to a known contact. The recipient lands on a public page and submits a friend\'s details -- the platform auto-creates a contact + opportunity + referral row on submit. Returns request_id, token, and public_url.',
      scopes: ['referrals:write'],
      isWrite: true,
      params: [
        { name: 'contact_id', type: 'string', required: true, description: 'UUID of the referrer contact (the person being asked to refer someone).', in: 'body' },
        { name: 'deal_id', type: 'string', required: false, description: 'Optional opportunity context for variable resolution in the email template.', in: 'body' },
        { name: 'subject_override', type: 'string', required: false, description: 'Override the email subject line. Supports {{contact.first_name}} tokens.', in: 'body' },
        { name: 'intro_html', type: 'string', required: false, description: 'Override the intro paragraph (raw HTML). Supports template tokens.', in: 'body' },
        { name: 'how_it_works_html', type: 'string', required: false, description: 'Override the "how it works" card HTML.', in: 'body' },
        { name: 'expires_in_days', type: 'number', required: false, description: 'Days until the public link expires. Default 30.', in: 'body' },
      ],
      requestExample: `curl -X POST "https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/referrals/request" \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"contact_id": "1068084c-f975-4bb8-be1b-4f0a2f0843be", "expires_in_days": 30}'`,
      responseExample: `{
  "data": {
    "request_id": "ccdd1234-abcd-1234-abcd-abcdef123456",
    "token": "abc123def456",
    "public_url": "https://app.trustpager.com/refer/abc123def456",
    "expires_at": "2026-06-15T10:00:00.000Z",
    "email_sent": true
  },
  "meta": { "credits_remaining": 4496 }
}`,
    },
    // ==================== LIST REQUESTS ====================
    {
      method: 'GET',
      path: '/referrals/requests',
      description: 'List referral request lifecycle rows (sent -> viewed -> submitted -> expired). Filter by status or contact_id. Useful for "who has been asked but not yet submitted".',
      scopes: ['referrals:read'],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'sent | viewed | submitted | expired', in: 'query' },
        { name: 'contact_id', type: 'string', required: false, description: 'UUID. Filter to requests sent TO this contact.', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max records (default 20, max 100).', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Pagination cursor.', in: 'query' },
      ],
      requestExample: `curl "https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/referrals/requests?status=sent" \\
  -H "Authorization: Bearer tp_live_..."`,
      responseExample: `{
  "data": [
    {
      "id": "ccdd1234-abcd-1234-abcd-abcdef123456",
      "company_id": "ebeff86e-7b09-4e49-96db-f711d69d2d57",
      "contact_id": "1068084c-f975-4bb8-be1b-4f0a2f0843be",
      "deal_id": null,
      "recipient_email": "referrer@example.com",
      "recipient_name": "Jane Smith",
      "status": "sent",
      "sent_at": "2026-05-16T10:00:00.000Z",
      "viewed_at": null,
      "submitted_at": null,
      "referral_id": null,
      "expires_at": "2026-06-15T10:00:00.000Z",
      "created_at": "2026-05-16T10:00:00.000Z"
    }
  ],
  "pagination": { "total": 1, "has_more": false, "next_cursor": null },
  "meta": { "credits_remaining": 4500 }
}`,
    },
    // ==================== LEADERBOARD ====================
    {
      method: 'GET',
      path: '/referrals/leaderboard',
      description: 'Top referrers ranked by converted_referrals desc, then total_referrals desc. Returns up to limit entries with contact details, total_referrals, converted_referrals, and conversion_rate.',
      scopes: ['referrals:read'],
      isWrite: false,
      params: [
        { name: 'limit', type: 'number', required: false, description: 'Max entries (default 10, max 50).', in: 'query' },
        { name: 'only_converted', type: 'boolean', required: false, description: 'When true, only count referrals with status="converted".', in: 'query' },
      ],
      requestExample: `curl "https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/referrals/leaderboard?limit=10" \\
  -H "Authorization: Bearer tp_live_..."`,
      responseExample: `{
  "data": {
    "leaderboard": [
      {
        "contact": {
          "id": "1068084c-f975-4bb8-be1b-4f0a2f0843be",
          "first_name": "Jane",
          "last_name": "Smith",
          "email": "jane@example.com",
          "images": []
        },
        "total_referrals": 5,
        "converted_referrals": 3,
        "conversion_rate": 0.6
      }
    ]
  },
  "meta": { "credits_remaining": 4500 }
}`,
    },
  ],
};
