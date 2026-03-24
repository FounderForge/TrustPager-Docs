import { type ResourceGroup } from './types.js';

// =============================================================================
// TRANSCRIPTS
// =============================================================================

export const TRANSCRIPTS: ResourceGroup = {
  id: 'transcripts',
  label: 'Transcripts',
  description: 'View call transcripts and AI coaching results.',
  endpoints: [
    { method: 'GET', path: '/transcripts', description: 'List all transcripts with optional filters for type, source, date range, and participant email.', scopes: ['calls:read'], isWrite: false, params: [
      { name: 'type', type: 'string', required: false, description: 'Filter by type (call, meeting)', in: 'query' },
      { name: 'source', type: 'string', required: false, description: 'Filter by source (retell, zoom, manual, etc.)', in: 'query' },
      { name: 'occurred_after', type: 'string', required: false, description: 'ISO date filter', in: 'query' },
      { name: 'occurred_before', type: 'string', required: false, description: 'ISO date filter', in: 'query' },
      { name: 'participant_email', type: 'string', required: false, description: 'Filter by participant email. Returns transcripts where any participant object has this email.', in: 'query' },
      { name: 'limit', type: 'number', required: false, description: 'Max results (1-100, default 25)', in: 'query' },
      { name: 'cursor', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
    ] },
    { method: 'GET', path: '/transcripts/:id', description: 'Retrieve a transcript.', scopes: ['calls:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Transcript ID', in: 'path' }] },
    { method: 'GET', path: '/coaching-results', description: 'List AI coaching results.', scopes: ['calls:read'], isWrite: false, params: [{ name: 'framework', type: 'string', required: false, description: 'Filter by coaching framework (SPIN, BANT, Challenger, MEDDIC)', in: 'query' }] },
    { method: 'GET', path: '/coaching-results/:id', description: 'Retrieve a coaching result by ID.', scopes: ['calls:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Coaching result ID', in: 'path' }] },
  ],
};
