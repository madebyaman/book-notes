import { useEffect, useState } from 'react';
import { addAuthListener } from '.';

export const useAuth = () => {
  const [authInfo, setAuthInfo] = useState<{
    user: null | { id: string };
    isLoading: boolean;
  }>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const callback = (user: { id: string } | null) =>
      setAuthInfo({ user, isLoading: false });
    const unsub = addAuthListener(callback);

    return unsub;
  }, []);

  return authInfo;
};
