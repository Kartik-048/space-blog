import React from 'react';
import { Telescope, Cpu, Globe, ShieldCheck, Heart, Radio, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      {/* Header */}
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cosmic-cyan/15 text-cosmic-cyan border border-cosmic-cyan/30 text-xs font-mono">
          <Telescope className="w-3.5 h-3.5" />
          <span>EDITORIAL CHARTER & ARCHITECTURE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
          About Astronomia
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
          An autonomous, continuous digital publication chronicling humanity&apos;s exploration of the observable universe through verified science and high-resolution astronomy photography.
        </p>
      </div>

      {/* Mission & Purpose */}
      <div className="space-y-12">
        <section className="rounded-3xl border border-white/10 bg-space-900/90 p-8 sm:p-10 shadow-xl space-y-4">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center space-x-2.5">
            <Globe className="w-5 h-5 text-cosmic-cyan" />
            <span>The Editorial Mission</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            Astronomia was conceived to bridge the divide between dry academic astrophysics papers and algorithm-driven sensationalist clickbait. Our mandate is clear: present genuine observational data, groundbreaking discoveries, and deep-space photography with elegance, rigor, and aesthetic reverence for the cosmos.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            We believe that looking upward into deep space inspires philosophical perspective, scientific literacy, and an enduring sense of wonder for the fragile planetary home we share.
          </p>
        </section>

        {/* How the Autonomous System Works */}
        <section className="rounded-3xl border border-white/10 bg-space-900/90 p-8 sm:p-10 shadow-xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center space-x-2.5">
            <Cpu className="w-5 h-5 text-cosmic-purple" />
            <span>Autonomous Ingestion Engine</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            This magazine is engineered to update automatically without manual editorial intervention:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-mono text-cosmic-cyan font-bold block">1. NASA APOD Pipeline</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connects directly to the NASA Astronomy Picture of the Day API and NASA Science WordPress endpoint, parsing high-resolution space photographs and verified descriptions daily.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-mono text-cosmic-purple font-bold block">2. RSS News Aggregator</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                In-flight XML feed parser synchronizes with official RSS feeds from NASA, the European Space Agency, and global astrophysics centers, normalizing and categorizing stories in real time.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-mono text-cosmic-gold font-bold block">3. NASA Image & Video Library</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Queries the vast, public-domain NASA Images API across galaxies, nebulas, exoplanets, and spacecraft, streaming full-resolution assets on-demand.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-mono text-emerald-400 font-bold block">4. Verified Fact Rotation</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                A deterministic calendar rotation cycles through empirically confirmed astrophysics phenomena, ensuring each day offers a new lesson in cosmic physics.
              </p>
            </div>
          </div>
        </section>

        {/* Data Sources and Zero-Cost Architecture */}
        <section className="rounded-3xl border border-white/10 bg-space-900/90 p-8 sm:p-10 shadow-xl space-y-4">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Zero-Cost & Open Science Commitment</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            Astronomia is built entirely on open web standards, utilizing 100% free and open public endpoints. No paid subscriptions, API tiers, or proprietary paywalls are required to run this publication.
          </p>

          <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2">
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cosmic-cyan" />
              <span>NASA Open APIs: https://api.nasa.gov</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cosmic-purple" />
              <span>NASA Image Library: https://images-api.nasa.gov</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cosmic-gold" />
              <span>NASA RSS Feeds: https://www.nasa.gov/rss-feeds/</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>ESA Portal Feeds: https://www.esa.int</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
