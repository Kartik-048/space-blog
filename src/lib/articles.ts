import { Article } from './types';
import articlesData from '@/data/articles.json';

const ARTICLES: Article[] = articlesData as Article[];

export function getAllArticles(): Article[] {
  return [...ARTICLES].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getFeaturedArticles(): Article[] {
  return ARTICLES.filter(a => a.featured);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug);
}

export function getRelatedArticles(currentSlug: string, category: string, limit = 2): Article[] {
  return ARTICLES
    .filter(a => a.slug !== currentSlug)
    .sort((a, b) => (a.category === category ? -1 : 1))
    .slice(0, limit);
}
