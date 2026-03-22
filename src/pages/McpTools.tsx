import { Helmet } from 'react-helmet-async';
import { RESOURCES } from '@/data/endpoints';

const TOOL_CATEGORIES = [
  {
    label: 'Contacts',
    tools: [
      'search_contacts', 'list_contacts', 'get_contact', 'create_contact', 'update_contact', 'delete_contact',
      'get_contact_deals', 'get_contact_activities', 'get_contact_employers',
      'link_contact_to_customer', 'unlink_contact_from_customer',
    ],
  },
  {
    label: 'Customers',
    tools: [
      'search_customers', 'list_customers', 'get_customer', 'create_customer', 'update_customer', 'delete_customer',
      'get_customer_contacts', 'get_customer_deals', 'get_customer_activities',
    ],
  },
  {
    label: 'Deals',
    tools: [
      'search_deals', 'list_deals', 'get_deal', 'create_deal', 'update_deal', 'delete_deal', 'move_deal',
      'add_deal_product', 'update_deal_product', 'remove_deal_product', 'get_deal_products', 'reorder_deal_products',
      'list_deal_product_costs', 'create_deal_product_cost', 'update_deal_product_cost', 'delete_deal_product_cost',
      'add_deal_contact', 'remove_deal_contact', 'list_deal_contacts',
      'assign_deal_user', 'unassign_deal_user', 'list_deal_users',
      'get_deal_activities', 'get_deal_tasks', 'get_deal_work_orders',
    ],
  },
  {
    label: 'Pipelines',
    tools: [
      'list_pipelines', 'get_pipeline', 'create_pipeline', 'update_pipeline', 'delete_pipeline',
      'list_pipeline_stages', 'create_pipeline_stage', 'update_pipeline_stage', 'delete_pipeline_stage', 'reorder_pipeline_stages',
      'get_pipeline_deals', 'get_pipeline_summary',
    ],
  },
  {
    label: 'Products',
    tools: [
      'list_products', 'get_product', 'create_product', 'update_product', 'delete_product',
      'list_product_costs', 'create_product_cost', 'update_product_cost', 'delete_product_cost',
    ],
  },
  {
    label: 'Supplier Products',
    tools: [
      'list_supplier_products', 'get_supplier_product', 'create_supplier_product', 'update_supplier_product', 'delete_supplier_product',
    ],
  },
  {
    label: 'Tasks',
    tools: [
      'list_tasks', 'get_task', 'create_task', 'update_task', 'delete_task', 'complete_task', 'reorder_tasks',
      'list_task_categories', 'create_task_category', 'update_task_category', 'delete_task_category',
    ],
  },
  {
    label: 'Work Orders',
    tools: [
      'list_work_orders', 'get_work_order', 'create_work_order', 'update_work_order', 'delete_work_order',
    ],
  },
  {
    label: 'Activities',
    tools: [
      'list_activities', 'get_activity', 'delete_activity', 'add_note', 'log_call', 'log_meeting',
    ],
  },
  {
    label: 'Automations',
    tools: [
      'list_automations', 'get_automation', 'create_automation', 'update_automation', 'delete_automation',
      'enable_automation', 'disable_automation', 'trigger_automation',
      'list_automation_triggers', 'add_automation_trigger', 'update_automation_trigger', 'delete_automation_trigger',
      'list_automation_actions', 'add_automation_action', 'update_automation_action', 'delete_automation_action', 'reorder_automation_actions',
      'list_automation_runs', 'get_automation_run',
    ],
  },
  {
    label: 'Communication',
    tools: [
      'send_email', 'reply_to_email', 'list_email_threads', 'get_email_thread', 'list_email_logs',
      'list_email_configs', 'get_email_config', 'create_email_config', 'update_email_config', 'delete_email_config',
      'send_sms', 'list_sms_conversations', 'get_sms_conversation', 'get_sms_messages',
      'initiate_voice_call', 'list_phone_call_logs',
      'list_phone_numbers', 'search_phone_numbers', 'buy_phone_number', 'release_phone_number',
      'list_voice_agents', 'get_voice_agent', 'create_voice_agent', 'update_voice_agent', 'delete_voice_agent', 'sync_voice_agent',
      'list_voice_agent_calls',
      'list_voice_agent_website_configs', 'create_voice_agent_website_config', 'update_voice_agent_website_config', 'delete_voice_agent_website_config',
      'list_voice_agent_outbound_configs', 'create_voice_agent_outbound_config', 'update_voice_agent_outbound_config', 'delete_voice_agent_outbound_config',
      'get_phone_number', 'update_phone_number',
      'list_phone_addresses', 'create_phone_address',
      'list_phone_bundles', 'create_phone_bundle', 'submit_phone_bundle',
      'resend_signing_email',
    ],
  },
  {
    label: 'Document Templates',
    tools: [
      'list_document_templates', 'get_document_template', 'create_document_template', 'update_document_template', 'delete_document_template', 'duplicate_document_template',
      'list_document_sections', 'add_document_section', 'update_document_section', 'delete_document_section', 'reorder_document_sections',
      'send_for_signing', 'list_signing_envelopes', 'get_signing_envelope', 'void_signing_envelope',
    ],
  },
  {
    label: 'CRM Documents',
    tools: [
      'list_documents', 'get_document', 'create_document', 'delete_document', 'download_document', 'list_document_folders',
    ],
  },
  {
    label: 'Forms',
    tools: [
      'list_form_templates', 'get_form_template', 'create_form_template', 'update_form_template', 'delete_form_template',
      'duplicate_form_template', 'archive_form_template',
      'list_form_fields', 'add_form_field', 'update_form_field', 'delete_form_field', 'reorder_form_fields',
      'send_form', 'list_form_submissions', 'get_form_submission', 'resend_form_submission', 'void_form_submission',
      'list_form_folders', 'create_form_folder', 'update_form_folder', 'delete_form_folder',
      'list_form_prefills', 'create_form_prefill', 'get_form_prefill', 'upsert_form_prefill_values',
    ],
  },
  {
    label: 'CRM Templates',
    tools: [
      'list_crm_templates', 'get_crm_template', 'create_crm_template', 'update_crm_template', 'delete_crm_template',
    ],
  },
  {
    label: 'Files',
    tools: [
      'list_files', 'get_file', 'delete_file', 'download_file', 'list_file_folders', 'create_file_folder',
    ],
  },
  {
    label: 'Secure Files',
    tools: [
      'list_secure_files', 'get_secure_file', 'delete_secure_file', 'download_secure_file',
      'list_secure_file_folders', 'create_secure_file_folder',
    ],
  },
  {
    label: 'Notepads',
    tools: [
      'list_notepads', 'get_notepad', 'create_notepad', 'update_notepad', 'delete_notepad',
      'list_notepad_folders', 'create_notepad_folder',
    ],
  },
  {
    label: 'Text Agents',
    tools: [
      'list_text_agents', 'create_text_agent', 'update_text_agent', 'delete_text_agent',
      'list_text_agent_responses',
    ],
  },
  {
    label: 'Webhooks',
    tools: [
      'list_outgoing_webhooks', 'get_outgoing_webhook', 'create_outgoing_webhook', 'update_outgoing_webhook', 'delete_outgoing_webhook',
      'get_outgoing_webhook_logs', 'test_outgoing_webhook',
      'list_incoming_webhooks', 'get_incoming_webhook', 'create_incoming_webhook', 'update_incoming_webhook', 'delete_incoming_webhook',
      'create_webhook_subscription', 'list_webhook_subscriptions', 'update_webhook_subscription', 'delete_webhook_subscription',
      'list_webhook_subscription_logs',
    ],
  },
  {
    label: 'Event Queues',
    tools: [
      'list_event_queues', 'get_event_queue', 'create_event_queue', 'update_event_queue', 'delete_event_queue',
      'add_event_queue_step', 'update_event_queue_step', 'delete_event_queue_step',
    ],
  },
  {
    label: 'Order Forms',
    tools: [
      'list_order_forms', 'get_order_form', 'create_order_form', 'update_order_form', 'delete_order_form',
      'list_order_form_logs',
    ],
  },
  {
    label: 'Transcripts & Coaching',
    tools: [
      'list_transcripts', 'get_transcript',
      'list_coaching_results', 'get_coaching_result',
    ],
  },
  {
    label: 'AI',
    tools: [
      'ai_enrich', 'ai_edit_text', 'ai_deal_probability', 'ai_call_coaching', 'ai_generate_pipeline',
      'ai_needs_analysis', 'ai_fill_form',
    ],
  },
  {
    label: 'Websites',
    tools: [
      'list_websites', 'get_website', 'create_website', 'update_website', 'delete_website',
      'list_website_pages', 'get_website_page', 'create_website_page', 'update_website_page', 'delete_website_page',
      'list_website_page_sections', 'create_website_page_section', 'update_website_page_section', 'delete_website_page_section', 'reorder_website_page_sections',
    ],
  },
  {
    label: 'Integrations',
    tools: [
      'list_integrations', 'get_integration', 'connect_integration', 'update_integration', 'delete_integration',
      'query_integration', 'execute_integration_action',
    ],
  },
  {
    label: 'Admin & Billing',
    tools: [
      'get_company', 'update_company',
      'list_company_users', 'get_company_user', 'invite_user', 'update_user_role', 'remove_user',
      'get_crm_settings', 'update_crm_settings',
      'get_billing_plan', 'get_credit_balance', 'get_billing_usage',
    ],
  },
];

// Deduplicate tools that appear in multiple categories (e.g. AI tools also listed elsewhere)
function getUniqueTotalTools(): number {
  const all = new Set<string>();
  TOOL_CATEGORIES.forEach(cat => cat.tools.forEach(t => all.add(t)));
  return all.size;
}

function McpTools() {
  const totalTools = getUniqueTotalTools();

  return (
    <>
      <Helmet>
        <title>MCP Tools - TrustPager Developer Docs</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">MCP Tools</h1>
        <p className="text-gray-600 mb-2">
          Complete list of MCP tools available through the TrustPager MCP server.
          Each tool maps directly to an API endpoint.
        </p>
        <p className="text-sm text-gray-500 mb-10">
          {totalTools} unique tools across {TOOL_CATEGORIES.length} categories (
          {RESOURCES.reduce((sum, r) => sum + r.endpoints.length, 0)} API endpoints total)
        </p>

        {TOOL_CATEGORIES.map(category => (
          <div key={category.label} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              {category.label}
              <span className="ml-2 text-sm font-normal text-gray-400">({category.tools.length} tools)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {category.tools.map(tool => (
                <div
                  key={tool}
                  className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 text-sm font-mono text-gray-700"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default McpTools;
