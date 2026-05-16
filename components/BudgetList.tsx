'use client';

import { Edit2, Trash2 } from 'lucide-react';
import { Budget, useBudgetStore } from '@/lib/budgetStore';

interface BudgetListProps {
  budgets: Budget[];
  isLoading: boolean;
  onEdit: (budget: Budget) => void;
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
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
        <div className="inline-block spinner-calm rounded-full h-8 w-8 border-4 border-[var(--color-border)] border-t-[var(--color-accent)]"></div>
        <span className="ml-4 text-[var(--color-muted-text)]">Loading budgets...</span>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-muted-text)] text-base">No budgets yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="text-left py-3 px-4 font-semibold text-[var(--color-text)]">Budget Name</th>
            <th className="text-right py-3 px-4 font-semibold text-[var(--color-text)]">Allocated Amount</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--color-text)]">Category</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--color-text)]">Date</th>
            <th className="text-right py-3 px-4 font-semibold text-[var(--color-text)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => (
            <tr key={budget.id} className="border-b border-[var(--color-border)] transition-colors duration-200 hover:bg-gray-50">
              <td className="py-3 px-4 text-[var(--color-text)]">{budget.name}</td>
              <td className="text-right py-3 px-4 text-[var(--color-text)] font-semibold">${budget.allocated_amount.toFixed(2)}</td>
              <td className="py-3 px-4 text-[var(--color-text)]">{budget.category || 'Other'}</td>
              <td className="py-3 px-4 text-[var(--color-text)]">{formatDate(budget.budget_date)}</td>
              <td className="text-right py-3 px-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(budget)}
                    className="inline-flex items-center gap-1 bg-[var(--color-accent)] text-white py-1 px-3 rounded transition-colors duration-200 text-sm font-medium hover:bg-[var(--color-accent-hover)] focus:outline-none focus:border-2 focus:border-[var(--color-accent)]"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1 bg-[var(--color-danger)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-1 px-3 rounded transition-colors duration-200 text-sm font-medium hover:bg-[var(--color-danger-hover)] focus:outline-none focus:border-2 focus:border-[var(--color-danger)]"
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
