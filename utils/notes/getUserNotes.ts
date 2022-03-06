import {
  collection,
  endAt,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  startAt,
  Timestamp,
  where,
} from 'firebase/firestore';
import { BookNote, DashboardNote } from '../../@types';
import db from '../../firebase';

export const getUserNotes = async ({
  userId,
  start,
}: {
  userId: string;
  start?: BookNote;
}) => {
  const bookNotesCollectionRef = collection(db, 'book-notes');
  const order = start ? startAt(start) : endAt(5);

  const q = query(
    bookNotesCollectionRef,
    where('userId', '==', userId),
    where('isPublished', '==', true),
    orderBy('lastUpdated', 'desc'),
    start ? startAt(start) : limit(5)
  );
  const docSnap = (await getDocs(q)) as QuerySnapshot<DashboardNote>;
  const notes = docSnap.docs.map((note) => ({
    ...note.data(),
    lastUpdated: note.data().lastUpdated.toDate(),
    id: note.id,
  }));
  return notes;
};
