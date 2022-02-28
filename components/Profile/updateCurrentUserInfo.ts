import { doc, updateDoc } from 'firebase/firestore';
import db from '../../firebase';
import { getCurrentUser } from '../../utils/auth';

export const updateCurrentUserInfo = async (updates) => {
  const currentUser = getCurrentUser();

  if (!currentUser) return;
  const userRef = doc(db, 'users', currentUser.id);
  await updateDoc(userRef, updates);
};
