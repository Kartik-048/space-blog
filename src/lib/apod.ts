import { ApodData } from './types';

const FALLBACK_APOD: ApodData = {
  title: 'NGC 1365: Majestic Island Universe in the Fornax Cluster',
  date: new Date().toISOString().split('T')[0],
  explanation:
    'Barred spiral galaxy NGC 1365 is a truly majestic island universe roughly 56 million light-years distant in the southern constellation Fornax. Spanning over 200,000 light-years across, it is about twice the size of our own barred spiral Milky Way. This crisp composite image from the James Webb Space Telescope and Hubble captures intense star-forming regions along its prominent bar and sweeping dust lanes that funnel interstellar material toward a central supermassive black hole.',
  url: 'https://images-assets.nasa.gov/image/PIA25328/PIA25328~orig.jpg',
  hdurl: 'https://images-assets.nasa.gov/image/PIA25328/PIA25328~orig.jpg',
  media_type: 'image',
  copyright: 'NASA / ESA / CSA / STScI / J. Lee (NOIRLab)',
};

let cachedApod: { data: ApodData; timestamp: number } | null = null;
const CACHE_DURATION_MS = 1000 * 60 * 60 * 2; // 2 hours

export async function getApod(date?: string): Promise<ApodData> {
  const now = Date.now();
  if (!date && cachedApod && now - cachedApod.timestamp < CACHE_DURATION_MS) {
    return cachedApod.data;
  }

  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  const url = date
    ? `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`
    : `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 7200 }, // 2 hours
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        const apod: ApodData = {
          title: data.title || 'Astronomy Picture of the Day',
          date: data.date || new Date().toISOString().split('T')[0],
          explanation: data.explanation || '',
          url: data.url,
          hdurl: data.hdurl || data.url,
          media_type: data.media_type || 'image',
          copyright: data.copyright?.trim(),
        };

        if (!date) {
          cachedApod = { data: apod, timestamp: now };
        }
        return apod;
      }
    }
  } catch (err) {
    console.warn('NASA official APOD endpoint failed, attempting NASA Science WP fallback:', err);
  }

  // Secondary fallback: NASA Science WordPress endpoint
  try {
    const wpRes = await fetch('https://science.nasa.gov/wp-json/wp/v2/apod-basic?per_page=1', {
      next: { revalidate: 7200 },
    });
    if (wpRes.ok) {
      const list = await wpRes.json();
      if (Array.isArray(list) && list.length > 0) {
        const item = list[0];
        const apod: ApodData = {
          title: item.title?.rendered || 'Astronomy Picture of the Day',
          date: item.date?.split('T')[0] || new Date().toISOString().split('T')[0],
          explanation:
            item.excerpt?.rendered?.replace(/<[^>]*>?/gm, '').trim() ||
            item.content?.rendered?.replace(/<[^>]*>?/gm, '').slice(0, 400) + '...',
          url: item.featured_media_src_url || FALLBACK_APOD.url,
          hdurl: item.featured_media_src_url || FALLBACK_APOD.hdurl,
          media_type: 'image',
          copyright: 'NASA Science Directorate',
        };

        if (!date) {
          cachedApod = { data: apod, timestamp: now };
        }
        return apod;
      }
    }
  } catch (wpErr) {
    console.warn('NASA Science WP APOD failed, using resilient static fallback:', wpErr);
  }

  // Safe fallback to prevent breaking UI
  return {
    ...FALLBACK_APOD,
    date: date || new Date().toISOString().split('T')[0],
  };
}
