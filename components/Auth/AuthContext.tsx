import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '../../utils/auth';

export const AuthComponent = ({ children }: { children: ReactNode }) => {
  const { isLoading, user } = useAuth();
  const router = useRouter();
  const protectedRoutes = ['/', '/dashboard', '/edit/:id', '/add']; // TODO check edit
  const authPages = ['/signin', '/signup'];

  // Redirect to login page if user is not signed in. Else,
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (!isLoading && !user && protectedRoutes.includes(router.pathname)) {
      timerId = setTimeout(() => {
        router.push('/signin');
      }, 3_000);
    }

    return () => clearTimeout(timerId);
  }, [isLoading, user, router]);

  // Redirect to dashboard if user is signed in.
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (!isLoading && user && authPages.includes(router.pathname)) {
      timerId = setTimeout(() => {
        router.push('/dashboard');
      }, 3_000);
    }

    return () => clearTimeout(timerId);
  }, [isLoading, user, router]);

  return <>{children}</>;
};
