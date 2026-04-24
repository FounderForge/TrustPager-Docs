import { type ResourceGroup } from './types.js';

// =============================================================================
// VOICE AGENT KNOWLEDGE BASES
// =============================================================================

export const VOICE_AGENT_KBS: ResourceGroup = {
  id: 'voice-agent-kbs',
  label: 'Agent Knowledge Bases',
  description: 'Manage Retell-backed knowledge bases for voice agents. Each KB stores documents that agents can retrieve during calls. KBs can be seeded from help center articles or populated with custom content. Required scopes: voice-kbs:read, voice-kbs:write, voice-kbs:delete. NOTE: Retell KB write API (create and add-sources) is occasionally unavailable -- if create or add_doc returns a 500, this is a Retell-side outage, not a TrustPager bug.',
  endpoints: [
    {
      method: 'GET',
      path: '/voice-agent-kbs',
      description: 'List all knowledge bases for the workspace.',
      scopes: ['voice-kbs:read'],
      isWrite: false,
      params: [],
      responseExample: '{"kbs": [{"id": "uuid", "name": "Product FAQ", "description": "...", "retell_kb_id": "kb_abc123", "source": "custom", "created_at": "2026-04-25T00:00:00Z"}]}',
    },
    {
      method: 'GET',
      path: '/voice-agent-kbs/:id',
      description: 'Get a single knowledge base by ID, including all document records.',
      scopes: ['voice-kbs:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Knowledge base UUID', in: 'path' },
      ],
      responseExample: '{"kb": {"id": "uuid", "name": "Product FAQ", "retell_kb_id": "kb_abc123", "source": "custom", "documents": [{"id": "doc-uuid", "title": "Pricing", "retell_doc_id": "src_xyz", "source_type": "manual"}]}}',
    },
    {
      method: 'POST',
      path: '/voice-agent-kbs',
      description: 'Create a new knowledge base. source="help_center" seeds it with all help center articles automatically. source="custom" (default) starts empty or accepts initial_texts. WARNING: Retell KB create API returns 500 intermittently -- this is a Retell-side outage.',
      scopes: ['voice-kbs:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Knowledge base name', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Optional description', in: 'body' },
        { name: 'source', type: 'string', required: false, description: '"help_center" to seed from articles, or "custom" (default) for manual content', in: 'body' },
        { name: 'initial_texts', type: 'array', required: false, description: 'Initial documents for custom KBs. Each item: {title: string, text: string}. Ignored when source="help_center".', in: 'body' },
      ],
      requestExample: '{"name": "Product FAQ", "source": "custom", "initial_texts": [{"title": "Pricing", "text": "Our pricing starts at $49/month..."}]}',
      responseExample: '{"kb": {"id": "uuid", "name": "Product FAQ", "retell_kb_id": "kb_abc123", "source": "custom"}}',
    },
    {
      method: 'DELETE',
      path: '/voice-agent-kbs/:id',
      description: 'Delete a knowledge base. Removes it from Retell (best-effort, tolerates 404) and deletes all local document rows. Does NOT detach from voice agents -- detach first if needed.',
      scopes: ['voice-kbs:delete'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Knowledge base UUID', in: 'path' },
      ],
      responseExample: '{"success": true}',
    },
    {
      method: 'GET',
      path: '/voice-agent-kbs/:kb_id/documents',
      description: 'List all document records tracked for a knowledge base. Each row has a retell_doc_id, source_type (help_center_article or manual), optional source_id (article UUID), title, and content_hash.',
      scopes: ['voice-kbs:read'],
      isWrite: false,
      params: [
        { name: 'kb_id', type: 'uuid', required: true, description: 'Knowledge base UUID', in: 'path' },
      ],
      responseExample: '{"documents": [{"id": "doc-uuid", "title": "Pricing", "retell_doc_id": "src_xyz", "source_type": "manual", "content_hash": "abc123"}]}',
    },
    {
      method: 'POST',
      path: '/voice-agent-kbs/:kb_id/documents',
      description: 'Add a manually written document to a knowledge base. Pushes the text to Retell and stores a local tracking row. WARNING: Retell add-sources API returns 500 intermittently.',
      scopes: ['voice-kbs:write'],
      isWrite: true,
      params: [
        { name: 'kb_id', type: 'uuid', required: true, description: 'Knowledge base UUID', in: 'path' },
        { name: 'title', type: 'string', required: true, description: 'Document title', in: 'body' },
        { name: 'text', type: 'string', required: true, description: 'Document content', in: 'body' },
      ],
      requestExample: '{"title": "Refund Policy", "text": "We offer a 30-day money-back guarantee..."}',
      responseExample: '{"document": {"id": "doc-uuid", "title": "Refund Policy", "retell_doc_id": "src_xyz", "source_type": "manual"}}',
    },
    {
      method: 'DELETE',
      path: '/voice-agent-kbs/:kb_id/documents/:doc_id',
      description: 'Remove a document from a knowledge base. Deletes the Retell source (best-effort) and the local tracking row. doc_id is the local UUID from the documents list, not the Retell source ID.',
      scopes: ['voice-kbs:delete'],
      isWrite: true,
      params: [
        { name: 'kb_id', type: 'uuid', required: true, description: 'Knowledge base UUID', in: 'path' },
        { name: 'doc_id', type: 'uuid', required: true, description: 'Document UUID (local ID from list endpoint)', in: 'path' },
      ],
      responseExample: '{"success": true}',
    },
    {
      method: 'POST',
      path: '/voice-agent-kbs/:kb_id/sync-help-center',
      description: 'Sync all help center articles into a knowledge base. Adds new articles, updates changed articles (by content hash), removes deleted articles, skips unchanged ones. Returns added/updated/unchanged/removed/failed counts.',
      scopes: ['voice-kbs:write'],
      isWrite: true,
      params: [
        { name: 'kb_id', type: 'uuid', required: true, description: 'Knowledge base UUID', in: 'path' },
      ],
      requestExample: '{}',
      responseExample: '{"success": true, "summary": {"added": 3, "updated": 1, "unchanged": 10, "removed": 0, "failed": 0}}',
    },
    {
      method: 'POST',
      path: '/voice-agent-kbs/:kb_id/attach/:agent_id',
      description: 'Attach a knowledge base to a voice agent conversation flow. Reads the current flow from Retell, adds the KB ID to knowledge_base_ids (deduped), and saves the updated draft. The agent must be published separately for the change to go live. Returns already_attached:true if already linked.',
      scopes: ['voice-kbs:write'],
      isWrite: true,
      params: [
        { name: 'kb_id', type: 'uuid', required: true, description: 'Knowledge base UUID', in: 'path' },
        { name: 'agent_id', type: 'uuid', required: true, description: 'Voice agent UUID', in: 'path' },
      ],
      requestExample: '{}',
      responseExample: '{"success": true, "already_attached": false, "knowledge_base_ids": ["kb_abc123"]}',
    },
  ],
};
