import { type ResourceGroup } from './types.js';

// =============================================================================
// INTEGRATIONS
// =============================================================================

export const INTEGRATIONS: ResourceGroup = {
  id: 'integrations',
  label: 'Integrations',
  description: 'Read, query, and execute actions on native integrations (Xero, MYOB, etc.). Connecting and disconnecting integrations is done via the platform UI (OAuth browser flows).',
  endpoints: [
    { method: 'GET', path: '/integrations', description: 'List all integrations.', scopes: ['integrations:read'], isWrite: false },
    { method: 'GET', path: '/integrations/:id', description: 'Retrieve an integration.', scopes: ['integrations:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Integration ID', in: 'path' }] },
    { method: 'POST', path: '/integrations/:id/query', description: 'Query data from an integration (e.g. list invoices from Xero).', scopes: ['integrations:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Integration ID', in: 'path' }, { name: 'query_type', type: 'string', required: true, description: 'Query type', in: 'body' }, { name: 'params', type: 'object', required: false, description: 'Query parameters', in: 'body' }] },
    {
      method: 'POST',
      path: '/integrations/:id/action',
      description: 'Execute an action on an integration (e.g. create invoice in Xero). The integration must be status "active". Xero invoice actions (xero_create_invoice, xero_update_invoice) support email_mode ("none" | "xero" | "trustpager"), email_subject, email_body, email_attach_pdf (boolean), email_recipient_source, email_recipient_contact_id, and email_recipient inside params. email_mode "trustpager" sends a branded Postmark email with PDF attached and a Xero pay-now link; requires a default email_config. email_mode "xero" uses Xero native /Email endpoint (no customisation). Default is "none". email_recipient_source controls which contact receives the email: "primary_contact" (deal primary contact, default), "xero_contact" (Xero contact EmailAddress), or "secondary_contact" (a specific CRM contact -- requires email_recipient_contact_id set to a crm_contacts.id). Merge tags supported in subject/body: {{xero.invoice_number}}, {{xero.due_date}}, {{xero.total}}, {{company.name}}, {{contact.first_name}}.',
      scopes: ['integrations:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Integration ID', in: 'path' },
        { name: 'action_type', type: 'string', required: true, description: 'Action type. Xero: xero_create_contact, xero_create_invoice, xero_update_invoice, xero_create_contact_and_invoice, xero_create_repeating_invoice.', in: 'body' },
        { name: 'params', type: 'object', required: true, description: 'Action-specific parameters. For Xero invoice actions: email_mode, email_subject, email_body, email_attach_pdf, email_recipient_source, email_recipient_contact_id, and email_recipient are optional email config fields.', in: 'body' },
        { name: 'params.email_recipient_source', type: '"primary_contact" | "xero_contact" | "secondary_contact"', required: false, description: 'Who receives the invoice email. "primary_contact" uses the deal primary contact email (default). "xero_contact" uses the EmailAddress on the Xero contact record. "secondary_contact" uses the CRM contact specified by email_recipient_contact_id. Only applies when email_mode is "trustpager" or "xero".', in: 'body' },
        { name: 'params.email_recipient_contact_id', type: 'uuid', required: false, description: 'crm_contacts.id of the secondary contact to email. Required when email_recipient_source is "secondary_contact". Only available via the opportunity-page modal or direct API calls (not the automation wizard).', in: 'body' },
      ],
    },
  ],
};
