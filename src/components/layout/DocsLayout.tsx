import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DocsLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  toc?: ReactNode;
}

export function DocsLayout({ children, sidebar, toc }: DocsLayoutProps) {
  const mainSpan = toc ? 'lg:col-span-6' : 'lg:col-span-9';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left sidebar */}
        {sidebar && (
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto docs-sidebar pr-4">
              {sidebar}
            </div>
          </aside>
        )}

        {/* Main content */}
        <div className={cn('min-w-0', sidebar ? mainSpan : 'lg:col-span-12')}>
          {children}
        </div>

        {/* Right sidebar / TOC */}
        {toc && (
          <aside className="hidden xl:block lg:col-span-3">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto docs-sidebar">
              {toc}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
