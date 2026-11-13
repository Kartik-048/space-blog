import { NextResponse } from 'next/server';
import { getApod } from '@/lib/apod';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour ISR

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || undefined;
    const apod = await getApod(date);
    return NextResponse.json({ success: true, data: apod });
  } catch (error) {
    console.error('API APOD Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Astronomy Picture of the Day' },
      { status: 500 }
    );
  }
}
