import { doc, getDoc } from 'firebase/firestore';
import db from '../../firebase';

export const getUserInfo = async (userId: string) => {
  const userInfoDoc = doc(db, 'users', userId);
  const docSnap = await getDoc(userInfoDoc);
  if (docSnap.exists()) {
    return {
      ...docSnap.data(),
      id: docSnap.id,
    };
  }
  return null;
};
