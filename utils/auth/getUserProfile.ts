import { doc, DocumentSnapshot, getDoc } from 'firebase/firestore';
import { UserProfile } from '../../@types';
import db from '../../firebase';

export const getUserProfile = async (userId: string) => {
  const userInfoDoc = doc(db, 'users', userId);
  const docSnap = (await getDoc(userInfoDoc)) as DocumentSnapshot<UserProfile>;
  if (docSnap.exists()) {
    return {
      ...docSnap.data(),
      id: docSnap.id,
    };
  }
  return;
};
