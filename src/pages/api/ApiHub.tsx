import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RESOURCES, API_BASE_URL } from '@/data/endpoints';

function ApiHub() {
  // Group resources by category
  const categories = [
    { label: 'CRM Core', ids: ['contacts', 'customers', 'deals', 'pipelines', 'products', 'supplier-products'] },
    { label: 'Tasks & Activities', ids: ['activities', 'tasks', 'work-orders'] },
    { label: 'Automation', ids: ['automations', 'event-queues'] },
    { label: 'Communication', ids: ['email', 'sms', 'phone', 'voice-agents', 'text-agents', 'transcripts'] },
    { label: 'Documents & Forms', ids: ['document-templates', 'documents', 'signing', 'forms'] },
    { label: 'Web & Commerce', ids: ['websites', 'order-forms', 'files', 'notepads'] },
    { label: 'Admin', ids: ['company', 'crm-templates', 'integrations', 'webhooks'] },
    { label: 'AI & Billing', ids: ['ai', 'billing'] },
  ];

  return (
    <>
      <Helmet>
        <title>API Reference - TrustPager Developer Docs</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">API Reference</h1>
          <p className="text-gray-600 mb-4">
            Complete REST API documentation for TrustPager. All endpoints use JSON request/response bodies and cursor-based pagination.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-500 font-medium">Base URL</span>
            <code className="text-sm font-mono text-gray-800">{API_BASE_URL}</code>
          </div>
        </div>

        {/* Resource groups by category */}
        {categories.map(category => {
          const resources = category.ids
            .map(id => RESOURCES.find(r => r.id === id))
            .filter(Boolean);

          if (resources.length === 0) return null;

          return (
            <div key={category.label} className="mb-10">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {category.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {resources.map(resource => {
                  if (!resource) return null;
                  return (
                    <Link
                      key={resource.id}
                      to={`/api/${resource.id}`}
                      className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {resource.label}
                        </h3>
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                          {resource.endpoints.length} endpoints
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{resource.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ApiHub;
