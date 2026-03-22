import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavCategory } from '@/data/navigation';

interface SidebarProps {
  categories: NavCategory[];
  basePath?: string;
}

export function Sidebar({ categories, basePath = '/api' }: SidebarProps) {
  const location = useLocation();
  const [search, setSearch] = useState('');

  // Find which category contains the active route
  const activeCategory = categories.find(cat =>
    cat.items.some(item => {
      const href = `${basePath}/${item.id}`;
      return location.pathname === href || location.pathname.startsWith(href + '/');
    })
  );

  // Only one accordion open at a time — defaults to the one with the active route
  const [openCategory, setOpenCategory] = useState<string | null>(activeCategory?.label ?? categories[0]?.label ?? null);

  // Update open category when route changes
  useEffect(() => {
    if (activeCategory && activeCategory.label !== openCategory) {
      setOpenCategory(activeCategory.label);
    }
  }, [location.pathname]);

  const toggleCategory = (label: string) => {
    setOpenCategory(prev => prev === label ? null : label);
  };

  const lowerSearch = search.toLowerCase();
  const isSearching = search.length > 0;

  const filteredCategories = categories
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        !search || item.label.toLowerCase().includes(lowerSearch) || item.id.toLowerCase().includes(lowerSearch)
      ),
    }))
    .filter(cat => cat.items.length > 0);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Filter resources..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
        />
      </div>

      {/* Category Accordions */}
      <nav className="space-y-2">
        {filteredCategories.map(cat => {
          const isOpen = isSearching || openCategory === cat.label;
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
                  'flex items-center justify-between w-full px-3 py-2.5 text-left transition-colors duration-200',
                  isOpen && hasActiveItem
                    ? 'bg-teal-50/50'
                    : 'bg-gray-50/50 hover:bg-gray-50'
                )}
              >
                <div className="min-w-0">
                  <span className={cn(
                    'text-xs font-semibold uppercase tracking-wider',
                    hasActiveItem ? 'text-teal-600' : 'text-gray-500'
                  )}>
                    {cat.label}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5 normal-case tracking-normal">{cat.description}</p>
                </div>
                <ChevronRight className={cn(
                  'w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200',
                  isOpen && 'rotate-90'
                )} />
              </button>

              {/* Animated Items */}
              <AccordionContent isOpen={isOpen}>
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
                            ? 'bg-teal-50 text-teal-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </AccordionContent>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

// Smooth animated accordion content
function AccordionContent({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  const updateHeight = useCallback(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, []);

  useEffect(() => {
    updateHeight();
  }, [isOpen, children, updateHeight]);

  return (
    <div
      className="overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out"
      style={{
        maxHeight: isOpen ? `${height}px` : '0px',
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
