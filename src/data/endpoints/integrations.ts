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
    {
      method: 'POST',
      path: '/integrations/:id/query',
      description: 'Query data from an integration (read-only). Supported Xero query_types: xero_contacts (params: page?, search?), xero_contact_detail (params: contact_id), xero_accounts (params: type?), xero_tax_rates (params: status?), xero_invoices (params: page?, statuses?, date_from?, date_to?), xero_invoices_by_contact (params: contact_id, statuses?), xero_profit_and_loss (params: from_date?, to_date?, periods?, timeframe?, tracking_category_id?, tracking_option_id?, standard_layout?, payments_only?), xero_balance_sheet (params: date?, periods?, timeframe?, tracking_option_id_1?, tracking_option_id_2?, standard_layout?, payments_only?), xero_aged_receivables (params: contact_id REQUIRED, date?, from_date?, to_date?, periods?, timeframe? -- per-contact Xero report; returns Xero report structure), xero_aged_payables (params: contact_id REQUIRED, date?, from_date?, to_date?, periods?, timeframe? -- per-contact Xero report), xero_aged_receivables_summary (params: date? -- aggregated across all contacts by paging open AUTHORISED ACCREC invoices; returns {as_at, totals:{total, current, days_1_30, days_31_60, days_61_90, days_90_plus}, contacts:[{contact_id, contact_name, total_outstanding, current, days_1_30, days_31_60, days_61_90, days_90_plus, invoice_count}]} sorted desc by total_outstanding), xero_aged_payables_summary (params: date? -- same shape as receivables summary but for ACCPAY). All date params accept both snake_case (from_date, to_date) and camelCase (fromDate, toDate). Other platforms: Slack (slack_channels, slack_users), Facebook (facebook_pages, facebook_leadgen_forms, facebook_ad_accounts), Calcom (calcom_event_types, calcom_bookings), Zoom (zoom_users, zoom_meetings), Portant (portant_templates), ActiveCampaign (activecampaign_lists, activecampaign_tags, activecampaign_automations).',
      scopes: ['integrations:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Integration ID', in: 'path' },
        { name: 'query_type', type: 'string', required: true, description: 'Query type (see description for full list per platform)', in: 'body' },
        { name: 'params', type: 'object', required: false, description: 'Query-specific parameters. See description for each query_type\'s accepted params.', in: 'body' },
      ],
    },
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
