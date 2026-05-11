import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const VALID_CATEGORIES = [
  'Housing',
  'Food',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Other',
];

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('sessionToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    const { name, allocated_amount, category, budget_date } = await request.json();

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

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    if (!budget_date) {
      return NextResponse.json(
        { success: false, error: 'Budget date is required' },
        { status: 400 }
      );
    }

    const dateObj = new Date(budget_date);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid budget date' },
        { status: 400 }
      );
    }

    const { data: budget, error: createError } = await supabase
      .from('budget_tracker_app_mecen_budgets')
      .insert([
        {
          user_id: session.user_id,
          name: name.trim(),
          allocated_amount: amount,
          category,
          budget_date,
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
