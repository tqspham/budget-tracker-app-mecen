'use client';

import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm
        onSignupClick={() => {
          router.push('/signup');
        }}
      />
    </div>
  );
}
