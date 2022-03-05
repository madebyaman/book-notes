import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  setPersistence,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Signup } from '../../@types/types';
import db, { auth } from '../../firebase';

export const signup: Signup = async ({ name, email, password }) => {
  try {
    setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredential.user) {
      sendEmailVerification(userCredential.user);
      await setDoc(doc(db, 'users', userCredential.user.uid), { name: name });
    }
  } catch (e) {
    console.log(e); // Should I rethrow it?
    throw new Error('Error signing up');
  }
};
