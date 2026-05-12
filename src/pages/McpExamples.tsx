import { Helmet } from 'react-helmet-async';
import { CodeBlock } from '@/components/docs/CodeBlock';

const EXAMPLES = [
  {
    title: 'Create a contact and add them to an opportunity',
    description: 'Ask Claude to create a new contact and link them to an existing opportunity.',
    prompt: '"Create a contact named Sarah Chen with email sarah@acme.com and add her to my Website Redesign opportunity"',
    toolCalls: `// Claude will call these tools in sequence:

// 1. Create the contact
create_contact({
  first_name: "Sarah",
  last_name: "Chen",
  email: "sarah@acme.com"
})

// 2. Search for the opportunity
//    (legacy alias search_deals still works)
search_opportunities({ query: "Website Redesign" })

// 3. Add the contact to the opportunity
add_opportunity_contact({
  opportunity_id: "opp-uuid-...",
  contact_id: "new-contact-uuid-..."
})`,
  },
  {
    title: 'Set up an automation workflow',
    description: 'Ask Claude to create an automation that sends a welcome email when an opportunity enters a pipeline.',
    prompt: '"Create an automation called New Lead Welcome that sends a welcome email when an opportunity enters the Sales pipeline"',
    toolCalls: `// Claude will:

// 1. Find the Sales pipeline
list_pipelines()

// 2. Create the automation
create_automation({
  name: "New Lead Welcome",
  trigger_type: "pipeline",
  description: "Send welcome email on new leads"
})

// 3. Add the trigger
add_automation_trigger({
  automation_id: "auto-uuid-...",
  source_type: "pipeline_stage",
  source_id: "first-stage-uuid-..."
})

// 4. Add the email action
add_automation_action({
  automation_id: "auto-uuid-...",
  action_type: "send_custom_email",
  sequence: 1,
  config: {
    greeting: "Welcome!",
    customMessage: "Thank you for your interest..."
  }
})

// 5. Enable the automation
enable_automation({ automation_id: "auto-uuid-..." })`,
  },
  {
    title: 'Get a sales pipeline summary',
    description: 'Ask Claude for a quick overview of your pipeline performance.',
    prompt: '"Give me a summary of my Sales pipeline -- how many opportunities in each stage and total value?"',
    toolCalls: `// Claude will call:
get_pipeline_summary({ pipeline_id: "pipe-uuid-..." })

// Response includes opportunity counts, values per stage,
// and overall pipeline metrics`,
  },
  {
    title: 'Send a follow-up email',
    description: 'Ask Claude to send an email to a contact with opportunity context.',
    prompt: '"Send a follow-up email to John Smith about the Website Redesign proposal"',
    toolCalls: `// Claude will:

// 1. Find the contact
search_contacts({ query: "John Smith" })

// 2. Find the opportunity (legacy: search_deals)
search_opportunities({ query: "Website Redesign" })

// 3. Send the email
send_email({
  to_email: "john@example.com",
  to_name: "John Smith",
  subject: "Following up on Website Redesign Proposal",
  html_body: "<p>Hi John,</p><p>I wanted to follow up on the Website Redesign proposal we discussed...</p>",
  contact_id: "contact-uuid-...",
  deal_id: "opp-uuid-..."
})`,
  },
  {
    title: 'Discover what an agent can do with an opportunity',
    description: 'Use the tier-2 discovery primitive to ask the server which tools operate on a given resource. Returns the curated tool surface (primary CRUD, sub-resources, activities, workflows, field hints) instead of having the agent guess.',
    prompt: '"What tools do you have for working with opportunities?"',
    toolCalls: `// 1. Discover the tool surface for the resource
//    (free, 0 credits, response is structured for the model)
describe_resource({ resource: "opportunity" })

// 2. Returned shape (abridged):
//
//    {
//      "resource": "opportunity",
//      "primary": ["create_opportunity", "get_opportunity",
//                  "update_opportunity", "delete_opportunity",
//                  "search_opportunities", "list_opportunities"],
//      "sub_resources": {
//        "products":     ["add_opportunity_product", ...],
//        "contacts":     ["add_opportunity_contact", ...],
//        "users":        ["assign_opportunity_user", ...],
//        "activities":   ["get_opportunity_activities"],
//        "tasks":        ["get_opportunity_tasks"],
//        "work_orders":  ["get_opportunity_work_orders"],
//        "files":        ["list_opportunity_files",
//                         "add_opportunity_file",
//                         "remove_opportunity_file"],
//        "documents":    ["list_opportunity_documents", ...],
//        "images":       ["list_opportunity_images", ...],
//        "spreadsheets": ["list_opportunity_spreadsheets", ...],
//        "invoices":     ["list_opportunity_invoices"]
//      },
//      "workflows": ["move_opportunity", "add_opportunity_card",
//                    "bulk_create_opportunities",
//                    "bulk_move_opportunities"],
//      "field_hints": { "status": ["open","won","lost"], ... }
//    }

// 3. Now call the right tool from that list, no guessing.`,
  },
];

function McpExamples() {
  return (
    <>
      <Helmet>
        <title>MCP Examples - TrustPager Developer Docs</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">MCP Usage Examples</h1>
        <p className="text-gray-600 mb-10">
          Real-world examples of how AI agents use TrustPager MCP tools. These show the natural language prompt
          and the tool calls Claude makes behind the scenes.
        </p>

        {EXAMPLES.map((example, i) => (
          <div key={i} className="mb-12 pb-12 border-b border-gray-100 last:border-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{example.title}</h2>
            <p className="text-gray-600 mb-4">{example.description}</p>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-emerald-800 font-medium">User prompt:</p>
              <p className="text-sm text-emerald-900 mt-1 italic">{example.prompt}</p>
            </div>

            <CodeBlock
              code={example.toolCalls}
              language="javascript"
              title="Tool calls"
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default McpExamples;
