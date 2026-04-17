export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export interface NavCategory {
  label: string;
  description: string;
  items: NavItem[];
}

export const API_CATEGORIES: NavCategory[] = [
  {
    label: 'CRM Data',
    description: 'Core CRM records — contacts, deals, pipelines, and products',
    items: [
      { id: 'contacts', label: 'Contacts', icon: 'Users' },
      { id: 'customers', label: 'Customers', icon: 'Building2' },
      { id: 'deals', label: 'Deals', icon: 'Handshake' },
      { id: 'pipelines', label: 'Pipelines', icon: 'GitBranch' },
      { id: 'products', label: 'Products', icon: 'Package' },
      { id: 'supplier-catalog', label: 'Supplier Catalog', icon: 'Truck' },
      { id: 'activities', label: 'Activities', icon: 'Activity' },
      { id: 'tasks', label: 'Tasks', icon: 'CheckSquare' },
      { id: 'crm-templates', label: 'CRM Templates', icon: 'Layout' },
      { id: 'work-orders', label: 'Work Orders', icon: 'ClipboardList' },
    ],
  },
  {
    label: 'Communication',
    description: 'Email, SMS, phone calls, voice agents, and transcripts',
    items: [
      { id: 'email', label: 'Email', icon: 'Mail' },
      { id: 'email-campaigns', label: 'Email Campaigns', icon: 'Megaphone' },
      { id: 'sms', label: 'SMS', icon: 'MessageSquare' },
      { id: 'phone', label: 'Phone', icon: 'Phone' },
      { id: 'agents', label: 'Agents', icon: 'Mic' },
      { id: 'text-agents', label: 'Text Agents (deprecated path)', icon: 'Bot' },
      { id: 'transcripts', label: 'Transcripts', icon: 'FileText' },
    ],
  },
  {
    label: 'Documents & Forms',
    description: 'Document templates, e-signatures, forms, files, and notepads',
    items: [
      { id: 'document-templates', label: 'Document Templates', icon: 'FileText' },
      { id: 'documents', label: 'Documents', icon: 'File' },
      { id: 'signing', label: 'Signing', icon: 'PenTool' },
      { id: 'forms', label: 'Forms', icon: 'FormInput' },
      { id: 'files', label: 'Files', icon: 'FolderOpen' },
      { id: 'notepads', label: 'Notepads', icon: 'StickyNote' },
    ],
  },
  {
    label: 'Automation & Workflows',
    description: 'Automations, event queues, webhooks, and AI features',
    items: [
      { id: 'automations', label: 'Automations', icon: 'Zap' },
      { id: 'event-queues', label: 'Event Queues', icon: 'ListOrdered' },
      { id: 'webhooks', label: 'Webhooks', icon: 'Webhook' },
      { id: 'ai', label: 'AI', icon: 'Brain' },
      { id: 'voices', label: 'Voices', icon: 'Mic' },
    ],
  },
  {
    label: 'Lead Generation',
    description: 'Search Google Maps for business leads, save search configs, and import into CRM',
    items: [
      { id: 'lead-gen', label: 'Lead Generation', icon: 'MapPin' },
    ],
  },
  {
    label: 'Admin & Platform',
    description: 'Company settings, users, integrations, websites, and billing',
    items: [
      { id: 'company', label: 'Company', icon: 'Building' },
      { id: 'integrations', label: 'Integrations', icon: 'Plug' },
      { id: 'websites', label: 'Websites', icon: 'Globe' },
      { id: 'order-forms', label: 'Order Forms', icon: 'ShoppingCart' },
      { id: 'billing', label: 'Billing', icon: 'CreditCard' },
      { id: 'approvals', label: 'Approvals', icon: 'ShieldCheck' },
    ],
  },
];

// Flat list for backwards compat
export const API_GROUPS = API_CATEGORIES.flatMap(c => c.items);
