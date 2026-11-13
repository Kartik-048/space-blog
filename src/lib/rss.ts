import { XMLParser } from 'fast-xml-parser';
import { NewsCategory, NewsItem } from './types';
import fallbackNews from '@/data/fallback-news.json';
import { getDbNews, saveDbNews, saveDbConfig } from './db';

const RSS_FEEDS = [
  {
    url: 'https://www.nasa.gov/news-release/feed/',
    sourceName: 'NASA News Release',
    defaultCategory: 'NASA' as NewsCategory,
  },
  {
    url: 'https://www.nasa.gov/feed/',
    sourceName: 'NASA Missions & Science',
    defaultCategory: 'Space Exploration' as NewsCategory,
  },
  {
    url: 'https://science.nasa.gov/feed/',
    sourceName: 'NASA Science Directorate',
    defaultCategory: 'Discoveries' as NewsCategory,
  },
  {
    url: 'https://spacenews.com/feed/',
    sourceName: 'SpaceNews Global',
    defaultCategory: 'Space Exploration' as NewsCategory,
  },
];

const CATEGORY_KEYWORDS: Record<Exclude<NewsCategory, 'All'>, string[]> = {
  Astronomy: ['telescope', 'hubble', 'webb', 'star', 'stellar', 'supernova', 'pulsar', 'nebula', 'cosmic', 'sky', 'astronomer', 'constellation'],
  'Space Exploration': ['rover', 'astronaut', 'spacecraft', 'orbit', 'artemis', 'lunar', 'moon', 'exploration', 'probe', 'landing', 'mars'],
  NASA: ['nasa', 'glenn', 'goddard', 'jpl', 'kennedy', 'langley', 'marshall', 'johnson', 'ames', 'headquarters'],
  SpaceX: ['spacex', 'falcon', 'starship', 'super heavy', 'dragon', 'elon musk', 'starlink', 'booster', 'raptor'],
  Missions: ['mission', 'voyager', 'clipper', 'perseverance', 'curiosity', 'dart', 'osiris', 'dragonfly', 'new horizons', 'juice', 'bepicolombo'],
  Galaxies: ['galaxy', 'galaxies', 'spiral', 'andromeda', 'milky way', 'intergalactic', 'cluster', 'deep field', 'smacs'],
  Discoveries: ['discovery', 'discover', 'found', 'confirms', 'unveils', 'detects', 'evidence', 'first time', 'record-breaking', 'breakthrough'],
};

function categorizeText(title: string, summary: string, fallback: NewsCategory): NewsCategory {
  const text = `${title} ${summary}`.toLowerCase();

  // SpaceX check first because it's specific
  if (CATEGORY_KEYWORDS.SpaceX.some(k => text.includes(k))) {
    return 'SpaceX';
  }
  // Discoveries
  if (CATEGORY_KEYWORDS.Discoveries.some(k => text.includes(k))) {
    return 'Discoveries';
  }
  // Galaxies
  if (CATEGORY_KEYWORDS.Galaxies.some(k => text.includes(k))) {
    return 'Galaxies';
  }
  // Missions
  if (CATEGORY_KEYWORDS.Missions.some(k => text.includes(k))) {
    return 'Missions';
  }
  // NASA
  if (CATEGORY_KEYWORDS.NASA.some(k => text.includes(k))) {
    return 'NASA';
  }
  // Astronomy
  if (CATEGORY_KEYWORDS.Astronomy.some(k => text.includes(k))) {
    return 'Astronomy';
  }
  // Space Exploration
  if (CATEGORY_KEYWORDS['Space Exploration'].some(k => text.includes(k))) {
    return 'Space Exploration';
  }

  return fallback;
}

function extractThumbnail(item: any): string {
  // 1. media:content url
  if (item['media:content']?.['@_url']) {
    return item['media:content']['@_url'];
  }
  if (Array.isArray(item['media:content']) && item['media:content'][0]?.['@_url']) {
    return item['media:content'][0]['@_url'];
  }
  // 2. enclosure url
  if (item.enclosure?.['@_url'] && (item.enclosure['@_type']?.includes('image') || item.enclosure['@_url'].match(/\.(jpg|jpeg|png|webp)/i))) {
    return item.enclosure['@_url'];
  }
  // 3. regex in description/content:encoded
  const rawContent = item['content:encoded'] || item.description || '';
  if (typeof rawContent === 'string') {
    const imgMatch = rawContent.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }
  // High quality NASA astronomy fallback banner
  return 'https://images-assets.nasa.gov/image/PIA25328/PIA25328~orig.jpg';
}

function cleanSummary(rawText: string): string {
  if (!rawText) return 'Read the full coverage for comprehensive mission details and astrophysical findings.';
  let clean = rawText
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

  if (clean.length > 280) {
    clean = clean.slice(0, 277).trim() + '...';
  }
  return clean;
}

function createHashId(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'news-' + Math.abs(hash).toString(36);
}

// In-memory cache for news articles to provide instant responses
let inMemoryNewsCache: { items: NewsItem[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

export async function fetchSpaceNews(forceRefresh = false): Promise<NewsItem[]> {
  const now = Date.now();
  if (!forceRefresh && inMemoryNewsCache && now - inMemoryNewsCache.timestamp < CACHE_TTL_MS) {
    return inMemoryNewsCache.items;
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
  });

  const collectedArticles: NewsItem[] = [];
  const seenUrls = new Set<string>();

  for (const feed of RSS_FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: {
          'User-Agent': 'SpaceMagazineBot/1.0 (+https://github.com/Kartik-048/space-blog)',
          Accept: 'application/rss+xml, application/xml, text/xml',
        },
        next: { revalidate: 1800 }, // 30 minutes
      });

      if (!res.ok) continue;

      const xmlText = await res.text();
      const parsed = parser.parse(xmlText);
      const items = parsed?.rss?.channel?.item || parsed?.feed?.entry;

      if (!items) continue;
      const itemList = Array.isArray(items) ? items : [items];

      for (const item of itemList) {
        const title = item.title?.['#text'] || item.title;
        const link = item.link?.['#text'] || item.link?.['@_href'] || item.link;
        if (!title || !link || typeof link !== 'string') continue;

        // Normalize URL for deduplication
        const cleanUrl = link.split('?')[0].trim();
        if (seenUrls.has(cleanUrl)) continue;
        seenUrls.add(cleanUrl);

        const pubDateRaw = item.pubDate || item.published || item['dc:date'];
        const pubDate = pubDateRaw ? new Date(pubDateRaw).toISOString() : new Date().toISOString();
        const rawDesc = item.description?.['#text'] || item.description || item.summary?.['#text'] || item.summary || '';
        const summary = cleanSummary(String(rawDesc));
        const thumbnail = extractThumbnail(item);
        const category = categorizeText(title, summary, feed.defaultCategory);
        const author = item['dc:creator'] || item.author?.name || feed.sourceName;

        collectedArticles.push({
          id: createHashId(cleanUrl),
          title: String(title).trim(),
          link: cleanUrl,
          pubDate,
          source: feed.sourceName,
          author: String(author).trim(),
          summary,
          thumbnail,
          category,
          tags: [category, feed.sourceName],
        });
      }
    } catch (err) {
      console.warn(`Failed to fetch RSS from ${feed.url}:`, err);
    }
  }

  // Merge with local PC database archive and fallback news
  const dbArchivedNews = getDbNews();
  const safeFallback = fallbackNews as unknown as NewsItem[];
  const mergedList: NewsItem[] = [...collectedArticles];

  for (const item of dbArchivedNews) {
    if (!seenUrls.has(item.link)) {
      seenUrls.add(item.link);
      mergedList.push(item);
    }
  }

  for (const item of safeFallback) {
    if (!seenUrls.has(item.link)) {
      seenUrls.add(item.link);
      mergedList.push(item);
    }
  }

  // Sort newest first
  mergedList.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  // Save updated collection into local PC database
  try {
    saveDbNews(mergedList);
    saveDbConfig({ lastSync: new Date().toISOString() });
  } catch (err) {
    console.error('Failed to save news to local PC database:', err);
  }

  inMemoryNewsCache = {
    items: mergedList,
    timestamp: now,
  };

  return mergedList;
}

/**
 * Catch-up sync triggered after site turns back on:
 * Compares latest feed items against the date/time before site was turned off,
 * isolates the newer articles, updates the database, and returns the catchup metrics.
 */
export async function syncNewsCatchup(sinceDateIso?: string | null): Promise<{
  allNews: NewsItem[];
  newArticlesCount: number;
  newArticles: NewsItem[];
  cutoffDate: string;
}> {
  // 1. Force a live fetch from all NASA & Space feeds
  const freshlyFetched = await fetchSpaceNews(true);

  // 2. Determine cutoff timestamp
  const cutoffTime = sinceDateIso ? new Date(sinceDateIso).getTime() : 0;

  // 3. Find articles strictly newer than the cutoff timestamp
  const newArticles = freshlyFetched.filter(item => {
    const itemTime = new Date(item.pubDate).getTime();
    return itemTime > cutoffTime;
  });

  return {
    allNews: freshlyFetched,
    newArticlesCount: newArticles.length,
    newArticles,
    cutoffDate: sinceDateIso || (freshlyFetched[0] ? freshlyFetched[0].pubDate : new Date().toISOString()),
  };
}

