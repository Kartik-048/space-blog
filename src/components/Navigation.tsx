'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Sparkles, Image as ImageIcon, Newspaper, BookOpen, Info, Search, Menu, X, Globe, Radio } from 'lucide-react';
import SearchModal from './SearchModal';

const NAV_LINKS = [
  { name: 'Home', href: '/', icon: Globe },
  { name: 'Discoveries', href: '/discoveries', icon: Compass },
  { name: 'Space News', href: '/news', icon: Newspaper },
  { name: 'Gallery', href: '/gallery', icon: ImageIcon },
  { name: 'Space Facts', href: '/facts', icon: Sparkles },
  { name: 'Articles', href: '/articles', icon: BookOpen },
  { name: 'About', href: '/about', icon: Info },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Live UTC clock
    const updateTime = () => {
      const now = new Date();
      setUtcTime(
        now.toUTCString().slice(17, 25) + ' UTC'
      );
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
            ? 'bg-space-950/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40 py-3'
            : 'bg-gradient-to-b from-space-950/90 via-space-950/50 to-transparent py-4'
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

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {NAV_LINKS.map(link => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
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

            {/* Right Side: Telemetry & Search */}
            <div className="flex items-center space-x-3">
              {/* Telemetry pill */}
              <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-space-900/80 border border-white/10 text-[11px] font-mono text-slate-300">
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
                <span className="hidden md:inline font-mono text-[11px] text-slate-400">Search</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-white/10 rounded text-slate-400">
                  /
                </kbd>
              </button>

              {/* Mobile hamburger menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-white/10 bg-space-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 mt-3 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {NAV_LINKS.map(link => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-medium ${
                      isActive
                        ? 'bg-cosmic-cyan/20 text-cosmic-cyan border border-cosmic-cyan/40'
                        : 'bg-white/5 text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-cosmic-cyan" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs text-slate-400 font-mono">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>DATA STREAM: ACTIVE</span>
              </span>
              <span>{utcTime}</span>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
