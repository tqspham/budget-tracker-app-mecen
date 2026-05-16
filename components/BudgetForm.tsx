'use client';

import { useState, useEffect } from 'react';
import { useBudgetStore, Budget } from '@/lib/budgetStore';

const BUDGET_CATEGORIES = [
  'Housing',
  'Food',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Other',
];

interface BudgetFormProps {
  budget?: Budget | null;
  onClose: () => void;
}

export default function BudgetForm({ budget, onClose }: BudgetFormProps) {
  const [name, setName] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [budgetDate, setBudgetDate] = useState('');
  const [localError, setLocalError] = useState('');
  const { isCreating, isEditing, createBudget, updateBudget } = useBudgetStore();
  const isLoading = isCreating || isEditing;

  useEffect(() => {
    if (budget) {
      setName(budget.name);
      setAllocatedAmount(budget.allocated_amount.toString());
      setCategory(budget.category || 'Other');
      setBudgetDate(budget.budget_date || '');
    } else {
      setName('');
      setAllocatedAmount('');
      setCategory('Other');
      setBudgetDate(new Date().toISOString().split('T')[0]);
    }
    setLocalError('');
  }, [budget]);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setLocalError('Budget name is required');
      return false;
    }
    if (!allocatedAmount) {
      setLocalError('Allocated amount is required');
      return false;
    }
    const amount = parseFloat(allocatedAmount);
    if (isNaN(amount) || amount <= 0) {
      setLocalError('Allocated amount must be a positive number');
      return false;
    }
    if (!category) {
      setLocalError('Category is required');
      return false;
    }
    if (!budgetDate) {
      setLocalError('Budget date is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm()) {
      return;
    }

    const amount = parseFloat(allocatedAmount);

    if (budget) {
      const result = await updateBudget(budget.id, name, amount, category, budgetDate);
      if (result) {
        onClose();
      }
    } else {
      const result = await createBudget(name, amount, category, budgetDate);
      if (result) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] max-w-md w-full p-8 card">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-8">
          {budget ? 'Edit Budget' : 'Add New Budget'}
        </h2>

        {localError && (
          <div className="mb-6 p-4 bg-opacity-10 border-l-4 border-[var(--color-danger)] text-[var(--color-danger)] rounded text-sm message-error">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-[var(--color-text)] mb-2">
              Budget Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] focus:border-2 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200"
              placeholder="e.g., Groceries"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-semibold text-[var(--color-text)] mb-2">
              Allocated Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              value={allocatedAmount}
              onChange={(e) => setAllocatedAmount(e.target.value)}
              disabled={isLoading}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] focus:border-2 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-[var(--color-text)] mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] focus:border-2 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {BUDGET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budgetDate" className="block text-sm font-semibold text-[var(--color-text)] mb-2">
              Budget Date
            </label>
            <input
              type="date"
              id="budgetDate"
              value={budgetDate}
              onChange={(e) => setBudgetDate(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] focus:border-2 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[var(--color-accent)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-[var(--color-accent-hover)] focus:outline-none focus:border-2 focus:border-[var(--color-accent)]"
            >
              {isLoading ? (budget ? 'Updating...' : 'Creating...') : (budget ? 'Update' : 'Create')}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border border-[var(--color-border)] text-[var(--color-text)] disabled:bg-gray-50 disabled:cursor-not-allowed font-semibold py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:border-2 focus:border-[var(--color-accent)]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
