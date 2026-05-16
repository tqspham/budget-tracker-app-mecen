'use client';

import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-(--color-background) flex items-center justify-center p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl w-full">
        {/* Left side - Typography statement */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl lg:text-6xl font-semibold text-(--color-primary) leading-tight mb-6">
            Welcome back.
          </h1>
          <p className="text-lg text-(--color-secondary) leading-relaxed">
            Sign in to your account and continue managing your budget with clarity and confidence.
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
