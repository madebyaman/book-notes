import { useRouter } from 'next/router';
import { createContext, ReactNode, useEffect } from 'react';
import { useAuth } from '@/utils/auth';

export const AuthContext = createContext<{
  id: string;
  emailVerified: boolean;
} | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { isLoading, user } = useAuth();
  const router = useRouter();

  // Redirect to login page if user is not signed in. Else,
  useEffect(() => {
    const protectedRoutes = ['/dashboard', '/add', '/profile'];
    if (!isLoading && !user && protectedRoutes.includes(router.pathname)) {
      const timerId = setTimeout(() => {
        router.push('/signin');
      }, 3_000);
      return () => clearTimeout(timerId);
    }
  }, [isLoading, user, router]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
