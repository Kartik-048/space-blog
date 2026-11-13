'use client';

import React, { useState } from 'react';
import { Fact } from '@/lib/types';
import { Sparkles, Share2, Check, RefreshCw, BookOpen, Quote } from 'lucide-react';
import { getRandomFact } from '@/lib/facts';

interface FactCardProps {
  initialFact: Fact;
}

export default function FactCard({ initialFact }: FactCardProps) {
  const [fact, setFact] = useState<Fact>(initialFact);
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const handleShare = () => {
    const text = `Cosmic Fact: "${fact.fact}" — Source: ${fact.source} (via Astronomia Magazine)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleRotate = () => {
    setIsRotating(true);
    setTimeout(() => {
      setFact(getRandomFact());
      setIsRotating(false);
    }, 250);
  };

  return (
    <div className="relative rounded-3xl border border-cosmic-purple/30 bg-gradient-to-br from-space-900 via-space-950 to-space-900 p-6 sm:p-8 shadow-xl shadow-cosmic-purple/5 overflow-hidden">
      {/* Decorative cosmic nebula glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-cosmic-purple/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cosmic-cyan/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-cosmic-purple/20 text-cosmic-purple border border-cosmic-purple/30">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-cosmic-purple font-semibold block">
              COSMIC INSIGHT OF THE DAY
            </span>
            <span className="text-xs text-slate-400">
              {fact.category} &bull; {fact.topic}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRotate}
            title="Explore another verified fact"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer group"
          >
            <RefreshCw className={`w-4 h-4 group-hover:text-cosmic-cyan transition-transform ${isRotating ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            title="Copy and share fact"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cosmic-purple" />}
          </button>
        </div>
      </div>

      {/* Quote / Fact Content */}
      <div className="relative mb-6">
        <Quote className="absolute -top-3 -left-2 w-8 h-8 text-cosmic-purple/20 pointer-events-none" />
        <h3 className="text-lg sm:text-xl font-serif font-bold text-white mb-3 pl-4">
          {fact.title}
        </h3>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light pl-4">
          {fact.fact}
        </p>
      </div>

      {/* Footer / Attribution */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs font-mono">
        <div className="flex items-center space-x-1.5 text-slate-400">
          <BookOpen className="w-3.5 h-3.5 text-cosmic-gold" />
          <span>Scientific Verification:</span>
          <span className="text-slate-300 font-medium">{fact.source}</span>
        </div>

        <div className="flex items-center space-x-1.5">
          {fact.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
