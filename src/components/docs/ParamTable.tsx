interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface ParamTableProps {
  params: Param[];
}

export function ParamTable({ params }: ParamTableProps) {
  if (params.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-4 py-2.5 font-medium text-gray-700">Name</th>
            <th className="px-4 py-2.5 font-medium text-gray-700">Type</th>
            <th className="px-4 py-2.5 font-medium text-gray-700">Required</th>
            <th className="px-4 py-2.5 font-medium text-gray-700">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {params.map((param, i) => (
            <tr key={param.name} className={i % 2 === 1 ? 'bg-gray-50/50' : ''}>
              <td className="px-4 py-2.5 font-mono text-xs text-gray-900">{param.name}</td>
              <td className="px-4 py-2.5 text-gray-600 font-mono text-xs">{param.type}</td>
              <td className="px-4 py-2.5">
                {param.required ? (
                  <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-red-50 text-red-700 rounded">
                    Required
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Optional</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-gray-600">{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
