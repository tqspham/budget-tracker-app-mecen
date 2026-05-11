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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data: budget, error: fetchError } = await supabase
      .from('budget_tracker_app_mecen_budgets')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', session.user_id)
      .single();

    if (fetchError || !budget) {
      return NextResponse.json(
        { success: false, error: 'Budget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, budget },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data: existingBudget, error: fetchError } = await supabase
      .from('budget_tracker_app_mecen_budgets')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', session.user_id)
      .single();

    if (fetchError || !existingBudget) {
      return NextResponse.json(
        { success: false, error: 'Budget not found' },
        { status: 404 }
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

    const { data: budget, error: updateError } = await supabase
      .from('budget_tracker_app_mecen_budgets')
      .update({
        name: name.trim(),
        allocated_amount: amount,
        category,
        budget_date,
      })
      .eq('id', params.id)
      .eq('user_id', session.user_id)
      .select('*')
      .single();

    if (updateError || !budget) {
      return NextResponse.json(
        { success: false, error: 'Failed to update budget' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, budget },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data: existingBudget, error: fetchError } = await supabase
      .from('budget_tracker_app_mecen_budgets')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', session.user_id)
      .single();

    if (fetchError || !existingBudget) {
      return NextResponse.json(
        { success: false, error: 'Budget not found' },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabase
      .from('budget_tracker_app_mecen_budgets')
      .delete()
      .eq('id', params.id)
      .eq('user_id', session.user_id);

    if (deleteError) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete budget' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
