import { type ResourceGroup } from './types.js';

// =============================================================================
// SIGNING
// =============================================================================

export const SIGNING: ResourceGroup = {
  id: 'signing',
  label: 'Signing',
  description: 'Manage e-signature envelopes. Send documents for signing and track completion status.',
  endpoints: [
    { method: 'GET', path: '/signing/envelopes', description: 'List signing envelopes. Response includes slug for human-readable URLs.', scopes: ['documents:read'], isWrite: false },
    {
      method: 'GET',
      path: '/signing/envelopes/:id',
      description: 'Retrieve a signing envelope with recipients. Each recipient includes input_values (object keyed by signer-input section ID) which is populated once the signer submits their values at signing time. Empty object until signed.',
      scopes: ['documents:read'],
      isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Envelope ID', in: 'path' }],
    },
    {
      method: 'POST',
      path: '/signing/send',
      description: 'Send a document for signing. Renders the document template sections server-side into a PDF, creates a signing envelope, and emails all signers. If the template contains signer-input sections, signers will see a fillable form panel below the PDF and their typed values are stored on the recipient as input_values after signing. A slug is auto-generated from the document title.',
      scopes: ['signing:send'],
      isWrite: true,
      params: [
        { name: 'template_id', type: 'uuid', required: true, description: 'Document template ID', in: 'body' },
        { name: 'deal_id', type: 'uuid', required: false, description: 'Deal ID -- links deal data for variable resolution and dynamic sections', in: 'body' },
        { name: 'signers', type: 'array', required: true, description: 'Array of signers with name (required), email (required), role (optional), order_index (optional)', in: 'body' },
        { name: 'personal_message', type: 'string', required: false, description: 'Personal message included in the signing email', in: 'body' },
      ],
    },
    { method: 'POST', path: '/signing/envelopes/:id/void', description: 'Void a signing envelope to cancel all pending signatures.', scopes: ['signing:send'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Envelope ID', in: 'path' }] },
    { method: 'POST', path: '/signing/envelopes/:id/resend', description: 'Resend signing email to a specific recipient.', scopes: ['signing:send'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Envelope ID', in: 'path' }, { name: 'recipient_id', type: 'uuid', required: true, description: 'Recipient ID to resend to', in: 'body' }] },
  ],
};
