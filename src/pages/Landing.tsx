import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Code2, Key, Zap, BookOpen, ArrowRight, Globe, Webhook, Shield } from 'lucide-react';
import { API_BASE_URL } from '@/data/endpoints';

const QUICK_LINKS = [
  {
    title: 'API Reference',
    description: 'Browse all REST endpoints with examples and parameter docs.',
    icon: Code2,
    href: '/api',
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'MCP Integration',
    description: 'Connect AI agents like Claude directly to your CRM via MCP.',
    icon: Zap,
    href: '/mcp/setup',
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Authentication',
    description: 'API keys, OAuth 2.0, scopes, and rate limits.',
    icon: Key,
    href: '/authentication',
    color: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Quick Start',
    description: 'Get up and running in under 5 minutes.',
    icon: BookOpen,
    href: '/quickstart',
    color: 'from-green-500 to-emerald-600',
  },
];

const FEATURES = [
  {
    title: 'REST API',
    description: 'Full CRUD operations across 30+ resource types with cursor-based pagination, field selection, and expansions.',
    icon: Code2,
  },
  {
    title: 'MCP Tools',
    description: '180+ MCP tools for AI agents. Connect Claude, GPT, or any MCP-compatible agent to your CRM.',
    icon: Zap,
  },
  {
    title: 'OAuth 2.0',
    description: 'Secure authentication with granular scopes. API keys for server-to-server, OAuth for user-delegated access.',
    icon: Shield,
  },
  {
    title: 'Webhooks',
    description: 'Real-time event notifications. Incoming webhooks for automation triggers, outgoing for external integrations.',
    icon: Webhook,
  },
];

function Landing() {
  return (
    <>
      <Helmet>
        <title>TrustPager Developer Docs</title>
        <meta name="description" content="Build integrations, automate workflows, and connect AI agents to your Business Operating System." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDRWMTRoLTR2Mkg2djRoMTB2LTJoMTR2NmgtNHYtMmgtMnYyem0wLTMwaC0ydjJIMnY0aDJWNmg0VjRoMnYyaDE0VjRoMnYyaDRWMmgtMnYyaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-blue-200" />
            <span className="text-blue-200 text-sm font-medium">Developer Documentation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            TrustPager
            <span className="block text-blue-200">Developer Documentation</span>
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Build integrations, automate workflows, and connect AI agents to your Business Operating System.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/quickstart"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Quick Start
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/api"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              API Reference
              <Code2 className="w-4 h-4" />
            </Link>
          </div>

          {/* Base URL */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/20 rounded-lg border border-white/10">
            <span className="text-blue-200 text-sm">Base URL:</span>
            <code className="text-white text-sm font-mono">{API_BASE_URL}</code>
          </div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_LINKS.map(({ title, description, icon: Icon, href, color }) => (
            <Link
              key={href}
              to={href}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Platform Capabilities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ title, description, icon: Icon }) => (
            <div key={title} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Landing;
