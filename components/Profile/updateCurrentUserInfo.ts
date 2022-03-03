import { doc, updateDoc } from 'firebase/firestore';
import db from '../../firebase';
import { getCurrentUser } from '../../utils/auth';

export const updateCurrentUserInfo = async (updates: {
  name: string;
  photo: string | null;
}) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return;
  const userRef = doc(db, 'users', currentUser.id);
  await updateDoc(userRef, updates);
};
