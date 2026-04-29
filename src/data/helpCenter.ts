/**
 * Public help center data fetchers.
 *
 * Articles live in the `help_center_articles` Supabase table and are exposed
 * via the `help-center-public` edge function (no auth required).
 */

const PUBLIC_ENDPOINT =
  'https://ucqwijexmjctglmrxlej.supabase.co/functions/v1/help-center-public';

export interface HelpArticleListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  youtube_url: string | null;
  category: string;
  duration: number | null;
  sort_order: number;
}

export interface HelpArticle extends HelpArticleListItem {
  article_body: string;
}

/** Normalise a category to Title Case to merge stragglers like "automations" → "Automations". */
export function normaliseCategory(raw: string | null | undefined): string {
  if (!raw) return 'General';
  const trimmed = raw.trim();
  if (!trimmed) return 'General';
  return trimmed
    .split(/\s+/)
    .map(word =>
      word.length === 0 ? word : word[0].toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ');
}

export async function fetchArticles(): Promise<HelpArticleListItem[]> {
  const res = await fetch(`${PUBLIC_ENDPOINT}?action=list`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Failed to load articles: ${res.status}`);
  const data = await res.json();
  const articles: HelpArticleListItem[] = data.articles ?? [];
  return articles
    .map(a => ({ ...a, category: normaliseCategory(a.category) }))
    .sort((a, b) => {
      // Sort by category then sort_order then title
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
      return a.title.localeCompare(b.title);
    });
}

export async function fetchArticle(slug: string): Promise<HelpArticle | null> {
  const res = await fetch(
    `${PUBLIC_ENDPOINT}?action=get&slug=${encodeURIComponent(slug)}`,
    { headers: { 'Content-Type': 'application/json' } },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load article: ${res.status}`);
  const data = await res.json();
  return data.article
    ? { ...data.article, category: normaliseCategory(data.article.category) }
    : null;
}

/** Group an article list by normalised category, preserving sort order. */
export function groupByCategory(
  articles: HelpArticleListItem[],
): Array<{ category: string; articles: HelpArticleListItem[] }> {
  const map = new Map<string, HelpArticleListItem[]>();
  for (const a of articles) {
    const list = map.get(a.category) ?? [];
    list.push(a);
    map.set(a.category, list);
  }
  return [...map.entries()]
    .map(([category, items]) => ({ category, articles: items }))
    .sort((a, b) => a.category.localeCompare(b.category));
}
