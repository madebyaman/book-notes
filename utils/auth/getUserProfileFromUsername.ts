import {
  collection,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { UserProfile } from '../../@types';
import db from '../../firebase';

export const getUserProfileFromUsername = async (username: string) => {
  const userCollectionRef = collection(db, 'users');
  const q = query(userCollectionRef, where('username', '==', username));
  try {
    const userProfileSnap = (await getDocs(q)) as QuerySnapshot<UserProfile>;
    if (userProfileSnap.empty) return null;
    const profiles: UserProfile[] = [];
    userProfileSnap.forEach((profile) => {
      profiles.push({ ...profile.data(), id: profile.id });
    });
    return profiles[0];
  } catch (e) {
    console.error(e);
    return null;
  }
};
