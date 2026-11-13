import { NextResponse } from 'next/server';
import { getDbConfig } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const config = getDbConfig();
    const validPassword = config.adminPassword || 'Kartik040708@@';

    if (password === validPassword) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        token: 'auth_' + Buffer.from('kartik_admin_session').toString('base64'),
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid security code' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Authentication error: ' + error.message },
      { status: 500 }
    );
  }
}
