import { Helmet } from 'react-helmet-async';
import { RESOURCES } from '@/data/endpoints';

// =============================================================================
// Discovery protocol (2026-05-13)
//
// The MCP server's static "Primitives" instruction blob has been replaced with
// a 4-line stable header that points agents at the Discovery primitives below.
// The first thing an agent should do at the start of a session is:
//
//   1. get_ai_instructions          -- load workspace-wide workflow guidance
//   2. describe_resource("opportunity") etc. -- get the curated tool surface
//   3. search_help_center           -- find a tutorial for "how do I X"
//   4. create_service_request       -- file a gap when a tool is missing
//
// All four are free (0 credits) and idempotent.
// =============================================================================
const DISCOVERY_TOOLS = [
  {
    name: 'get_ai_instructions',
    summary:
      'Tier 1. Load the current workspace workflow guidance, correct tool sequences, and common mistakes. Call once per session and cache the result.',
  },
  {
    name: 'describe_resource',
    summary:
      'Tier 2. Pass a resource name (opportunity, company, contact, file, document, image, task, booking, invoice, spreadsheet, notepad, form, automation, voice_agent, ...) and get the curated tool surface for that entity: primary CRUD, sub-resources, activities, workflows, field hints.',
  },
  {
    name: 'search_help_center',
    summary:
      'Free-text search across the published help-center articles. Use this for any "how do I…" question before guessing tool names.',
  },
  {
    name: 'create_service_request',
    summary:
      'File a gap (missing tool, missing field, missing filter, confusing error, bug) into the TrustPager triage queue. Include category, affected_tools, suggested_solution, and use_case.',
  },
];

const TOOL_CATEGORIES = [
  {
    label: 'Discovery (call these first)',
    tools: ['get_ai_instructions', 'describe_resource', 'search_help_center', 'create_service_request', 'search'],
  },
  {
    label: 'Contacts',
    tools: [
      'search_contacts', 'list_contacts', 'get_contact', 'create_contact', 'update_contact', 'delete_contact',
      'get_contact_deals', 'get_contact_activities', 'get_contact_employers', 'get_contact_birthday_sends',
      'link_contact_to_customer', 'unlink_contact_from_customer',
    ],
  },
  {
    label: 'Companies (canonical) — formerly Customers',
    tools: [
      // Canonical names
      'search_companies', 'list_companies', 'get_company', 'create_company', 'update_company', 'delete_company',
      'get_company_contacts', 'get_company_opportunities', 'get_company_activities',
      'bulk_create_companies', 'bulk_update_companies', 'bulk_delete_companies',
      // Legacy aliases (kept indefinitely)
      'search_customers', 'list_customers', 'get_customer', 'create_customer', 'update_customer', 'delete_customer',
      'get_customer_contacts', 'get_customer_deals', 'get_customer_activities',
      'bulk_create_customers', 'bulk_update_customers', 'bulk_delete_customers',
    ],
  },
  {
    label: 'Opportunities (canonical) — formerly Deals',
    tools: [
      // Canonical names
      'search_opportunities', 'list_opportunities', 'get_opportunity', 'create_opportunity', 'update_opportunity', 'delete_opportunity', 'move_opportunity',
      'add_opportunity_product', 'update_opportunity_product', 'remove_opportunity_product', 'get_opportunity_products', 'reorder_opportunity_products',
      'list_opportunity_product_costs', 'create_opportunity_product_cost', 'update_opportunity_product_cost', 'delete_opportunity_product_cost',
      'add_opportunity_contact', 'remove_opportunity_contact', 'list_opportunity_contacts',
      'assign_opportunity_user', 'unassign_opportunity_user', 'list_opportunity_users',
      'get_opportunity_activities', 'get_opportunity_tasks', 'get_opportunity_work_orders',
      'bulk_create_opportunities', 'bulk_update_opportunities', 'bulk_delete_opportunities', 'bulk_move_opportunities',
      // New 2026-05-13 attachment tools
      'list_opportunity_files', 'add_opportunity_file', 'remove_opportunity_file',
      'list_opportunity_documents', 'add_opportunity_document', 'remove_opportunity_document',
      'list_opportunity_images', 'add_opportunity_image', 'remove_opportunity_image',
      'list_opportunity_spreadsheets', 'add_opportunity_spreadsheet', 'remove_opportunity_spreadsheet',
      'list_opportunity_invoices',
      // Legacy aliases (kept indefinitely)
      'search_deals', 'list_deals', 'get_deal', 'create_deal', 'update_deal', 'delete_deal', 'move_deal',
      'add_deal_product', 'update_deal_product', 'remove_deal_product', 'get_deal_products', 'reorder_deal_products',
      'list_deal_product_costs', 'create_deal_product_cost', 'update_deal_product_cost', 'delete_deal_product_cost',
      'add_deal_contact', 'remove_deal_contact', 'list_deal_contacts',
      'assign_deal_user', 'unassign_deal_user', 'list_deal_users',
      'get_deal_activities', 'get_deal_tasks', 'get_deal_work_orders',
      'bulk_create_deals', 'bulk_update_deals', 'bulk_delete_deals', 'bulk_move_deals',
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
    label: 'Supplier Catalog',
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
      'get_email_capabilities',
      'list_email_configs', 'get_email_config', 'create_email_config', 'update_email_config', 'delete_email_config',
      'send_sms', 'list_sms_conversations', 'get_sms_conversation', 'get_sms_messages',
      'initiate_voice_call', 'list_phone_call_logs',
      'list_phone_numbers', 'search_phone_numbers', 'buy_phone_number', 'release_phone_number',
      'list_voice_agents', 'get_voice_agent', 'create_voice_agent', 'update_voice_agent', 'delete_voice_agent', 'sync_voice_agent',
      'update_voice_agent_flow', 'update_voice_agent_settings', 'publish_voice_agent',
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
      'list_documents', 'get_document', 'delete_document', 'download_document', 'list_document_folders',
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
      'list_files', 'get_file', 'upload_file', 'delete_file', 'download_file', 'list_file_folders', 'create_file_folder',
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
    label: 'AI Knowledge',
    tools: [
      'list_knowledge', 'get_knowledge', 'create_knowledge', 'update_knowledge', 'delete_knowledge',
      'search_knowledge',
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
      'add_event_queue_step', 'update_event_queue_step', 'delete_event_queue_step', 'list_event_queue_enrollments',
    ],
  },
  {
    label: 'Scheduled Event Types',
    tools: [
      'list_scheduled_event_types', 'get_scheduled_event_type',
      'create_scheduled_event_type', 'update_scheduled_event_type', 'delete_scheduled_event_type',
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
      'ai_edit_text', 'ai_call_coaching', 'ai_generate_pipeline',
      'ai_needs_analysis', 'ai_fill_form', 'ai_generate_image', 'ai_generate_speech',
    ],
  },
  {
    label: 'Voices',
    tools: [
      'list_voices', 'get_voice', 'create_voice', 'update_voice', 'delete_voice',
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
      'list_integrations', 'get_integration',
      'query_integration', 'execute_integration_action',
    ],
  },
  {
    label: 'Service Requests',
    tools: ['create_service_request'],
  },
  {
    label: 'Approval Queue',
    tools: [
      'list_approvals', 'get_approval', 'approve_action', 'reject_action',
    ],
  },
  {
    label: 'Admin & Billing',
    tools: [
      'get_company', 'update_company',
      'list_company_users', 'get_company_user', 'invite_user', 'update_user_role', 'remove_user',
      'get_crm_settings', 'update_crm_settings',
      'get_tag_palette', 'update_tag_palette',
      'get_birthday_messages', 'update_birthday_messages',
      'get_billing_plan', 'get_credit_balance', 'get_billing_usage', 'get_billing_pricing',
      'get_ai_instructions',
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

        {/* --------------------------------------------------------------- */}
        {/* Discovery protocol overview                                     */}
        {/* --------------------------------------------------------------- */}
        <section className="mb-12 bg-teal-50/60 border border-teal-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Discovery protocol</h2>
          <p className="text-sm text-gray-700 mb-4">
            The MCP server's instruction blob points at four discovery primitives. Call them
            at the start of every session instead of guessing tool names — they're all free
            (0 credits) and they replace the older static "Primitives" list.
          </p>
          <ol className="space-y-3 list-decimal pl-5">
            {DISCOVERY_TOOLS.map((t, i) => (
              <li key={t.name} className="text-sm text-gray-700">
                <code className="font-mono text-teal-700 bg-white px-1.5 py-0.5 rounded border border-teal-200 text-xs">
                  {t.name}
                </code>
                <span className="ml-2">{t.summary}</span>
                {i === 1 && (
                  <div className="mt-2 text-xs text-gray-500 italic">
                    Accepted resource values include: opportunity, company, contact, file, document,
                    image, task, booking, invoice, spreadsheet, notepad, form, automation, voice_agent,
                    pipeline, product, supplier_product, work_order, knowledge, transcript, and more.
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* --------------------------------------------------------------- */}
        {/* Phase A naming refactor notice                                  */}
        {/* --------------------------------------------------------------- */}
        <section className="mb-12 bg-amber-50/60 border border-amber-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2026-05-13 naming refactor</h2>
          <p className="text-sm text-gray-700 mb-2">
            All <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-amber-200">deal_*</code> tools
            are now <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-amber-200">opportunity_*</code>,
            and all <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-amber-200">customer_*</code> tools
            are now <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-amber-200">company_*</code>.
            The legacy tool names remain registered as indefinite aliases — every existing integration keeps working
            with zero changes. The categories below list canonical names first and legacy aliases at the bottom of the same group.
          </p>
          <p className="text-sm text-gray-700">
            13 new opportunity-attachment tools shipped alongside the rename (files, documents, images, spreadsheets,
            invoices), all listed in the Opportunities group.
          </p>
        </section>

        {/* --------------------------------------------------------------- */}
        {/* Tool catalogue                                                  */}
        {/* --------------------------------------------------------------- */}
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
