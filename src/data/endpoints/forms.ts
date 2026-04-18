import { type ResourceGroup } from './types.js';

// =============================================================================
// FORMS
// =============================================================================

export const FORMS: ResourceGroup = {
  id: 'forms',
  label: 'Forms',
  description: 'Create form templates, manage fields, send forms to contacts, and view submissions. Fields support CRM Variable Injection - map a field to a CRM variable so submitted values are written back to the linked deal, contact, or account before automations run.',
  endpoints: [
    { method: 'GET', path: '/forms/templates', description: 'List all form templates.', scopes: ['forms:read'], isWrite: false },
    { method: 'GET', path: '/forms/templates/:id', description: 'Retrieve a form template with all fields inline.', scopes: ['forms:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'POST', path: '/forms/templates', description: 'Create a form template.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Form name', in: 'body' }, { name: 'description', type: 'string', required: false, description: 'Form description', in: 'body' }] },
    { method: 'PATCH', path: '/forms/templates/:id', description: 'Update a form template. Use settings to configure the completion screen and notification addresses.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }, { name: 'name', type: 'string', required: false, description: 'Form name', in: 'body' }, { name: 'settings', type: 'object', required: false, description: 'Template settings JSON. Completion keys: completionMessage (string), completionButtonEnabled (boolean), completionButtonText (string), completionButtonUrl (string), completionButtonNewTab (boolean, default true). Notification key: notifyEmails (string[] - email addresses to notify when this form is completed, overrides workspace default). Merge with existing settings to avoid overwriting stepCount/stepHeaders.', in: 'body' }] },
    { method: 'DELETE', path: '/forms/templates/:id', description: 'Delete a form template.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'POST', path: '/forms/templates/:id/duplicate', description: 'Duplicate a form template with all its fields.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID to duplicate', in: 'path' }] },
    { method: 'POST', path: '/forms/templates/:id/archive', description: 'Toggle archive status on a form template.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    { method: 'GET', path: '/forms/templates/:id/fields', description: 'List all fields for a form template, ordered by order_index.', scopes: ['forms:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' }] },
    {
      method: 'POST',
      path: '/forms/templates/:id/fields',
      description: 'Add a field to a form template. Use the content object to configure CRM Variable Injection.',
      scopes: ['forms:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' },
        { name: 'type', type: 'string', required: true, description: 'Field type: text, textarea, number, date, select, checkbox, radio, file', in: 'body' },
        { name: 'label', type: 'string', required: true, description: 'Field label', in: 'body' },
        { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text', in: 'body' },
        { name: 'is_required', type: 'boolean', required: false, description: 'Whether the field is required', in: 'body' },
        { name: 'order_index', type: 'number', required: false, description: 'Display order', in: 'body' },
        { name: 'step_number', type: 'number', required: false, description: 'Multi-step form step number', in: 'body' },
        { name: 'content', type: 'object', required: false, description: 'Field config JSON. For select/checkbox/radio: { options: [...] }. For CRM Variable Injection: { crm_variable: "contact.email", crm_variable_mode: "write" | "overwrite" }. Standard variables: contact.{email,phone,first_name,last_name,job_title,notes,address_line1,city,state,postal_code,country}, account.{name,email,phone,website,industry,tax_number,notes,...}, deal.{name,value,currency,notes,lead_source,opportunity_type}. Custom fields: deal.metadata.{id}, account.metadata.{id}, contact.metadata.{id}. Mode "write" only writes if the CRM field is currently empty. Mode "overwrite" always writes.', in: 'body' },
      ],
      requestExample: JSON.stringify({
        type: 'text',
        label: 'Contact Email',
        is_required: true,
        content: { crm_variable: 'contact.email', crm_variable_mode: 'write' },
      }, null, 2),
    },
    {
      method: 'PATCH',
      path: '/forms/templates/:id/fields/:fieldId',
      description: 'Update a field on a form template. Use content to update CRM Variable Injection mapping.',
      scopes: ['forms:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' },
        { name: 'fieldId', type: 'uuid', required: true, description: 'Field ID', in: 'path' },
        { name: 'label', type: 'string', required: false, description: 'Field label', in: 'body' },
        { name: 'content', type: 'object', required: false, description: 'Field config including optional crm_variable and crm_variable_mode', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/forms/templates/:id/fields/:fieldId',
      description: 'Remove a field from a form template.',
      scopes: ['forms:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' },
        { name: 'fieldId', type: 'uuid', required: true, description: 'Field ID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/forms/templates/:id/fields/reorder',
      description: 'Reorder fields within a form template by providing an ordered array of field IDs.',
      scopes: ['forms:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' },
        { name: 'field_ids', type: 'string[]', required: true, description: 'Ordered array of field UUIDs', in: 'body' },
      ],
    },
    {
      method: 'POST',
      path: '/forms/send',
      description: 'Send a form to a recipient via email. Costs 3 credits. At least one of deal_id, contact_id, or customer_id is required to link the submission to a CRM entity. CRM Variable Injection fires on submission when any linkage is set -- deal.* wirings are skipped if no deal_id is provided, but contact.* and account.* wirings fire against the submission-level contact/customer. Notification cascade: notify_emails (this call) -> template notifyEmails -> workspace form_completion_notify_emails -> sender fallback.',
      scopes: ['forms:send'],
      isWrite: true,
      params: [
        { name: 'template_id', type: 'uuid', required: true, description: 'Form template ID', in: 'body' },
        { name: 'recipient_email', type: 'string', required: true, description: 'Recipient email address', in: 'body' },
        { name: 'recipient_name', type: 'string', required: true, description: 'Recipient full name', in: 'body' },
        { name: 'deal_id', type: 'uuid', required: false, description: 'Link to an opportunity. Preferred when the form is opportunity-scoped. Enables all CRM variable wirings including deal.* fields.', in: 'body' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Link to a contact. Use for standalone client-profile forms where no opportunity exists. contact.* and account.* wirings still fire.', in: 'body' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Link to a customer (account). account.* wirings fire even without a deal_id.', in: 'body' },
        { name: 'personal_message', type: 'string', required: false, description: 'Personal message included in the email', in: 'body' },
        { name: 'expires_in_days', type: 'number', required: false, description: 'Days before the form link expires', in: 'body' },
        { name: 'notify_emails', type: 'string[]', required: false, description: 'Email addresses to notify when this form is completed. Overrides template-level notifyEmails for this specific submission. Falls back to template notifyEmails, then workspace form_completion_notify_emails, then the sending user.', in: 'body' },
      ],
    },
    {
      method: 'POST',
      path: '/forms/templates/:id/wiring',
      description: 'Bulk-update CRM variable wiring on a form template\'s fields in one atomic call. Optionally creates new workspace custom fields on company_settings before applying mappings -- useful for wiring AI-generated templates whose fields need new CRM targets. Fields not listed in mappings are untouched. Pass crm_variable: null to clear an existing wiring. Requires forms:write scope.',
      scopes: ['forms:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Form template ID', in: 'path' },
        { name: 'mappings', type: 'object[]', required: false, description: 'Array of { field_id (uuid, required), crm_variable (string or null to clear), crm_variable_mode ("write" | "overwrite", default "overwrite") }. At least one of mappings or create_custom_fields must be provided.', in: 'body' },
        { name: 'create_custom_fields', type: 'object[]', required: false, description: 'Array of { label (string), type ("text"|"textarea"|"dropdown"|"number"|"datetime"|"checkbox"), entity ("deal"|"account"|"contact"), options (string[], required for dropdown) }. New fields are persisted to company_settings.custom_fields before mappings are applied, so you can immediately wire to them.', in: 'body' },
      ],
      requestExample: JSON.stringify({
        mappings: [
          { field_id: 'uuid-field-1', crm_variable: 'contact.first_name', crm_variable_mode: 'overwrite' },
          { field_id: 'uuid-field-2', crm_variable: 'account.tax_number', crm_variable_mode: 'write' },
          { field_id: 'uuid-field-3', crm_variable: 'contact.metadata.marital_status', crm_variable_mode: 'overwrite' },
        ],
        create_custom_fields: [
          { label: 'Marital Status', type: 'dropdown', entity: 'contact', options: ['Single', 'Married', 'De facto', 'Divorced', 'Widowed'] },
        ],
      }, null, 2),
      responseExample: JSON.stringify({
        data: {
          updated_fields: [
            { id: 'uuid-field-1', label: 'First Name', type: 'text', content: { crm_variable: 'contact.first_name', crm_variable_mode: 'overwrite' } },
            { id: 'uuid-field-2', label: 'ABN', type: 'text', content: { crm_variable: 'account.tax_number', crm_variable_mode: 'write' } },
            { id: 'uuid-field-3', label: 'Marital Status', type: 'select', content: { crm_variable: 'contact.metadata.marital_status', crm_variable_mode: 'overwrite' } },
          ],
          created_custom_fields: [{ entity: 'contact', id: 'marital_status', label: 'Marital Status', type: 'dropdown', variable: 'contact.metadata.marital_status' }],
          stats: { fields_updated: 3, custom_fields_created: 1 },
        },
        meta: { credits_remaining: 9490 },
      }, null, 2),
    },
    { method: 'GET', path: '/forms/folders', description: 'List form template folders.', scopes: ['forms:read'], isWrite: false },
    { method: 'POST', path: '/forms/folders', description: 'Create a form template folder. name is required.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Folder name', in: 'body' }] },
    { method: 'PATCH', path: '/forms/folders/:id', description: 'Update a form template folder.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Folder ID', in: 'path' }] },
    { method: 'DELETE', path: '/forms/folders/:id', description: 'Delete a form template folder.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Folder ID', in: 'path' }] },
    { method: 'GET', path: '/forms/prefills', description: 'List form prefills. Filter by template_id or deal_id.', scopes: ['forms:read'], isWrite: false, params: [{ name: 'template_id', type: 'uuid', required: false, description: 'Filter by template', in: 'query' }, { name: 'deal_id', type: 'uuid', required: false, description: 'Filter by deal', in: 'query' }] },
    { method: 'POST', path: '/forms/prefills', description: 'Create a form prefill. template_id is required.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'template_id', type: 'uuid', required: true, description: 'Form template ID', in: 'body' }, { name: 'deal_id', type: 'uuid', required: false, description: 'Deal ID', in: 'body' }, { name: 'status', type: 'string', required: false, description: 'Prefill status', in: 'body' }, { name: 'additional_context', type: 'string', required: false, description: 'Additional context for AI prefilling', in: 'body' }] },
    { method: 'GET', path: '/forms/prefills/:id', description: 'Retrieve a form prefill with its values.', scopes: ['forms:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Prefill ID', in: 'path' }] },
    { method: 'POST', path: '/forms/prefills/:id/values', description: 'Upsert prefill values for form fields.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Prefill ID', in: 'path' }, { name: 'values', type: 'object[]', required: true, description: 'Array of { field_id, value, confidence?, reasoning? }', in: 'body' }] },
    { method: 'GET', path: '/forms/submissions', description: 'List form submissions. Filter by template_id, deal_id, contact_id, customer_id, or status.', scopes: ['forms:read'], isWrite: false },
    { method: 'GET', path: '/forms/submissions/:id', description: 'Retrieve a form submission with all response data.', scopes: ['forms:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Submission ID', in: 'path' }] },
    { method: 'POST', path: '/forms/submissions/:id/resend', description: 'Resend a form submission email to the original recipient.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Submission ID', in: 'path' }] },
    { method: 'POST', path: '/forms/submissions/:id/void', description: 'Void (expire) a form submission to prevent further responses.', scopes: ['forms:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Submission ID', in: 'path' }] },
  ],
};
