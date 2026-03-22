import { cn } from '@/lib/utils';

interface MethodBadgeProps {
  method: string;
}

const METHOD_CLASSES: Record<string, string> = {
  GET: 'method-get',
  POST: 'method-post',
  PATCH: 'method-patch',
  PUT: 'method-put',
  DELETE: 'method-delete',
};

export function MethodBadge({ method }: MethodBadgeProps) {
  const upper = method.toUpperCase();
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono uppercase shrink-0',
        METHOD_CLASSES[upper] ?? 'bg-gray-100 text-gray-600'
      )}
    >
      {upper}
    </span>
  );
}
