import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { API_BASE_URL } from '@/data/endpoints';

function QuickStart() {
  return (
    <>
      <Helmet>
        <title>Quick Start - TrustPager Developer Docs</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Quick Start</h1>
        <p className="text-gray-600 mb-10">
          Get up and running with the TrustPager API in under 5 minutes.
        </p>

        {/* Step 1 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 text-sm font-bold">1</span>
            <h2 className="text-xl font-semibold text-gray-900">Get your API Key</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Go to{' '}
            <a
              href="https://app.trustpager.com/admin/company-management"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:underline font-medium"
            >
              Settings &rarr; API Keys
            </a>
            {' '}in your TrustPager dashboard and create a new API key. Select the scopes you need.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <strong>Important:</strong> Copy your API key immediately after creation. It will only be shown once.
            Store it securely and never commit it to version control.
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 text-sm font-bold">2</span>
            <h2 className="text-xl font-semibold text-gray-900">Make your first request</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Send a GET request to list your contacts:
          </p>
          <CodeBlock
            language="bash"
            title="List contacts"
            code={`curl -X GET \\
  "${API_BASE_URL}/contacts?limit=5" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
          />
        </div>

        {/* Step 3 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 text-sm font-bold">3</span>
            <h2 className="text-xl font-semibold text-gray-900">Create a contact</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Create a new contact with a POST request:
          </p>
          <CodeBlock
            language="bash"
            title="Create contact"
            code={`curl -X POST \\
  "${API_BASE_URL}/contacts" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@example.com",
    "phone": "+61412345678",
    "source": "api"
  }'`}
          />
        </div>

        {/* Step 4 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 text-sm font-bold">4</span>
            <h2 className="text-xl font-semibold text-gray-900">Explore further</h2>
          </div>
          <p className="text-gray-600 mb-4">
            The API supports 30+ resource types. Here are the most common next steps:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/api/deals" className="bg-white border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
              <h4 className="font-medium text-gray-900 mb-1">Deals</h4>
              <p className="text-xs text-gray-500">Create and manage sales opportunities</p>
            </Link>
            <Link to="/api/automations" className="bg-white border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
              <h4 className="font-medium text-gray-900 mb-1">Automations</h4>
              <p className="text-xs text-gray-500">Set up workflow automations</p>
            </Link>
            <Link to="/api/email" className="bg-white border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
              <h4 className="font-medium text-gray-900 mb-1">Email</h4>
              <p className="text-xs text-gray-500">Send emails and manage threads</p>
            </Link>
            <Link to="/authentication" className="bg-white border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
              <h4 className="font-medium text-gray-900 mb-1">Authentication</h4>
              <p className="text-xs text-gray-500">Learn about API keys, OAuth, and scopes</p>
            </Link>
          </div>
        </div>

        {/* Pagination */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pagination</h2>
          <p className="text-gray-600 mb-4">
            All list endpoints use cursor-based pagination. The response includes a <code className="text-sm bg-gray-100 px-1 py-0.5 rounded">pagination</code> object:
          </p>
          <CodeBlock
            language="json"
            title="Pagination response"
            code={`{
  "data": [...],
  "pagination": {
    "limit": 25,
    "has_more": true,
    "next_cursor": "a1b2c3d4-...",
    "prev_cursor": null
  },
  "meta": {
    "credits_remaining": 9500
  }
}`}
          />
          <p className="text-gray-600 mt-4">
            Pass <code className="text-sm bg-gray-100 px-1 py-0.5 rounded">?cursor=NEXT_CURSOR</code> to get the next page.
          </p>
        </div>
      </div>
    </>
  );
}

export default QuickStart;
