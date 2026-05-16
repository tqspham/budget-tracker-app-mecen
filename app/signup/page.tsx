'use client';

import { useRouter } from 'next/navigation';
import SignupForm from '@/components/SignupForm';

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)] p-4">
      <SignupForm
        onLoginClick={() => {
          router.push('/login');
        }}
      />
    </div>
  );
}
