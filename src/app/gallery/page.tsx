import React from 'react';
import { Camera, Sparkles, Telescope } from 'lucide-react';
import { fetchGalleryItems } from '@/lib/gallery';
import GalleryGrid from '@/components/GalleryGrid';

export const revalidate = 3600; // 1 hour

export default async function GalleryPage() {
  const initialItems = await fetchGalleryItems('All');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cosmic-purple/15 text-cosmic-purple border border-cosmic-purple/30 text-xs font-mono">
          <Telescope className="w-3.5 h-3.5" />
          <span>DEEP COSMOS VISUAL ARCHIVE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
          Space Photography Gallery
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
          High-resolution imagery captured by the James Webb Space Telescope, Hubble Space Telescope, Chandra X-ray Observatory, Juno, and planetary probes. Powered by the NASA Image and Video Library API.
        </p>
      </div>

      {/* Interactive Gallery Component */}
      <GalleryGrid initialItems={initialItems} />

      {/* Footer Info Box */}
      <div className="mt-16 p-6 rounded-2xl border border-white/10 bg-space-950/80 text-xs text-slate-400 font-mono space-y-2">
        <div className="flex items-center space-x-2 text-cosmic-purple">
          <Camera className="w-4 h-4" />
          <span className="font-bold">IMAGE RIGHTS & ASTROPHOTOGRAPHY ACCREDITATION</span>
        </div>
        <p className="leading-relaxed">
          Unless specifically stated otherwise, all astronomical imagery displayed in this gallery is sourced directly from NASA and affiliated partner agencies (ESA, CSA, STScI, JPL-Caltech). NASA materials are generally not protected by copyright and reside in the public domain for educational and scientific communication purposes.
        </p>
      </div>
    </div>
  );
}
