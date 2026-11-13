'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ApodData } from '@/lib/types';
import { Sparkles, Maximize2, Calendar, User, Info, X, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ApodSectionProps {
  initialApod: ApodData;
}

export default function ApodSection({ initialApod }: ApodSectionProps) {
  const [apod] = useState<ApodData>(initialApod);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  return (
    <>
      <section className="relative my-16 sm:my-24">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cosmic-purple/10 via-cosmic-cyan/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

        <div className="relative rounded-3xl border border-white/15 bg-space-900/90 overflow-hidden shadow-2xl shadow-black/80">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-space-950/60">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 rounded-lg bg-cosmic-cyan/15 text-cosmic-cyan border border-cosmic-cyan/30">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </span>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-cosmic-cyan font-semibold">
                  OFFICIAL DAILY FEATURE
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-white">
                  NASA Astronomy Picture of the Day (APOD)
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-cosmic-gold" />
                <span>{formatDate(apod.date)}</span>
              </span>
              {apod.copyright && (
                <span className="hidden md:flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="line-clamp-1 max-w-[150px]">{apod.copyright}</span>
                </span>
              )}
            </div>
          </div>

          {/* Grid Layout: Visual + Editorial Copy */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Visual Container */}
            <div className="lg:col-span-7 relative group min-h-[380px] sm:min-h-[460px] bg-black flex items-center justify-center overflow-hidden">
              {apod.media_type === 'video' ? (
                <div className="w-full h-full min-h-[380px] flex items-center justify-center bg-black">
                  <iframe
                    src={apod.url}
                    title={apod.title}
                    className="w-full h-full min-h-[380px] border-0"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px]">
                  <Image
                    src={apod.url}
                    alt={apod.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-transparent opacity-60 lg:hidden" />

                  {/* Expand button */}
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute bottom-4 right-4 z-20 flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/95 text-white text-xs font-mono border border-white/20 backdrop-blur-md transition-all shadow-lg cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-cosmic-cyan" />
                    <span>View High-Res</span>
                  </button>
                </div>
              )}
            </div>

            {/* Scientific Explanation Column */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-space-900 to-space-950 border-t lg:border-t-0 lg:border-l border-white/10">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-cosmic-purple mb-2">
                  <span>DISPATCH IDENTIFIER</span>
                  <span>&bull;</span>
                  <span>APOD-{apod.date.replace(/-/g, '')}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug mb-4">
                  {apod.title}
                </h2>

                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 font-light">
                  <p>
                    {showFullExplanation
                      ? apod.explanation
                      : apod.explanation.slice(0, 360) + (apod.explanation.length > 360 ? '...' : '')}
                  </p>
                </div>

                {apod.explanation.length > 360 && (
                  <button
                    onClick={() => setShowFullExplanation(!showFullExplanation)}
                    className="mt-3 text-xs font-mono text-cosmic-cyan hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{showFullExplanation ? 'Show Less' : 'Read Full Scientific Explanation'}</span>
                  </button>
                )}
              </div>

              {/* Attribution and Deep Link */}
              <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Credit & Copyright:</span>
                  <span className="text-slate-200 font-medium">{apod.copyright || 'NASA Goddard Space Flight Center'}</span>
                </div>

                <a
                  href={`https://apod.nasa.gov/apod/ap${apod.date.slice(2).replace(/-/g, '')}.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors text-xs font-mono"
                >
                  <span>Official APOD Site</span>
                  <ExternalLink className="w-3 h-3 text-cosmic-cyan" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-Resolution Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl animate-in fade-in duration-200">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center">
            <div className="relative w-full h-[70vh] sm:h-[80vh]">
              <Image
                src={apod.hdurl || apod.url}
                alt={apod.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center mt-3 text-white">
              <h4 className="text-sm sm:text-base font-serif font-bold">{apod.title}</h4>
              <p className="text-xs text-slate-400 mt-1">
                {formatDate(apod.date)} &bull; Credit: {apod.copyright || 'NASA / STScI'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
