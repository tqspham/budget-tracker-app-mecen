import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('sessionToken')?.value;

    if (token) {
      // Delete session from database
      await supabase
        .from('budget_tracker_app_mecen_sessions')
        .delete()
        .eq('token', token);
    }

    // Clear session cookie
    const response = NextResponse.json(
      { success: true, redirectUrl: '/login' },
      { status: 200 }
    );

    response.cookies.set('sessionToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
