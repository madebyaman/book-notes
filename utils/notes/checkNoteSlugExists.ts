import { collection, getDocs, query, where } from 'firebase/firestore';
import db from '../../firebase';

export const checkNoteSlugExists = async ({
  slug,
  userId,
}: {
  slug: string;
  userId: string;
}): Promise<boolean> => {
  const notesRef = collection(db, 'book-notes');
  const q = query(
    notesRef,
    where('userId', '==', userId),
    where('slug', '==', slug)
  );

  try {
    const noteSnap = await getDocs(q);
    if (noteSnap.empty) {
      return false;
    }
    return true;
  } catch (e) {
    console.error(e);
    return true;
  }
};
