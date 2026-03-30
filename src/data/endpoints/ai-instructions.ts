import { type ResourceGroup } from './types.js';

// =============================================================================
// AI INSTRUCTIONS
// =============================================================================

export const AI_INSTRUCTIONS: ResourceGroup = {
  id: 'ai-instructions',
  label: 'AI Instructions',
  description: 'Structured behavioral instructions for AI agents. Call once per session, cache the result. Free (0 credits).',
  endpoints: [
    { method: 'GET', path: '/ai-instructions', description: 'Get behavioral instructions for AI agents using the API. Returns structured guidance on email sending, automation setup, deal management, scheduling, document workflows, formatting rules, and common mistakes to avoid. Free (0 credits).', scopes: [], isWrite: false },
  ],
};
