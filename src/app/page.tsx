import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Compass, Sparkles, Newspaper, Image as ImageIcon, Flame, ChevronRight } from 'lucide-react';
import { getApod } from '@/lib/apod';
import { fetchSpaceNews } from '@/lib/rss';
import { getDailyFact } from '@/lib/facts';
import { getAllDiscoveries } from '@/lib/discoveries';
import { getFeaturedArticles } from '@/lib/articles';
import { fetchGalleryItems } from '@/lib/gallery';
import ApodSection from '@/components/ApodSection';
import NewsCard from '@/components/NewsCard';
import FactCard from '@/components/FactCard';
import { formatDate } from '@/lib/utils';

export const revalidate = 1800; // 30 minutes ISR revalidation

export default async function HomePage() {
  const [apod, news, dailyFact, discoveries, featuredArticles, galleryItems] = await Promise.all([
    getApod(),
    fetchSpaceNews(),
    Promise.resolve(getDailyFact()),
    Promise.resolve(getAllDiscoveries()),
    Promise.resolve(getFeaturedArticles()),
    fetchGalleryItems('All'),
  ]);

  const primaryEditorial = featuredArticles[0];
  const secondaryEditorial = featuredArticles[1];
  const latestNewsSlice = news.slice(0, 6);
  const featuredDiscoveries = discoveries.slice(0, 3);
  const galleryPreview = galleryItems.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden border border-white/15 my-6 sm:my-8 bg-space-900 shadow-2xl shadow-black/80">
        {/* Background Hero Image */}
        <div className="relative min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] w-full flex items-end">
          <Image
            src="https://images-assets.nasa.gov/image/PIA25442/PIA25442~orig.jpg"
            alt="Cosmic Cliffs of the Carina Nebula by JWST"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105 animate-pulse-glow"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/60 to-black/30" />
          <div className="absolute inset-0 bg-radial-at-t from-transparent via-transparent to-space-950/80" />

          {/* Hero Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-16 max-w-4xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono text-cosmic-cyan">
              <span className="w-2 h-2 rounded-full bg-cosmic-cyan animate-ping inline-block" />
              <span>ISSUE № 48 &bull; DIGITAL EDITION &bull; CONTINUOUS TELEMETRY</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-white leading-[1.1] tracking-tight">
              Unlocking the Secrets of the Deep Cosmos
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-200 font-light leading-relaxed max-w-2xl">
              From the primordial light captured by the James Webb Space Telescope to oceans concealed beneath alien ice sheets—explore humanity&apos;s frontier science through verified astronomical data and breathtaking space photography.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/news"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-cosmic-cyan hover:bg-cosmic-cyan/90 text-space-950 font-bold text-xs sm:text-sm font-mono transition-all shadow-glow-cyan"
              >
                <Newspaper className="w-4 h-4" />
                <span>Explore Daily Space News</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/gallery"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md text-xs sm:text-sm font-mono transition-all"
              >
                <ImageIcon className="w-4 h-4 text-cosmic-cyan" />
                <span>Photography Gallery</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Bottom Telemetry Bar */}
        <div className="border-t border-white/10 bg-space-950/80 backdrop-blur-md px-6 py-3 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-4">
          <div className="flex items-center space-x-4">
            <span>NASA APOD: CONNECTED</span>
            <span>&bull;</span>
            <span>JWST PIPELINE: NOMINAL</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="hidden sm:inline">ESA SCIENCE: ACTIVE</span>
          </div>
          <span className="text-slate-400">Imagery: Carina Nebula &apos;Cosmic Cliffs&apos; (NASA/ESA/CSA/STScI)</span>
        </div>
      </section>

      {/* 3-BAR QUICK NAVIGATION SWITCHER */}
      <div className="sticky top-20 z-30 my-6 bg-space-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        <a
          href="#news"
          className="flex-1 min-w-[130px] flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-cosmic-cyan/15 border border-white/5 hover:border-cosmic-cyan/30 text-slate-200 hover:text-cosmic-cyan text-xs font-mono font-medium transition-all"
        >
          <Newspaper className="w-3.5 h-3.5 text-cosmic-cyan" />
          <span>1. Space News</span>
        </a>

        <a
          href="#gallery"
          className="flex-1 min-w-[130px] flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-cosmic-purple/15 border border-white/5 hover:border-cosmic-purple/30 text-slate-200 hover:text-cosmic-purple text-xs font-mono font-medium transition-all"
        >
          <ImageIcon className="w-3.5 h-3.5 text-cosmic-purple" />
          <span>2. Photography</span>
        </a>

        <a
          href="#discoveries"
          className="flex-1 min-w-[130px] flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-cosmic-gold/15 border border-white/5 hover:border-cosmic-gold/30 text-slate-200 hover:text-cosmic-gold text-xs font-mono font-medium transition-all"
        >
          <Compass className="w-3.5 h-3.5 text-cosmic-gold" />
          <span>3. Discoveries & Facts</span>
        </a>
      </div>

      {/* 2. FEATURED ASTRONOMY EDITORIAL */}
      {primaryEditorial && (
        <section className="my-16 sm:my-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 rounded-lg bg-cosmic-purple/15 text-cosmic-purple border border-cosmic-purple/30">
                <Flame className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-cosmic-purple font-semibold">
                  COVER STORY
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Featured Astronomy Editorial
                </h2>
              </div>
            </div>

            <Link
              href="/articles"
              className="text-xs font-mono text-cosmic-cyan hover:underline flex items-center space-x-1"
            >
              <span>View All Articles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Primary Main Feature */}
            <div className="lg:col-span-8 group relative rounded-3xl overflow-hidden border border-white/15 bg-space-900 shadow-2xl flex flex-col justify-end min-h-[420px] sm:min-h-[480px]">
              <Image
                src={primaryEditorial.coverImage}
                alt={primaryEditorial.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/70 to-transparent" />

              <div className="relative z-10 p-6 sm:p-8 space-y-3">
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="px-2.5 py-0.5 rounded-full bg-cosmic-purple/20 text-cosmic-purple border border-cosmic-purple/40">
                    {primaryEditorial.category}
                  </span>
                  <span className="text-slate-400">{formatDate(primaryEditorial.publishedAt)}</span>
                  <span>&bull;</span>
                  <span className="text-slate-400">{primaryEditorial.readingTime}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight group-hover:text-cosmic-cyan transition-colors">
                  <Link href={`/articles/${primaryEditorial.slug}`}>
                    {primaryEditorial.title}
                  </Link>
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed max-w-2xl font-light">
                  {primaryEditorial.excerpt}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/20">
                      <Image
                        src={primaryEditorial.author.avatar}
                        alt={primaryEditorial.author.name}
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-slate-300 font-medium">{primaryEditorial.author.name}</span>
                  </div>

                  <Link
                    href={`/articles/${primaryEditorial.slug}`}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-cosmic-cyan text-white hover:text-space-950 text-xs font-mono font-medium transition-all"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Secondary Feature Card */}
            {secondaryEditorial && (
              <div className="lg:col-span-4 rounded-3xl border border-white/15 bg-space-900 p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 border border-white/10">
                    <Image
                      src={secondaryEditorial.coverImage}
                      alt={secondaryEditorial.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-cosmic-cyan border border-white/10">
                      {secondaryEditorial.category}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 block mb-1">
                    {formatDate(secondaryEditorial.publishedAt)} &bull; {secondaryEditorial.readingTime}
                  </span>

                  <h4 className="text-lg font-serif font-bold text-white hover:text-cosmic-cyan transition-colors leading-snug mb-2">
                    <Link href={`/articles/${secondaryEditorial.slug}`}>
                      {secondaryEditorial.title}
                    </Link>
                  </h4>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {secondaryEditorial.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{secondaryEditorial.author.name}</span>
                  <Link
                    href={`/articles/${secondaryEditorial.slug}`}
                    className="text-xs font-mono text-cosmic-cyan hover:underline flex items-center space-x-1"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. ASTRONOMY PICTURE OF THE DAY (APOD) */}
      <div id="apod" className="scroll-mt-28">
        <ApodSection initialApod={apod} />
      </div>

      {/* 4. DAILY SPACE FACT OF THE DAY */}
      <section className="my-16 sm:my-20">
        <FactCard initialFact={dailyFact} />
      </section>

      {/* 5. LATEST SPACE NEWS (AUTOMATIC NASA/ESA FEED) */}
      <section id="news" className="my-16 sm:my-20 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cosmic-cyan uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
              <span>LIVE AUTOMATED INGESTION &bull; NASA & ESA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Latest Space News & Dispatch
            </h2>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center space-x-1 text-xs font-mono text-cosmic-cyan hover:underline self-start sm:self-auto"
          >
            <span>View All News & Filters ({news.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNewsSlice.map(item => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </section>

      {/* 6. FEATURED SPACE DISCOVERIES */}
      <section id="discoveries" className="my-16 sm:my-20 scroll-mt-28">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2.5">
            <span className="p-1.5 rounded-lg bg-cosmic-gold/15 text-cosmic-gold border border-cosmic-gold/30">
              <Compass className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-cosmic-gold font-semibold">
                HISTORIC MILESTONES
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Featured Space Discoveries
              </h2>
            </div>
          </div>

          <Link
            href="/discoveries"
            className="text-xs font-mono text-cosmic-gold hover:underline flex items-center space-x-1"
          >
            <span>All Discoveries</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDiscoveries.map(disc => (
            <div
              key={disc.id}
              className="rounded-3xl border border-white/10 bg-space-900/80 p-6 flex flex-col justify-between hover:border-cosmic-gold/40 transition-colors shadow-lg"
            >
              <div>
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 border border-white/10 bg-space-950">
                  <Image
                    src={disc.imageUrl}
                    alt={disc.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-cosmic-gold border border-white/10">
                    {disc.category}
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 mb-2">
                  {disc.facility} &bull; {disc.date}
                </div>

                <h3 className="text-base font-serif font-bold text-white mb-2 leading-snug">
                  {disc.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {disc.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Milestone</span>
                <Link
                  href={`/discoveries#${disc.slug}`}
                  className="text-xs font-mono text-cosmic-gold hover:underline flex items-center space-x-1"
                >
                  <span>Explore Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. SPACE PHOTOGRAPHY GALLERY PREVIEW */}
      <section id="gallery" className="my-16 sm:my-20 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cosmic-cyan uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NASA IMAGE & VIDEO LIBRARY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Space Photography Gallery
            </h2>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-cosmic-cyan/15 hover:bg-cosmic-cyan/25 text-cosmic-cyan border border-cosmic-cyan/30 text-xs font-mono transition-colors self-start sm:self-auto"
          >
            <span>Browse Full Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {galleryPreview.map(item => (
            <Link
              key={item.nasa_id}
              href={`/gallery`}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-space-900 shadow-lg block"
            >
              <Image
                src={item.thumbUrl}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                <span className="text-[10px] font-mono text-cosmic-cyan line-clamp-1">{item.category}</span>
                <span className="text-[11px] font-serif font-bold text-white line-clamp-1">{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
