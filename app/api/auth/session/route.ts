import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('sessionToken')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    // Check if session exists and is valid
    const { data: session, error: sessionError } = await supabase
      .from('budget_tracker_app_mecen_sessions')
      .select('user_id, expires_at')
      .eq('token', token)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    // Check if session is expired
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      // Session expired, delete it
      await supabase
        .from('budget_tracker_app_mecen_sessions')
        .delete()
        .eq('token', token);

      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('budget_tracker_app_mecen_users')
      .select('id, email')
      .eq('id', session.user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json(
      {
        authenticated: true,
        userId: user.id,
        email: user.email,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { authenticated: false },
      { status: 200 }
    );
  }
}
