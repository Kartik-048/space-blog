import { NextResponse } from 'next/server';
import { fetchSpaceNews } from '@/lib/rss';
import { NewsCategory } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 1800; // 30 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as NewsCategory | null;
    const query = searchParams.get('q')?.toLowerCase() || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const forceRefresh = searchParams.get('refresh') === 'true';

    let news = await fetchSpaceNews(forceRefresh);

    // Filter by category
    if (category && category !== 'All') {
      news = news.filter(item => item.category === category);
    }

    // Filter by search query
    if (query) {
      news = news.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.source.toLowerCase().includes(query)
      );
    }

    const total = news.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = news.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: startIndex + limit < total,
      },
    });
  } catch (error) {
    console.error('API News Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to aggregate space news' },
      { status: 500 }
    );
  }
}
