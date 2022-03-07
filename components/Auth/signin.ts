import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { auth } from '../../firebase';

export const signin = async ({
  email,
  password,
  remember,
}: {
  email: string;
  password: string;
  remember: boolean;
}) => {
  try {
    setPersistence(
      auth,
      remember ? browserLocalPersistence : browserSessionPersistence
    );
    const result = await signInWithEmailAndPassword(auth, email, password);
    return {};
  } catch (e) {
    throw new Error('Error signing in');
  }
};
