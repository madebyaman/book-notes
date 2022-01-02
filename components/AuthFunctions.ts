import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';
import { AUTHSTATE, AUTH_SET_STATE } from '../types/AuthTypes';

export const registerUser = (
  state: AUTHSTATE,
  setState: AUTH_SET_STATE,
  email: string,
  name: string,
  password: string
) => {
  console.log(
    'Registering user with email: ',
    email,
    'and password ',
    password
  );
  setState({ ...state, status: 'pending' });
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log('doing something');
      if (!auth.currentUser) {
        console.log('no user found');
        return;
      }
      setState({ ...state, status: 'resolved' });
      return updateProfile(auth.currentUser, {
        displayName: name,
      });
    })
    .catch((err) => {
      console.error(err);
      setState({ ...state, error: err, status: 'rejected' });
    });
};

export const signInUser = (
  state: AUTHSTATE,
  setState: AUTH_SET_STATE,
  email: string,
  password: string
) => {
  setState({ ...state, status: 'pending' });
  signInWithEmailAndPassword(auth, email, password)
    .then((res) => setState({ ...state, status: 'resolved' }))
    .catch((err) =>
      setState({ ...state, error: err.message, status: 'rejected' })
    );
};

export const logoutUser = () => {
  signOut(auth);
};

export const forgotPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};
