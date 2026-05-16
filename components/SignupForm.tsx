'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SignupFormProps {
  onLoginClick: () => void;
}

export default function SignupForm({ onLoginClick }: SignupFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setError('Email field is required');
      return false;
    }
    if (!password) {
      setError('Password field is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed. Please try again.');
        setLoading(false);
        return;
      }

      if (data.success && data.redirectUrl) {
        router.push(data.redirectUrl);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-8" style={{ boxShadow: '0 2px 4px rgba(26,26,24,0.04)' }}>
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8 text-center">Sign Up</h2>

      {error && (
        <div className="mb-6 p-4 bg-[var(--color-danger)] bg-opacity-10 border border-[var(--color-danger)] text-[var(--color-danger)] rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-text)] mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] focus:border-2 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-[var(--color-text)] mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] focus:border-2 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-accent)] hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-6 text-center text-[var(--color-muted-text)] text-sm">
        Already have an account?{' '}
        <button
          onClick={onLoginClick}
          disabled={loading}
          className="text-[var(--color-accent)] hover:text-[var(--color-primary)] font-semibold disabled:cursor-not-allowed transition-colors duration-200"
        >
          Login
        </button>
      </p>
    </div>
  );
}
