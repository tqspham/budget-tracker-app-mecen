import { create } from 'zustand';

export interface Budget {
  id: string;
  user_id: string;
  name: string;
  allocated_amount: number;
  created_at: string;
  updated_at: string;
}

interface BudgetStore {
  budgets: Budget[];
  isLoading: boolean;
  isCreating: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  error: string | null;
  successMessage: string | null;

  setBudgets: (budgets: Budget[]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsCreating: (creating: boolean) => void;
  setIsEditing: (editing: boolean) => void;
  setIsDeleting: (deleting: boolean) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;

  fetchBudgets: () => Promise<void>;
  createBudget: (name: string, allocated_amount: number) => Promise<Budget | null>;
  updateBudget: (id: string, name: string, allocated_amount: number) => Promise<Budget | null>;
  deleteBudget: (id: string) => Promise<boolean>;
}

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  budgets: [],
  isLoading: false,
  isCreating: false,
  isEditing: false,
  isDeleting: false,
  error: null,
  successMessage: null,

  setBudgets: (budgets) => set({ budgets }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsCreating: (creating) => set({ isCreating: creating }),
  setIsEditing: (editing) => set({ isEditing: editing }),
  setIsDeleting: (deleting) => set({ isDeleting: deleting }),
  setError: (error) => set({ error }),
  setSuccessMessage: (message) => set({ successMessage: message }),

  fetchBudgets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/budgets', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        set({ error: data.error || 'Failed to fetch budgets', isLoading: false });
        return;
      }

      set({ budgets: data.budgets || [], isLoading: false });
    } catch (err) {
      set({ error: 'An error occurred while fetching budgets', isLoading: false });
    }
  },

  createBudget: async (name, allocated_amount) => {
    set({ isCreating: true, error: null });
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, allocated_amount }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        set({ error: data.error || 'Failed to create budget', isCreating: false });
        return null;
      }

      set((state) => ({
        budgets: [data.budget, ...state.budgets],
        successMessage: 'Budget created successfully',
        isCreating: false,
      }));

      return data.budget;
    } catch (err) {
      set({ error: 'An error occurred while creating budget', isCreating: false });
      return null;
    }
  },

  updateBudget: async (id, name, allocated_amount) => {
    set({ isEditing: true, error: null });
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, allocated_amount }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        set({ error: data.error || 'Failed to update budget', isEditing: false });
        return null;
      }

      set((state) => ({
        budgets: state.budgets.map((b) => (b.id === id ? data.budget : b)),
        successMessage: 'Budget updated successfully',
        isEditing: false,
      }));

      return data.budget;
    } catch (err) {
      set({ error: 'An error occurred while updating budget', isEditing: false });
      return null;
    }
  },

  deleteBudget: async (id) => {
    set({ isDeleting: true, error: null });
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        set({ error: data.error || 'Failed to delete budget', isDeleting: false });
        return false;
      }

      set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id),
        successMessage: 'Budget deleted successfully',
        isDeleting: false,
      }));

      return true;
    } catch (err) {
      set({ error: 'An error occurred while deleting budget', isDeleting: false });
      return false;
    }
  },
}));