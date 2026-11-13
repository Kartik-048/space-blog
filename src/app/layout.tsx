import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Starfield from '@/components/Starfield';

export const metadata: Metadata = {
  title: 'ASTRONOMIA — Space & Deep Cosmos Review',
  description:
    'A modern digital astronomy publication and photography journal. Continuously updated with real-time news from NASA and ESA, daily verified astronomical facts, and deep-space imagery.',
  keywords: [
    'astronomy',
    'space news',
    'NASA APOD',
    'JWST',
    'Hubble',
    'black holes',
    'exoplanets',
    'cosmology',
    'astrophysics',
    'space photography',
  ],
  authors: [{ name: 'Astronomia Editorial Team' }],
  openGraph: {
    title: 'ASTRONOMIA — Space & Deep Cosmos Review',
    description:
      'Immersive digital astronomy publication featuring automated NASA and ESA news streams, daily space facts, and high-resolution deep space photography.',
    url: 'https://github.com/Kartik-048/space-blog',
    siteName: 'Astronomia',
    images: [
      {
        url: 'https://images-assets.nasa.gov/image/PIA25328/PIA25328~orig.jpg',
        width: 1200,
        height: 630,
        alt: "Webb's First Deep Field",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASTRONOMIA — Space & Deep Cosmos Review',
    description: 'Real-time astronomy news, high-res deep space photography, and daily cosmic insights.',
    images: ['https://images-assets.nasa.gov/image/PIA25328/PIA25328~orig.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#03050c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-space-950 text-slate-100 antialiased selection:bg-cosmic-cyan/30 min-h-screen flex flex-col relative">
        {/* Dynamic canvas starfield */}
        <Starfield />

        {/* Ambient background glow layers */}
        <div className="fixed inset-0 bg-nebula-gradient pointer-events-none z-0 opacity-40" />

        {/* Global Navigation */}
        <Navigation />

        {/* Main Content Area */}
        <main className="flex-1 relative z-10 pt-20">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
