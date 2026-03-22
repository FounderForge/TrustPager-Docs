import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Key, Zap, BookOpen, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'API Reference', href: '/api', icon: Code2 },
  { label: 'MCP', href: '/mcp/setup', icon: Zap },
  { label: 'Auth', href: '/authentication', icon: Key },
  { label: 'Quick Start', href: '/quickstart', icon: BookOpen },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span>TrustPager</span>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">Docs</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const isActive = location.pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href="https://app.trustpager.com/admin/company-management"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <Key className="w-4 h-4" />
              Get API Key
            </a>
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-100 pt-2">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const isActive = location.pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
            <a
              href="https://app.trustpager.com/admin/company-management"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 mt-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg"
            >
              <Key className="w-4 h-4" />
              Get API Key
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
