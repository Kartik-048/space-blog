import { NextResponse } from 'next/server';
import { fetchSpaceNews } from '@/lib/rss';
import { getApod } from '@/lib/apod';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const secret = process.env.SYNC_SECRET;

    // Optional secret check if configured in environment
    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [news, apod] = await Promise.all([
      fetchSpaceNews(true),
      getApod(),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Cosmic content synchronization complete',
      stats: {
        newsCount: news.length,
        apodTitle: apod.title,
        syncedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('API Sync Error:', error);
    return NextResponse.json(
      { success: false, error: 'Synchronization failed' },
      { status: 500 }
    );
  }
}
