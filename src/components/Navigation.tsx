'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Sparkles, Image as ImageIcon, Newspaper, BookOpen, Info, Search, Menu, X, Globe, Radio, ArrowRight, ChevronRight, Layers } from 'lucide-react';
import SearchModal from './SearchModal';

const PRIMARY_LINKS = [
  { name: 'Space News', href: '/news', icon: Newspaper },
  { name: 'Gallery', href: '/gallery', icon: ImageIcon },
  { name: 'Discoveries', href: '/discoveries', icon: Compass },
];

const SECTION_GROUPS = [
  {
    title: 'Editorial & News',
    icon: Newspaper,
    links: [
      { name: 'Daily Space News', href: '/news', desc: 'Real-time automated NASA & ESA stories' },
      { name: 'Editorial Articles', href: '/articles', desc: 'In-depth essays on astrophysics' },
    ],
  },
  {
    title: 'Visuals & Observatories',
    icon: ImageIcon,
    links: [
      { name: 'Photography Gallery', href: '/gallery', desc: 'High-res NASA image & video library' },
      { name: 'APOD Feature', href: '/#apod', desc: 'Astronomy picture of the day' },
    ],
  },
  {
    title: 'Science & Archive',
    icon: Compass,
    links: [
      { name: 'Landmark Discoveries', href: '/discoveries', desc: 'JWST, Black holes, Gravitational waves' },
      { name: 'Daily Space Facts', href: '/facts', desc: 'Verified date-rotating astrophysics facts' },
      { name: 'About & Sources', href: '/about', desc: 'Editorial charter & data pipelines' },
    ],
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-space-950/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40 py-3'
            : 'bg-gradient-to-b from-space-950/95 via-space-950/60 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo / Branding */}
            <Link href="/" className="group flex items-center space-x-3 text-white">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-cosmic-purple via-cosmic-blue to-cosmic-cyan p-[1.5px] shadow-glow-cyan/50 transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-space-950 flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-cosmic-cyan animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-widest text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-cosmic-cyan bg-clip-text text-transparent group-hover:text-white transition-colors">
                  ASTRONOMIA
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-cosmic-cyan/80 font-mono -mt-1">
                  Space & Cosmos Review
                </span>
              </div>
            </Link>

            {/* Clean Center Navigation: Primary Quick Links */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors ${
                  pathname === '/'
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </Link>
              {PRIMARY_LINKS.map(link => {
                const isActive = pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors ${
                      isActive
                        ? 'bg-cosmic-cyan/15 text-cosmic-cyan border border-cosmic-cyan/30 shadow-glow-cyan/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 opacity-80" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls: Telemetry, Search & 3-Bars Menu Button */}
            <div className="flex items-center space-x-2.5">
              {/* Telemetry pill */}
              <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-space-900/80 border border-white/10 text-[11px] font-mono text-slate-300">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>{utcTime || 'LIVE SYNC'}</span>
              </div>

              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer group"
                aria-label="Search articles and discoveries"
              >
                <Search className="w-3.5 h-3.5 text-cosmic-cyan group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline font-mono text-[11px] text-slate-400">Search</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-white/10 rounded text-slate-400">
                  /
                </kbd>
              </button>

              {/* 3-BARS (☰) SECTIONS DRAWER BUTTON */}
              <button
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cosmic-cyan/15 hover:bg-cosmic-cyan/25 border border-cosmic-cyan/30 text-cosmic-cyan hover:text-white transition-all cursor-pointer shadow-glow-cyan/20"
                aria-label="Open Sections Menu"
              >
                <Menu className="w-4 h-4" />
                <span className="text-xs font-mono font-bold tracking-wider">Sections</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3-BARS MEGA-DRAWER OVERLAY */}
        {drawerOpen && (
          <div className="fixed inset-0 top-[65px] z-50 bg-black/85 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-cosmic-cyan font-bold block">
                    MAGAZINE SECTIONS DIRECTORY
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                    Explore All Astronomia Departments
                  </h2>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer"
                  aria-label="Close sections"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3 Clean Section Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SECTION_GROUPS.map((group, idx) => {
                  const GroupIcon = group.icon;
                  return (
                    <div
                      key={group.title}
                      className="p-6 rounded-3xl bg-space-900 border border-white/10 hover:border-cosmic-cyan/40 transition-colors shadow-xl space-y-4"
                    >
                      <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10">
                        <span className="p-2 rounded-xl bg-cosmic-cyan/15 text-cosmic-cyan">
                          <GroupIcon className="w-4 h-4" />
                        </span>
                        <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-white">
                          {group.title}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {group.links.map(link => (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setDrawerOpen(false)}
                            className="block p-3 rounded-2xl bg-white/5 hover:bg-cosmic-cyan/15 border border-white/5 hover:border-cosmic-cyan/30 transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-serif font-bold text-white group-hover:text-cosmic-cyan transition-colors">
                                {link.name}
                              </span>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cosmic-cyan group-hover:translate-x-1 transition-all" />
                            </div>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                              {link.desc}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Bar */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-4">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>DATA STREAM: ACTIVE &bull; NASA OPEN API</span>
                </div>
                <span>{utcTime}</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
