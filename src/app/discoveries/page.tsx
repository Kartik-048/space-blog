import React from 'react';
import Image from 'next/image';
import { Compass, Calendar, Award, CheckCircle2, Telescope, ArrowRight } from 'lucide-react';
import { getAllDiscoveries } from '@/lib/discoveries';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export const revalidate = 7200;

export default function DiscoveriesPage() {
  const discoveries = getAllDiscoveries();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-14 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cosmic-gold/15 text-cosmic-gold border border-cosmic-gold/30 text-xs font-mono">
          <Compass className="w-3.5 h-3.5" />
          <span>PARADIGM SHIFTS IN ASTROPHYSICS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
          Monumental Space Discoveries
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
          From the first direct shadow of an event horizon to ripples in the spacetime fabric and ancient Martian organic chemistry. The milestones that rewrote cosmological textbooks.
        </p>
      </div>

      {/* Discovery Items Showcase */}
      <div className="space-y-12">
        {discoveries.map((discovery, index) => (
          <article
            key={discovery.id}
            id={discovery.slug}
            className="group rounded-3xl border border-white/15 bg-space-900/90 overflow-hidden shadow-2xl hover:border-cosmic-gold/40 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            {/* Visual Column */}
            <div
              className={`lg:col-span-6 relative min-h-[340px] sm:min-h-[420px] bg-space-950 overflow-hidden ${
                index % 2 === 1 ? 'lg:order-last' : ''
              }`}
            >
              <Image
                src={discovery.imageUrl}
                alt={discovery.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-transparent opacity-60" />

              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-black/75 backdrop-blur-md text-cosmic-gold border border-cosmic-gold/30">
                  {discovery.category}
                </span>
              </div>
            </div>

            {/* Editorial Analysis Column */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center space-x-3 text-xs font-mono text-slate-400 mb-3">
                  <span className="flex items-center space-x-1 text-cosmic-gold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(discovery.date)}</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center space-x-1">
                    <Telescope className="w-3.5 h-3.5 text-slate-400" />
                    <span>{discovery.facility}</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-cosmic-gold transition-colors leading-tight mb-4">
                  {discovery.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-5">
                  {discovery.summary}
                </p>

                {/* Scientific Significance Card */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-xs font-mono text-cosmic-gold">
                    <Award className="w-4 h-4" />
                    <span className="font-semibold uppercase tracking-wider">Astrophysical Impact</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {discovery.significance}
                  </p>
                </div>

                {/* Key Takeaways */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block">
                    Core Empirical Findings:
                  </span>
                  <ul className="space-y-1.5">
                    {discovery.keyTakeaways.map((takeaway, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Archival Reference</span>
                <Link
                  href="/gallery"
                  className="inline-flex items-center space-x-1.5 text-xs font-mono text-cosmic-gold hover:underline"
                >
                  <span>Explore Mission Imagery</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
