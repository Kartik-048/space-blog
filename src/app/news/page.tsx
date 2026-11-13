'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper, Filter, Search, RefreshCw, Radio, Sparkles, Check } from 'lucide-react';
import { NewsCategory, NewsItem } from '@/lib/types';
import NewsCard from '@/components/NewsCard';

const CATEGORIES: NewsCategory[] = [
  'All',
  'Astronomy',
  'Space Exploration',
  'NASA',
  'SpaceX',
  'Missions',
  'Galaxies',
  'Discoveries',
];

export default function SpaceNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [reconnectionReport, setReconnectionReport] = useState<any>(null);

  const loadNews = async (forceRefresh = false) => {
    if (forceRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const url = `/api/news?limit=100${forceRefresh ? '&refresh=true' : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setNews(json.data);
          if (json.reconnectionReport) {
            setReconnectionReport(json.reconnectionReport);
          }
          if (forceRefresh) {
            setRefreshSuccess(true);
            setTimeout(() => setRefreshSuccess(false), 3000);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load space news:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Filter & sort
  const filteredNews = news
    .filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    })
    .sort((a, b) => {
      const timeA = new Date(a.pubDate).getTime();
      const timeB = new Date(b.pubDate).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cosmic-cyan/15 text-cosmic-cyan border border-cosmic-cyan/30 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>REAL-TIME ASTROPHYSICS & SPACE EXPLORATION DISPATCH</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
          Daily Space News
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
          Continuously synthesized from official NASA news releases, the European Space Agency (ESA), and international space agencies. Free from algorithmic noise, verified by primary sources.
        </p>
      </div>

      {/* Reconnection Catch-up Notification Banner */}
      {reconnectionReport && (
        <div className="mb-8 p-4 rounded-2xl bg-cosmic-purple/15 border border-cosmic-purple/30 text-xs font-mono text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-glow-purple animate-in fade-in">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cosmic-purple/20 text-cosmic-purple shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center space-x-2">
                <span>RECONNECTION CATCH-UP SYNCHRONIZED</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                  ARCHIVE UPDATED
                </span>
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Site offline duration: <span className="text-cosmic-cyan font-bold">{reconnectionReport.offlineDurationFormatted || 'recent shutdown'}</span>.
                Scanned for new cosmic dispatches published since {reconnectionReport.lastNewsDateBeforeOff ? new Date(reconnectionReport.lastNewsDateBeforeOff).toLocaleString() : 'prior period'} and merged <span className="text-emerald-400 font-bold">+{reconnectionReport.newArticlesSynced} new articles</span> into your database.
              </p>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 shrink-0">
            Reconnected: {new Date(reconnectionReport.reconnectedAt).toLocaleTimeString()}
          </span>
        </div>
      )}

      {/* Control Bar: Categories, Search, Sort & Refresh */}
      <div className="bg-space-900/90 border border-white/10 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl space-y-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-4 h-4 text-cosmic-cyan shrink-0 mr-1" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cosmic-cyan text-space-950 font-bold shadow-glow-cyan'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search, Sort, and Refresh Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search news titles, missions, or keywords..."
              className="w-full pl-9 pr-3 py-1.5 bg-space-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cosmic-cyan transition-colors"
            />
          </div>

          <div className="flex items-center space-x-3">
            {/* Sort Order */}
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="bg-space-950 text-slate-300 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-cosmic-cyan cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>

            {/* Refresh Live Feed */}
            <button
              onClick={() => loadNews(true)}
              disabled={isRefreshing}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-colors disabled:opacity-50 cursor-pointer"
              title="Poll latest RSS feeds directly"
            >
              {refreshSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Synced</span>
                </>
              ) : (
                <>
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cosmic-cyan' : ''}`} />
                  <span className="hidden sm:inline">Refresh Feeds</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="py-20 text-center text-cosmic-cyan font-mono text-xs flex items-center justify-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-cosmic-cyan animate-ping" />
          <span>INGESTING RSS FEEDS FROM NASA & ESA...</span>
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="space-y-8">
          {/* Top Featured story if any */}
          {filteredNews[0] && (
            <NewsCard news={filteredNews[0]} variant="featured" />
          )}

          {/* Grid of the remaining news articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.slice(1).map(item => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-slate-400">
          <Newspaper className="w-12 h-12 text-cosmic-cyan mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-serif font-bold text-white mb-1">No News Articles Found</h3>
          <p className="text-xs font-mono">Try adjusting your filter or search criteria.</p>
        </div>
      )}

      {/* Attribution & Legal Notice */}
      <div className="mt-16 p-6 rounded-2xl border border-white/10 bg-space-950 text-xs text-slate-400 font-mono space-y-2">
        <div className="flex items-center space-x-2 text-cosmic-cyan">
          <Sparkles className="w-4 h-4" />
          <span className="font-bold">EDITORIAL STANDARDS & ATTRIBUTION POLICY</span>
        </div>
        <p className="leading-relaxed">
          Astronomia aggregates public domain news feeds published by the National Aeronautics and Space Administration (NASA), European Space Agency (ESA), and peer-reviewed astronomy outlets. Content summaries are synthesized and presented with full source accreditation and direct canonical links. We never fabricate publication timestamps or reproduce copyrighted long-form works.
        </p>
      </div>
    </div>
  );
}
