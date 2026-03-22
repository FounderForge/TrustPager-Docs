import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MethodBadge } from '@/components/docs/MethodBadge';
import { ParamTable } from '@/components/docs/ParamTable';
import { CodeBlock } from '@/components/docs/CodeBlock';

interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface EndpointCardProps {
  method: string;
  path: string;
  description: string;
  scopes: string[];
  params?: Param[];
  requestExample?: string;
  responseExample?: string;
}

function slugify(method: string, path: string): string {
  return `${method.toLowerCase()}-${path.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

export function EndpointCard({
  method,
  path,
  description,
  scopes,
  params,
  requestExample,
  responseExample,
}: EndpointCardProps) {
  const [paramsOpen, setParamsOpen] = useState(false);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const id = slugify(method, path);

  const hasParams = params && params.length > 0;
  const hasExamples = requestExample || responseExample;

  return (
    <div id={id} className="border border-gray-200 rounded-xl overflow-hidden scroll-mt-24">
      {/* Header */}
      <div className="px-5 py-4 bg-gray-50/70">
        <div className="flex flex-wrap items-center gap-3">
          <MethodBadge method={method} />
          <code className="text-sm font-mono text-gray-800 font-medium">{path}</code>
        </div>
        <p className="text-sm text-gray-600 mt-2">{description}</p>

        {/* Scopes */}
        {scopes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {scopes.map(scope => (
              <span
                key={scope}
                className="inline-flex px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100"
              >
                {scope}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expandable sections */}
      <div className="divide-y divide-gray-100">
        {/* Parameters */}
        {hasParams && (
          <div>
            <button
              onClick={() => setParamsOpen(!paramsOpen)}
              className={cn(
                'flex items-center gap-2 w-full px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors',
              )}
            >
              {paramsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              Parameters ({params.length})
            </button>
            {paramsOpen && (
              <div className="px-5 pb-4">
                <ParamTable params={params} />
              </div>
            )}
          </div>
        )}

        {/* Code examples */}
        {hasExamples && (
          <div>
            <button
              onClick={() => setExamplesOpen(!examplesOpen)}
              className="flex items-center gap-2 w-full px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {examplesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              Examples
            </button>
            {examplesOpen && (
              <div className="px-5 pb-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {requestExample && (
                    <CodeBlock code={requestExample} language="bash" title="Request" />
                  )}
                  {responseExample && (
                    <CodeBlock code={responseExample} language="json" title="Response" />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
