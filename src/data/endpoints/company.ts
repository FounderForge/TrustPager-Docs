import { type ResourceGroup } from './types.js';

// =============================================================================
// COMPANY
// =============================================================================

export const COMPANY: ResourceGroup = {
  id: 'company',
  label: 'Company',
  description: 'View and manage company settings, users, and CRM configuration.',
  endpoints: [
    { method: 'GET', path: '/company', description: 'Retrieve company details including slug for public-facing URLs.', scopes: ['company:read'], isWrite: false },
    { method: 'PATCH', path: '/company', description: 'Update company settings. Writable fields include: name, slug, description, contact_name, contact_email, phone, logo_url, primary_color, secondary_color, address, timezone, industry, website_url, abn, email_handle.', scopes: ['company:write'], isWrite: true, params: [{ name: 'slug', type: 'string', required: false, description: 'URL-friendly slug for public pages (forms, signing, bookings). Auto-generated from name on company creation.', in: 'body' }] },
    { method: 'GET', path: '/company/users', description: 'List all users in the company.', scopes: ['users:read'], isWrite: false },
    { method: 'GET', path: '/company/users/:userId', description: 'Get details for a specific user in the company.', scopes: ['users:read'], isWrite: false, params: [{ name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' }] },
    { method: 'POST', path: '/company/users/invite', description: 'Invite a user to the company.', scopes: ['users:write'], isWrite: true, params: [{ name: 'email', type: 'string', required: true, description: 'Email to invite', in: 'body' }, { name: 'role', type: 'string', required: false, description: 'User role', in: 'body' }] },
    { method: 'PATCH', path: '/company/users/:userId/role', description: 'Update a user role.', scopes: ['users:write'], isWrite: true, params: [{ name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' }, { name: 'role', type: 'string', required: true, description: 'New role', in: 'body' }] },
    { method: 'DELETE', path: '/company/users/:userId', description: 'Remove a user from the company.', scopes: ['users:write'], isWrite: true, params: [{ name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' }] },
    { method: 'GET', path: '/company/crm-settings', description: 'Get CRM settings including custom field definitions, lead sources, lost/won reasons, type option lists (opportunity, account, contact), transcript settings, feature toggles (accounts_enabled, contacts_enabled, enable_work_orders), and form_completion_notify_emails. All fields are stored in the company_settings table.', scopes: ['company:read'], isWrite: false },
    { method: 'PATCH', path: '/company/crm-settings', description: 'Partial update of CRM settings. Only include fields you want to change; unspecified fields are left unchanged. All fields are stored in company_settings (NOT companies.crm_settings which no longer exists).', scopes: ['company:write'], isWrite: true, params: [
      { name: 'opportunity_type_options', type: 'string[]', required: false, description: 'Opportunity type dropdown options (e.g. ["New Business", "Upsell", "Renewal", "Referral"])', in: 'body' },
      { name: 'account_type_options', type: 'string[]', required: false, description: 'Account/company type dropdown options (e.g. ["Client", "Supplier", "Partner", "Referrer"])', in: 'body' },
      { name: 'contact_type_options', type: 'string[]', required: false, description: 'Contact type dropdown options (e.g. ["Decision Maker", "Influencer", "Champion"])', in: 'body' },
      { name: 'transcript_types', type: 'string[]', required: false, description: 'Transcript type categories (e.g. ["Sales", "Fulfilment", "Support"])', in: 'body' },
      { name: 'transcript_sources', type: 'string[]', required: false, description: 'Transcript source options (e.g. ["Zoom", "Loom", "Manual"])', in: 'body' },
      { name: 'custom_fields_title', type: 'string', required: false, description: 'Custom label for the "Additional Information" section on detail pages', in: 'body' },
      { name: 'accounts_enabled', type: 'boolean', required: false, description: 'Enable/disable the Accounts feature', in: 'body' },
      { name: 'contacts_enabled', type: 'boolean', required: false, description: 'Enable/disable the Contacts feature', in: 'body' },
      { name: 'enable_work_orders', type: 'boolean', required: false, description: 'Enable/disable Work Orders on deals', in: 'body' },
      { name: 'lead_sources', type: 'string[]', required: false, description: 'Available lead source options for deals', in: 'body' },
      { name: 'lost_reasons', type: 'string[]', required: false, description: 'Available reasons when marking a deal lost', in: 'body' },
      { name: 'won_reasons', type: 'string[]', required: false, description: 'Available reasons when marking a deal won', in: 'body' },
      { name: 'form_completion_notify_emails', type: 'string[]', required: false, description: 'Workspace-wide default email addresses notified when any form is completed. Falls back to the sending user if empty.', in: 'body' },
      { name: 'custom_fields', type: 'object', required: false, description: 'Custom field definitions keyed by entity: { deal: [...], account: [...], contact: [...] }', in: 'body' },
    ] },
    {
      method: 'GET',
      path: '/company/birthday-messages',
      description: 'Get the birthday message configuration -- array of templates used by the birthday cron to send automated birthday emails and SMS to contacts.',
      scopes: ['company:read'],
      isWrite: false,
      responseExample: `{
  "data": [
    {
      "label": "Year 1",
      "channels": ["email", "sms"],
      "email_subject": "Happy Birthday {first_name}!",
      "email_body": "Hi {first_name}, wishing you a wonderful birthday from {company_name}!",
      "sms_body": "Happy Birthday {first_name}! From {company_name}."
    },
    {
      "label": "Year 2",
      "channels": ["email"],
      "email_subject": "Another year, {first_name}!",
      "email_body": "Happy Birthday {first_name}! Hope year {age} treats you well.",
      "sms_body": ""
    }
  ],
  "meta": { "credits_remaining": 9490 }
}`,
    },
    {
      method: 'PUT',
      path: '/company/birthday-messages',
      description: 'Replace the entire birthday messages array. Send an array of message objects -- one per year of relationship. The cron picks the entry matching the contact\'s year count (Year 1 on first birthday, etc.). Supported merge tags: {first_name}, {last_name}, {company_name}, {age}.',
      scopes: ['company:write'],
      isWrite: true,
      params: [
        { name: '(body)', type: 'object[]', required: true, description: 'Array of birthday message objects. Each must have: channels (array of "email" and/or "sms"), email_subject (string), email_body (string), sms_body (string). Optional: label (string).', in: 'body' },
      ],
      requestExample: `curl -X PUT \\
  "${'' /* API_BASE_URL */}/company/birthday-messages" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '[
    {
      "label": "Year 1",
      "channels": ["email", "sms"],
      "email_subject": "Happy Birthday {first_name}!",
      "email_body": "Hi {first_name}, best wishes from {company_name}!",
      "sms_body": "Happy Birthday {first_name}! From {company_name}."
    }
  ]'`,
      responseExample: `{
  "data": [
    {
      "label": "Year 1",
      "channels": ["email", "sms"],
      "email_subject": "Happy Birthday {first_name}!",
      "email_body": "Hi {first_name}, best wishes from {company_name}!",
      "sms_body": "Happy Birthday {first_name}! From {company_name}."
    }
  ],
  "meta": { "credits_remaining": 9489 }
}`,
    },
    {
      method: 'GET',
      path: '/company/settings/tag-palette',
      description: 'Get the company-wide tag palette -- the list of pre-defined tags shown as quick-picks in the Add Tag modal on opportunity cards. Returns an array of {name, color} objects stored in company_settings.deal_tag_options.',
      scopes: ['company:read'],
      isWrite: false,
      responseExample: `{
  "data": [
    { "name": "Hot Lead", "color": "#ef4444" },
    { "name": "Priority", "color": "#f97316" },
    { "name": "Follow Up", "color": "#3b82f6" }
  ],
  "meta": { "credits_remaining": 9490, "url": "https://app.trustpager.com/settings/crm" }
}`,
    },
    {
      method: 'PATCH',
      path: '/company/settings/tag-palette',
      description: 'Replace the company-wide tag palette. Accepts an array of {name, color} objects directly (or wrapped in a "tags" key). Duplicates with the same name (case-insensitive) are deduplicated -- last entry wins. Replaces the entire palette.',
      scopes: ['company:write'],
      isWrite: true,
      params: [
        { name: '(body)', type: 'object[] | { tags: object[] }', required: true, description: 'Array of tag objects. Each tag needs name (string) and color (hex string, e.g. "#ef4444").', in: 'body' },
      ],
      requestExample: `curl -X PATCH \\
  "\${API_BASE_URL}/company/settings/tag-palette" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '[
    { "name": "Hot Lead", "color": "#ef4444" },
    { "name": "Priority", "color": "#f97316" },
    { "name": "Follow Up", "color": "#3b82f6" }
  ]'`,
      responseExample: `{
  "data": [
    { "name": "Hot Lead", "color": "#ef4444" },
    { "name": "Priority", "color": "#f97316" },
    { "name": "Follow Up", "color": "#3b82f6" }
  ],
  "meta": { "credits_remaining": 9489, "url": "https://app.trustpager.com/settings/crm" }
}`,
    },
  ],
};
