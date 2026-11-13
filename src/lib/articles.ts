import { Article } from './types';
import articlesData from '@/data/articles.json';
import { getDbArticles } from './db';

export function getAllArticles(): Article[] {
  const dbArticles = getDbArticles();
  const baseArticles = articlesData as Article[];
  const seenSlugs = new Set<string>();
  const combined: Article[] = [];

  for (const art of dbArticles) {
    if (!seenSlugs.has(art.slug)) {
      seenSlugs.add(art.slug);
      combined.push(art);
    }
  }

  for (const art of baseArticles) {
    if (!seenSlugs.has(art.slug)) {
      seenSlugs.add(art.slug);
      combined.push(art);
    }
  }

  return combined.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getFeaturedArticles(): Article[] {
  const all = getAllArticles();
  return all.filter(a => a.featured);
}

export function getArticleBySlug(slug: string): Article | undefined {
  const all = getAllArticles();
  return all.find(a => a.slug === slug);
}

export function getRelatedArticles(currentSlug: string, category: string, limit = 2): Article[] {
  const all = getAllArticles();
  return all
    .filter(a => a.slug !== currentSlug)
    .sort((a, b) => (a.category === category ? -1 : 1))
    .slice(0, limit);
}
