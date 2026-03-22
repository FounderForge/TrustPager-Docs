import { Helmet } from 'react-helmet-async';
import { RESOURCES } from '@/data/endpoints';

const TOOL_CATEGORIES = [
  { label: 'Contacts', tools: ['list_contacts', 'get_contact', 'create_contact', 'update_contact', 'delete_contact', 'search_contacts', 'get_contact_deals', 'get_contact_activities', 'get_contact_employers', 'link_contact_to_customer', 'unlink_contact_from_customer', 'ai_enrich'] },
  { label: 'Customers', tools: ['list_customers', 'get_customer', 'create_customer', 'update_customer', 'delete_customer', 'search_customers', 'get_customer_contacts', 'get_customer_deals', 'get_customer_activities'] },
  { label: 'Deals', tools: ['list_deals', 'get_deal', 'create_deal', 'update_deal', 'delete_deal', 'search_deals', 'move_deal', 'add_deal_product', 'update_deal_product', 'remove_deal_product', 'get_deal_products', 'add_deal_contact', 'remove_deal_contact', 'assign_deal_user', 'unassign_deal_user', 'get_deal_activities', 'get_deal_tasks', 'get_deal_work_orders', 'ai_deal_probability'] },
  { label: 'Pipelines', tools: ['list_pipelines', 'get_pipeline', 'create_pipeline', 'update_pipeline', 'delete_pipeline', 'list_pipeline_stages', 'create_pipeline_stage', 'update_pipeline_stage', 'delete_pipeline_stage', 'reorder_pipeline_stages', 'get_pipeline_deals', 'get_pipeline_summary', 'ai_generate_pipeline'] },
  { label: 'Automations', tools: ['list_automations', 'get_automation', 'create_automation', 'update_automation', 'delete_automation', 'enable_automation', 'disable_automation', 'trigger_automation', 'list_automation_actions', 'add_automation_action', 'update_automation_action', 'delete_automation_action', 'reorder_automation_actions', 'add_automation_trigger', 'update_automation_trigger', 'delete_automation_trigger', 'list_automation_runs', 'get_automation_run'] },
  { label: 'Communication', tools: ['send_email', 'reply_to_email', 'list_email_threads', 'get_email_thread', 'list_email_logs', 'send_sms', 'list_sms_conversations', 'get_sms_conversation', 'get_sms_messages', 'initiate_voice_call', 'list_phone_call_logs', 'list_phone_numbers'] },
  { label: 'Documents & Forms', tools: ['list_document_templates', 'get_document_template', 'create_document_template', 'update_document_template', 'delete_document_template', 'duplicate_document_template', 'add_document_section', 'update_document_section', 'delete_document_section', 'reorder_document_sections', 'list_form_templates', 'get_form_template', 'create_form_template', 'send_form', 'send_for_signing', 'list_signing_envelopes'] },
  { label: 'Tasks & Work Orders', tools: ['list_tasks', 'get_task', 'create_task', 'update_task', 'delete_task', 'complete_task', 'list_work_orders', 'get_work_order', 'create_work_order', 'update_work_order', 'delete_work_order'] },
  { label: 'AI', tools: ['ai_enrich', 'ai_edit_text', 'ai_deal_probability', 'ai_call_coaching', 'ai_generate_pipeline'] },
  { label: 'Admin', tools: ['get_company', 'update_company', 'list_company_users', 'invite_user', 'update_user_role', 'remove_user', 'get_crm_settings', 'update_crm_settings', 'get_billing_plan', 'get_credit_balance'] },
];

function McpTools() {
  const totalTools = TOOL_CATEGORIES.reduce((sum, cat) => sum + cat.tools.length, 0);

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
          {totalTools} tools across {TOOL_CATEGORIES.length} categories (
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
