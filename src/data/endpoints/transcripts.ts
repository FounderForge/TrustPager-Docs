import { type ResourceGroup } from './types.js';

// =============================================================================
// TRANSCRIPTS
// =============================================================================

export const TRANSCRIPTS: ResourceGroup = {
  id: 'transcripts',
  label: 'Transcripts',
  description: 'Transcribe call recordings and meetings, view results, and access AI coaching. Use POST /transcripts/transcribe to kick off transcription from any audio URL. Coaching results are under /transcripts/coaching.',
  endpoints: [
    { method: 'POST', path: '/transcripts/transcribe', description: 'Kick off an audio transcription via TrustPager AI (Whisper). Pass a publicly fetchable recording URL or a Twilio recording URL plus recording_auth. The transcript lands in /inbox/phone-calls (type=phone_call or legacy alias type=call) or /inbox/meetings (type=meeting) and auto-links to contacts and opportunities matching participant email or phone number. Files over 25 MB are automatically chunked at MP3 frame boundaries. Requires transcripts:write scope. Costs 12 credits per minute.', scopes: ['transcripts:write'], isWrite: true, params: [
      { name: 'recording_url', type: 'string', required: true, description: 'Publicly fetchable audio URL (https), or a private R2 URL for recordings already rehosted by TrustPager. For raw Twilio recording URLs also pass recording_auth.', in: 'body' },
      { name: 'title', type: 'string', required: true, description: 'Display title for the transcript, e.g. "Outbound call - Edward Anderson".', in: 'body' },
      { name: 'type', type: 'string', required: true, description: 'Transcript type: phone_call (or legacy alias call) lands in /inbox/phone-calls; meeting lands in /inbox/meetings; voicemail lands in /inbox.', in: 'body' },
      { name: 'source', type: 'string', required: false, description: 'Producer label for filtering (e.g. manual-upload, twilio-call, field-memo). Defaults to api.', in: 'body' },
      { name: 'source_id', type: 'string', required: false, description: 'Foreign key in the producer system (Twilio call_sid, bot_id, etc.). Stored on metadata.', in: 'body' },
      { name: 'occurred_at', type: 'string', required: false, description: 'ISO timestamp when the audio was captured. Defaults to now.', in: 'body' },
      { name: 'recording_auth', type: 'string', required: false, description: 'Basic-auth credentials formatted USER:PASSWORD. Required for raw Twilio recording URLs (pass ACCOUNT_SID:AUTH_TOKEN).', in: 'body' },
      { name: 'participants', type: 'array', required: false, description: 'Participant objects with email, phone, name, and optional role (caller or callee). Used for entity matching and activity creation. role=caller/callee is used by the phone_call_groups view to identify the external phone on outbound calls.', in: 'body' },
      { name: 'model', type: 'string', required: false, description: 'Override the workspace transcription model: whisper-1, gpt-4o-transcribe, gpt-4o-mini-transcribe. whisper-1 is used internally regardless (required for verbose_json diarization).', in: 'body' },
      { name: 'metadata', type: 'object', required: false, description: 'Free-form metadata attached to the transcript row.', in: 'body' },
      { name: 'created_by', type: 'string', required: false, description: 'User UUID for activity attribution when calling from a service-role context.', in: 'body' },
      { name: 'existing_transcript_id', type: 'string', required: false, description: 'UUID of an existing transcript to overwrite. Use for fallback or retry flows.', in: 'body' },
    ] },
    { method: 'GET', path: '/transcripts', description: 'List all transcripts with optional filters for type, source, transcription_status, date range, participant email, or booking_id. Each record includes transcription_status (not_applicable, pending, complete) and booking_id (populated for TrustPager Notetaker recordings, links the transcript to a scheduling_bookings row). Filter type=phone_call to see browser softphone call transcripts.', scopes: ['calls:read'], isWrite: false, params: [
      { name: 'type', type: 'string', required: false, description: 'Filter by type: phone_call (browser softphone + Twilio calls), meeting (Notetaker/Zoom), voicemail. Legacy alias call is equivalent to phone_call.', in: 'query' },
      { name: 'source', type: 'string', required: false, description: 'Filter by source (retell, zoom, recall, manual, etc.). Use "recall" for TrustPager Notetaker recordings.', in: 'query' },
      { name: 'transcription_status', type: 'string', required: false, description: 'Filter by transcription status: not_applicable, pending, or complete. Use complete to find transcripts with text ready for analysis.', in: 'query' },
      { name: 'occurred_after', type: 'string', required: false, description: 'ISO date filter', in: 'query' },
      { name: 'occurred_before', type: 'string', required: false, description: 'ISO date filter', in: 'query' },
      { name: 'participant_email', type: 'string', required: false, description: 'Filter by participant email. Returns transcripts where any participant object has this email.', in: 'query' },
      { name: 'booking_id', type: 'uuid', required: false, description: 'Filter by scheduling booking UUID. Returns the transcript recorded during that specific booking via TrustPager Notetaker.', in: 'query' },
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
