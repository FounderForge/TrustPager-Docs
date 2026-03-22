import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { DocsLayout } from '@/components/layout/DocsLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { EndpointCard } from '@/components/docs/EndpointCard';
import { getResourceById } from '@/data/endpoints';
import { API_CATEGORIES } from '@/data/navigation';

function slugify(method: string, path: string): string {
  return `${method.toLowerCase()}-${path.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

function ResourcePage() {
  const { resource } = useParams<{ resource: string }>();
  const group = resource ? getResourceById(resource) : undefined;

  if (!group) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Resource not found</h1>
        <p className="text-gray-500 mb-6">
          The API resource "{resource}" does not exist.
        </p>
        <Link to="/api" className="text-blue-600 hover:underline">
          Back to API Reference
        </Link>
      </div>
    );
  }

  // TOC for current resource
  const toc = (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        On this page
      </p>
      <nav className="space-y-1">
        {group.endpoints.map(ep => {
          const id = slugify(ep.method, ep.path);
          return (
            <a
              key={id}
              href={`#${id}`}
              className="flex items-center gap-2 px-2 py-1 text-sm text-gray-500 hover:text-gray-900 rounded transition-colors"
            >
              <span className={`inline-block w-12 text-center text-[10px] font-bold uppercase rounded px-1 py-0.5 method-${ep.method.toLowerCase()}`}>
                {ep.method}
              </span>
              <span className="truncate font-mono text-xs">{ep.path}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{group.label} - API Reference - TrustPager Developer Docs</title>
      </Helmet>

      <DocsLayout sidebar={<Sidebar categories={API_CATEGORIES} />} toc={toc}>
        {/* Resource header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to="/api" className="hover:text-blue-600 transition-colors">API Reference</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{group.label}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{group.label}</h1>
          <p className="text-gray-600">{group.description}</p>
          <div className="mt-3 text-sm text-gray-500">
            {group.endpoints.length} endpoint{group.endpoints.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          {group.endpoints.map(ep => (
            <EndpointCard
              key={`${ep.method}-${ep.path}`}
              method={ep.method}
              path={ep.path}
              description={ep.description}
              scopes={ep.scopes}
              params={ep.params}
              requestExample={ep.requestExample}
              responseExample={ep.responseExample}
            />
          ))}
        </div>
      </DocsLayout>
    </>
  );
}

export default ResourcePage;
