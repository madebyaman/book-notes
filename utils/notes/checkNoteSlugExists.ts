import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { DashboardNote } from '../../@types';
import db from '../../firebase';

export const checkNoteSlugExists = async ({
  slug,
  userId,
  docId,
}: {
  slug: string;
  userId: string;
  docId?: string;
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
    // If docId is provided, its own currently saved slug should be available.
    if (docId) {
      const noteRef = doc(
        db,
        'book-notes',
        docId
      ) as DocumentReference<DashboardNote>;
      const currentNoteSnap = await getDoc(noteRef);
      if (!currentNoteSnap.exists()) return false;
      if (currentNoteSnap.data().slug === slug) {
        // It should also be available for selecting
        return false;
      }
    }
    return true;
  } catch (e) {
    console.error(e);
    return true;
  }
};
