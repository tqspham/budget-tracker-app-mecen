'use client';

import { useRouter } from 'next/navigation';
import SignupForm from '@/components/SignupForm';

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-(--color-background) flex items-center justify-center p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl w-full">
        {/* Left side - Typography statement */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl lg:text-6xl font-semibold text-(--color-primary) leading-tight mb-6">
            Start taking control today.
          </h1>
          <p className="text-lg text-(--color-secondary) leading-relaxed">
            Create your account and begin your journey toward mindful, intentional financial management.
          </p>
        </div>

        {/* Right side - Signup form */}
        <div>
          <SignupForm
            onLoginClick={() => {
              router.push('/login');
            }}
          />
        </div>
      </div>
    </div>
  );
}
