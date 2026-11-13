import { NextResponse } from 'next/server';
import { getDbConfig, saveDbConfig } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const config = getDbConfig();
    const cookieHeader = request.headers.get('cookie') || '';
    const hasCookieOff = cookieHeader.includes('astronomia_maintenance_mode=1');

    return NextResponse.json({
      success: true,
      maintenanceMode: config.maintenanceMode || hasCookieOff,
      maintenanceMessage: config.maintenanceMessage,
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

    const updated = saveDbConfig({
      maintenanceMode: isMaintenance,
      ...(body.maintenanceMessage ? { maintenanceMessage: String(body.maintenanceMessage) } : {}),
    });

    const res = NextResponse.json({
      success: true,
      maintenanceMode: updated.maintenanceMode,
      maintenanceMessage: updated.maintenanceMessage,
      message: updated.maintenanceMode ? 'Maintenance mode enabled' : 'Maintenance mode disabled',
    });

    // Set persistent cookie
    res.cookies.set('astronomia_maintenance_mode', isMaintenance ? '1' : '0', {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
