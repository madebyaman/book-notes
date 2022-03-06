import { collection, getDocs, query, where } from 'firebase/firestore';
import db from '../../firebase';

export const checkUsernameExist = async (username: string) => {
  const usersCollectionRef = collection(db, 'users');
  const q = query(usersCollectionRef, where('username', '==', username));

  try {
    const usersSnap = await getDocs(q);
    if (usersSnap.empty) {
      return false;
    }
    return true;
  } catch (e) {
    console.error(e);
    return true;
  }
};
