import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CodeBlock } from '@/components/docs/CodeBlock';

function McpSetup() {
  return (
    <>
      <Helmet>
        <title>MCP Setup - TrustPager Developer Docs</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">MCP Integration</h1>
        <p className="text-gray-600 mb-10">
          Connect AI agents like Claude, GPT, and others directly to your TrustPager CRM using the
          Model Context Protocol (MCP). Over 180 tools available for full CRM management.
        </p>

        {/* What is MCP */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What is MCP?</h2>
          <p className="text-gray-600 mb-4">
            The Model Context Protocol (MCP) is an open standard that allows AI agents to interact with
            external tools and data sources. TrustPager's MCP server exposes your CRM as a set of typed tools
            that AI agents can call directly.
          </p>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-sm text-teal-800">
            <strong>npm package:</strong>{' '}
            <code className="bg-teal-100 px-1 py-0.5 rounded">@trustpager/mcp-server</code>
          </div>
        </section>

        {/* Claude Desktop setup */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Claude Desktop Setup</h2>
          <p className="text-gray-600 mb-4">
            Add TrustPager to your Claude Desktop configuration:
          </p>
          <CodeBlock
            language="json"
            title="claude_desktop_config.json"
            code={`{
  "mcpServers": {
    "trustpager": {
      "command": "npx",
      "args": ["-y", "@trustpager/mcp-server"],
      "env": {
        "TRUSTPAGER_API_KEY": "tp_live_your_api_key_here",
        "TRUSTPAGER_COMPANY_ID": "your-company-uuid"
      }
    }
  }
}`}
          />
        </section>

        {/* Claude.ai (OAuth) */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Claude.ai Integration (OAuth)</h2>
          <p className="text-gray-600 mb-4">
            For Claude.ai web and Claude for Enterprise, TrustPager uses OAuth 2.0 for authentication.
            The MCP server is available as a remote integration -- no local setup required.
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-600">
            <li>Open Claude.ai and navigate to Settings &rarr; Integrations</li>
            <li>Search for "TrustPager" or "FinalPiece CRM"</li>
            <li>Click Connect and authorize access to your CRM</li>
            <li>Start chatting -- Claude can now manage your CRM directly</li>
          </ol>
        </section>

        {/* Environment vars */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Environment Variables</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Variable</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Required</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">TRUSTPAGER_API_KEY</td>
                  <td className="px-4 py-2"><span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded">Required</span></td>
                  <td className="px-4 py-2 text-gray-600">Your TrustPager API key</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-4 py-2 font-mono text-xs">TRUSTPAGER_COMPANY_ID</td>
                  <td className="px-4 py-2"><span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded">Required</span></td>
                  <td className="px-4 py-2 text-gray-600">Your company UUID</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Nav links */}
        <div className="flex flex-wrap gap-3">
          <Link to="/mcp/tools" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            View all MCP Tools &rarr;
          </Link>
          <Link to="/mcp/examples" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            Usage Examples &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}

export default McpSetup;
