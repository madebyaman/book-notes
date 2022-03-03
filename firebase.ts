import * as firebase from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA174aEiZHJWzPLox77Cwvn9ElRsYmJ57A',
  authDomain: 'book-notes-app-9ea54.firebaseapp.com',
  projectId: 'book-notes-app-9ea54',
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

/**
 * Firebase storage
 */
export const storage = getStorage(fb);

export default db;
