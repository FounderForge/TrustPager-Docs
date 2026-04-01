export { type EndpointParam, type Endpoint, type ResourceGroup, API_BASE_URL } from './types.js';
export { SEARCH } from './search.js';
export { CONTACTS } from './contacts.js';
export { CUSTOMERS } from './customers.js';
export { DEALS } from './deals.js';
export { AUTOMATIONS } from './automations.js';
export { EMAIL } from './email.js';
export { PIPELINES } from './pipelines.js';
export { PRODUCTS } from './products.js';
export { SUPPLIER_PRODUCTS } from './supplier-products.js';
export { ACTIVITIES } from './activities.js';
export { TASKS } from './tasks.js';
export { WORK_ORDERS } from './work-orders.js';
export { EVENT_QUEUES } from './event-queues.js';
export { SMS } from './sms.js';
export { PHONE } from './phone.js';
export { VOICE_AGENTS } from './voice-agents.js';
export { TEXT_AGENTS } from './text-agents.js';
export { TRANSCRIPTS } from './transcripts.js';
export { DOCUMENT_TEMPLATES } from './document-templates.js';
export { DOCUMENTS } from './documents.js';
export { SIGNING } from './signing.js';
export { FORMS } from './forms.js';
export { WEBSITES } from './websites.js';
export { ORDER_FORMS } from './order-forms.js';
export { FILES } from './files.js';
export { NOTEPADS } from './notepads.js';
export { COMPANY } from './company.js';
export { CRM_TEMPLATES } from './crm-templates.js';
export { INTEGRATIONS } from './integrations.js';
export { WEBHOOKS } from './webhooks.js';
export { AI } from './ai.js';
export { BILLING } from './billing.js';
export { SCHEDULED_EVENT_TYPES } from './scheduled-event-types.js';
export { SCHEDULING_AVAILABILITY } from './scheduling-availability.js';
export { SCHEDULING_BOOKINGS } from './scheduling-bookings.js';
export { SERVICE_REQUESTS } from './service-requests.js';
export { APPROVALS } from './approvals.js';
export { AI_INSTRUCTIONS } from './ai-instructions.js';
export { VOICES } from './voices.js';
export { KNOWLEDGE } from './knowledge.js';

import { type ResourceGroup } from './types.js';
import { SEARCH } from './search.js';
import { CONTACTS } from './contacts.js';
import { CUSTOMERS } from './customers.js';
import { DEALS } from './deals.js';
import { AUTOMATIONS } from './automations.js';
import { EMAIL } from './email.js';
import { PIPELINES } from './pipelines.js';
import { PRODUCTS } from './products.js';
import { SUPPLIER_PRODUCTS } from './supplier-products.js';
import { ACTIVITIES } from './activities.js';
import { TASKS } from './tasks.js';
import { WORK_ORDERS } from './work-orders.js';
import { EVENT_QUEUES } from './event-queues.js';
import { SMS } from './sms.js';
import { PHONE } from './phone.js';
import { VOICE_AGENTS } from './voice-agents.js';
import { TEXT_AGENTS } from './text-agents.js';
import { TRANSCRIPTS } from './transcripts.js';
import { DOCUMENT_TEMPLATES } from './document-templates.js';
import { DOCUMENTS } from './documents.js';
import { SIGNING } from './signing.js';
import { FORMS } from './forms.js';
import { WEBSITES } from './websites.js';
import { ORDER_FORMS } from './order-forms.js';
import { FILES } from './files.js';
import { NOTEPADS } from './notepads.js';
import { COMPANY } from './company.js';
import { CRM_TEMPLATES } from './crm-templates.js';
import { INTEGRATIONS } from './integrations.js';
import { WEBHOOKS } from './webhooks.js';
import { AI } from './ai.js';
import { BILLING } from './billing.js';
import { SCHEDULED_EVENT_TYPES } from './scheduled-event-types.js';
import { SCHEDULING_AVAILABILITY } from './scheduling-availability.js';
import { SCHEDULING_BOOKINGS } from './scheduling-bookings.js';
import { SERVICE_REQUESTS } from './service-requests.js';
import { APPROVALS } from './approvals.js';
import { AI_INSTRUCTIONS } from './ai-instructions.js';
import { VOICES } from './voices.js';
import { KNOWLEDGE } from './knowledge.js';

export const RESOURCES: ResourceGroup[] = [
  SEARCH,
  CONTACTS,
  CUSTOMERS,
  DEALS,
  PIPELINES,
  PRODUCTS,
  SUPPLIER_PRODUCTS,
  ACTIVITIES,
  TASKS,
  WORK_ORDERS,
  AUTOMATIONS,
  EVENT_QUEUES,
  SCHEDULED_EVENT_TYPES,
  SCHEDULING_AVAILABILITY,
  SCHEDULING_BOOKINGS,
  EMAIL,
  SMS,
  PHONE,
  VOICE_AGENTS,
  TEXT_AGENTS,
  TRANSCRIPTS,
  DOCUMENT_TEMPLATES,
  DOCUMENTS,
  SIGNING,
  FORMS,
  WEBSITES,
  ORDER_FORMS,
  FILES,
  NOTEPADS,
  KNOWLEDGE,
  COMPANY,
  CRM_TEMPLATES,
  INTEGRATIONS,
  WEBHOOKS,
  AI,
  BILLING,
  SERVICE_REQUESTS,
  APPROVALS,
  AI_INSTRUCTIONS,
  VOICES,
];

/** Look up a resource group by its id (URL slug) */
export function getResourceById(id: string): ResourceGroup | undefined {
  return RESOURCES.find(r => r.id === id);
}
