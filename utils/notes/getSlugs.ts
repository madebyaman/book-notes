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
import { mapAsync } from '../mapAsync';

export async function getSlugs(usernames: string[]) {
  const noteSlugs = async (username: string) => {
    const userProfile = await getUserProfileFromUsername(username);

    if (!userProfile) return null;

    const q = query(
      collection(db, 'book-notes'),
      where('userId', '==', userProfile.id),
      where('isPublished', '==', true)
    );

    // { params: { slug: string; username: string } }[]

    const notesSnap = (await getDocs(q)) as QuerySnapshot<DashboardNote>;
    let slugsWithUsername: any = [];

    notesSnap.forEach((doc) => {
      const newSlug = {
        params: { slug: doc.data().slug, username },
      };
      const oldSlugs = [...slugsWithUsername];
      slugsWithUsername = [...oldSlugs, newSlug];
    });

    return slugsWithUsername;
  };

  const usernameWithSlugs = await Promise.all(
    usernames.map(async (username) => {
      return await noteSlugs(username);
    })
  );

  return usernameWithSlugs.flat();
}
