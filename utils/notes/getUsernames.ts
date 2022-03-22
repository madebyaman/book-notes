import { collection, getDocs, QuerySnapshot } from 'firebase/firestore';
import { UserProfile } from '../../@types';
import db from '../../firebase';

export const getUsernames = async () => {
  const usersSnap = (await getDocs(
    collection(db, 'users')
  )) as QuerySnapshot<UserProfile>;

  let usernames: string[] = [];

  usersSnap.forEach((doc) => {
    usernames.push(doc.data().username);
  });

  return usernames;
};
