'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Compass, Newspaper, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import articlesData from '@/data/articles.json';
import discoveriesData from '@/data/discoveries.json';
import factsData from '@/data/facts.json';
import fallbackNews from '@/data/fallback-news.json';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        onClose(); // Inverted toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search results
  const matchedArticles = q
    ? articlesData.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      )
    : [];

  const matchedDiscoveries = q
    ? discoveriesData.filter(
        d =>
          d.title.toLowerCase().includes(q) ||
          d.summary.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      )
    : [];

  const matchedNews = q
    ? fallbackNews.filter(
        n =>
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q)
      )
    : [];

  const matchedFacts = q
    ? factsData.filter(
        f =>
          f.topic.toLowerCase().includes(q) ||
          f.title.toLowerCase().includes(q) ||
          f.fact.toLowerCase().includes(q)
      )
    : [];

  const totalResults = matchedArticles.length + matchedDiscoveries.length + matchedNews.length + matchedFacts.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-space-900 border border-white/15 rounded-2xl shadow-2xl shadow-cosmic-cyan/10 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-space-950/60">
          <Search className="w-5 h-5 text-cosmic-cyan mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search discoveries, articles, space news, and facts..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-white mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-mono text-slate-400 hover:text-white bg-white/5 rounded border border-white/10"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q && (
            <div className="py-8 text-center text-slate-400 text-xs sm:text-sm">
              <p className="font-mono mb-2 text-cosmic-cyan">COSMIC ARCHIVE SEARCH</p>
              <p>Type keywords like &quot;black hole&quot;, &quot;JWST&quot;, &quot;Europa&quot;, &quot;exoplanet&quot;, or &quot;Artemis&quot;.</p>
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No astronomical records found matching &quot;<span className="text-white">{query}</span>&quot;.
            </div>
          )}

          {/* Articles */}
          {matchedArticles.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-cosmic-cyan mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Editorial Articles ({matchedArticles.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedArticles.slice(0, 3).map(article => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-cosmic-cyan/10 border border-white/5 hover:border-cosmic-cyan/30 transition-colors group"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-white group-hover:text-cosmic-cyan transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{article.excerpt}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cosmic-cyan shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Discoveries */}
          {matchedDiscoveries.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-cosmic-purple mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>Space Discoveries ({matchedDiscoveries.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedDiscoveries.slice(0, 3).map(disc => (
                  <Link
                    key={disc.id}
                    href={`/discoveries#${disc.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-cosmic-purple/10 border border-white/5 hover:border-cosmic-purple/30 transition-colors group"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-white group-hover:text-cosmic-purple transition-colors">
                        {disc.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{disc.summary}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cosmic-purple shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Space News */}
          {matchedNews.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-cosmic-gold mb-2">
                <Newspaper className="w-3.5 h-3.5" />
                <span>Space News ({matchedNews.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedNews.slice(0, 3).map(item => (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-cosmic-gold/10 border border-white/5 hover:border-cosmic-gold/30 transition-colors group"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-cosmic-gold px-1.5 py-0.5 rounded bg-cosmic-gold/15">
                          {item.source}
                        </span>
                        <h4 className="text-xs sm:text-sm font-medium text-white group-hover:text-cosmic-gold transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.summary}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cosmic-gold shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Space Facts */}
          {matchedFacts.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Space Facts ({matchedFacts.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedFacts.slice(0, 2).map(fact => (
                  <Link
                    key={fact.id}
                    href={`/facts#${fact.id}`}
                    onClick={onClose}
                    className="block p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-colors"
                  >
                    <div className="text-[10px] font-mono text-emerald-400">{fact.topic}</div>
                    <div className="text-xs sm:text-sm font-medium text-white">{fact.title}</div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">{fact.fact}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
