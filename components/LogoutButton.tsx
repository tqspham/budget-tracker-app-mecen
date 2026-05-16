'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success && data.redirectUrl) {
        router.push(data.redirectUrl);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="border border-[var(--color-border)] disabled:bg-gray-50 disabled:cursor-not-allowed text-[var(--color-text)] font-semibold py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:border-2 focus:border-[var(--color-accent)]"
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
