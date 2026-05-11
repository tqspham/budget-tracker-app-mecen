'use client';

import { Plus } from 'lucide-react';

interface AddBudgetButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function AddBudgetButton({ onClick, disabled = false }: AddBudgetButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition duration-200"
    >
      <Plus size={20} />
      Add Budget
    </button>
  );
}