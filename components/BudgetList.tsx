'use client';

import { Edit2, Trash2 } from 'lucide-react';
import { Budget, useBudgetStore } from '@/lib/budgetStore';

interface BudgetListProps {
  budgets: Budget[];
  isLoading: boolean;
  onEdit: (budget: Budget) => void;
}

export default function BudgetList({ budgets, isLoading, onEdit }: BudgetListProps) {
  const { isDeleting, deleteBudget } = useBudgetStore();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      await deleteBudget(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-700">Loading budgets...</span>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No budgets yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-300 bg-gray-50">
            <th className="text-left py-3 px-4 font-semibold text-gray-800">Budget Name</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-800">Allocated Amount</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-800">Spent Amount</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-800">Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => (
            <tr key={budget.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
              <td className="py-3 px-4 text-gray-800">{budget.name}</td>
              <td className="text-right py-3 px-4 text-gray-800">${budget.allocated_amount.toFixed(2)}</td>
              <td className="text-right py-3 px-4 text-gray-600">$0.00</td>
              <td className="text-right py-3 px-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(budget)}
                    className="inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition duration-200 text-sm"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white py-1 px-3 rounded transition duration-200 text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}