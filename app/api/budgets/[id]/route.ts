import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Fetch budget
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

    // Verify budget exists and belongs to user
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

    // Update budget
    const { data: budget, error: updateError } = await supabase
      .from('budget_tracker_app_mecen_budgets')
      .update({
        name: name.trim(),
        allocated_amount: amount,
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

    // Verify budget exists and belongs to user
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

    // Delete budget
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