import { NextResponse } from 'next/server';
import { getDbConfig, saveDbConfig } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = getDbConfig();
    return NextResponse.json({
      success: true,
      maintenanceMode: config.maintenanceMode,
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
    const updated = saveDbConfig({
      maintenanceMode: Boolean(body.maintenanceMode),
      ...(body.maintenanceMessage ? { maintenanceMessage: String(body.maintenanceMessage) } : {}),
    });

    return NextResponse.json({
      success: true,
      maintenanceMode: updated.maintenanceMode,
      maintenanceMessage: updated.maintenanceMessage,
      message: updated.maintenanceMode ? 'Maintenance mode enabled' : 'Maintenance mode disabled',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
