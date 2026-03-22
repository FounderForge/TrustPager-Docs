import { Helmet } from 'react-helmet-async';

interface ChangelogEntry {
  date: string;
  version: string;
  changes: { type: 'added' | 'changed' | 'fixed' | 'removed'; description: string }[];
}

const ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-03-23',
    version: 'v1.0',
    changes: [
      { type: 'added', description: 'Initial API release with 30+ resource types and 180+ endpoints' },
      { type: 'added', description: 'MCP server with 180+ tools for AI agent integration' },
      { type: 'added', description: 'OAuth 2.0 support for Claude.ai and other MCP clients' },
      { type: 'added', description: 'Cursor-based pagination across all list endpoints' },
      { type: 'added', description: 'Field selection and expansion support on contacts and deals' },
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
