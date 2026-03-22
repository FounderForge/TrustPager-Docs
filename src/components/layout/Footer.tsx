import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  { label: 'API Reference', href: '/api' },
  { label: 'MCP Guide', href: '/mcp/setup' },
  { label: 'Quick Start', href: '/quickstart' },
  { label: 'Changelog', href: '/changelog' },
];

const EXTERNAL_LINKS = [
  { label: 'TrustPager', href: 'https://trustpager.com' },
  { label: 'Status', href: 'https://status.trustpager.com' },
  { label: 'GitHub', href: 'https://github.com/AICrafterZheng/TrustPager-MCP' },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="font-semibold text-gray-900 mb-2">TrustPager Developer Documentation</p>
            <p className="text-sm text-gray-500">
              Build integrations, automate workflows, and connect AI agents.
            </p>
          </div>

          {/* Internal links */}
          <div>
            <p className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide">Documentation</p>
            <ul className="space-y-1.5">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External links */}
          <div>
            <p className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide">Links</p>
            <ul className="space-y-1.5">
              {EXTERNAL_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2026 FinalPiece AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
