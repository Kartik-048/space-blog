import { NextResponse } from 'next/server';
import {
  getDbConfig,
  saveDbConfig,
  getLatestNewsPubDate,
  formatDurationMs,
  getDbNews,
  ReconnectionReport,
} from '@/lib/db';
import { syncNewsCatchup } from '@/lib/rss';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = getDbConfig();

    return NextResponse.json({
      success: true,
      maintenanceMode: Boolean(config.maintenanceMode),
      maintenanceMessage: config.maintenanceMessage,
      turnedOffAt: config.turnedOffAt,
      lastNewsDateBeforeOff: config.lastNewsDateBeforeOff,
      lastReconnectionReport: config.lastReconnectionReport,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const isMaintenance = Boolean(body.maintenanceMode);
    const previousConfig = getDbConfig();

    if (isMaintenance) {
      // 1. SITE IS BEING TURNED OFF
      // Record timestamp of shutdown and latest news publication date in DB
      const latestPubDate = getLatestNewsPubDate() || new Date().toISOString();
      const turnedOffAt = new Date().toISOString();

      const updated = saveDbConfig({
        maintenanceMode: true,
        turnedOffAt,
        lastNewsDateBeforeOff: latestPubDate,
        ...(body.maintenanceMessage ? { maintenanceMessage: String(body.maintenanceMessage) } : {}),
      });

      const res = NextResponse.json({
        success: true,
        maintenanceMode: true,
        turnedOffAt,
        lastNewsDateBeforeOff: latestPubDate,
        maintenanceMessage: updated.maintenanceMessage,
        message: 'Site turned OFF (Maintenance blackout enabled)',
      });

      res.cookies.set('astronomia_maintenance_mode', '1', {
        path: '/',
        maxAge: 31536000,
        sameSite: 'lax',
      });

      return res;
    } else {
      // 2. SITE IS BEING TURNED BACK ON
      // Detect offline time duration and reference date
      const wasOfflineSince = previousConfig.turnedOffAt;
      const lastNewsDateBeforeOff = previousConfig.lastNewsDateBeforeOff;

      let durationFormatted = 'a few moments';
      if (wasOfflineSince) {
        const elapsedMs = Date.now() - new Date(wasOfflineSince).getTime();
        durationFormatted = formatDurationMs(elapsedMs);
      }

      // Check the difference and catch up with newest space news
      let newArticlesCount = 0;
      let totalArticles = 0;
      try {
        const catchupResult = await syncNewsCatchup(lastNewsDateBeforeOff);
        newArticlesCount = catchupResult.newArticlesCount;
        totalArticles = catchupResult.allNews.length;
      } catch (syncErr) {
        console.error('Catchup sync error on reconnect:', syncErr);
        totalArticles = getDbNews().length;
      }

      const reconnectionReport: ReconnectionReport = {
        reconnectedAt: new Date().toISOString(),
        wasOfflineSince: wasOfflineSince || undefined,
        offlineDurationFormatted: durationFormatted,
        lastNewsDateBeforeOff: lastNewsDateBeforeOff || undefined,
        newArticlesSynced: newArticlesCount,
        totalArticlesInDb: totalArticles,
      };

      saveDbConfig({
        maintenanceMode: false,
        turnedOffAt: null,
        lastReconnectionReport: reconnectionReport,
      });

      const res = NextResponse.json({
        success: true,
        maintenanceMode: false,
        reconnectionReport,
        message: `Site turned ON! Offline for ${durationFormatted}. Caught up ${newArticlesCount} new articles since ${
          lastNewsDateBeforeOff ? new Date(lastNewsDateBeforeOff).toLocaleString() : 'last shutdown'
        }.`,
      });

      // Clear cookie immediately
      res.cookies.set('astronomia_maintenance_mode', '0', {
        path: '/',
        maxAge: 0,
        sameSite: 'lax',
      });

      return res;
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
