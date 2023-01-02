import { useEffect, useState } from 'react';
import { UserProfile } from '../../@types';
import { getCurrentUserProfile } from '.';

export const useUserProfileHook = () => {
  const [user, setUser] = useState<{
    profile: UserProfile | undefined;
    loading: boolean;
  }>({ profile: undefined, loading: true });

  useEffect(() => {
    let isSubscribed = true;

    (async function () {
      try {
        const userProfile = await getCurrentUserProfile();
        if (isSubscribed) {
          setUser({ profile: userProfile || undefined, loading: false });
        }
      } catch (error) {
        setUser({ profile: undefined, loading: false });
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return user;
};
