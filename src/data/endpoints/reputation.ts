import { type ResourceGroup } from './types.js';

export const REPUTATION: ResourceGroup = {
  id: 'reputation',
  label: 'Reputation',
  description: 'Public B2B reputation profiles, verified reviews, and case studies. Build credibility with a public reputation page at trustpager.com/reputation/<slug>. Includes a companion anonymous image upload endpoint for reviewer logos and avatars.',
  endpoints: [
    // ==================== IMAGE UPLOAD ====================
    {
      method: 'POST',
      path: 'https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/public-image-upload',
      description: 'Anonymous public image upload endpoint. No API key required. Accepts PNG, WebP, JPEG, or SVG up to 100 KB. Stores in Cloudflare R2 at trustpager.net/uploads/<context>/<sha256>.<ext>. Rate limited to 3 uploads per IP or browser fingerprint per 24 hours. Use context=reputation-reviewer-logo for reviewer company logos and context=form-avatar for reviewer headshots.',
      scopes: [],
      isWrite: true,
      params: [
        { name: 'file', type: 'File', required: true, description: 'Image file (PNG/WebP/JPEG/SVG, max 100 KB). Send as multipart/form-data.', in: 'body' },
        { name: 'context', type: 'string', required: true, description: 'Upload namespace. Must be one of: reputation-reviewer-logo, form-avatar', in: 'body' },
        { name: 'fingerprint', type: 'string', required: false, description: 'Optional browser fingerprint string for per-device rate limiting in addition to IP limiting.', in: 'body' },
      ],
      requestExample: `curl -X POST https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/public-image-upload \\
  -H "Origin: https://app.trustpager.com" \\
  -F "file=@company-logo.png;type=image/png" \\
  -F "context=reputation-reviewer-logo"`,
      responseExample: `{
  "url": "https://trustpager.net/uploads/reputation-reviewer-logo/a3f9c1d2e4b7890abc123def456789012345678901234567890abcdef12345678.png"
}`,
    },
    // ==================== PROFILE ====================
    {
      method: 'GET',
      path: '/reputation/profile',
      description: 'Get the company\'s public Reputation profile (singleton per company). Returns slug, display name, category, branding, overall rating, review/case-study counts, publish state, and settings.',
      scopes: ['reputation:read'],
      isWrite: false,
      params: [],
      requestExample: `curl https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/reputation/profile \\
  -H "Authorization: Bearer tp_live_..."`,
      responseExample: `{
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "company_id": "ebeff86e-7b09-4e49-96db-f711d69d2d57",
    "slug": "acme-agency",
    "display_name": "Acme Agency",
    "tagline": "B2B marketing for SaaS founders",
    "overall_rating": 4.8,
    "total_reviews": 12,
    "total_case_studies": 3,
    "is_published": true,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-04-24T00:00:00.000Z"
  },
  "meta": { "credits_remaining": 4500 }
}`,
    },
    {
      method: 'POST',
      path: '/reputation/profile',
      description: 'Create or update the company\'s Reputation profile (upsert). On creation, slug and display_name are required. On update, only the provided fields are changed.',
      scopes: ['reputation:write'],
      isWrite: true,
      params: [
        { name: 'slug', type: 'string', required: false, description: 'URL slug (e.g. "acme-agency"). Required on first creation. Lowercase letters, numbers, hyphens.', in: 'body' },
        { name: 'display_name', type: 'string', required: false, description: 'Business display name shown on the public page. Required on first creation.', in: 'body' },
        { name: 'category_id', type: 'string', required: false, description: 'Company profile category UUID.', in: 'body' },
        { name: 'tagline', type: 'string', required: false, description: 'Short positioning line.', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Longer about-us paragraph.', in: 'body' },
        { name: 'logo_url', type: 'string', required: false, description: 'URL to logo image.', in: 'body' },
        { name: 'cover_image_url', type: 'string', required: false, description: 'URL to cover/hero image.', in: 'body' },
        { name: 'website_url', type: 'string', required: false, description: 'Business website URL.', in: 'body' },
        { name: 'linkedin_url', type: 'string', required: false, description: 'Company LinkedIn URL.', in: 'body' },
        { name: 'settings', type: 'object', required: false, description: 'Widget style, theme, and CTA config.', in: 'body' },
        { name: 'is_published', type: 'boolean', required: false, description: 'true = live at trustpager.com/reputation/<slug>.', in: 'body' },
      ],
      requestExample: `curl -X POST https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/reputation/profile \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "slug": "acme-agency",
    "display_name": "Acme Agency",
    "tagline": "B2B marketing for SaaS founders",
    "is_published": true
  }'`,
      responseExample: `{
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "slug": "acme-agency",
    "display_name": "Acme Agency",
    "tagline": "B2B marketing for SaaS founders",
    "is_published": true,
    "overall_rating": 0,
    "total_reviews": 0,
    "total_case_studies": 0,
    "created_at": "2026-04-24T00:00:00.000Z",
    "updated_at": "2026-04-24T00:00:00.000Z"
  },
  "meta": { "credits_remaining": 4499, "url": "https://app.trustpager.com/tools/reputation/profile" }
}`,
    },
    {
      method: 'GET',
      path: '/reputation/stats',
      description: 'Get aggregate stats for the company\'s Reputation: profile state, total/published review count, rating distribution (1-5), and case study counts by status.',
      scopes: ['reputation:read'],
      isWrite: false,
      params: [],
      requestExample: `curl https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/reputation/stats \\
  -H "Authorization: Bearer tp_live_..."`,
      responseExample: `{
  "data": {
    "has_profile": true,
    "profile": { "slug": "acme-agency", "overall_rating": 4.8, "is_published": true },
    "reviews": {
      "total": 14,
      "by_status": { "published": 12, "draft": 1, "approved": 1 },
      "by_rating": { "5": 8, "4": 3, "3": 1 }
    },
    "case_studies": { "total": 4, "by_status": { "published": 3, "draft": 1 } }
  },
  "meta": { "credits_remaining": 4498 }
}`,
    },
    // ==================== REVIEWS ====================
    {
      method: 'GET',
      path: '/reputation/reviews',
      description: 'List reviews on the company\'s Reputation profile. Supports cursor pagination. Filter by status, featured, service_category, or rating. Use search for fuzzy match on reviewer name or testimonial.',
      scopes: ['reputation:read'],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'Filter: draft | approved | published | rejected | archived', in: 'query' },
        { name: 'featured', type: 'boolean', required: false, description: 'Filter to featured reviews only', in: 'query' },
        { name: 'service_category', type: 'string', required: false, description: 'Filter by service category', in: 'query' },
        { name: 'rating', type: 'number', required: false, description: 'Filter by exact rating (1-5)', in: 'query' },
        { name: 'search', type: 'string', required: false, description: 'Fuzzy match on reviewer_name or testimonial_text', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Page size (default 25, max 100)', in: 'query' },
        { name: 'cursor', type: 'string', required: false, description: 'Pagination cursor from previous response', in: 'query' },
      ],
      requestExample: `curl https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/reputation/reviews?status=published \\
  -H "Authorization: Bearer tp_live_..."`,
      responseExample: `{
  "data": [
    {
      "id": "e14dad66-b422-42d4-a636-cd17af1c9970",
      "profile_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "reviewer_name": "Sarah Chen",
      "reviewer_company": "Momentum Labs",
      "reviewer_company_logo": "https://trustpager.net/uploads/reputation-reviewer-logo/abc123.png",
      "reviewer_role": "CMO",
      "reviewer_avatar": "https://trustpager.net/uploads/form-avatar/def456.png",
      "reviewer_linkedin_url": "https://linkedin.com/in/sarahchen",
      "reviewer_linkedin_verified": true,
      "reviewer_company_size": "51-200",
      "reviewer_industry": "Technology",
      "rating": 5,
      "testimonial_text": "Exceptional work. Highly recommended.",
      "status": "published",
      "featured": false,
      "created_at": "2026-04-20T00:00:00.000Z"
    }
  ],
  "meta": {
    "credits_remaining": 4497,
    "pagination": { "has_more": false, "next_cursor": null, "count": 1 }
  }
}`,
    },
    {
      method: 'POST',
      path: '/reputation/reviews',
      description: 'Create a new reputation review (starts in "draft" status). Required fields: profile_id, reviewer_name, rating (1-5), testimonial_text. Supply reviewer_company_logo and reviewer_avatar as URLs from the public-image-upload endpoint for richer display.',
      scopes: ['reputation:write'],
      isWrite: true,
      params: [
        { name: 'profile_id', type: 'string', required: true, description: 'Company profile UUID', in: 'body' },
        { name: 'reviewer_name', type: 'string', required: true, description: 'Reviewer full name', in: 'body' },
        { name: 'rating', type: 'number', required: true, description: 'Rating 1-5', in: 'body' },
        { name: 'testimonial_text', type: 'string', required: true, description: 'The review text', in: 'body' },
        { name: 'reviewer_email', type: 'string', required: false, description: 'Reviewer email (admin-only field)', in: 'body' },
        { name: 'reviewer_company', type: 'string', required: false, description: 'Reviewer company name', in: 'body' },
        { name: 'reviewer_company_logo', type: 'string', required: false, description: 'URL of reviewer company logo. Use public-image-upload (context: reputation-reviewer-logo).', in: 'body' },
        { name: 'reviewer_role', type: 'string', required: false, description: 'e.g. CMO, Head of Ops', in: 'body' },
        { name: 'reviewer_avatar', type: 'string', required: false, description: 'URL of reviewer headshot. Use public-image-upload (context: form-avatar).', in: 'body' },
        { name: 'reviewer_linkedin_url', type: 'string', required: false, description: 'LinkedIn profile URL', in: 'body' },
        { name: 'reviewer_linkedin_verified', type: 'boolean', required: false, description: 'Whether LinkedIn identity was verified', in: 'body' },
        { name: 'reviewer_company_size', type: 'string', required: false, description: 'One of: 1-10 | 11-50 | 51-200 | 201-1000 | 1000+', in: 'body' },
        { name: 'reviewer_industry', type: 'string', required: false, description: 'Reviewer industry (free text)', in: 'body' },
        { name: 'service_category', type: 'string', required: false, description: 'e.g. "Demand Gen", "Brand Strategy"', in: 'body' },
        { name: 'engagement_type', type: 'string', required: false, description: 'project | retainer | one-off | trial', in: 'body' },
        { name: 'engagement_value_band', type: 'string', required: false, description: '<5k | 5-25k | 25-100k | 100k+', in: 'body' },
        { name: 'consent_given', type: 'boolean', required: false, description: 'Reviewer consented to publication', in: 'body' },
        { name: 'consent_method', type: 'string', required: false, description: 'voice_call | form | email | manual | linkedin', in: 'body' },
      ],
      requestExample: `curl -X POST https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/reputation/reviews \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "profile_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "reviewer_name": "Sarah Chen",
    "reviewer_company": "Momentum Labs",
    "reviewer_company_logo": "https://trustpager.net/uploads/reputation-reviewer-logo/abc123.png",
    "reviewer_role": "CMO",
    "reviewer_avatar": "https://trustpager.net/uploads/form-avatar/def456.png",
    "reviewer_linkedin_url": "https://linkedin.com/in/sarahchen",
    "reviewer_linkedin_verified": true,
    "reviewer_company_size": "51-200",
    "reviewer_industry": "Technology",
    "rating": 5,
    "testimonial_text": "Exceptional work. Highly recommended.",
    "consent_given": true,
    "consent_method": "email"
  }'`,
      responseExample: `{
  "data": {
    "id": "e14dad66-b422-42d4-a636-cd17af1c9970",
    "profile_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "reviewer_name": "Sarah Chen",
    "reviewer_company_logo": "https://trustpager.net/uploads/reputation-reviewer-logo/abc123.png",
    "reviewer_linkedin_verified": true,
    "rating": 5,
    "status": "draft",
    "created_at": "2026-04-24T00:00:00.000Z"
  },
  "meta": { "credits_remaining": 4498, "url": "https://app.trustpager.com/tools/reputation/reviews" }
}`,
    },
    {
      method: 'PATCH',
      path: '/reputation/reviews/:id',
      description: 'Update a reputation review. Accepts all writable fields. Setting vendor_response auto-stamps vendor_response_by and vendor_response_at. Use reviewer_company_logo and reviewer_avatar to attach images uploaded via public-image-upload.',
      scopes: ['reputation:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Review UUID', in: 'path' },
        { name: 'reviewer_name', type: 'string', required: false, description: 'Reviewer full name', in: 'body' },
        { name: 'reviewer_company', type: 'string', required: false, description: 'Reviewer company name', in: 'body' },
        { name: 'reviewer_company_logo', type: 'string', required: false, description: 'URL of reviewer company logo (from public-image-upload)', in: 'body' },
        { name: 'reviewer_role', type: 'string', required: false, description: 'Reviewer job title', in: 'body' },
        { name: 'reviewer_avatar', type: 'string', required: false, description: 'URL of reviewer headshot (from public-image-upload)', in: 'body' },
        { name: 'reviewer_linkedin_url', type: 'string', required: false, description: 'LinkedIn profile URL', in: 'body' },
        { name: 'reviewer_linkedin_verified', type: 'boolean', required: false, description: 'LinkedIn identity verified', in: 'body' },
        { name: 'reviewer_company_size', type: 'string', required: false, description: '1-10 | 11-50 | 51-200 | 201-1000 | 1000+', in: 'body' },
        { name: 'reviewer_industry', type: 'string', required: false, description: 'Reviewer industry', in: 'body' },
        { name: 'rating', type: 'number', required: false, description: '1-5', in: 'body' },
        { name: 'testimonial_text', type: 'string', required: false, description: 'Review text', in: 'body' },
        { name: 'vendor_response', type: 'string', required: false, description: 'Public vendor reply to this review. Auto-stamps vendor_response_at.', in: 'body' },
        { name: 'featured', type: 'boolean', required: false, description: 'Pin to featured slot on public profile', in: 'body' },
        { name: 'service_category', type: 'string', required: false, description: 'Service category label', in: 'body' },
        { name: 'engagement_type', type: 'string', required: false, description: 'project | retainer | one-off | trial', in: 'body' },
        { name: 'engagement_value_band', type: 'string', required: false, description: '<5k | 5-25k | 25-100k | 100k+', in: 'body' },
      ],
      requestExample: `curl -X PATCH https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/reputation/reviews/e14dad66-b422-42d4-a636-cd17af1c9970 \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "reviewer_company_logo": "https://trustpager.net/uploads/reputation-reviewer-logo/abc123.png",
    "reviewer_linkedin_verified": true,
    "reviewer_company_size": "51-200",
    "reviewer_industry": "Technology",
    "vendor_response": "Thank you Sarah -- it was a pleasure working with your team.",
    "featured": true
  }'`,
      responseExample: `{
  "data": {
    "id": "e14dad66-b422-42d4-a636-cd17af1c9970",
    "reviewer_company_logo": "https://trustpager.net/uploads/reputation-reviewer-logo/abc123.png",
    "reviewer_linkedin_verified": true,
    "reviewer_company_size": "51-200",
    "reviewer_industry": "Technology",
    "vendor_response": "Thank you Sarah -- it was a pleasure working with your team.",
    "vendor_response_at": "2026-04-24T00:00:00.000Z",
    "featured": true,
    "status": "draft"
  },
  "meta": { "credits_remaining": 4497 }
}`,
    },
    {
      method: 'POST',
      path: '/reputation/reviews/:id/approve',
      description: 'Transition a review from draft to approved. Stamps approved_by and approved_at.',
      scopes: ['reputation:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Review UUID', in: 'path' },
      ],
      requestExample: `curl -X POST https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/reputation/reviews/e14dad66-b422-42d4-a636-cd17af1c9970/approve \\
  -H "Authorization: Bearer tp_live_..."`,
      responseExample: `{
  "data": { "id": "e14dad66-b422-42d4-a636-cd17af1c9970", "status": "approved", "approved_at": "2026-04-24T00:00:00.000Z" },
  "meta": { "credits_remaining": 4496 }
}`,
    },
    {
      method: 'POST',
      path: '/reputation/reviews/:id/publish',
      description: 'Transition a review from approved to published. Stamps published_at and recalculates the profile overall_rating and total_reviews.',
      scopes: ['reputation:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Review UUID', in: 'path' },
      ],
      requestExample: `curl -X POST https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/reputation/reviews/e14dad66-b422-42d4-a636-cd17af1c9970/publish \\
  -H "Authorization: Bearer tp_live_..."`,
      responseExample: `{
  "data": { "id": "e14dad66-b422-42d4-a636-cd17af1c9970", "status": "published", "published_at": "2026-04-24T00:00:00.000Z" },
  "meta": { "credits_remaining": 4495 }
}`,
    },
    {
      method: 'DELETE',
      path: '/reputation/reviews/:id',
      description: 'Permanently delete a review. If the review was published, the profile overall_rating and total_reviews are recalculated.',
      scopes: ['reputation:delete'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Review UUID', in: 'path' },
      ],
      requestExample: `curl -X DELETE https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/reputation/reviews/e14dad66-b422-42d4-a636-cd17af1c9970 \\
  -H "Authorization: Bearer tp_live_..."`,
      responseExample: `204 No Content`,
    },
  ],
};
