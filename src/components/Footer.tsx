'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Telescope, ExternalLink, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative border-t border-white/10 bg-space-950 text-slate-300 pt-16 pb-12 overflow-hidden z-10">
      {/* Ambient glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cosmic-cyan/50 to-transparent" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-32 bg-cosmic-cyan/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 text-white">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cosmic-purple to-cosmic-cyan p-[1.5px]">
                <div className="w-full h-full rounded-full bg-space-950 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-cosmic-cyan" />
                </div>
              </div>
              <span className="font-serif tracking-widest text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                ASTRONOMIA
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              An independent, digital publication chronicling humanity&apos;s journey into the cosmos.
              Powered by real-time automated data streams from NASA, the European Space Agency, and global astrophysics observatories.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs font-mono text-cosmic-cyan">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
              <span>LIVE AUTOMATED DATA INGESTION: ONLINE</span>
            </div>
          </div>

          {/* Editorial Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-cosmic-cyan transition-colors">Home Edition</Link>
              </li>
              <li>
                <Link href="/discoveries" className="hover:text-cosmic-cyan transition-colors">Landmark Discoveries</Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-cosmic-cyan transition-colors">Daily Space News</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-cosmic-cyan transition-colors">Photography Gallery</Link>
              </li>
              <li>
                <Link href="/facts" className="hover:text-cosmic-cyan transition-colors">Daily Space Facts</Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-cosmic-cyan transition-colors">Editorial Articles</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cosmic-cyan transition-colors">About & Sources</Link>
              </li>
            </ul>
          </div>

          {/* Scientific Sources & Credits */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white">Data & Observatories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://science.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>NASA Science Directorate</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://images.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>NASA Image & Video Library</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://apod.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Astronomy Picture of the Day</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.esa.int"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>European Space Agency (ESA)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://webbtelescope.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>STScI / Webb Telescope</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white">Cosmic Dispatch</h4>
            <p className="text-xs text-slate-400">
              Receive our curated weekly digest of astronomical discoveries and deep-space captures.
            </p>
            {subscribed ? (
              <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Subscribed! Welcome to the mission log.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="astronomer@deepspace.org"
                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cosmic-cyan transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-1 py-2 px-3 bg-cosmic-cyan/20 hover:bg-cosmic-cyan/30 text-cosmic-cyan border border-cosmic-cyan/40 rounded-xl text-xs font-medium transition-all group"
                >
                  <span>Join Weekly Dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <Telescope className="w-4 h-4 text-cosmic-cyan" />
            <span>&copy; {new Date().getFullYear()} Astronomia Magazine. Public astronomical imagery courtesy of NASA/ESA/JPL-Caltech.</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/about" className="hover:text-slate-300 transition-colors">License & Attribution</Link>
            <span>&bull;</span>
            <span className="font-mono text-[11px] text-slate-400">STATUS: NOMINAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
