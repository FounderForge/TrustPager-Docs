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
    { method: 'GET', path: '/company/crm-settings', description: 'Get CRM settings (deal stages, lead sources, etc.).', scopes: ['company:read'], isWrite: false },
    { method: 'PATCH', path: '/company/crm-settings', description: 'Update CRM settings.', scopes: ['company:write'], isWrite: true },
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
  ],
};
