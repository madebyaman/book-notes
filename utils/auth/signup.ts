import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import db, { auth } from '../../firebase';
import { checkUsernameExist } from './checkUsernameExist';

export class UsernameError extends Error {}

export const signup = async ({
  name,
  email,
  password,
  username,
}: {
  name: string;
  email: string;
  password: string;
  username: string;
}) => {
  // 1. If username is not unique, throw error.
  if (await checkUsernameExist(username))
    throw new UsernameError('Username already exists');

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredential.user) {
      sendEmailVerification(userCredential.user);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        username,
        email,
      });
    }
  } catch (e) {
    throw e;
  }
};
