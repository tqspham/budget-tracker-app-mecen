'use client';

import { useEffect, useState } from 'react';
import { useBudgetStore, Budget } from '@/lib/budgetStore';
import AddBudgetButton from './AddBudgetButton';
import BudgetList from './BudgetList';
import BudgetForm from './BudgetForm';

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
    <div className="space-y-6">
      {successMessage && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Your Budgets</h2>
          <AddBudgetButton onClick={handleOpenForm} disabled={showForm} />
        </div>

        <BudgetList budgets={budgets} isLoading={isLoading} onEdit={handleEdit} />
      </div>

      {showForm && <BudgetForm budget={editingBudget} onClose={handleCloseForm} />}
    </div>
  );
}