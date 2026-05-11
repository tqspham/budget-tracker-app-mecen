import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('sessionToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from session
    const { data: session, error: sessionError } = await supabase
      .from('budget_tracker_app_mecen_sessions')
      .select('user_id')
      .eq('token', token)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch budgets for user
    const { data: budgets, error: fetchError } = await supabase
      .from('budget_tracker_app_mecen_budgets')
      .select('*')
      .eq('user_id', session.user_id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch budgets' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, budgets: budgets || [] },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('sessionToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from session
    const { data: session, error: sessionError } = await supabase
      .from('budget_tracker_app_mecen_sessions')
      .select('user_id')
      .eq('token', token)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, allocated_amount } = await request.json();

    // Validate input
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Budget name is required' },
        { status: 400 }
      );
    }

    if (allocated_amount === undefined || allocated_amount === null) {
      return NextResponse.json(
        { success: false, error: 'Allocated amount is required' },
        { status: 400 }
      );
    }

    const amount = parseFloat(allocated_amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Allocated amount must be a positive number' },
        { status: 400 }
      );
    }

    // Create budget
    const { data: budget, error: createError } = await supabase
      .from('budget_tracker_app_mecen_budgets')
      .insert([
        {
          user_id: session.user_id,
          name: name.trim(),
          allocated_amount: amount,
        },
      ])
      .select('*')
      .single();

    if (createError || !budget) {
      return NextResponse.json(
        { success: false, error: 'Failed to create budget' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, budget },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}