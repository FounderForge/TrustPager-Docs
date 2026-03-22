import { Helmet } from 'react-helmet-async';
import { CodeBlock } from '@/components/docs/CodeBlock';

const ERROR_CODES = [
  { status: 400, code: 'INVALID_BODY', description: 'Request body could not be parsed as JSON.', fix: 'Ensure your Content-Type is application/json and the body is valid JSON.' },
  { status: 400, code: 'MISSING_FIELDS', description: 'One or more required fields are missing.', fix: 'Check the required fields for this endpoint and include them in your request.' },
  { status: 400, code: 'VALIDATION_ERROR', description: 'A field value is invalid.', fix: 'Check the field types and constraints in the endpoint documentation.' },
  { status: 401, code: 'UNAUTHORIZED', description: 'No valid API key or token was provided.', fix: 'Include a valid Authorization header: Bearer YOUR_API_KEY' },
  { status: 403, code: 'INSUFFICIENT_SCOPE', description: 'The API key does not have the required scope for this endpoint.', fix: 'Add the missing scope to your API key in Settings > API Keys.' },
  { status: 403, code: 'INSUFFICIENT_CREDITS', description: 'No API credits remaining.', fix: 'Top up your credits in Settings > Billing, or upgrade your plan.' },
  { status: 404, code: 'NOT_FOUND', description: 'The requested resource does not exist or does not belong to your company.', fix: 'Verify the ID is correct and that the resource belongs to the authenticated company.' },
  { status: 409, code: 'CONFLICT', description: 'A resource with the same unique constraint already exists.', fix: 'Check for duplicate records (e.g., duplicate email, duplicate link).' },
  { status: 429, code: 'RATE_LIMITED', description: 'Too many requests. You have exceeded the rate limit.', fix: 'Wait and retry. Default: 60 req/min, 10,000 req/day.' },
  { status: 500, code: 'INTERNAL_ERROR', description: 'An unexpected error occurred on the server.', fix: 'Retry the request. If the error persists, contact support.' },
];

function Errors() {
  return (
    <>
      <Helmet>
        <title>Error Reference - TrustPager Developer Docs</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Error Reference</h1>
        <p className="text-gray-600 mb-10">
          All API errors follow a consistent format with machine-readable codes, human-friendly messages,
          and actionable fix instructions. Every error includes enough context for AI agents to self-correct.
        </p>

        {/* Error format */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Format</h2>
          <CodeBlock
            language="json"
            title="Standard error response"
            code={`{
  "error": {
    "code": "MISSING_FIELDS",
    "message": "Required fields missing: first_name",
    "fix": "Include the 'first_name' field in your request body.",
    "hint": "Writable fields: first_name, last_name, email, phone, ...",
    "status": 400
  }
}`}
          />
        </section>

        {/* Error codes table */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Codes</h2>
          <div className="space-y-4">
            {ERROR_CODES.map(err => (
              <div key={err.code} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                    err.status >= 500 ? 'bg-red-100 text-red-800' :
                    err.status >= 400 ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {err.status}
                  </span>
                  <code className="text-sm font-mono font-medium text-gray-900">{err.code}</code>
                </div>
                <p className="text-sm text-gray-600 mb-2">{err.description}</p>
                <p className="text-sm text-teal-700 bg-teal-50 px-3 py-1.5 rounded">
                  <strong>Fix:</strong> {err.fix}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default Errors;
