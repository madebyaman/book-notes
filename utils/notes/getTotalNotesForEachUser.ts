import {
  collection,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { DashboardNote } from '../../@types';
import db from '../../firebase';
import { getUserProfileFromUsername } from '../auth';
import { getTotalNotes } from './getTotalNotes';

export async function getTotalNotesForEachUser(usernames: string[]) {
  const getTotalCount = async (username: string) => {
    const userProfile = await getUserProfileFromUsername(username);

    if (!userProfile) return null;
    const totalNoteCount = await getTotalNotes({ userId: userProfile.id });
    return totalNoteCount;
  };

  const totalNoteCount = await Promise.all(
    usernames.map(async (username) => {
      return await getTotalCount(username);
    })
  );

  return usernameWithSlugs.flat();
}
