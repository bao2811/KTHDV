'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken) {
      // 1. Save tokens (using localStorage for simplicity in this MVP)
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

      // 2. Mock fetching user role. In a real app, you'd decode the JWT or call an API.
      const fetchRoleAndRedirect = async () => {
        // MOCK: Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // MOCK: Check if role was already set by our mock login page
        let mockRole = localStorage.getItem('userRole');
        
        // If not set, infer from the accessToken if it was passed from mock login
        if (!mockRole) {
           if (accessToken.includes('admin')) mockRole = 'admin';
           else if (accessToken.includes('hr')) mockRole = 'hr';
           else mockRole = 'candidate';
           
           localStorage.setItem('userRole', mockRole);
        }

        // 3. Redirect based on role
        switch (mockRole) {
          case 'hr':
            router.push('/hr');
            break;
          case 'admin':
            router.push('/admin');
            break;
          case 'candidate':
          default:
            router.push('/candidate');
            break;
        }
      };

      fetchRoleAndRedirect();
    } else {
      // Handle error: no token provided
      router.push('/login?error=auth_failed');
    }
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Authenticating...</h2>
        <p className="text-gray-500 mt-2">Please wait while we log you in.</p>
      </div>
    </div>
  );
}
