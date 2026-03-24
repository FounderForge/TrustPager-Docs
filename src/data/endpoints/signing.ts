import { type ResourceGroup } from './types.js';

// =============================================================================
// SIGNING
// =============================================================================

export const SIGNING: ResourceGroup = {
  id: 'signing',
  label: 'Signing',
  description: 'Manage e-signature envelopes. Send documents for signing and track completion status.',
  endpoints: [
    { method: 'GET', path: '/signing/envelopes', description: 'List signing envelopes.', scopes: ['documents:read'], isWrite: false },
    { method: 'GET', path: '/signing/envelopes/:id', description: 'Retrieve a signing envelope with recipients.', scopes: ['documents:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Envelope ID', in: 'path' }] },
    { method: 'POST', path: '/signing/send', description: 'Send a document for signing.', scopes: ['signing:send'], isWrite: true, params: [{ name: 'template_id', type: 'uuid', required: true, description: 'Document template ID', in: 'body' }, { name: 'contact_id', type: 'uuid', required: false, description: 'Contact ID', in: 'body' }, { name: 'deal_id', type: 'uuid', required: false, description: 'Deal ID', in: 'body' }] },
    { method: 'POST', path: '/signing/envelopes/:id/void', description: 'Void a signing envelope to cancel all pending signatures.', scopes: ['signing:send'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Envelope ID', in: 'path' }] },
    { method: 'POST', path: '/signing/envelopes/:id/resend', description: 'Resend signing email to a specific recipient.', scopes: ['signing:send'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Envelope ID', in: 'path' }, { name: 'recipient_id', type: 'uuid', required: true, description: 'Recipient ID to resend to', in: 'body' }] },
  ],
};
