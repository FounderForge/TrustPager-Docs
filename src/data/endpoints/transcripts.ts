import { type ResourceGroup } from './types.js';

// =============================================================================
// TRANSCRIPTS
// =============================================================================

export const TRANSCRIPTS: ResourceGroup = {
  id: 'transcripts',
  label: 'Transcripts',
  description: 'View call transcripts and AI coaching results. Coaching results are accessed under /transcripts/coaching.',
  endpoints: [
    { method: 'GET', path: '/transcripts', description: 'List all transcripts with optional filters for type, source, transcription_status, date range, and participant email. Each record includes transcription_status (not_applicable, pending, complete).', scopes: ['calls:read'], isWrite: false, params: [
      { name: 'type', type: 'string', required: false, description: 'Filter by type (call, meeting)', in: 'query' },
      { name: 'source', type: 'string', required: false, description: 'Filter by source (retell, zoom, manual, etc.)', in: 'query' },
      { name: 'transcription_status', type: 'string', required: false, description: 'Filter by transcription status: not_applicable, pending, or complete. Use complete to find transcripts with text ready for analysis.', in: 'query' },
      { name: 'occurred_after', type: 'string', required: false, description: 'ISO date filter', in: 'query' },
      { name: 'occurred_before', type: 'string', required: false, description: 'ISO date filter', in: 'query' },
      { name: 'participant_email', type: 'string', required: false, description: 'Filter by participant email. Returns transcripts where any participant object has this email.', in: 'query' },
      { name: 'limit', type: 'number', required: false, description: 'Max results (1-100, default 25)', in: 'query' },
      { name: 'cursor', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
    ] },
    { method: 'GET', path: '/transcripts/:id', description: 'Retrieve a transcript with full text, participants, linked entities, and transcription_status. Check transcription_status=complete before using transcript_text for AI analysis.', scopes: ['calls:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Transcript ID', in: 'path' }] },
    { method: 'DELETE', path: '/transcripts/:id', description: 'Delete a transcript and its linked entity relationships.', scopes: ['calls:read'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Transcript ID', in: 'path' }] },
    { method: 'GET', path: '/transcripts/:id/coaching', description: 'Get all coaching results for a specific transcript.', scopes: ['calls:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Transcript ID', in: 'path' }] },
    { method: 'GET', path: '/transcripts/coaching', description: 'List all AI coaching results across all transcripts. Filter by framework, source_type, or team_member_id.', scopes: ['calls:read'], isWrite: false, params: [
      { name: 'framework', type: 'string', required: false, description: 'Filter by coaching framework (SPIN, BANT, Challenger, MEDDIC)', in: 'query' },
      { name: 'source_type', type: 'string', required: false, description: 'Filter by source type', in: 'query' },
      { name: 'team_member_id', type: 'uuid', required: false, description: 'Filter by team member UUID', in: 'query' },
    ] },
    { method: 'GET', path: '/transcripts/coaching/:id', description: 'Retrieve a specific AI coaching result by ID.', scopes: ['calls:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Coaching result ID', in: 'path' }] },
  ],
};
