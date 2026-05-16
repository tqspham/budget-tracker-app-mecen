'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
          router.push('/dashboard');
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-(--color-background)">
        <div className="text-center">
          <div className="inline-block spinner-calm rounded-full h-12 w-12 border-4 border-(--color-border) border-t-(--color-accent)"></div>
          <p className="mt-4 text-(--color-muted-text)">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-(--color-background) flex items-center justify-center p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl w-full">
        {/* Left side - Typography statement */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl lg:text-6xl font-semibold text-(--color-primary) leading-tight mb-6">
            Manage your finances with intention.
          </h1>
          <p className="text-lg text-(--color-secondary) leading-relaxed">
            A modern, focused budget tracker designed to help you understand your spending and take control of your financial future.
          </p>
        </div>

        {/* Right side - Login form */}
        <div>
          <LoginForm
            onSignupClick={() => {
              router.push('/signup');
            }}
          />
        </div>
      </div>
    </div>
  );
}
