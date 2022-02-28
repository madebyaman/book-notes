import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export const signout = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    throw new Error('Error signing out');
  }
};
