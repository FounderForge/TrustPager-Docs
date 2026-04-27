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
    { method: 'PATCH', path: '/company', description: 'Update company settings. Writable fields include: name, slug, description, contact_name, contact_email, phone, logo_url, primary_color, secondary_color, address, timezone, industry, website_url, abn. (The workspace from-address — formerly exposed as email_handle — is now managed via the email_config endpoints.)', scopes: ['company:write'], isWrite: true, params: [{ name: 'slug', type: 'string', required: false, description: 'URL-friendly slug for public pages (forms, signing, bookings). Auto-generated from name on company creation.', in: 'body' }] },
    {
      method: 'GET', path: '/company/users',
      description: 'List all team members. Returns membership role, status, and workspace-enriched profile fields (full_name, email, phone, job_title, department). Workspace-scoped fields from company_user_settings take priority over global user profile values.',
      scopes: ['users:read'], isWrite: false,
    },
    {
      method: 'GET', path: '/company/users/:userId',
      description: 'Get a single team member with workspace-enriched profile. Returns membership role, status, and profile fields overlaid with any workspace-scoped overrides from company_user_settings.',
      scopes: ['users:read'], isWrite: false,
      params: [{ name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' }],
    },
    {
      method: 'POST', path: '/company/users/invite',
      description: 'Invite a user to the company. They receive an invitation email.',
      scopes: ['users:write'], isWrite: true,
      params: [
        { name: 'email', type: 'string', required: true, description: 'Email to invite', in: 'body' },
        { name: 'role', type: 'string', required: true, description: 'Role: client_admin, client_editor, or client_viewer', in: 'body' },
        { name: 'full_name', type: 'string', required: false, description: 'Full name of the invitee', in: 'body' },
      ],
    },
    {
      method: 'GET', path: '/company/users/:userId/personal-user-profile',
      description: 'Get the global (platform-wide) identity record for a team member from the users table -- full_name, email, phone, avatar_url, status, job_title, department, created_at. Returns 404 if the user is not a member of this workspace.',
      scopes: ['users:read'], isWrite: false,
      params: [{ name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' }],
    },
    {
      method: 'GET', path: '/company/users/:userId/workspace-user-profile',
      description: 'Get workspace-scoped contact info for a team member from company_user_settings -- phone, job_title, department. Returns null values if not set. These fields take priority over the global profile when displayed in the platform.',
      scopes: ['users:read'], isWrite: false,
      params: [{ name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' }],
    },
    {
      method: 'PATCH', path: '/company/users/:userId/workspace-user-profile',
      description: 'Set workspace-scoped contact info for a team member. Accepts phone, job_title, department. Values are stored in company_user_settings and take priority over the global user profile within this workspace.',
      scopes: ['users:write'], isWrite: true,
      params: [
        { name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' },
        { name: 'phone', type: 'string', required: false, description: 'Workspace phone number override', in: 'body' },
        { name: 'job_title', type: 'string', required: false, description: 'Workspace job title override', in: 'body' },
        { name: 'department', type: 'string', required: false, description: 'Workspace department override', in: 'body' },
      ],
    },
    {
      method: 'GET', path: '/company/users/:userId/workspace-user-connections',
      description: 'Get the integrations a team member has shared with this workspace -- Gmail, calendar sync, etc. Returns an array of connection objects with platform_type, platform_account_name, status, calendar_synced, and gmail_aliases.',
      scopes: ['users:read'], isWrite: false,
      params: [{ name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' }],
    },
    {
      method: 'GET', path: '/company/users/:userId/workspace-user-roles',
      description: 'Get the company role and join date for a team member. Returns role (client_admin, client_editor, or client_viewer) and created_at.',
      scopes: ['users:read'], isWrite: false,
      params: [{ name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' }],
    },
    {
      method: 'PATCH', path: '/company/users/:userId/workspace-user-roles',
      description: 'Change a team member\'s workspace role. Valid values: client_admin (full access), client_editor (edit access), client_viewer (read-only).',
      scopes: ['users:write'], isWrite: true,
      params: [
        { name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' },
        { name: 'role', type: 'string', required: true, description: 'New role: client_admin, client_editor, or client_viewer', in: 'body' },
      ],
    },
    {
      method: 'GET', path: '/company/users/:userId/workspace-user-preferences',
      description: 'Get workspace-level preferences for a team member. Currently returns default_pipeline_id (the pipeline shown by default when they open the CRM). Returns null if not set.',
      scopes: ['users:read'], isWrite: false,
      params: [{ name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' }],
    },
    {
      method: 'PATCH', path: '/company/users/:userId/workspace-user-preferences',
      description: 'Set workspace-level preferences for a team member. Accepted field: default_pipeline_id (UUID of the pipeline to show by default, or null to clear).',
      scopes: ['users:write'], isWrite: true,
      params: [
        { name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' },
        { name: 'default_pipeline_id', type: 'uuid | null', required: false, description: 'Pipeline to show by default in this workspace, or null to clear', in: 'body' },
      ],
    },
    {
      method: 'DELETE', path: '/company/users/:userId',
      description: 'Remove a user from the company -- revoke their access permanently.',
      scopes: ['users:delete'], isWrite: true,
      params: [{ name: 'userId', type: 'uuid', required: true, description: 'User ID', in: 'path' }],
    },
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
      { name: 'custom_fields', type: 'object', required: false, description: 'Custom field definitions keyed by entity: { deal: [...], account: [...], contact: [...] }. Each field: { id, label, type, options?, show_on_detail, show_in_table, required?, fill_with_ai?, hidden? }. Supported types: text, textarea, number, datetime, checkbox, dropdown (requires options[]), url (renders as clickable link with open-in-new-tab icon -- use for Drive folders, portal links, signed agreement URLs).', in: 'body' },
      { name: 'needs_analysis_config', type: 'object', required: false, description: 'Discovery/needs-analysis question definitions shown during deal qualification. Structure: { questions: [{ key, label, type, show_on_detail, show_in_table, ai_fill }] }. Pass { questions: [] } to clear all questions. Configurable in Settings > CRM > Needs Analysis.', in: 'body' },
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
