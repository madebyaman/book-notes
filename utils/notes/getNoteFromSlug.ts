import {
  collection,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { DashboardNote, DashboardNoteWithDate } from '../../@types';
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
    where('isPublished', '==', true),
    where('userId', '==', userId),
    where('slug', '==', slug)
  );

  try {
    const noteSnap = (await getDocs(q)) as QuerySnapshot<DashboardNote>;
    if (noteSnap.empty) return null;
    const notes: DashboardNoteWithDate[] = [];

    noteSnap.forEach((note) => {
      notes.push({
        ...note.data(),
        lastUpdated: note.data().lastUpdated.toDate(),
        id: note.id,
      });
    });

    return notes[0];
  } catch (e) {
    console.error(e);
    return null;
  }
};
