import {
  collection,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { DashboardNote } from '../../@types';
import db from '../../firebase';

export const getNoteFromSlug = async ({
  slug,
  userId,
}: {
  slug: string;
  userId: string;
}) => {
  const notesRef = collection(db, 'book-notes');
  const q = query(
    notesRef,
    where('userId', '==', userId),
    where('slug', '==', slug)
  );

  try {
    const noteSnap = (await getDocs(q)) as QuerySnapshot<DashboardNote>;
    if (noteSnap.empty) throw new Error('Note not found');
    const notes: DashboardNote[] = [];

    noteSnap.forEach((note) => {
      notes.push({
        ...note.data(),
        id: note.id,
      });
    });

    return notes[0];
  } catch (e) {
    throw e;
  }
};
