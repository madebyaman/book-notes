import { User } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth, fb } from '../firebase';

const formatAuthUser = (user: User) => ({
  uid: user.uid,
  email: user.email,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<{
    uid: string;
    email: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState: User) => {
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    var formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);
    setLoading(false);
  };

  // listen for Firebase state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
  };
}
