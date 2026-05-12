import { Helmet } from 'react-helmet-async';

interface ChangelogEntry {
  date: string;
  version: string;
  changes: { type: 'added' | 'changed' | 'fixed' | 'removed'; description: string }[];
}

const ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-05-13',
    version: 'Phase A',
    changes: [
      { type: 'changed', description: 'Renamed all deal_* MCP tools to opportunity_* (search_opportunities, list_opportunities, get_opportunity, create_opportunity, update_opportunity, delete_opportunity, move_opportunity, add_opportunity_product, add_opportunity_contact, assign_opportunity_user, get_opportunity_activities, get_opportunity_tasks, get_opportunity_work_orders, bulk_create_opportunities, bulk_update_opportunities, bulk_delete_opportunities, bulk_move_opportunities, and every other deal_* tool). The legacy deal_* names remain registered as indefinite aliases -- existing integrations keep working with zero changes.' },
      { type: 'changed', description: 'Renamed all customer_* MCP tools to company_* (search_companies, list_companies, get_company, create_company, update_company, delete_company, get_company_contacts, get_company_opportunities, get_company_activities, bulk_create_companies, bulk_update_companies, bulk_delete_companies). Legacy customer_* names remain registered as indefinite aliases.' },
      { type: 'added', description: 'New canonical API paths: /opportunities/* (alongside the legacy /deals/* path) and /companies/* (alongside /customers/*). Both forms accept identical request bodies and return identical responses. New code should use the canonical paths.' },
      { type: 'added', description: 'New describe_resource(resource) MCP tool -- tier-2 discovery primitive. Accepts a resource name (opportunity, company, contact, file, document, image, task, booking, invoice, spreadsheet, notepad, form, automation, voice_agent, ...) and returns the curated tool surface for that entity: primary CRUD, sub-resources, activities, workflows, field hints. Replaces the static "Primitives" blob that used to live in the MCP server instructions. Free (0 credits).' },
      { type: 'added', description: '13 new opportunity-attachment endpoints + matching MCP tools: list/add/remove_opportunity_file, list/add/remove_opportunity_document, list/add/remove_opportunity_image, list/add/remove_opportunity_spreadsheet, list_opportunity_invoices. Available at /opportunities/:id/{files|documents|images|spreadsheets|invoices} (canonical) and /deals/:id/{...} (legacy alias).' },
      { type: 'changed', description: 'MCP server instructions rewritten -- the static "Primitives" blob is replaced with a 4-line stable header pointing agents at the Discovery protocol primitives (get_ai_instructions, describe_resource, search_help_center, create_service_request).' },
    ],
  },
  {
    date: '2026-03-23',
    version: 'v1.0',
    changes: [
      { type: 'added', description: 'Initial API release with 30+ resource types and 180+ endpoints' },
      { type: 'added', description: 'MCP server with 180+ tools for AI agent integration' },
      { type: 'added', description: 'OAuth 2.0 support for Claude.ai and other MCP clients' },
      { type: 'added', description: 'Cursor-based pagination across all list endpoints' },
      { type: 'added', description: 'Field selection and expansion support on contacts and opportunities' },
      { type: 'added', description: 'AI-friendly error responses with fix instructions and hints' },
      { type: 'added', description: 'Webhook system with incoming and outgoing webhooks' },
      { type: 'added', description: 'API credit system with per-request tracking' },
    ],
  },
];

const TYPE_STYLES = {
  added: 'bg-green-50 text-green-700 border-green-200',
  changed: 'bg-teal-50 text-teal-700 border-teal-200',
  fixed: 'bg-amber-50 text-amber-700 border-amber-200',
  removed: 'bg-red-50 text-red-700 border-red-200',
};

function Changelog() {
  return (
    <>
      <Helmet>
        <title>Changelog - TrustPager Developer Docs</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Changelog</h1>
        <p className="text-gray-600 mb-10">
          Track API and MCP changes, new features, and breaking changes.
        </p>

        <div className="space-y-12">
          {ENTRIES.map(entry => (
            <div key={entry.version}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-lg font-bold text-gray-900">{entry.version}</span>
                <span className="text-sm text-gray-500">{entry.date}</span>
              </div>
              <ul className="space-y-2">
                {entry.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded border shrink-0 mt-0.5 ${TYPE_STYLES[change.type]}`}>
                      {change.type}
                    </span>
                    <span className="text-sm text-gray-700">{change.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Changelog;
