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
      className="inline-flex items-center gap-2 bg-(--color-accent) disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-colors duration-200 hover:bg-(--color-accent-hover) focus:outline-none focus:ring-2 focus:ring-(--color-accent) focus:ring-offset-2 min-h-44px"
    >
      <Plus size={20} />
      Add Budget
    </button>
  );
}
