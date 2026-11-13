import { NextResponse } from 'next/server';
import { getDbArticles, saveDbArticles } from '@/lib/db';
import { Article } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const articles = getDbArticles();
  return NextResponse.json({ success: true, articles });
}

export async function POST(request: Request) {
  try {
    const article: Article = await request.json();
    const current = getDbArticles();
    const filtered = current.filter(a => a.slug !== article.slug);
    const updated = [article, ...filtered];
    saveDbArticles(updated);
    return NextResponse.json({ success: true, article, total: updated.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { slug } = await request.json();
    const current = getDbArticles();
    const updated = current.filter(a => a.slug !== slug);
    saveDbArticles(updated);
    return NextResponse.json({ success: true, message: 'Article removed', total: updated.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
