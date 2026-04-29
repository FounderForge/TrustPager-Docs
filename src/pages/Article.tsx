import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchArticle, type HelpArticle } from '@/data/helpCenter';

function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<HelpArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setError(null);
    fetchArticle(slug)
      .then(a => {
        if (cancelled) return;
        if (!a) setNotFound(true);
        else setArticle(a);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message ?? 'Failed to load article');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading article...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Helmet>
          <title>Article not found - TrustPager Docs</title>
        </Helmet>
        <Link
          to="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to articles
        </Link>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Article not found</h1>
          <p className="text-sm text-gray-600">
            The article you're looking for doesn't exist or hasn't been published yet.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to articles
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Failed to load article.</strong> {error}
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <>
      <Helmet>
        <title>{article.title} - TrustPager Help Center</title>
        {article.description && <meta name="description" content={article.description} />}
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
          <Link to="/articles" className="hover:text-teal-600 transition-colors">
            Articles
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{article.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 truncate">{article.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{article.title}</h1>
          {article.description && (
            <p className="text-base text-gray-600 leading-relaxed">{article.description}</p>
          )}
        </div>

        {/* YouTube video (if any) */}
        {article.youtube_url && (
          <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden border border-gray-200">
            <iframe
              src={article.youtube_url.replace('watch?v=', 'embed/')}
              title={article.title}
              className="w-full h-full"
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Markdown body */}
        <article className="prose prose-gray max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 prose-pre:text-gray-100">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node: _node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          >
            {article.article_body}
          </ReactMarkdown>
        </article>

        {/* Footer back link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            to="/articles"
            className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all articles
          </Link>
        </div>
      </div>
    </>
  );
}

export default ArticlePage;
