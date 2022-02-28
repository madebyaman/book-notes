import { doc, DocumentSnapshot, getDoc } from 'firebase/firestore';
import { CustomUser } from '../../@types/types';
import db from '../../firebase';

export const getUserInfo = async (userId: string) => {
  const userInfoDoc = doc(db, 'users', userId);
  const docSnap = (await getDoc(userInfoDoc)) as DocumentSnapshot<CustomUser>;
  if (docSnap.exists()) {
    return {
      ...docSnap.data(),
      id: docSnap.id,
    };
  }
  return;
};
