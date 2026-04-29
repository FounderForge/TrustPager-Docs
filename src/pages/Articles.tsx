import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BookOpen, Search, ChevronRight } from 'lucide-react';
import {
  fetchArticles,
  groupByCategory,
  type HelpArticleListItem,
} from '@/data/helpCenter';

function Articles() {
  const [articles, setArticles] = useState<HelpArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchArticles()
      .then(items => {
        if (!cancelled) {
          setArticles(items);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load articles');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
    );
  }, [articles, query]);

  const groups = useMemo(() => groupByCategory(filtered), [filtered]);

  return (
    <>
      <Helmet>
        <title>Articles - TrustPager Help Center</title>
        <meta
          name="description"
          content="Browse TrustPager help articles — guides, walkthroughs, and how-tos for the platform."
        />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(to right, #29c6c6, #47a3d9)' }}
          >
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Help Articles</h1>
        </div>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Guides and walkthroughs for every part of TrustPager — automations, voice agents,
          forms, scheduling, and more.
        </p>

        {/* Search */}
        <div className="relative mb-10 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {loading && (
          <div className="space-y-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
                <div className="h-20 bg-gray-50 border border-gray-100 rounded-lg animate-pulse" />
                <div className="h-20 bg-gray-50 border border-gray-100 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <strong>Failed to load articles.</strong> {error}
          </div>
        )}

        {!loading && !error && groups.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {query ? `No articles match "${query}".` : 'No articles found.'}
            </p>
          </div>
        )}

        {!loading && !error && groups.length > 0 && (
          <div className="space-y-10">
            {groups.map(group => (
              <section key={group.category}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">{group.category}</h2>
                  <span className="text-xs text-gray-500">
                    {group.articles.length} article{group.articles.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.articles.map(article => (
                    <Link
                      key={article.id}
                      to={`/articles/${article.slug}`}
                      className="group flex items-start gap-3 p-4 rounded-lg border border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-50/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                          {article.title}
                        </h3>
                        {article.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {article.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Articles;
