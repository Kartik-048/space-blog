import React from 'react';
import Image from 'next/image';
import { ExternalLink, Clock } from 'lucide-react';
import { NewsItem } from '@/lib/types';
import { getRelativeTime } from '@/lib/utils';

interface NewsCardProps {
  news: NewsItem;
  variant?: 'compact' | 'standard' | 'featured';
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Astronomy: { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'Space Exploration': { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  NASA: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  SpaceX: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  Missions: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  Galaxies: { bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30' },
  Discoveries: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
};

export default function NewsCard({ news, variant = 'standard' }: NewsCardProps) {
  const catStyle = CATEGORY_STYLES[news.category] || {
    bg: 'bg-slate-500/15',
    text: 'text-slate-400',
    border: 'border-slate-500/30',
  };

  if (variant === 'featured') {
    return (
      <article className="group relative rounded-2xl border border-white/10 bg-space-900/90 overflow-hidden shadow-xl hover:border-cosmic-cyan/40 transition-all duration-300 flex flex-col md:flex-row">
        {/* Thumbnail */}
        <div className="relative md:w-1/2 min-h-[260px] sm:min-h-[320px] overflow-hidden bg-space-950">
          <Image
            src={news.thumbnail}
            alt={news.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex items-center space-x-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border backdrop-blur-md ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
            >
              {news.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-2">
              <span className="text-white font-medium">{news.source}</span>
              <span>&bull;</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{getRelativeTime(news.pubDate)}</span>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-serif font-bold text-white group-hover:text-cosmic-cyan transition-colors leading-snug mb-3">
              <a href={news.link} target="_blank" rel="noopener noreferrer">
                {news.title}
              </a>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
              {news.summary}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              Verified Primary Source
            </span>
            <a
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cosmic-cyan/15 hover:bg-cosmic-cyan/25 text-cosmic-cyan border border-cosmic-cyan/30 text-xs font-mono font-medium transition-colors"
            >
              <span>READ MORE</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative rounded-2xl border border-white/10 bg-space-900/80 hover:bg-space-900 overflow-hidden shadow-lg hover:border-cosmic-cyan/40 hover:shadow-glow-cyan/20 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image wrapper */}
        <div className="relative w-full h-48 overflow-hidden bg-space-950">
          <Image
            src={news.thumbnail}
            alt={news.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border backdrop-blur-md ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
            >
              {news.category}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400 mb-2">
            <span className="text-slate-300 font-medium truncate max-w-[120px]">{news.source}</span>
            <span>&bull;</span>
            <span>{getRelativeTime(news.pubDate)}</span>
          </div>

          <h3 className="text-base font-serif font-bold text-white group-hover:text-cosmic-cyan transition-colors leading-snug line-clamp-2 mb-2">
            <a href={news.link} target="_blank" rel="noopener noreferrer">
              {news.title}
            </a>
          </h3>

          <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
            {news.summary}
          </p>
        </div>
      </div>

      {/* Footer link */}
      <div className="px-5 pb-5 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-mono text-slate-400">
          {news.author || news.source}
        </span>
        <a
          href={news.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-xs font-mono font-medium text-cosmic-cyan hover:text-white transition-colors"
        >
          <span>READ MORE</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </div>
    </article>
  );
}
