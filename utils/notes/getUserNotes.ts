import {
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  startAfter,
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
  let lastVisible = null;
  if (page && page > 1) {
    const q = query(
      bookNotesCollectionRef,
      where('userId', '==', userId),
      where('isPublished', '==', true),
      orderBy('lastUpdated', 'desc'),
      limit((page - 1) * totalNotesInOnePage)
    );
    const documentSnapshots = await getDocs(q);
    lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
  }

  const q = lastVisible
    ? query(
        bookNotesCollectionRef,
        where('userId', '==', userId),
        where('isPublished', '==', true),
        orderBy('lastUpdated', 'desc'),
        startAfter(lastVisible),
        limit(totalNotesInOnePage)
      )
    : query(
        bookNotesCollectionRef,
        where('userId', '==', userId),
        where('isPublished', '==', true),
        orderBy('lastUpdated', 'desc'),
        limit(totalNotesInOnePage)
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
