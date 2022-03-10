import { useEffect, useState } from 'react';
import { UserProfile } from '../../@types';
import { getCurrentUserProfile } from '.';

export const useUserProfileHook = () => {
  const [user, setUser] = useState<UserProfile | undefined>();

  useEffect(() => {
    let isSubscribed = true;

    (async function () {
      const userProfile = await getCurrentUserProfile();
      isSubscribed && setUser(userProfile || undefined);
    })();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return user;
};
