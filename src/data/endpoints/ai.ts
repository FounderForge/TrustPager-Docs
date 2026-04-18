import { type ResourceGroup } from './types.js';

// =============================================================================
// AI
// =============================================================================

export const AI: ResourceGroup = {
  id: 'ai',
  label: 'AI',
  description: 'AI-powered features including entity enrichment, text editing, deal probability, call coaching, needs analysis, form filling, pipeline generation, image generation, text-to-speech generation, and AI tool generators (form, document, whiteboard, website page) that create fully-structured workspace assets from a plain-language prompt.',
  endpoints: [
    { method: 'POST', path: '/ai/enrich', description: 'Enrich a deal\'s primary contact and customer with AI web research. Provide deal_id; the system resolves the linked contact and customer automatically. Costs 5 credits.', scopes: ['ai:use'], isWrite: true, params: [{ name: 'deal_id', type: 'uuid', required: true, description: 'Deal ID. The system finds the deal\'s primary contact and customer and enriches them.', in: 'body' }] },
    { method: 'POST', path: '/ai/edit-text', description: 'Rewrite, improve, translate, summarize, or edit text using AI. Costs 1 credit. Accepts both "text"/"instruction" or "originalText"/"editInstructions" field names.', scopes: ['ai:use'], isWrite: true, params: [{ name: 'text', type: 'string', required: true, description: 'Text to edit (also accepted as "originalText")', in: 'body' }, { name: 'instruction', type: 'string', required: true, description: 'Editing instruction, e.g. "make it more professional", "translate to French" (also accepted as "editInstructions")', in: 'body' }, { name: 'writingStyle', type: 'string', required: false, description: 'Writing style ID (optional)', in: 'body' }, { name: 'formContext', type: 'object', required: false, description: 'Form context for inline editing (optional)', in: 'body' }] },
    { method: 'POST', path: '/ai/deal-probability', description: 'Get AI-generated qualification score and win probability for a deal. Costs 2 credits. Fetches all deal data from DB automatically.', scopes: ['ai:use'], isWrite: true, params: [{ name: 'deal_id', type: 'uuid', required: true, description: 'Deal ID', in: 'body' }] },
    { method: 'POST', path: '/ai/call-coaching', description: 'Analyze a call, meeting, or SMS transcript for coaching insights. Returns performance scores, strengths, improvements, and coaching summary. Costs 3 credits. Provide transcript_id (preferred, auto-resolves text and metadata) or transcript_text (raw text).', scopes: ['ai:use'], isWrite: true, params: [{ name: 'transcript_id', type: 'uuid', required: false, description: 'Transcript UUID (preferred -- auto-resolves transcript text, source type, and context)', in: 'body' }, { name: 'transcript_text', type: 'string', required: false, description: 'Raw transcript text (use only if no transcript_id). Lines formatted as "Speaker Name: text..."', in: 'body' }, { name: 'team_member_name', type: 'string', required: true, description: 'Full name of the team member to coach. Must match a company user.', in: 'body' }, { name: 'source_type', type: 'string', required: false, description: 'Type of interaction: zoom_call (sales), zoom_meeting (team), sms_conversation. Auto-detected from transcript_id. Defaults to zoom_call.', in: 'body' }] },
    { method: 'POST', path: '/ai/generate-pipeline', description: 'Auto-generate a pipeline structure with stages from a text description. Costs 3 credits.', scopes: ['ai:use'], isWrite: true, params: [{ name: 'description', type: 'string', required: true, description: 'Description of the business/sales process', in: 'body' }, { name: 'business_type', type: 'string', required: false, description: 'Type of business (e.g. "B2B SaaS", "retail")', in: 'body' }, { name: 'industry', type: 'string', required: false, description: 'Industry for tailored stage suggestions', in: 'body' }, { name: 'success_criteria', type: 'string', required: false, description: 'What makes a deal "won"', in: 'body' }, { name: 'lost_criteria', type: 'string', required: false, description: 'What makes a deal "lost"', in: 'body' }, { name: 'additional_context', type: 'string', required: false, description: 'Any other relevant context', in: 'body' }] },
    { method: 'POST', path: '/ai/needs-analysis', description: 'Run AI needs analysis on a deal -- extracts client requirements and recommendations from all linked transcripts and activities. Provide deal_id; the system fetches all related data automatically.', scopes: ['ai:use'], isWrite: true, params: [{ name: 'deal_id', type: 'uuid', required: true, description: 'Deal ID. The system fetches all related transcripts, contacts, and activities.', in: 'body' }, { name: 'master_prompt', type: 'string', required: false, description: 'Optional custom instructions to guide the analysis focus', in: 'body' }] },
    { method: 'POST', path: '/ai/fill-form', description: 'Use AI to pre-fill form fields based on a prompt. template_id and prompt are required. The system fetches form fields automatically.', scopes: ['ai:use'], isWrite: true, params: [{ name: 'template_id', type: 'uuid', required: true, description: 'Form template ID', in: 'body' }, { name: 'prompt', type: 'string', required: true, description: 'Instructions for filling the form, e.g. "Fill this incident report for a slip-and-fall at the warehouse on 28 March 2026"', in: 'body' }] },
    { method: 'POST', path: '/ai/generate-image', description: 'Generate an AI image from a text prompt using the NanoBanana model (google:4@1). Returns a CDN image URL, seed, and dimensions. Costs credits. The image is automatically saved to company files. IMPORTANT: Only 11 specific dimension pairs are accepted -- invalid dimensions return a VALIDATION_ERROR with the full list. Default: 1024x1024.', scopes: ['ai:use'], isWrite: true, params: [{ name: 'prompt', type: 'string', required: true, description: 'Text description of the image to generate (2-3000 chars). Be descriptive for best results.', in: 'body' }, { name: 'width', type: 'number', required: false, description: 'Image width in pixels. Must be part of a valid pair. Default 1024. Valid pairs: 1024x1024, 1248x832, 832x1248, 1184x864, 864x1184, 896x1152, 1152x896, 768x1344, 1344x768, 1536x672, 672x1536.', in: 'body' }, { name: 'height', type: 'number', required: false, description: 'Image height in pixels. Must be part of a valid pair with width. See width description for all valid pairs. Default 1024.', in: 'body' }, { name: 'seed', type: 'number', required: false, description: 'Random seed for reproducible results. Omit for random.', in: 'body' }] },
    { method: 'POST', path: '/ai/generate-speech', description: 'Convert text to speech audio using ElevenLabs. Uploads the audio to R2 and saves to company files. Returns an audio URL, duration, file size, and credits charged. Costs 50 credits per 100 characters (minimum 50 credits). Voice resolution order: workspace voices by name -> workspace default -> platform voices -> presets (jessica/rachel/adam/sam) -> raw ElevenLabs voice ID. Optionally returns timed transcript segments (sentences, phrases, or words) for animation timing (e.g. Remotion video sync).', scopes: ['ai:use'], isWrite: true, params: [{ name: 'text', type: 'string', required: true, description: 'Text to convert to speech (2-5000 characters)', in: 'body' }, { name: 'voice', type: 'string', required: false, description: 'Voice name, preset (jessica/rachel/adam/sam), or raw ElevenLabs voice ID. Default: jessica.', in: 'body' }, { name: 'model', type: 'string', required: false, description: 'ElevenLabs model: eleven_multilingual_v2 (default), eleven_monolingual_v1, eleven_turbo_v2_5', in: 'body' }, { name: 'stability', type: 'number', required: false, description: 'Voice stability 0-1 (default 0.6). Higher = more consistent, lower = more expressive.', in: 'body' }, { name: 'similarity_boost', type: 'number', required: false, description: 'Voice clarity/similarity 0-1 (default 0.75)', in: 'body' }, { name: 'style', type: 'number', required: false, description: 'Speaking style intensity 0-1 (default 0.4)', in: 'body' }, { name: 'output_format', type: 'string', required: false, description: 'Audio output format (default: mp3_44100_128)', in: 'body' }, { name: 'name', type: 'string', required: false, description: 'Custom file name for the audio (auto-generated if omitted)', in: 'body' }, { name: 'transcript', type: 'string', required: false, description: 'Request timed transcript segments alongside audio. Values: "none" (default, no transcript), "sentences" (sentence-level timestamps), "phrases" (comma/clause-level timestamps), "words" (word-level timestamps). When set (not "none"), response includes transcript array of {text, start, end, frame_start, frame_end} objects and transcript_mode. frame_start/frame_end are at 30fps for Remotion animation.', in: 'body' }] },
    {
      method: 'POST',
      path: '/ai/generate-form',
      description: 'Generate a complete form template with AI, auto-wired to CRM variables. The generator maps fields whose labels unambiguously match a writable CRM variable (e.g. Email -> contact.email, ABN -> account.tax_number). Workspace custom fields are included in the wiring vocabulary. By default (persist=true), creates the form_templates row and all form_template_fields rows and returns the new template_id. Costs credits (ai_tool_generate).',
      scopes: ['ai:use'],
      isWrite: true,
      params: [
        { name: 'prompt', type: 'string', required: true, description: 'Plain-language description of the form to generate. Be specific about fields needed.', in: 'body' },
        { name: 'persist', type: 'boolean', required: false, description: 'If true (default), creates the form template and fields in the workspace. If false, returns only the generated structure without persisting.', in: 'body' },
        { name: 'name', type: 'string', required: false, description: 'Override the AI-generated form name.', in: 'body' },
        { name: 'folder', type: 'string', required: false, description: 'Folder to place the template in.', in: 'body' },
      ],
      responseExample: JSON.stringify({
        data: {
          template: { id: 'uuid', name: 'Client Intake Form', description: '...', slug: 'client-intake-form', created_at: '2026-04-19T...' },
          fields: [{ id: 'uuid', type: 'text', label: 'First Name', content: { crm_variable: 'contact.first_name', crm_variable_mode: 'overwrite' } }],
          persisted: true,
          stats: { total_fields: 6, wired_fields: 5, unwired_fields: 1 },
        },
        meta: { credits_remaining: 9250 },
      }, null, 2),
    },
    {
      method: 'POST',
      path: '/ai/generate-document',
      description: 'Generate a document template with AI -- proposals, contracts, reports, invoices, letters. Produces structured sections (cover page, text blocks, tables, signature blocks) with {{variable}} tokens for auto-filling. By default (persist=true), creates the document_templates row and all document_template_sections rows and returns the new template_id. Costs credits (ai_tool_generate).',
      scopes: ['ai:use'],
      isWrite: true,
      params: [
        { name: 'prompt', type: 'string', required: true, description: 'Plain-language description of the document. Be specific about purpose, tone, and major sections.', in: 'body' },
        { name: 'persist', type: 'boolean', required: false, description: 'If true (default), creates the document template and its sections in the workspace. If false, returns only the generated structure.', in: 'body' },
        { name: 'name', type: 'string', required: false, description: 'Override the AI-generated document name.', in: 'body' },
      ],
      responseExample: JSON.stringify({
        data: {
          template: { id: 'uuid', name: 'Service Proposal', description: '...', category: 'proposal', page_size: 'A4', created_at: '2026-04-19T...' },
          section_count: 7,
          persisted: true,
        },
        meta: { credits_remaining: 9200 },
      }, null, 2),
    },
    {
      method: 'POST',
      path: '/ai/generate-whiteboard',
      description: 'Generate a whiteboard/diagram template with AI -- process flows, org charts, decision trees, customer journeys, system architectures. Produces Excalidraw-compatible shapes with coordinated colour themes. By default (persist=true), creates whiteboard_templates + whiteboard_snapshots rows. Costs credits (ai_tool_generate).',
      scopes: ['ai:use'],
      isWrite: true,
      params: [
        { name: 'prompt', type: 'string', required: true, description: 'Plain-language description of the diagram to generate.', in: 'body' },
        { name: 'persist', type: 'boolean', required: false, description: 'If true (default), creates the whiteboard template and snapshot. If false, returns only the generated structure.', in: 'body' },
        { name: 'name', type: 'string', required: false, description: 'Override the AI-generated whiteboard name.', in: 'body' },
      ],
      responseExample: JSON.stringify({
        data: {
          template: { id: 'uuid', name: 'Sales Pipeline Flow', description: '...', created_at: '2026-04-19T...' },
          element_count: 20,
          persisted: true,
        },
        meta: { credits_remaining: 9150 },
      }, null, 2),
    },
    {
      method: 'POST',
      path: '/ai/generate-website-page',
      description: 'Generate a complete website landing page with AI -- picks industry-appropriate sections (hero, social proof, features, pricing, FAQ, CTA, etc.) from the business description. Creates website + homepage + all page sections in one call. By default (persist=true), inserts rows into websites, website_pages, and website_page_sections. Costs credits (ai_tool_generate).',
      scopes: ['ai:use'],
      isWrite: true,
      params: [
        { name: 'prompt', type: 'string', required: true, description: 'Business description. Be specific about industry, tone, and target audience.', in: 'body' },
        { name: 'persist', type: 'boolean', required: false, description: 'If true (default), creates the website, homepage, and sections. If false, returns only the generated structure.', in: 'body' },
        { name: 'name', type: 'string', required: false, description: 'Override the AI-generated website name.', in: 'body' },
        { name: 'page_type', type: 'string', required: false, description: 'homepage (default) or page (for secondary pages like services, about, pricing).', in: 'body' },
      ],
      responseExample: JSON.stringify({
        data: {
          website: { id: 'uuid', name: 'Smith Plumbing', created_at: '2026-04-19T...' },
          homepage: { id: 'uuid', title: 'Home', slug: 'home', path: '/home' },
          section_count: 7,
          persisted: true,
        },
        meta: { credits_remaining: 9100 },
      }, null, 2),
    },
    {
      method: 'POST',
      path: '/ai/transcript-summary',
      description: 'Server-side AI intelligence extraction from a transcript. Runs Claude on the full transcript text server-side (no transport size limits) and returns a compact structured summary. Ideal for large transcripts that exceed MCP context limits, or when you need intelligence rather than raw text. Costs 1 credit.',
      scopes: ['ai:use'],
      isWrite: true,
      params: [
        { name: 'transcript_id', type: 'uuid', required: true, description: 'Transcript UUID. Use GET /transcripts to find IDs.', in: 'body' },
        { name: 'focus', type: 'string', required: false, description: 'Optional focus area for the extraction (e.g. "product feedback", "pricing objections", "competitor comparison")', in: 'body' },
      ],
      responseExample: `{
  "data": {
    "transcript_id": "uuid",
    "title": "Demo Call - Acme Corp",
    "occurred_at": "2026-04-17T09:00:00Z",
    "duration_minutes": 42,
    "participant_count": 3,
    "type": "zoom_call",
    "source": "Zoom",
    "sentiment": "positive",
    "summary": "Strong interest in workflow automation. Client asked about Xero integration and API access. Decision expected by end of April.",
    "key_topics": ["automation", "Xero integration", "pricing", "timeline"],
    "key_quotes": [
      { "quote": "This would save us 3 hours a day", "context": "After seeing the automation demo", "use": "testimonial" }
    ],
    "feature_gaps": ["Bulk SMS to a segment"],
    "competitor_mentions": [{ "name": "HubSpot", "context": "Currently using, wants to switch" }],
    "impressive_features": ["Pipeline automation", "Document signing"],
    "bugs_reported": [],
    "pricing_feedback": "Pricing is reasonable but wants annual discount",
    "integration_requests": ["Xero", "Zapier"],
    "action_items": ["Send API docs", "Schedule follow-up for April 25"],
    "input_tokens": 4820,
    "output_tokens": 312
  },
  "meta": { "credits_remaining": 9489 }
}`,
    },
  ],
};
