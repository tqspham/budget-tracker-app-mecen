'use client';

import { useRouter } from 'next/navigation';
import SignupForm from '@/components/SignupForm';

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignupForm
        onLoginClick={() => {
          router.push('/login');
        }}
      />
    </div>
  );
}
