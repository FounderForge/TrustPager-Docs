export interface ScopeDefinition {
  key: string;
  label: string;
}

export interface ScopeGroup {
  label: string;
  description: string;
  admin: boolean;
  scopes: ScopeDefinition[];
}

export const SCOPE_GROUPS: ScopeGroup[] = [
  {
    label: 'CRM Data',
    description: 'Safe for most users -- read and manage core CRM records',
    admin: false,
    scopes: [
      { key: 'contacts:read', label: 'Contacts (Read)' },
      { key: 'contacts:write', label: 'Contacts (Write)' },
      { key: 'customers:read', label: 'Customers (Read)' },
      { key: 'customers:write', label: 'Customers (Write)' },
      { key: 'deals:read', label: 'Deals (Read)' },
      { key: 'deals:write', label: 'Deals (Write)' },
      { key: 'pipelines:read', label: 'Pipelines (Read)' },
      { key: 'pipelines:write', label: 'Pipelines (Write)' },
      { key: 'products:read', label: 'Products (Read)' },
      { key: 'products:write', label: 'Products (Write)' },
      { key: 'tasks:read', label: 'Tasks (Read)' },
      { key: 'tasks:write', label: 'Tasks (Write)' },
      { key: 'activities:read', label: 'Activities (Read)' },
      { key: 'activities:write', label: 'Activities (Write)' },
      { key: 'crm-templates:read', label: 'CRM Templates (Read)' },
      { key: 'crm-templates:write', label: 'CRM Templates (Write)' },
      { key: 'work-orders:read', label: 'Work Orders (Read)' },
      { key: 'work-orders:write', label: 'Work Orders (Write)' },
    ],
  },
  {
    label: 'Communication',
    description: 'Can send emails, SMS, and initiate calls on behalf of the company',
    admin: false,
    scopes: [
      { key: 'email:read', label: 'Email (Read)' },
      { key: 'email:send', label: 'Email (Send)' },
      { key: 'email-campaigns:read', label: 'Email Campaigns (Read)' },
      { key: 'email-campaigns:write', label: 'Email Campaigns (Write)' },
      { key: 'email-campaigns:delete', label: 'Email Campaigns (Delete)' },
      { key: 'sms:read', label: 'SMS (Read)' },
      { key: 'sms:send', label: 'SMS (Send)' },
      { key: 'calls:read', label: 'Calls & Transcripts (Read)' },
      { key: 'calls:initiate', label: 'Calls (Initiate)' },
      { key: 'voice-agents:read', label: 'Voice/Text Agents (Read)' },
    ],
  },
  {
    label: 'Documents & Forms',
    description: 'Create, send, and manage documents, forms, and e-signatures',
    admin: false,
    scopes: [
      { key: 'documents:read', label: 'Documents (Read)' },
      { key: 'documents:write', label: 'Documents (Write)' },
      { key: 'notepads:read', label: 'Notepads (Read)' },
      { key: 'notepads:write', label: 'Notepads (Write)' },
      { key: 'forms:read', label: 'Forms (Read)' },
      { key: 'forms:write', label: 'Forms (Write)' },
      { key: 'forms:send', label: 'Forms (Send)' },
      { key: 'signing:send', label: 'Signing (Send)' },
      { key: 'files:read', label: 'Files (Read)' },
      { key: 'files:write', label: 'Files (Write)' },
    ],
  },
  {
    label: 'Automation & Workflows',
    description: 'Manage and trigger automations, webhooks, and AI features',
    admin: false,
    scopes: [
      { key: 'automations:read', label: 'Automations (Read)' },
      { key: 'automations:write', label: 'Automations (Write)' },
      { key: 'automations:trigger', label: 'Automations (Trigger)' },
      { key: 'webhooks:read', label: 'Webhooks (Read)' },
      { key: 'webhooks:write', label: 'Webhooks (Write)' },
      { key: 'ai:use', label: 'AI Features' },
      { key: 'voices:read', label: 'Voices (Read)' },
      { key: 'voices:write', label: 'Voices (Write)' },
      { key: 'voices:delete', label: 'Voices (Delete)' },
    ],
  },
  {
    label: 'Admin Only',
    description: 'Company settings, billing, users, and infrastructure -- restrict to admins',
    admin: true,
    scopes: [
      { key: 'company:read', label: 'Company Settings (Read)' },
      { key: 'company:write', label: 'Company Settings (Write)' },
      { key: 'users:read', label: 'Users (Read)' },
      { key: 'users:write', label: 'Users (Write)' },
      { key: 'billing:read', label: 'Billing (Read)' },
      { key: 'integrations:read', label: 'Integrations (Read)' },
      { key: 'integrations:write', label: 'Integrations (Write)' },
      { key: 'websites:read', label: 'Websites (Read)' },
      { key: 'websites:write', label: 'Websites (Write)' },
      { key: 'phone:read', label: 'Phone Numbers (Read)' },
      { key: 'phone:write', label: 'Phone Numbers (Write)' },
      { key: 'email-config:write', label: 'Email Config (Write)' },
      { key: 'voice-agents:write', label: 'Voice/Text Agents (Write)' },
    ],
  },
];

export const ALL_SCOPES = SCOPE_GROUPS.flatMap(g => g.scopes.map(s => s.key));
