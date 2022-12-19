import { UserProfile } from 'firebase/auth';
import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import db from '@/firebase';

/**
 * Method of check whether a given username exists
 * @param userId if userId is given, it means a user is already signed up. Then check the current username.
 * @returns true if username exists. False otherwise.
 */
export const checkUsernameExist = async (username: string, userId?: string) => {
  const usersCollectionRef = collection(db, 'users');
  const q = query(usersCollectionRef, where('username', '==', username));

  try {
    const usersSnap = await getDocs(q);
    if (usersSnap.empty) {
      return false;
    } else if (userId) {
      // 1. Get the current username
      const userRef = doc(
        db,
        'users',
        userId
      ) as DocumentReference<UserProfile>;
      const currentUserSnap = await getDoc(userRef);
      if (!currentUserSnap.exists()) return false;
      if (currentUserSnap.data().username === username) {
        return false;
      }
    } else {
      return true;
    }
  } catch (e) {
    return true;
  }
};
