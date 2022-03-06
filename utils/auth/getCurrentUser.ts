import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

export const getCurrentUser = async (): Promise<{ id: string } | undefined> => {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (user) resolve({ id: user.uid });
      else reject();
    });
  });
};
