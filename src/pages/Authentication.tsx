import { Helmet } from 'react-helmet-async';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { SCOPE_GROUPS } from '@/data/scopes';

function Authentication() {
  return (
    <>
      <Helmet>
        <title>Authentication - TrustPager Developer Docs</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Authentication</h1>
        <p className="text-gray-600 mb-10">
          All API requests must be authenticated. TrustPager supports API keys for server-to-server integration and OAuth 2.0 for user-delegated access.
        </p>

        {/* API Keys */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Keys</h2>
          <p className="text-gray-600 mb-4">
            Create API keys in your TrustPager dashboard under <strong>Settings &rarr; API Keys</strong>.
            Include the key in the <code className="text-sm bg-gray-100 px-1 py-0.5 rounded">Authorization</code> header:
          </p>
          <CodeBlock
            language="bash"
            code={`curl -X GET "https://api.trustpager.com/v1/contacts" \\
  -H "Authorization: Bearer tp_live_abc123..."`}
          />

          <div className="mt-6 bg-teal-50 border border-teal-200 rounded-lg p-4 text-sm text-teal-800">
            <strong>Rate limits:</strong> Default 60 requests per minute, 10,000 per day. Higher limits available on Business and Enterprise plans.
          </div>
        </section>

        {/* OAuth */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">OAuth 2.0</h2>
          <p className="text-gray-600 mb-4">
            For applications acting on behalf of users, TrustPager supports the OAuth 2.0 Authorization Code flow.
            This is used by MCP integrations (e.g., Claude for Enterprise).
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
            <p className="font-medium mb-2">OAuth Endpoints:</p>
            <ul className="space-y-1 font-mono text-xs">
              <li><strong>Authorize:</strong> /functions/v1/oauth-authorize</li>
              <li><strong>Token:</strong> /functions/v1/oauth-token</li>
            </ul>
          </div>
        </section>

        {/* Credits */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Credits</h2>
          <p className="text-gray-600 mb-4">
            Each API request consumes credits. Read operations cost 1 credit, write operations cost 2 credits.
            Every response includes a <code className="text-sm bg-gray-100 px-1 py-0.5 rounded">credits_remaining</code> field in the meta object.
          </p>
          <CodeBlock
            language="json"
            code={`{
  "data": { ... },
  "meta": {
    "credits_remaining": 9498
  }
}`}
          />
        </section>

        {/* Scopes */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Scopes</h2>
          <p className="text-gray-600 mb-6">
            API keys and OAuth tokens are scoped to specific permissions. Each endpoint requires one or more scopes.
            Using the minimum required scopes follows the principle of least privilege.
          </p>

          {SCOPE_GROUPS.map(group => (
            <div key={group.label} className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {group.label}
                {group.admin && (
                  <span className="ml-2 text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-medium">
                    Admin
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{group.description}</p>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Scope</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {group.scopes.map(scope => (
                      <tr key={scope.key}>
                        <td className="px-4 py-2 font-mono text-xs text-gray-800">{scope.key}</td>
                        <td className="px-4 py-2 text-gray-600">{scope.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        {/* Error format */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Responses</h2>
          <p className="text-gray-600 mb-4">
            All errors follow a consistent format with machine-readable error codes and human-friendly messages:
          </p>
          <CodeBlock
            language="json"
            title="Error response"
            code={`{
  "error": {
    "code": "INSUFFICIENT_SCOPE",
    "message": "This endpoint requires the 'contacts:write' scope.",
    "fix": "Add the 'contacts:write' scope to your API key.",
    "hint": "Available scopes: contacts:read, contacts:write",
    "status": 403
  }
}`}
          />
        </section>
      </div>
    </>
  );
}

export default Authentication;
