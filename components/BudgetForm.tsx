'use client';

import { useState, useEffect } from 'react';
import { useBudgetStore, Budget } from '@/lib/budgetStore';

interface BudgetFormProps {
  budget?: Budget | null;
  onClose: () => void;
}

export default function BudgetForm({ budget, onClose }: BudgetFormProps) {
  const [name, setName] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [localError, setLocalError] = useState('');
  const { isCreating, isEditing, createBudget, updateBudget } = useBudgetStore();
  const isLoading = isCreating || isEditing;

  useEffect(() => {
    if (budget) {
      setName(budget.name);
      setAllocatedAmount(budget.allocated_amount.toString());
    } else {
      setName('');
      setAllocatedAmount('');
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
      const result = await updateBudget(budget.id, name, amount);
      if (result) {
        onClose();
      }
    } else {
      const result = await createBudget(name, amount);
      if (result) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {budget ? 'Edit Budget' : 'Add New Budget'}
        </h2>

        {localError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Budget Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., Groceries"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0.00"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              {isLoading ? (budget ? 'Updating...' : 'Creating...') : (budget ? 'Update' : 'Create')}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}