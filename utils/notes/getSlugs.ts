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

    const notesSnap = (await getDocs(q)) as QuerySnapshot<DashboardNote>;
    let slugs: { params: { slug: string; username: string } }[] = [];

    notesSnap.forEach((doc) => {
      slugs.push({ params: { slug: doc.data().slug, username } });
      return;
    });

    return slugs;
  };

  const mapUsernameWithSlugs = await Promise.all(
    usernames.map((username) => noteSlugs(username))
  );
  console.log('===========here=============', mapUsernameWithSlugs);

  return mapUsernameWithSlugs;
}
