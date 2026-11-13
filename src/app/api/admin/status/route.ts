import { NextResponse } from 'next/server';
import { getDatabaseDiagnostics } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function pingEndpoint(url: string, timeoutMs = 3000): Promise<{ ok: boolean; status: number; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });
    clearTimeout(timer);

    return {
      ok: res.ok,
      status: res.status,
      latencyMs: Date.now() - start,
    };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      latencyMs: Date.now() - start,
      error: err.name === 'AbortError' ? 'Timeout' : err.message || 'Connection failed',
    };
  }
}

export async function GET() {
  try {
    const [apodStatus, nasaNewsRss, esaRss, nasaImages] = await Promise.all([
      pingEndpoint('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'),
      pingEndpoint('https://www.nasa.gov/news-release/feed/'),
      pingEndpoint('https://www.esa.int/rssfeed/Our_Activities/Space_Science'),
      pingEndpoint('https://images-api.nasa.gov/search?q=earth&media_type=image&page_size=1'),
    ]);

    const dbDiag = getDatabaseDiagnostics();
    const memory = process.memoryUsage();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      apis: {
        nasaApod: {
          name: 'NASA APOD API',
          url: 'https://api.nasa.gov/planetary/apod',
          ...apodStatus,
        },
        nasaNewsRss: {
          name: 'NASA News Releases RSS',
          url: 'https://www.nasa.gov/news-release/feed/',
          ...nasaNewsRss,
        },
        esaScienceRss: {
          name: 'ESA Science Portal Feed',
          url: 'https://www.esa.int/rssfeed/Our_Activities/Space_Science',
          ...esaRss,
        },
        nasaImagesApi: {
          name: 'NASA Image & Video Library',
          url: 'https://images-api.nasa.gov',
          ...nasaImages,
        },
      },
      database: dbDiag,
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryRssMb: (memory.rss / (1024 * 1024)).toFixed(1),
        memoryHeapMb: (memory.heapUsed / (1024 * 1024)).toFixed(1),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
