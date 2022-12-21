import db from '@/firebase';
import { collection, orderBy, query, where, getDocs } from 'firebase/firestore';
import { totalNotesInOnePage } from './constants';

export async function getTotalPages({
  userId,
}: {
  userId: string;
}): Promise<number | null> {
  const bookNotesCollectionRef = collection(db, 'book-notes');
  const q = query(
    bookNotesCollectionRef,
    where('userId', '==', userId),
    where('isPublished', '==', true),
    orderBy('lastUpdated', 'desc')
  );
  try {
    const snapshot = await getDocs(q);
    const totalNotes = snapshot.size;
    return Math.ceil(totalNotes / totalNotesInOnePage);
  } catch (e) {
    return null;
  }
}
