import { useEffect, useState } from 'react';
import { addAuthListener, getCurrentUser } from '.';

export const useAuth = () => {
  const [authInfo, setAuthInfo] = useState(() => {
    const user = getCurrentUser();
    const isLoading = !user;
    return { user, isLoading };
  });

  useEffect(() => {
    const callback = (user: { id: string } | null) =>
      setAuthInfo({ user, isLoading: false });
    const unsub = addAuthListener(callback);

    return unsub;
  }, []);

  return authInfo;
};
