'use client';

import React, { useState } from 'react';
import { Sparkles, Filter, Share2, Check, BookOpen, Quote, Calendar, ArrowRight } from 'lucide-react';
import { getAllFacts, getDailyFact } from '@/lib/facts';
import { Fact } from '@/lib/types';

const TOPICS = [
  'All',
  'Black Holes',
  'Neutron Stars',
  'The Solar System',
  'Galaxies',
  'Exoplanets',
  'Space Exploration',
  'The Observable Universe',
  'Astrophysics',
];

export default function SpaceFactsPage() {
  const allFacts = getAllFacts();
  const todayFact = getDailyFact();
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredFacts = allFacts.filter(fact => {
    if (selectedTopic === 'All') return true;
    return fact.topic.toLowerCase() === selectedTopic.toLowerCase();
  });

  const handleCopy = (fact: Fact) => {
    const text = `Cosmic Fact: "${fact.fact}" — Source: ${fact.source} (via Astronomia Magazine)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(fact.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VERIFIED ASTRONOMICAL PHENOMENA</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
          Daily Space Facts
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
          A curated compendium of empirical astrophysics and planetary science. Rotates deterministically with each calendar day, grounded in observations from NASA, ESA, and peer-reviewed journals.
        </p>
      </div>

      {/* Today's Highlighted Fact */}
      <div className="mb-16">
        <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-3 flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Today&apos;s Featured Scientific Insight &bull; {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>

        <div className="relative rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-space-900 via-space-950 to-space-900 p-8 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {todayFact.topic} &bull; {todayFact.category}
            </span>

            <button
              onClick={() => handleCopy(todayFact)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              {copiedId === todayFact.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Share Fact</span>
                </>
              )}
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
            {todayFact.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light max-w-4xl mb-6">
            {todayFact.fact}
          </p>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-3.5 h-3.5 text-cosmic-gold" />
              <span>Scientific Citation:</span>
              <span className="text-slate-200 font-medium">{todayFact.source}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              {todayFact.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Topic Filter Pills */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-4 h-4 text-emerald-400 shrink-0 mr-1" />
          {TOPICS.map(topic => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedTopic === topic
                  ? 'bg-emerald-500 text-space-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Verified Facts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacts.map(fact => (
          <div
            key={fact.id}
            id={fact.id}
            className="rounded-3xl border border-white/10 bg-space-900/80 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                  {fact.topic}
                </span>
                <button
                  onClick={() => handleCopy(fact)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy Fact"
                >
                  {copiedId === fact.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              <h3 className="text-base font-serif font-bold text-white mb-2 leading-snug">
                {fact.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-4">
                {fact.fact}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="truncate max-w-[180px]">{fact.source}</span>
              <span className="text-emerald-400">Verified</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
