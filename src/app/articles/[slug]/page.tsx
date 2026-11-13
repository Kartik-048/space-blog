import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getRelatedArticles, getAllArticles } from '@/lib/articles';
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, Tag, BookOpen, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: 'Article Not Found — Astronomia' };

  return {
    title: `${article.title} — Astronomia Magazine`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.coverImage }],
    },
  };
}

export default function ArticleSlugPage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(article.slug, article.category, 2);

  // Format content paragraphs
  const paragraphs = article.content.split('\n\n');

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/articles"
          className="inline-flex items-center space-x-2 text-xs font-mono text-cosmic-cyan hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-4 mb-8">
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-cosmic-purple/20 text-cosmic-purple border border-cosmic-purple/30 font-medium">
            {article.category}
          </span>
          <span className="text-slate-400 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-cosmic-gold" />
            <span>{formatDate(article.publishedAt)}</span>
          </span>
          <span>&bull;</span>
          <span className="text-slate-400 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-cosmic-cyan" />
            <span>{article.readingTime}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-black text-white leading-[1.15] tracking-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
          {article.excerpt}
        </p>

        {/* Author Bio Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-white block">{article.author.name}</span>
              <span className="text-xs text-slate-400 font-mono block">{article.author.role}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Large Featured Photograph */}
      <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border border-white/15 mb-4 shadow-2xl bg-space-950">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 900px"
          className="object-cover"
        />
      </div>

      {article.coverCaption && (
        <figcaption className="text-xs font-mono text-slate-400 mb-10 text-center">
          {article.coverCaption}
        </figcaption>
      )}

      {/* Article Body Content */}
      <div className="prose prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-200 font-light">
        {paragraphs.map((p, index) => {
          if (p.startsWith('### ')) {
            return (
              <h3 key={index} className="text-xl sm:text-2xl font-serif font-bold text-white pt-6 mb-2">
                {p.replace('### ', '')}
              </h3>
            );
          }
          if (p.startsWith('> ')) {
            return (
              <blockquote
                key={index}
                className="my-6 pl-4 border-l-2 border-cosmic-purple italic text-slate-300 text-base sm:text-lg bg-cosmic-purple/5 p-4 rounded-r-2xl"
              >
                {p.replace('> ', '')}
              </blockquote>
            );
          }
          return <p key={index}>{p}</p>;
        })}
      </div>

      {/* Tags */}
      <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
        <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
        {article.tags.map(tag => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Related Articles Section */}
      {related.length > 0 && (
        <div className="mt-16 pt-10 border-t border-white/10">
          <div className="flex items-center space-x-2 text-xs font-mono text-cosmic-cyan uppercase tracking-widest mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Recommended Reading</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map(rel => (
              <Link
                key={rel.id}
                href={`/articles/${rel.slug}`}
                className="group rounded-2xl border border-white/10 bg-space-900 p-5 hover:border-cosmic-cyan/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 border border-white/10">
                    <Image
                      src={rel.coverImage}
                      alt={rel.title}
                      fill
                      sizes="300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-cosmic-cyan">{rel.category}</span>
                  <h4 className="text-sm sm:text-base font-serif font-bold text-white group-hover:text-cosmic-cyan transition-colors mt-1">
                    {rel.title}
                  </h4>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{rel.readingTime}</span>
                  <span className="text-cosmic-cyan flex items-center space-x-1">
                    <span>Read</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
