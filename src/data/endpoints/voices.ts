import { type ResourceGroup } from './types.js';

// =============================================================================
// VOICES
// =============================================================================

export const VOICES: ResourceGroup = {
  id: 'voices',
  label: 'Voices',
  description: 'Manage saved workspace voices and browse platform-recommended voices. Workspace voices are saved ElevenLabs voices scoped to your company. Platform voices are pre-seeded recommended voices available to all workspaces (read-only). Use these with POST /ai/generate-speech.',
  endpoints: [
    {
      method: 'GET',
      path: '/voices',
      description: 'List all voices -- workspace-saved voices (source: "workspace") and platform-recommended voices (source: "platform"). Workspace voices appear first, then platform voices sorted by sort_order.',
      scopes: ['voices:read'],
      isWrite: false,
      params: [],
      responseExample: JSON.stringify({
        data: {
          voices: [
            { id: 'uuid', name: 'Ruby Roo', provider: 'elevenlabs', provider_voice_id: 'b8gbDO0ybjX1VA89pBdX', preview_url: 'https://...mp3', model: 'eleven_multilingual_v2', settings: { stability: 0.6, similarity_boost: 0.75, style: 0.4 }, is_default: false, description: null, source: 'workspace' },
            { id: 'uuid', name: 'Jessica', provider: 'elevenlabs', provider_voice_id: 'cgSgspJ2msm6clMCkdW9', preview_url: 'https://...mp3', model: 'eleven_multilingual_v2', settings: null, is_default: false, description: 'Playful, bright, warm female voice', source: 'platform' },
          ],
          total: 2,
        },
      }, null, 2),
    },
    {
      method: 'POST',
      path: '/voices',
      description: 'Save an ElevenLabs voice to the workspace voice library. provider_voice_id is required. Name and preview URL are auto-resolved from ElevenLabs if not provided. Each voice ID can only be saved once per workspace.',
      scopes: ['voices:write'],
      isWrite: true,
      params: [
        { name: 'provider_voice_id', type: 'string', required: true, description: 'ElevenLabs voice ID. Find IDs via the ElevenLabs voice library or from platform voices in GET /voices.', in: 'body' },
        { name: 'name', type: 'string', required: false, description: 'Display name for the voice. Auto-resolved from ElevenLabs if omitted.', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Description of the voice and its best use cases', in: 'body' },
        { name: 'model', type: 'string', required: false, description: 'Preferred ElevenLabs model. Default: eleven_multilingual_v2.', in: 'body' },
        { name: 'settings', type: 'object', required: false, description: 'Voice settings: { stability: 0-1, similarity_boost: 0-1, style: 0-1 }', in: 'body' },
        { name: 'is_default', type: 'boolean', required: false, description: 'Set as workspace default voice (unsets any previous default)', in: 'body' },
        { name: 'provider', type: 'string', required: false, description: 'Voice provider. Default: elevenlabs.', in: 'body' },
      ],
      requestExample: JSON.stringify({ provider_voice_id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', description: 'Warm, friendly voice for customer-facing audio' }, null, 2),
      responseExample: JSON.stringify({
        data: { id: 'uuid', name: 'Jessica', provider: 'elevenlabs', provider_voice_id: 'cgSgspJ2msm6clMCkdW9', provider_voice_name: 'Jessica - Playful, Bright, Warm', preview_url: 'https://...mp3', model: 'eleven_multilingual_v2', settings: null, is_default: false, description: 'Warm, friendly voice for customer-facing audio', created_at: '2026-03-31T00:00:00Z' },
      }, null, 2),
    },
    {
      method: 'GET',
      path: '/voices/:id',
      description: 'Get a single workspace-saved voice by ID. Only returns workspace voices (not platform voices).',
      scopes: ['voices:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Voice UUID', in: 'path' },
      ],
    },
    {
      method: 'PATCH',
      path: '/voices/:id',
      description: 'Update a workspace-saved voice. Can update name, description, model, settings, or set as default. Only workspace voices can be updated.',
      scopes: ['voices:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Voice UUID', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'New display name', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'New description', in: 'body' },
        { name: 'model', type: 'string', required: false, description: 'Preferred ElevenLabs model', in: 'body' },
        { name: 'settings', type: 'object', required: false, description: 'Voice settings: { stability, similarity_boost, style } (all 0-1)', in: 'body' },
        { name: 'is_default', type: 'boolean', required: false, description: 'Set as workspace default (unsets previous default)', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/voices/:id',
      description: 'Remove a saved voice from the workspace. Only workspace voices can be deleted. Platform voices are read-only.',
      scopes: ['voices:delete'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Voice UUID to delete', in: 'path' },
      ],
    },
    // --- Provider catalogue ---
    {
      method: 'GET',
      path: '/voices/provider-catalog',
      description: 'List the upstream voice provider catalogue. Returns each voice with its namespaced provider voice_id (e.g. "11labs-Noah"), name, accent, gender, and preview URL. Use this to discover valid values for set_provider_voice_mapping, or to troubleshoot voice rejections when creating or provisioning voice agents.',
      scopes: ['voices:read'],
      isWrite: false,
      params: [],
      responseExample: JSON.stringify({
        data: {
          voices: [
            { voice_id: '11labs-Noah', name: 'Noah', accent: 'American', gender: 'male', preview_audio_url: 'https://...' },
            { voice_id: '11labs-Jessica', name: 'Jessica', accent: 'American', gender: 'female', preview_audio_url: 'https://...' },
          ],
          count: 2,
        },
      }, null, 2),
    },
    {
      method: 'POST',
      path: '/voices/:id/provider-mapping',
      description: 'Map a local voice (workspace or platform) to a provider-format voice ID so voice agent creation and provisioning use it instead of the fallback voice. Pass a namespaced voice_id (e.g. "11labs-Noah") from GET /voices/provider-catalog. Pass null to clear an existing mapping.',
      scopes: ['voices:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Local voice UUID (workspace or platform voice)', in: 'path' },
        { name: 'retell_voice_id', type: 'string|null', required: true, description: 'Provider-format voice ID (e.g. "11labs-Noah"). Pass null to clear.', in: 'body' },
      ],
      requestExample: `curl -X POST "https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/voices/voice-uuid/provider-mapping" \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"retell_voice_id": "11labs-Noah"}'`,
      responseExample: JSON.stringify({
        data: { id: 'voice-uuid', name: 'Noah', retell_voice_id: '11labs-Noah', updated: true },
        meta: { credits_remaining: 4500 },
      }, null, 2),
    },
    {
      method: 'POST',
      path: '/voices/sync-provider-catalog',
      description: 'Idempotent sync: pulls the upstream provider catalogue, finds same-provider name matches for every local voice (workspace + platform) missing a mapping, and writes the provider voice ID. Already-mapped voices are skipped unless force=true. Returns matched/skipped/unmatched counts per voice.',
      scopes: ['voices:write'],
      isWrite: true,
      params: [
        { name: 'force', type: 'boolean', required: false, description: 're-evaluate voices that already have a mapping (default false)', in: 'body' },
        { name: 'voice_id', type: 'string', required: false, description: 'Scope sync to a single local voice UUID', in: 'body' },
      ],
      requestExample: `curl -X POST "https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/api/v1/voices/sync-provider-catalog" \\
  -H "Authorization: Bearer tp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{}'`,
      responseExample: JSON.stringify({
        data: {
          matched: [{ id: 'voice-uuid', name: 'Noah', retell_voice_id: '11labs-Noah' }],
          skipped_already_mapped: [],
          unmatched: [],
          matched_count: 1,
          skipped_count: 0,
          unmatched_count: 0,
        },
        meta: { credits_remaining: 4499 },
      }, null, 2),
    },
  ],
};
