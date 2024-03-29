import { doc, updateDoc } from 'firebase/firestore';

import db from '../../firebase';
import { checkUsernameExist, getCurrentUser } from '../../utils/auth';

export class UsernameError extends Error {}

export const updateCurrentUserInfo = async (
  updates: {
    name: string;
    photo?: string;
    username: string;
    bio: string;
  },
  userId: string
) => {
  // 1. Check user is logged in.
  const currentUser = await getCurrentUser();
  if (!currentUser) return;

  // 2. Check if username is valid
  if (await checkUsernameExist(updates.username, userId)) {
    throw new UsernameError('username already exists');
  }

  const userRef = doc(db, 'users', currentUser.id);
  const updatedProfile: {
    name: string;
    username: string;
    bio: string;
    photo?: string;
  } = {
    name: updates.name,
    username: updates.username,
    bio: updates.bio,
  };
  if (updates.photo) updatedProfile['photo'] = updates.photo;
  await updateDoc(userRef, updatedProfile);
};
