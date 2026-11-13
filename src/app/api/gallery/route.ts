import { NextResponse } from 'next/server';
import { fetchGalleryItems } from '@/lib/gallery';
import { GalleryCategory } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get('category') as GalleryCategory) || 'All';
    const search = searchParams.get('q') || undefined;

    const items = await fetchGalleryItems(category, search);

    return NextResponse.json({
      success: true,
      data: items,
      total: items.length,
    });
  } catch (error) {
    console.error('API Gallery Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}
