import {
  collection,
  endAt,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  startAt,
  where,
} from 'firebase/firestore';
import { DashboardNote } from '../../@types';
import db from '@/firebase';
import { totalNotesInOnePage } from './constants';

export const getUserNotes = async ({
  userId,
  page,
}: {
  userId: string;
  page?: number;
}) => {
  const bookNotesCollectionRef = collection(db, 'book-notes');
  const order = page ? startAt(page) : endAt(totalNotesInOnePage);

  const q = query(
    bookNotesCollectionRef,
    where('userId', '==', userId),
    where('isPublished', '==', true),
    orderBy('lastUpdated', 'desc'),
    order
  );
  try {
    const docSnap = (await getDocs(q)) as QuerySnapshot<DashboardNote>;
    const notes = docSnap.docs.map((note) => ({
      ...note.data(),
      lastUpdated: note.data().lastUpdated.toDate(),
      id: note.id,
    }));
    return notes;
  } catch (e) {
    console.error(e);
    return null;
  }
};
