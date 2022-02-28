import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
} from 'firebase/auth';
import { Signup } from '../../@types/types';
import { auth } from '../../firebase';

export const signup: Signup = async ({ name, email, password }) => {
  try {
    setPersistence(auth, browserLocalPersistence);
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    throw new Error('Error signing up');
  }
};
