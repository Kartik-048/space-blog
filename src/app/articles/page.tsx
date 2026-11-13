'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Search, Filter, Clock, Calendar, ArrowRight } from 'lucide-react';
import articlesData from '@/data/articles.json';
import { Article } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const CATEGORIES = ['All', 'Astrophysics', 'Astrobiology', 'Cosmology', 'Planetary Science'];

export default function ArticlesPage() {
  const articles: Article[] = articlesData as Article[];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter(a => {
    const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cosmic-purple/15 text-cosmic-purple border border-cosmic-purple/30 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>EDITORIAL ESSAYS & LONG-FORM ESSAYS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
          Editorial Articles
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
          Deep-dive astrophysics essays and theoretical investigations authored by science journalists and visiting researchers.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 bg-space-900/80 p-4 rounded-2xl border border-white/10">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-cosmic-purple shrink-0 mr-1" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cosmic-purple text-white font-bold shadow-glow-purple'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search essay topics or titles..."
            className="w-full pl-9 pr-3 py-1.5 bg-space-950 border border-white/10 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cosmic-purple transition-colors"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredArticles.map(article => (
          <article
            key={article.id}
            className="group rounded-3xl border border-white/10 bg-space-900/90 overflow-hidden shadow-xl hover:border-cosmic-purple/40 hover:shadow-glow-purple/20 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative w-full h-64 overflow-hidden bg-space-950">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-black/75 backdrop-blur-md text-cosmic-purple border border-cosmic-purple/30">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center space-x-3 text-xs font-mono text-slate-400 mb-3">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-cosmic-gold" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-cosmic-cyan" />
                    <span>{article.readingTime}</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-cosmic-purple transition-colors leading-snug mb-3">
                  <Link href={`/articles/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light line-clamp-3">
                  {article.excerpt}
                </p>
              </div>
            </div>

            <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs text-white font-medium block">{article.author.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono block">{article.author.role}</span>
                </div>
              </div>

              <Link
                href={`/articles/${article.slug}`}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-cosmic-purple/15 hover:bg-cosmic-purple text-cosmic-purple hover:text-white border border-cosmic-purple/30 text-xs font-mono font-medium transition-colors"
              >
                <span>Read Essay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
