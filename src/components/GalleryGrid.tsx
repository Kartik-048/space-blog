'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryCategory, GalleryItem } from '@/lib/types';
import { Maximize2, X, Calendar, User, Search, Filter, Compass, Tag, Download } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface GalleryGridProps {
  initialItems: GalleryItem[];
}

const CATEGORIES: GalleryCategory[] = [
  'All',
  'Galaxies',
  'Nebulas',
  'Planets',
  'Moons',
  'Black Holes',
  'Solar System',
  'Deep Space',
  'Spacecraft',
];

export default function GalleryGrid({ initialItems }: GalleryGridProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryChange = async (cat: GalleryCategory) => {
    setSelectedCategory(cat);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/gallery?category=${encodeURIComponent(cat)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setItems(json.data);
        }
      }
    } catch (e) {
      console.error('Error fetching gallery category:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/gallery?category=${encodeURIComponent(selectedCategory)}&q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setItems(json.data);
        }
      }
    } catch (e) {
      console.error('Error searching gallery:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Category Filter Pills & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Categories scrollable pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-4 h-4 text-cosmic-cyan shrink-0 mr-1" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cosmic-cyan text-space-950 font-bold shadow-glow-cyan'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearch} className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search NASA Image Library..."
            className="w-full pl-9 pr-3 py-1.5 bg-space-900 border border-white/10 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cosmic-cyan transition-colors"
          />
        </form>
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="py-12 text-center text-cosmic-cyan font-mono text-xs flex items-center justify-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-cosmic-cyan animate-ping" />
          <span>QUERYING NASA ASTROPHYSICS IMAGE ARCHIVES...</span>
        </div>
      )}

      {/* Responsive Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(item => (
          <div
            key={item.nasa_id}
            onClick={() => setActiveItem(item)}
            className="group relative rounded-2xl overflow-hidden border border-white/10 bg-space-900 shadow-xl cursor-pointer hover:border-cosmic-cyan/50 hover:shadow-glow-cyan/20 transition-all duration-300 flex flex-col"
          >
            {/* Visual Preview */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-space-950">
              <Image
                src={item.thumbUrl}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-transparent opacity-80" />

              {/* Category badge */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/60 backdrop-blur-md text-cosmic-cyan border border-white/10">
                  {item.category}
                </span>
              </div>

              {/* Fullscreen icon on hover */}
              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="p-1.5 rounded-full bg-black/70 backdrop-blur-md text-white block">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 mb-1">
                  <span>{formatDate(item.date_created)}</span>
                  <span>&bull;</span>
                  <span>{item.center || 'NASA'}</span>
                </div>
                <h4 className="text-sm font-serif font-bold text-white group-hover:text-cosmic-cyan transition-colors line-clamp-2 leading-tight">
                  {item.title}
                </h4>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !isLoading && (
        <div className="py-16 text-center text-slate-400">
          <Compass className="w-10 h-10 text-cosmic-cyan mx-auto mb-3 opacity-50" />
          <p className="font-serif text-lg text-white">No images found for this category</p>
          <p className="text-xs font-mono mt-1">Try switching to &quot;All&quot; or refining your search term.</p>
        </div>
      )}

      {/* Full-Screen High-Resolution Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setActiveItem(null)}
        >
          <button
            onClick={() => setActiveItem(null)}
            className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-space-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row"
            onClick={e => e.stopPropagation()}
          >
            {/* Image display */}
            <div className="relative lg:w-3/5 min-h-[350px] sm:min-h-[480px] bg-black flex items-center justify-center">
              <Image
                src={activeItem.highResUrl || activeItem.thumbUrl}
                alt={activeItem.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Details Column */}
            <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[480px] bg-space-950">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cosmic-cyan/15 text-cosmic-cyan border border-cosmic-cyan/30">
                    {activeItem.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    NASA ID: {activeItem.nasa_id}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-serif font-bold text-white leading-snug">
                  {activeItem.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {activeItem.description}
                </p>

                {/* Metadata list */}
                <div className="space-y-2 pt-3 border-t border-white/10 text-xs font-mono text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cosmic-gold" />
                      <span>Date Created:</span>
                    </span>
                    <span className="text-slate-200">{formatDate(activeItem.date_created)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-cosmic-cyan" />
                      <span>Credit / Center:</span>
                    </span>
                    <span className="text-slate-200 line-clamp-1">{activeItem.photographer || activeItem.center || 'NASA'}</span>
                  </div>
                </div>

                {/* Keywords */}
                {activeItem.keywords && activeItem.keywords.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1.5">KEYWORDS</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeItem.keywords.slice(0, 6).map(kw => (
                        <span key={kw} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3">
                <a
                  href={activeItem.highResUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-cosmic-cyan text-space-950 font-mono text-xs font-bold hover:bg-cosmic-cyan/90 transition-all shadow-glow-cyan"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Original High-Res</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
