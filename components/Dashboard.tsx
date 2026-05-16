'use client';

import { useEffect, useState } from 'react';
import { useBudgetStore, Budget } from '@/lib/budgetStore';
import AddBudgetButton from './AddBudgetButton';
import BudgetList from './BudgetList';
import BudgetForm from './BudgetForm';
import BudgetCharts from './BudgetCharts';

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [notificationTimeout, setNotificationTimeout] = useState<NodeJS.Timeout | null>(null);
  const {
    budgets,
    isLoading,
    error,
    successMessage,
    fetchBudgets,
    setError,
    setSuccessMessage,
  } = useBudgetStore();

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  useEffect(() => {
    if (successMessage || error) {
      if (notificationTimeout) {
        clearTimeout(notificationTimeout);
      }
      const timeout = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
      setNotificationTimeout(timeout);
    }
  }, [successMessage, error, notificationTimeout, setSuccessMessage, setError]);

  const handleOpenForm = () => {
    setEditingBudget(null);
    setShowForm(true);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  return (
    <div className="space-y-8">
      {successMessage && (
        <div className="p-4 bg-opacity-10 border-l-4 border-[var(--color-success)] text-[var(--color-success)] rounded text-sm message-success">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="p-4 bg-opacity-10 border-l-4 border-[var(--color-danger)] text-[var(--color-danger)] rounded text-sm message-error">
          {error}
        </div>
      )}

      <BudgetCharts budgets={budgets} />

      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-8 card">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-[var(--color-primary)]">Your Budgets</h2>
          <AddBudgetButton onClick={handleOpenForm} disabled={showForm} />
        </div>

        <BudgetList budgets={budgets} isLoading={isLoading} onEdit={handleEdit} />
      </div>

      {showForm && <BudgetForm budget={editingBudget} onClose={handleCloseForm} />}
    </div>
  );
}
