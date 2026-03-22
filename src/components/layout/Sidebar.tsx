import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavCategory } from '@/data/navigation';

interface SidebarProps {
  categories: NavCategory[];
  basePath?: string;
}

export function Sidebar({ categories, basePath = '/api' }: SidebarProps) {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCategory = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const lowerSearch = search.toLowerCase();

  const filteredCategories = categories
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        !search || item.label.toLowerCase().includes(lowerSearch) || item.id.toLowerCase().includes(lowerSearch)
      ),
    }))
    .filter(cat => cat.items.length > 0);

  return (
    <div className="docs-sidebar overflow-y-auto max-h-[calc(100vh-6rem)]">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Filter resources..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        />
      </div>

      {/* Category Accordions */}
      <nav className="space-y-3">
        {filteredCategories.map(cat => {
          const isCollapsed = collapsed[cat.label] && !search;
          const hasActiveItem = cat.items.some(item => {
            const href = `${basePath}/${item.id}`;
            return location.pathname === href || location.pathname.startsWith(href + '/');
          });

          return (
            <div key={cat.label} className="rounded-lg border border-gray-100 overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(cat.label)}
                className={cn(
                  'flex items-center justify-between w-full px-3 py-2.5 text-left transition-colors',
                  hasActiveItem && !isCollapsed
                    ? 'bg-blue-50/50'
                    : 'bg-gray-50/50 hover:bg-gray-50'
                )}
              >
                <div>
                  <span className={cn(
                    'text-xs font-semibold uppercase tracking-wider',
                    hasActiveItem ? 'text-blue-600' : 'text-gray-500'
                  )}>
                    {cat.label}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5 normal-case tracking-normal">{cat.description}</p>
                </div>
                {isCollapsed
                  ? <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  : <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
              </button>

              {/* Items */}
              {!isCollapsed && (
                <div className="px-1.5 pb-1.5 space-y-0.5">
                  {cat.items.map(item => {
                    const href = `${basePath}/${item.id}`;
                    const isActive = location.pathname === href || location.pathname.startsWith(href + '/');
                    return (
                      <Link
                        key={item.id}
                        to={href}
                        className={cn(
                          'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors',
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
