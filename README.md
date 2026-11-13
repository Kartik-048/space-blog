# ASTRONOMIA — Space & Deep Cosmos Review 🌌🔭

An autonomous digital astronomy magazine and space photography publication. Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**, designed to look and feel like a high-end scientific periodical.

The magazine automatically fetches, normalizes, categorizes, and updates its content using free NASA/ESA APIs and live RSS feeds—requiring **zero manual daily publication**.

---

## 🌟 Key Features

### 1. Autonomous Content Ingestion
- **NASA APOD (Astronomy Picture of the Day)**: Automatically syncs the latest high-resolution space photography, scientific explanations, and copyright credits.
- **NASA & ESA RSS Aggregator**: Continuously pulls and categorizes recent stories into *Astronomy, Space Exploration, NASA, SpaceX, Missions, Galaxies, and Discoveries*. Deduplicates articles and provides direct "READ MORE" links to canonical sources.
- **NASA Image and Video Library**: Direct access to `https://images-api.nasa.gov` with categories (*Galaxies, Nebulas, Planets, Moons, Black Holes, Solar System, Deep Space, Spacecraft*) and high-res lightbox previews.
- **Daily Space Facts Rotation Engine**: A verified collection of empirical astrophysics facts that deterministically rotates every calendar day.

### 2. Deep Editorial Long-Form Section
- A dedicated structure (`src/data/articles.json`) for publishing long-form astrophysics essays and investigations, complete with estimated reading times, author profiles, and related reading recommendations.

### 3. Landmark Discoveries Showcase
- Interactive summaries of paradigm-shifting astronomical milestones: JWST Deep Field SMACS 0723, LIGO Gravitational Waves, EHT M87* Black Hole shadow, Perseverance Mars organic biosignatures, and DART asteroid deflection.

### 4. Zero-Cost & Resilient Architecture
- **100% Free**: Operates using public endpoints without any paid subscriptions.
- **Graceful Fallbacks**: Pre-seeded with authentic curated datasets (`src/data/`) to guarantee the magazine never breaks if an external API experiences downtime or rate-limiting.
- **Interactive Starfield Canvas**: GPU-accelerated background rendering twinkling stars, shooting meteors, and ambient nebula dust.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js**: v18.17+ (v20 or v24 recommended)
- **npm**: v9+

### 1. Clone & Install
```bash
git clone https://github.com/Kartik-048/space-blog.git
cd space-blog
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
> **Note:** The website runs out-of-the-box with `DEMO_KEY`. To increase NASA API rate limits, get a free key instantly at [api.nasa.gov](https://api.nasa.gov).

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Production

### Option A: Deploy to Vercel (Recommended)
1. Push your repository to GitHub (`Kartik-048/space-blog`).
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Framework preset will automatically detect **Next.js**.
4. (Optional) Set `NASA_API_KEY` in Environment Variables.
5. Click **Deploy**.

### Option B: Deploy to Netlify
1. Connect your GitHub repository in the Netlify dashboard.
2. Build command: `npm run build`
3. Publish directory: `.next`
4. The `@netlify/plugin-nextjs` will automatically handle App Router dynamic API routes and ISR.

### Option C: Production Node.js Server
```bash
npm run build
npm run start
```

---

## 🛠️ Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Global space shell, nav, footer, metadata
│   │   ├── page.tsx           # Homepage (Hero, APOD, News, Facts, Discoveries)
│   │   ├── news/page.tsx      # Real-time RSS news hub with filters & search
│   │   ├── gallery/page.tsx   # NASA Image Library explorer & full-screen lightbox
│   │   ├── discoveries/page.tsx # Monumental space discoveries showcase
│   │   ├── facts/page.tsx     # Space Fact of the Day calendar & explorer
│   │   ├── articles/          # Editorial essays & long-form reading view
│   │   ├── about/page.tsx     # Editorial charter, pipeline documentation
│   │   └── api/
│   │       ├── apod/route.ts  # NASA APOD proxy with ISR caching
│   │       ├── news/route.ts  # RSS multi-feed aggregator & categorizer
│   │       ├── gallery/route.ts # NASA Image Library query handler
│   │       └── sync/route.ts  # Background sync trigger endpoint
│   ├── components/
│   │   ├── Navigation.tsx     # Header with live UTC clock & search modal trigger
│   │   ├── Footer.tsx         # Attribution, sources, newsletter dispatch
│   │   ├── Starfield.tsx      # Canvas starfield & shooting meteor generator
│   │   ├── ApodSection.tsx    # Interactive APOD feature & high-res modal
│   │   ├── NewsCard.tsx       # Magazine-style card with canonical link
│   │   ├── FactCard.tsx       # Rotating daily fact card with share feature
│   │   ├── GalleryGrid.tsx    # Category pills & full-screen photo lightbox
│   │   └── SearchModal.tsx    # Universal keyboard-accessible search modal
│   ├── lib/
│   │   ├── apod.ts            # NASA APOD fetching logic with dual fallbacks
│   │   ├── rss.ts             # Fast XML RSS parsing & deduplication
│   │   ├── gallery.ts         # NASA Image Library API client
│   │   ├── facts.ts           # Verified astronomical facts engine
│   │   ├── discoveries.ts     # Discoveries repository
│   │   └── articles.ts        # Editorial articles repository
│   └── data/
│       ├── facts.json         # 15+ verified astrophysics facts
│       ├── discoveries.json   # 5 landmark scientific discoveries
│       ├── fallback-news.json # Resilient baseline news cache
│       └── articles.json      # Original long-form magazine articles
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 📜 Public Domain & Attribution Policy

All astronomical imagery and press release materials belong to public domain archives provided by:
- **NASA** (National Aeronautics and Space Administration)
- **ESA** (European Space Agency)
- **STScI** (Space Telescope Science Institute)
- **JPL-Caltech** (Jet Propulsion Laboratory)
- **Event Horizon Telescope Collaboration**

Content is ingested and summarized with full attribution and canonical links.
