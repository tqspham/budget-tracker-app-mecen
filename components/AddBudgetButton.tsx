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
      className="inline-flex items-center gap-2 bg-[var(--color-accent)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
    >
      <Plus size={20} />
      Add Budget
    </button>
  );
}
