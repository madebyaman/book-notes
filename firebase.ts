import * as firebase from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

/**
 * Firebase initializer
 */
export const fb = firebase.initializeApp(firebaseConfig);

/**
 * Firebase Firestore initializer
 */
const db = initializeFirestore(fb, {});

/**
 * Firebase Auth
 */
export const auth = getAuth(fb);

export default db;
